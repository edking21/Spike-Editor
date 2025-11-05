# <challenge name here>
import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms

#constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4


def is_color_red():
    return color_sensor.color(port.F) == color.RED


def is_pressed():
    return force_sensor.pressed(port.A)


def is_near(distance_threshold=100): # 100mm (4 inches) minimum
    distance = distance_sensor.distance(port.B)

    # Check if sensor is working (returns -1 when no reading)
    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))
    return distance < distance_threshold


async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    # start moving step 2
    motor_pair.move(motor_pair.PAIR_1, 0)

    # wait until condition step 2
    await runloop.until (is_pressed)

    # move backward for 6in step 2
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -6 * DEGREES_PER_INCH, 0)

    # Wait for 1 second step 2
    sleep(2)

    # turn left 90 degrees step 3
    degrees = 180 # number of degrees of wheel turn
    steering = -100 # positive values turn right, negative values turn left
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, degrees, steering)

    # start moving step 3
    motor_pair.move(motor_pair.PAIR_1, 0)

    # wait until condition step 3
    await runloop.until (lambda: is_near (int(10 * MM_PER_INCH)))

    # turn left 90 degrees step 4
    degrees = 180 # number of degrees of wheel turn
    steering = -100 # positive values turn right, negative values turn left
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, degrees, steering)

    # start moving step 4
    motor_pair.move(motor_pair.PAIR_1, 0)

    # wait until condition step 4
    await runloop.until  (is_pressed)

    # move backward for 4in
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -4 * DEGREES_PER_INCH, 0)

    # Turn On Angry Face For 2 Seconds step 5
    light_matrix.show_image(light_matrix.IMAGE_ANGRY)
    sleep(2)

    # turn left 90 degrees step 6
    degrees = 180 # number of degrees of wheel turn
    steering = -100 # positive values turn right, negative values turn left
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, degrees, steering)

    # Repeat until (function) step 6
    while not is_near(int(6 * MM_PER_INCH)):

        # move forward for 10in
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * DEGREES_PER_INCH, 0)

        # move backward for 10in
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * DEGREES_PER_INCH, 0)

    # stop moving
    motor_pair.stop(motor_pair.PAIR_1)
    sleep_ms(10) # sleep 10 milliseconds


runloop.run(main())
sys.exit()
