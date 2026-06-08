# Training Camp 1 - Driving Around
import runloop, sys, motor_pair
from hub import port, motion_sensor, button
from runloop import run
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = 21

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)


########################################################################
# 🤖 Gyro turn left 90 degrees
########################################################################
async def gyro_90_degree_turn():

    motion_sensor.reset_yaw(0)

    # turn left in place until yaw reaches 90 degrees
    motor_pair.move(motor_pair.PAIR_1, -100)
    await runloop.until(lambda: motion_sensor.tilt_angles()[0] >= 900)
    motor_pair.stop(motor_pair.PAIR_1)


########################################################################
# 🤖 when left button pressed
########################################################################
async def when_left_button_pressed():

    # wait for 1 second
    sleep(1)

    # move forward 10 cm and then move back 10 cm 
    if button.pressed(button.LEFT):
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * CM_TO_DEGREES, 0)
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES, 0)


########################################################################
# 🤖 when right button pressed
########################################################################
async def when_right_button_pressed():

    # wait for 1 second
    sleep(1)

    # pivot turn left 10 wheel rotations
    if button.pressed(button.RIGHT):
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * 360, -40)


########################################################################
# 🤖 main
########################################################################
async def main():

    runloop.run(gyro_90_degree_turn())

    while True:
        
        # Run all functions concurrently as events
        run(
            when_left_button_pressed(),
            when_right_button_pressed(),
        )

runloop.run(main())
sys.exit()
