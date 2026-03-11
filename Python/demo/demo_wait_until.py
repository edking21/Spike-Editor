#Demo_Wait_Until.py
import runloop, time, sys, motor_pair, motor, force_sensor, runloop
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms
from runloop import run

# Ports on the robot hub
color_port = port.A
distance_port = port.B
force_port = port.E

# Conversion constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4

# how many times we see each color
blue_count = 0
yellow_count = 0
red_count = 0

# Color codes - these numbers represent different colors to the robot
blue = 3
yellow = 7
red = 9

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# Remember the last color seen so we don't count the same color twice in a row
last_color = None

# This is like a stop sign for our program - when it's True, everything stops
should_stop = False

########################################################################
# 🛑 is_color_red - Function to check if the color sensor sees red
########################################################################
def is_color_red():
    """
    Examples:
        Using with if:            if is_color_red():
        Using with wait until:    await runloop.until(is_color_red)
        Using with repeat until:    while not (is_color_red())
    """
    return color_sensor.color(color_port) == color.RED

########################################################################
# 🎯 is_pressed - Function to check if force sensor is pressed
########################################################################
def is_pressed():
    """
    Examples:
        Using with if:            if is_pressed():
        Using with wait until:    await runloop.until(is_pressed)
        Using with repeat until:    while not (is_pressed())
    """
    return force_sensor.pressed(force_port)

########################################################################
# ☀️ is_near - Function to check if something is near
########################################################################
def is_near(distance_threshold=150): # 150mm (6 inches) threshold
    """
    Examples:
        Using with if:                if is_near():
        Using with wait until        await runloop.until(is_near)
        Using with repeat until:        while not (is_near()):
        Using with repeat until:        while not (is_near(200)):# 200mm (8 inches) threshold
    """
    distance = distance_sensor.distance(distance_port)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))

    return distance < distance_threshold

########################################################################
# 🤖 Test for is_near with wait until and repeat until
########################################################################
async def wait_until_demo():

    while True:

        # start moving
        motor_pair.move(motor_pair.PAIR_1, 0)
        light.color(light.POWER, color.BLUE)

        # Wait Until - STOP and Wait for Something to Happen
        await runloop.until (is_near) # NO parentheses
                                      # This means:
                                      #   "Keep checking is_near() over and over
                                      #    until it returns True"


        # stop moving
        motor_pair.stop(motor_pair.PAIR_1)
        light.color(light.POWER, color.RED)
        sleep_ms(10) # Wait 10 milliseconds before checking again

runloop.run(wait_until_demo())
sys.exit()


