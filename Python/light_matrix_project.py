# LEGO slot:0
# Robot Shuffle
########################################################################
# 🤖 main
########################################################################
async def main():
    
    await light_matrix.write("Hi!")

    # Blink 2 times
    blink(2)
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * int(360/17.5),
        0, velocity=int(.2 * 1100))
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * int(360/17.5),
        0, velocity=int(.2 * 1100))



########################################################################
# ☀️ initilize modules
########################################################################
import sys, motor_pair, motor, runloop, time
import color, color_sensor, distance_sensor, force_sensor
from hub import port, motion_sensor,button, light_matrix
from runloop import run, until
from time import sleep, sleep_ms

# Ports
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
force_port = port.A
distance_port = port.B
color_port = port.F
arm_motor_port = port.E

# Constants
CM_TO_DEGREES = int(360/17.5)   # degrees_wheel_diameter:360 cm_wheel_circumference:17.5
INCHES_TO_DEGREES = int(360/6.89)   # degrees_wheel_diameter:360 inches_wheel_circumference:6.89


########################################################################
# 🤖 blink n times
########################################################################
def blink(num_blinks):
    if not isinstance(num_blinks, (int, float)):
        raise ValueError("num_blinks must be a number")
    if num_blinks <= 0:
        raise ValueError("num_blinks must be greater than 0")

    two_eyes_open = [
        0, 0, 0, 0, 0,
        0, 100, 0, 100, 0,
        0,0, 0,0, 0,
        100, 0, 0, 0, 100,
        0, 100, 100, 100, 0
    ]

    one_eye_open = [
        0, 0, 0, 0, 0,
        0, 100, 0, 0, 0,
        0,0, 0,0, 0,
        100, 0, 0, 0, 100,
        0, 100, 100, 100, 0
    ]
    
    for _ in range(num_blinks):
        light_matrix.show(two_eyes_open)
        sleep_ms(2000)
        light_matrix.show(one_eye_open)
        sleep_ms(200)




########################################################################
# 🤖 turn_90
########################################################################
async def turn_90(direction):
    if direction not in ("left", "right"):
        raise ValueError("direction must be 'left' or 'right'")

    motion_sensor.reset_yaw(0)
    sleep_ms(100)

    if direction == "left":
        steering = -100
        target_reached = lambda: motion_sensor.tilt_angles()[0] >= 873
    else:  # direction == "right"
        steering = 100
        target_reached = lambda: motion_sensor.tilt_angles()[0] <= -873

    motor_pair.move(
        motor_pair.PAIR_1,
        steering,
        velocity=150
    )

    await until(target_reached)

    motor_pair.stop(motor_pair.PAIR_1, stop=motor.BRAKE)
    sleep_ms(500)


########################################################################
# ☀️ is the distance sensor seeing something close
########################################################################
def is_near(distance_threshold=200):  # 200mm (7.874 inches)
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
# 🛑 is the color sensor seeing blue
########################################################################
def is_blue():
    """
    Teacher tip:
        wait until the color is blue
            await runloop.until(is_blue) # pass the function itself

        repeat until the color is blue
            while not is_blue(): # call the function to get True/False

    Why:
        - wait until needs a function
        - repeat until needs a True/False result
    """
    return color_sensor.color(color_port) == color.BLUE

########################################################################
# 🛑 is the force sensor pressed
########################################################################
def is_pressed():
    """
    Teacher tip:
        wait until the force sensor is pressed
            await runloop.until(is_pressed) # pass the function itself

        repeat until the force sensor is pressed
            while not is_pressed(): # call the function to get True/False

    Why:
        - wait until needs a function
        - repeat until needs a True/False result
    """
    return force_sensor.pressed(force_port)


########################################################################
# 🤖 when_left_button_pressed_lower_and_raise_the_arm
########################################################################
async def when_left_button_pressed_lower_and_raise_the_arm():
    await until(lambda: bool(button.pressed(button.LEFT)) != 0)
    sleep_ms(1000)

    # Go shortest path to position -50 degrees then back to 0
    await motor.run_to_absolute_position(arm_motor_port, 0, 100, direction=motor.SHORTEST_PATH)
    await motor.run_to_absolute_position(arm_motor_port, -50, 100, direction=motor.SHORTEST_PATH)
    sleep_ms(200)

    await motor.run_to_absolute_position(arm_motor_port, 0, 100, direction=motor.SHORTEST_PATH)


########################################################################
# 🤖 when_right_button_pressed_detect_blue_line
########################################################################
async def when_right_button_pressed_detect_blue_line():
    await until(lambda: bool(button.pressed(button.RIGHT)) != 0)
    sleep_ms(1000)

    # start moving forward
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.2 * 1100))

    await until (is_blue)

    # backup 10 cm
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)
    sleep_ms(200)


########################################################################
# 🤖 line follower bang bang
########################################################################
async def line_follower_bang_bang():

    steering = 50              # set steering to 50 for line following 
    speed    = int(0.2 * 1100) # set speed to 20% of max speed
    sleep_milliseconds = 40    # sleep for 40 milliseconds between each check of the color sensor

    for i in range (100):      # run for 100 iterations (this number controls when to stop)

        if is_near():          # if hand wave stop moving for 2 seconds
            motor_pair.stop(motor_pair.PAIR_1)
            sleep_ms(2000)     # sleep 2000 milliseconds (2 seconds)

        if is_blue():          # if on the line turn right
            motor_pair.move(motor_pair.PAIR_1, -steering, velocity=speed)
            sleep_ms(sleep_milliseconds)

        else:                  # if off the line turn left
            motor_pair.move(motor_pair.PAIR_1, steering, velocity=speed)
            sleep_ms(sleep_milliseconds)
        
    motor_pair.stop(motor_pair.PAIR_1)


run(main())
sys.exit()
