# demo_repeat_until.py
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
def is_near (distance_threshold=200):# 200mm (7.874 inches)
    """
    Teacher tip:
        wait until the object is near
            await runloop.until(is_near) # pass the function itself

        repeat until the object is near
            while not is_near(): # call the function to get True/False

        override the distance
            await runloop.until(lambda: is_near(100))
            while not is_near(100)

    Why:
        - wait until needs a function
        - repeat until needs a True/False result
    """
    if not isinstance(distance_threshold, (int, float)):
        raise ValueError("distance_threshold must be a number")
    if distance_threshold <= 0:
        raise ValueError("distance_threshold must be greater than 0")

    distance = distance_sensor.distance(distance_port)
    if distance == -1:
        print("Warning : distance sensor returned -1")
        return False
    print("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance /25.4))
    
    return distance < distance_threshold


########################################################################
# 🤖 Test is_near back and forth until hand wave
########################################################################
from hub import port # pyright: ignore[reportMissingImports]
from time import sleep_ms
import distance_sensor, motor_pair # pyright: ignore[reportMissingImports]

async def repeat_until_demo():

    def is_near(distance_threshold=200): # 200mm (7.8 inches)
        distance = distance_sensor.distance(port.B)
        return distance < distance_threshold

    while not is_near():
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * int(360/17.5),
            0, velocity=int(.2 * 1100))
        sleep_ms(200)

        if is_near(): break

        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * int(360/17.5),
            0, velocity=int(.2 * 1100))
        sleep_ms(200)

    motor_pair.stop(motor_pair.PAIR_1)
    print("Hand Detected! Stopped repeating.")

runloop.run(repeat_until_demo())


