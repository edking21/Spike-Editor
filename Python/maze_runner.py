# Maze Runner Python
import color, color_sensor, motor_pair, runloop
from hub import light, port
from runloop import run

# Conversion constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4

# create a variable for the color sensor port 
color_port = port.F 

# Color codes - these numbers represent different colors to the robot
blue = color.BLUE
yellow = color.YELLOW
red = color.RED

# Separate last color tracking for each color
last_blue = None
last_red = None
last_yellow = None

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# This is like a stop sign for our program - when it's True, everything stops
should_stop = False

#####################################################################
# 🛑 Watch for yellow colors continuously
#####################################################################
async def when_yellow():
    global last_yellow, should_stop

    while not should_stop:
        current_color = color_sensor.color(color_port)
        if current_color == yellow and last_yellow != yellow:
            light.color(light.POWER, current_color)
            last_yellow = yellow
        elif current_color != yellow:
            last_yellow = None

        await runloop.sleep_ms(50)

#####################################################################
# 🤖 Movement control function
#####################################################################
async def robot_movement():
    global should_stop

    # start initial movement
    motor_pair.move(motor_pair.PAIR_1, 0)
    
    while not should_stop:
        
        # Use async sleep instead of blocking sleep
        await runloop.sleep_ms(1000)  

        # Check if we should stop before continuing
        if should_stop:
            motor_pair.stop(motor_pair.PAIR_1)
            break

#####################################################################
# 🛑 Watch for blue colors continuously
#####################################################################
async def when_blue():
    global last_blue, should_stop

    while not should_stop:
        current_color = color_sensor.color(color_port)
        if current_color == blue and last_blue != blue:
            light.color(light.POWER, current_color)
            last_blue = blue
            
            # Stop forward movement before turning
            motor_pair.stop(motor_pair.PAIR_1)
            await motor_pair.move_for_degrees(motor_pair.PAIR_1, 180, 100)
        elif current_color != blue:
            last_blue = None
            
        await runloop.sleep_ms(50)

#####################################################################
# 🛑 Watch for red colors continuously
#####################################################################
async def when_red():
    global last_red, should_stop

    while not should_stop:
        current_color = color_sensor.color(color_port)
        if current_color == red and last_red != red:
            light.color(light.POWER, current_color)
            last_red = red

            # Stop forward movement before turning
            motor_pair.stop(motor_pair.PAIR_1)
            await motor_pair.move_for_degrees(motor_pair.PAIR_1, 360, 50)
            
        elif current_color != red:
            last_red = None

        await runloop.sleep_ms(50)

########################################################################
# 🤖 Main - Run all functions concurrently
########################################################################
async def main():

    # Run all functions concurrently as events
    run(
        when_blue(),
        # when_red(),
        robot_movement()
    )

runloop.run(main())
