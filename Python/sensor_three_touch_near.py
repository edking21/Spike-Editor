# Sensors Python - Move Until Touch/Near/Touch with Repeat
# This project teaches students how to use all three sensors:
# 1. Touch Sensor to stop first time
# 2. Distance Sensor to detect when something is near
# 3. Touch Sensor to stop again
# 4. Repeat back and forth until touched

########################################################################
# 🤖 Main - Sensors Two Touch One Near One Repeat
########################################################################
async def main():

    print("Phase 1: Touch Sensor to stop first time ...")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.2 * 1100))

    # Wait until the touch sensor is pressed
    await runloop.until(is_pressed) 

    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES,
        0, velocity=int(0.2 * 1100))
    print("Phase 1 Complete: First touch detected!")

    print("Phase 2: Distance sensor to detect when something is near ...")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.2 * 1100))

    # wait until is_near condition
    await runloop.until (is_near) 

    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES,
        0, velocity=int(.2 * 1100))
    print("Phase 2 Complete: Object detected nearby!")

    print("Phase 3: Moving forward until touch again...")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.2 * 1100))

    # Wait until the touch sensor is pressed
    await runloop.until(is_pressed)

    await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES,
        0, velocity=int(.2 * 1100))
    print("Phase 3 Complete: Second touch detected!")

    # --- PHASE 4: Repeat back and forth motion until touched ---
    print("Phase 4: Repeating back and forth until touch...")

    while not is_near():
        print("Moving forward...")
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * CM_TO_DEGREES,
            0, velocity=int(.2 * 1100))

        # Check if touch sensor is pressed
        if is_near():
            break

        print("Moving backward...")
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * CM_TO_DEGREES,
            0, velocity=int(.2 * 1100))

    print("Phase 4 Complete: Motion stopped by distance sensor!")

    # --- SUCCESS: Show celebration on hub ---
    light_matrix.show_image(light_matrix.IMAGE_HAPPY)
    sleep(2)

##########################################################################################
##########################################################################################
##########################################################################################
import runloop, time, sys, motor_pair, motor, force_sensor # pyright: ignore[reportMissingImports]
import color, color_sensor, distance_sensor # pyright: ignore[reportMissingImports]
from hub import light, light_matrix, port, sound # pyright: ignore[reportMissingImports]
from time import sleep, sleep_ms

# Constants
CM_TO_DEGREES = int(360/17.5)# degrees_wheel_diameter:360 cm_wheel_circumference:17.5
INCHES_TO_DEGREES = int(360/6.89)# degrees_wheel_diameter:360 inches_wheel_circumference:6.89
INCHES_TO_MILLIMETERS = int(25.4)# 1 inch = 25.4 millimeters

# Connect motors C and D together as a pair for movement
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

########################################################################
# 🛑 TOUCH SENSOR 1 - Check if force sensor is pressed
########################################################################
def is_pressed():
    """Check if the touch sensor (port A) is pressed"""
    return force_sensor.pressed(port.A)

########################################################################
# ☀️DISTANCE SENSOR - Check if something is close (near)
########################################################################
def is_near(distance_threshold=200):# 200mm (7.8 inches) default
    """
    Check if distance sensor detects something closer than the threshold.

    Args:
        distance_threshold: Distance in millimeters (default: 200mm)

    Returns:
        True if object is within threshold distance, False otherwise
    """
    distance = distance_sensor.distance(port.B)

    # Sensor returns -1 when nothing is detected
    if distance == -1:
        # print("Warning: Distance sensor not detecting anything")
        return False

    # print("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))
    return distance < distance_threshold


runloop.run(main())
