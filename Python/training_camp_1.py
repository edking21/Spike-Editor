# Training Camp 1 - Driving Around
import sys, motor_pair, motor
from hub import port, motion_sensor, button
from runloop import run, until
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21
INCHES_TO_DEGREES = 53

# Sensor Ports
force_port = port.A
distance_port = port.B
color_port = port.F

# Motor Ports
left_motor = port.C
right_motor = port.D
arm_motor = port.E

# Default speed (20 percent of maximum for medium motor)
speed = int(.2 * 1100)

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, left_motor, right_motor)


########################################################################
# 🤖 Gyro turn left 90 degrees then right 90 degrees
########################################################################
async def gyro_90_degree_turn():

    motion_sensor.reset_yaw(0)

    # turn left in place until yaw reaches 90 degrees
    motor_pair.move(motor_pair.PAIR_1, -100, velocity=speed)
    await until(lambda: motion_sensor.tilt_angles()[0] >= 885)
    motor_pair.stop(motor_pair.PAIR_1, stop=motor.BRAKE)
    #sleep_ms(40)

    # turn right in place until yaw reaches 0 degrees
    motor_pair.move(motor_pair.PAIR_1, 100, velocity=speed)
    await until(lambda: motion_sensor.tilt_angles()[0] <= 15)
    motor_pair.stop(motor_pair.PAIR_1, stop=motor.BRAKE)
    #sleep_ms(40)


########################################################################
# 🤖 when left button pressed
########################################################################
async def when_left_button_pressed():

    # wait for .5 seconds
    sleep_ms(500)

    # move forward 10 cm and then move back 10 cm
    if button.pressed(button.LEFT):
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * CM_TO_DEGREES, 0)
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)


########################################################################
# 🤖 when right button pressed
########################################################################
async def when_right_button_pressed():

    # wait for .5 seconds
    sleep_ms(500)

    # pivot turn left 10 wheel rotations -40 steering
    if button.pressed(button.RIGHT):
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, -40)


########################################################################
# 🤖 main
########################################################################
async def main():

    for i in range(5):
        run(gyro_90_degree_turn())

    while True:

        # Run all functions concurrently as events
        run(
            when_left_button_pressed(),
            when_right_button_pressed(),
        )

run(main())
sys.exit()
