# Sensors Word Blocks - Move Until Touch/Near/Touch with Repeat
# This project teaches students how to use all three sensors:
# 1. Touch Sensor to stop first time
# 2. Distance Sensor to detect when something is near
# 3. Touch Sensor to stop again
# 4. Repeat back and forth until touched

import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms

# Constants for measurement conversion
DEGREES_PER_CM = 21        
DEGREES_PER_INCH = 53       
MM_PER_INCH = 25.4         

########################################################################
# 🛑 TOUCH SENSOR 1 - Check if force sensor is pressed
########################################################################
def is_touch_1():
    """Check if the touch sensor (port A) is pressed"""
    return force_sensor.pressed(port.A)

########################################################################
# ☀️  DISTANCE SENSOR - Check if something is close (near)
########################################################################
def is_near(distance_threshold=200):  # 200mm (7.8 inches) default
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
        print("Warning: Distance sensor not detecting anything")
        return False

    print("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))
    return distance < distance_threshold

########################################################################
# 🛑 TOUCH SENSOR 2 - Check if force sensor is pressed (for repeat)
########################################################################
def is_touch_2():
    """Check if the touch sensor (port A) is pressed again"""
    return force_sensor.pressed(port.A)

########################################################################
# 🤖 Main - Sensors Three Touch/Near Robot Movement
########################################################################
async def main():
    # Connect motors C and D together as a pair for movement
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    # --- PHASE 1: Move forward until first touch ---
    print("Phase 1: Moving forward until touch...")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))  # Move forward at 30% speed
    
    # Wait until the touch sensor (port A) is pressed
    await runloop.until(is_touch_1)
    
    # Stop the motors
    motor_pair.stop(motor_pair.PAIR_1)
    print("Phase 1 Complete: First touch detected!")
    sleep(1)  # Pause for 1 second

    # --- PHASE 2: Move forward until near ---
    print("Phase 2: Moving forward until something is near...")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))  # Move forward at 30% speed
    
    # Wait until distance sensor detects something close
    await runloop.until(is_near)
    
    # Stop the motors
    motor_pair.stop(motor_pair.PAIR_1)
    print("Phase 2 Complete: Object detected nearby!")
    sleep(1)  # Pause for 1 second

    # --- PHASE 3: Move forward until second touch ---
    print("Phase 3: Moving forward until touch again...")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))  # Move forward at 30% speed
    
    # Wait until the touch sensor (port A) is pressed
    await runloop.until(is_touch_2)
    
    # Stop the motors
    motor_pair.stop(motor_pair.PAIR_1)
    print("Phase 3 Complete: Second touch detected!")
    sleep(1)  # Pause for 1 second

    # --- PHASE 4: Repeat back and forth motion until touched ---
    print("Phase 4: Repeating back and forth until touch...")
    
    # Repeat until touch sensor is pressed
    while not is_touch_2():
        # Move forward for 1 second
        print("  Moving forward...")
        motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))
        await runloop.sleep_ms(1000)
        
        # Check if touch sensor is pressed
        if is_touch_2():
            break
        
        # Move backward for 1 second
        print("  Moving backward...")
        motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(-0.3 * 1100))
        await runloop.sleep_ms(1000)
        
        # Check if touch sensor is pressed
        if is_touch_2():
            break
    
    # Stop the motors
    motor_pair.stop(motor_pair.PAIR_1)
    print("Phase 4 Complete: Motion stopped by touch sensor!")
    
    # --- SUCCESS: Show celebration on hub ---
    light_matrix.show_image(light_matrix.IMAGE_HAPPY)
    sleep(2)

runloop.run(main())
sys.exit()
