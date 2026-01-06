# Line Counter
import runloop, time, sys, motor_pair, motor, force_sensor, runloop # pyright: ignore[reportMissingImports]
import color, color_sensor, distance_sensor # pyright: ignore[reportMissingImports]
from hub import light, light_matrix, port, sound # pyright: ignore[reportMissingImports]
from time import sleep, sleep_ms
from runloop import run # pyright: ignore[reportMissingImports]

# Conversion constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4

# how many times we see each color
red_count = 0
yellow_count = 0
blue_count = 0
distance_port = port.B

# Color codes - these numbers represent different colors to the robot
blue = 3
yellow = 7
red = 9

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# Remember the last color we saw so we don't count the same color twice in a row
last_color = None

# This is like a stop sign for our program - when it's True, everything stops
should_stop = False

########################################################################
# ☀️ is_near - Function or condition to check if something is close
########################################################################
def is_near(distance_threshold=100): # 100mm (4 inches) minimum
    distance = distance_sensor.distance(distance_port)
    if distance == -1:
        return False
    return distance < distance_threshold

#####################################################################
# 🛑 Watch for blue colors continuously
#####################################################################
async def when_blue():
    global blue_count, last_color, should_stop

    while not should_stop:
        # count the number of times crossing over the blue
        current_color = color_sensor.color(port.F)
        if current_color == blue and last_color != blue:
            light.color(light.POWER, current_color)
            last_color = blue
            blue_count += 1

        await runloop.sleep_ms(50)

#####################################################################
# 🛑 Watch for yellow colors continuously
#####################################################################
async def when_yellow():
    global yellow_count, last_color, should_stop

    while not should_stop:
        # count the number of times crossing over the yellow
        current_color = color_sensor.color(port.F)
        if current_color == yellow and last_color != yellow:
            light.color(light.POWER, current_color)
            last_color = yellow
            yellow_count += 1

        await runloop.sleep_ms(50)

#####################################################################
# 🛑 Watch for red colors continuously
#####################################################################
async def when_red():
    global red_count, last_color, should_stop

    while not should_stop:
        # count the number of times crossing over the red
        current_color = color_sensor.color(port.F)
        if current_color == red and last_color != red:
            light.color(light.POWER, current_color)
            last_color = red
            red_count += 1

        await runloop.sleep_ms(50)

#####################################################################
# 🛑 Watch for someone waving their hand near the distance sensor continuously
#####################################################################
async def when_hand_wave():
    global blue_count, yellow_count, red_count, should_stop

    while not should_stop:

        # if sensor is working and hand wave closer than 100mm (4in)
        if is_near():
            motor_pair.stop(motor_pair.PAIR_1)

            # Tell all other functions to stop
            should_stop = True

            print("Blue count:{:2d} Yellow count:{:2d} Red count:{:2d}".format(blue_count, yellow_count, red_count))
            break

        # Wait a bit before checking distance again
        await runloop.sleep_ms(50)

#####################################################################
# 🤖 Movement control function
#####################################################################
async def robot_movement():
    global should_stop

    while not should_stop:
        
        # turn left 90 degrees
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 180, -100)

        if should_stop:
            break

        # move forward 4in
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 4 * 53, 0)

########################################################################
# 🤖 Main - Run all functions concurrently
########################################################################
async def main():
    
    # Run all functions concurrently as events
    run(
        when_hand_wave(),
        when_blue(),
        when_yellow(),
        when_red(),
        robot_movement()
    )

runloop.run(main())
sys.exit()