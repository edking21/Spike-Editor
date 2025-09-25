# Testit.llsp3
import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light_matrix, port, sound
from time import sleep, sleep_ms
async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    # turn in place right 90 (180 degrees rotation 100 percent steering
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 180, 100)

    # turn in place left 90 (-180 degrees rotation 100 percent steering
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -180, 100)

    # Run shortest distance to absolute 0
    await motor.run_to_absolute_position(port.E, 0, 200, direction=motor.SHORTEST_PATH)

    # Run shortest distance to absolute 320
    await motor.run_to_absolute_position(port.E, 320, 200, direction=motor.SHORTEST_PATH)

    # Wait for 1 second
    sleep(1)

    # Run shortest distance to absolute 0
    await motor.run_to_absolute_position(port.E, 0, 200, direction=motor.SHORTEST_PATH)

    # move forward until an object within 10cm
    if distance_sensor.distance(port.B) > 100 or distance_sensor.distance(port.B) == -1 : pass

    # Move forward until object withiin 10cm
    if distance_sensor.distance(port.B) > 10 or distance_sensor.distance(port.B) == -1:

        # stop moving
        motor_pair.stop(motor_pair.PAIR_1)

    # move forward for 10cm
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10*21, 0)

def blinking_eyes():
    # Show a blinking eyes animation on the Light Matrix
    for i in range(3):
        light_matrix.show_image(light_matrix.IMAGE_HAPPY)
        sleep_ms(1000)

        light_matrix.show_image(light_matrix.IMAGE_SMILE)
        sleep_ms(200)

    light_matrix.show_image(light_matrix.IMAGE_HAPPY)
    sleep_ms(2000)


runloop.run(main())
sys.exit()

