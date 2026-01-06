# Maze Runner Python
import runloop, time, sys, motor_pair
import color_sensor
from hub import light, port
from time import sleep
from runloop import run

# Conversion constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4

# create a variable for the color sensor port 
color_port = port.F 

# Color codes - these numbers represent different colors to the robot
blue = 4
yellow = 7
red = 9

# Separate last color tracking for each color
last_blue = None
last_red = None
last_yellow = None

# Remember the last color we saw so we don't count the same color twice in a row
last_color = None

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# This is like a stop sign for our program - when it's True, everything stops
should_stop = False

#####################################################################
# 🛑 Watch for yellow colors continuously
#####################################################################
async def when_yellow():
    global last_color, should_stop

    while not should_stop:
        current_color = color_sensor.color(color_port)
        if current_color == yellow and last_color != yellow:
            light.color(light.POWER, current_color)
            last_color = yellow

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
    global should_stop

    while not should_stop:
        current_color = color_sensor.color(color_port)
        if current_color == blue:
            light.color(light.POWER, current_color)
            
            # Stop forward movement before turning
            motor_pair.stop(motor_pair.PAIR_1)
            await motor_pair.move_for_degrees(motor_pair.PAIR_1, 180, 100)
            
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
sys.exit()

