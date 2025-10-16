# Sensor Four Square Mr King
import runloop, time, sys, motor_pair, motor, force_sensor # pyright: ignore[reportMissingImports]
import color, color_sensor, distance_sensor # pyright: ignore[reportMissingImports]
from hub import light_matrix, port, sound # pyright: ignore[reportMissingImports]
from time import sleep, sleep_ms

def is_pressed():
    return force_sensor.pressed(port.A)

def is_near():
    dist = distance_sensor.distance(port.B)
    return dist != -1 and dist < 100

async def main():

    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    # start moving
    motor_pair.move(motor_pair.PAIR_1, 0)

    # wait until force sensor is pressed step 2
    await runloop.until(is_pressed)

    light_matrix.write('2')

    # move backward for 6in step 2
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -6*53, 0)

    # Turn On Smiley Face For 2 Seconds step 2
    light_matrix.show_image(light_matrix.IMAGE_SMILE)
    sleep(2)

    light_matrix.write('3')

    # turn left 90 degrees step 3
    degrees = 180 # number of degrees of wheel turn
    steering = -100 # positive values turn right, negative values turn left
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, degrees, steering )

    # start moving step 3
    motor_pair.move(motor_pair.PAIR_1, 0)

    # wait for near an obstacle step 3
    await runloop.until(is_near)
        
    light_matrix.write('4')

    # turn left 90 degrees step 4
    degrees = 180 # number of degrees of wheel turn
    steering = -100 # positive values turn right, negative values turn left
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, degrees, steering )

    # start moving step 4
    motor_pair.move(motor_pair.PAIR_1, 0)

    # wait until force sensor is pressed step 4
    await runloop.until(is_pressed)

    # move backward for 4"
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -4*53, 0)

    light_matrix.write('5')

    # Turn On frowny Face For 2 Seconds
    light_matrix.show_image(light_matrix.IMAGE_SAD)
    sleep(2)

    light_matrix.write('6')

    # move left 90 degrees step 6
    degrees = 180 # number of degrees of wheel turn
    steering = -100 # positive values turn right, negative values turn left
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, degrees, steering )

    # Move back and forth in a loop step 6

    while not is_near(): 

        # move forward for 10in
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 5*53, 0)
        sleep(0.5)

        if is_near():
            break #check again before moving back

        # move backward for 10in
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -5*53, 0)
        sleep(0.5)

    # stop moving step 6
    motor_pair.stop(motor_pair.PAIR_1)




runloop.run(main())
sys.exit()
