# Christmas Tree Light Detector
import runloop, time, sys, motor_pair, motor, force_sensor, runloop
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms
from runloop import run

# Color codes - these numbers represent different colors to the robot
blue = 3
yellow = 7
red = 9

# Ports on the robot hub
distance_port = port.F
color_port = port.B

# Connect two motors together so they work as a team
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

########################################################################
# 🛑 is_color_red - Function to check if the color sensor sees red
########################################################################
def is_color_red():
    """
    Check if the color sensor sees red.
    
    Returns:
        True if the color is red, False otherwise
    """
    return color_sensor.color(port.F) == color.RED

########################################################################
# 🎯 is_pressed - Function to check if pressed
########################################################################
def is_pressed():
    """
    Check if the force sensor is being pressed.
    
    Returns:
        True if the sensor is pressed, False otherwise
    """
    return force_sensor.pressed(port.A)

########################################################################
# ☀️ is_near - Function or condition to check if something is close
########################################################################
def is_near(distance_threshold=100): # 100mm (4 inches) minimum
    """
    Check if an object is close to the distance sensor.
    
    How far away is close?
        Default: 100mm (4 inches) or less
    
    Returns:
        True if something is close, False otherwise
    """
    distance = distance_sensor.distance(port.B)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))

    return distance < distance_threshold

########################################################################
# 🎄 Christmas Tree Light Detector
# Monitors a Christmas light and shows status on hub power button
########################################################################

# Color sensor port (change to match your connection)
# color_port = port.B

# Color codes
BLACK = 0
WHITE = 10
NO_COLOR = -1

# Color codes - these numbers represent different colors to the robot
blue = 3
green = 6
yellow = 7
red = 9

# State tracking
light_state = "unknown"
reading_buffer = []
BUFFER_SIZE = 10# Number of recent readings to analyze

########################################################################
# 🔍 Analyze color readings to determine light state
########################################################################
def analyze_light_state(readings):
    """
    Look at the recent color readings and figure out if the Christmas light is on or off.
    
    How it works:
        - Light OFF: Mostly black readings (darkness)
        - Light ON: Mix of white, black, and no color (flashing light pattern)
    
    Returns:
        "on" if light is on, "off" if light is off, "unknown" if not sure yet
    """
    if len(readings) < BUFFER_SIZE:
        return "unknown"

    # Count different reading types
    black_count = readings.count(BLACK)
    white_count = readings.count(WHITE)
    no_color_count = readings.count(NO_COLOR)

    # If mostly black readings, light is OFF
    if black_count >= (BUFFER_SIZE * 0.8):# 80% or more black
        return "off"

    # If mix of readings including white or no_color, light is ON
    if white_count > 0 or no_color_count > 0:
        return "on"

    return "unknown"

########################################################################
# 💡 Set hub power button LED based on light state
########################################################################
def set_hub_led(state):
    """
    Change the color of the power button LED to show the light state.
    
    Colors:
        - Green: Light is ON
        - Red: Light is OFF
        - Yellow: Unknown state (not sure yet)
    """
    if state == "on":
        light.color(light.POWER, green)
    elif state == "off":
        light.color(light.POWER, red)
    else:
        light.color(light.POWER, yellow) # Unknown state

########################################################################
# 🔄 Main monitoring loop
########################################################################
async def monitor_christmas_light():
    """
    Keep reading the color sensor and figure out if the Christmas light is on or off.
    
    This function runs forever and:
        1. Reads the color sensor over and over
        2. Keeps track of the last 10 readings
        3. Checks if the light state changed
        4. Updates the power button LED to show the state
    """
    global light_state, reading_buffer

    print("🎄 Christmas Light Detector Started")
    print("Connect color sensor to port B and place 1cm from light")

    while True:
        try:
            # Read current color
            current_color = color_sensor.color(color_port)

            # Add to buffer and maintain size
            reading_buffer.append(current_color)
            if len(reading_buffer) > BUFFER_SIZE:
                reading_buffer.pop(0)# Remove oldest reading

            # Analyze current state
            new_state = analyze_light_state(reading_buffer)

            # Update LED if state changed
            if new_state != light_state:
                light_state = new_state
                set_hub_led(light_state)
                print("Light state: %s" % light_state)

            # Debug: Show recent readings
            if len(reading_buffer) >= BUFFER_SIZE:

                print("Readings: %s | light_state: %s" % (reading_buffer[-5:], light_state))

        except Exception as e:
            print("Error: %s" % e)
            light.color(light.POWER, yellow) # Error indicator

        await runloop.sleep_ms(100)# Check every 100ms

async def rotate_right_medium_motor():
    """
    Make the right motor dance when the Christmas light is on.
    
    The motor:
        - Rotates 180 degrees clockwise
        - Turns off the distance sensor pixels
        - Rotates another 180 degrees clockwise
        - Blinks the distance sensor pixels
        - Only runs when the light is ON
    """
    velocity = int(0.75*1100)
    global light_state
    while True:
        if light_state == 'on': 

            # rotate cw
            await motor.run_for_degrees(port.D, 180, velocity)

            # turn off 4 pixels lights
            distance_sensor.show(port.F, [0,0,0,0])

            # rotate cw
            await motor.run_for_degrees(port.D, 180, velocity)

            # turn on the lower 2 pixels lights (blinks)
            distance_sensor.show(port.F, [0,0,50,50])
        else:
            await runloop.sleep_ms(100)  # Check again in 100ms

async def rotate_left_medium_motor():
    """
    Make the left motor dance when the Christmas light is on.
    
    The motor:
        - Rotates 180 degrees clockwise
        - Then rotates 180 degrees counter-clockwise
        - Only runs when the light is ON
    """
    velocity = int(0.75*1100)
    global light_state
    while True:
        if light_state == 'on':
            # rotate cw then ccw
            await motor.run_for_degrees(port.C, 180, velocity)
            await motor.run_for_degrees(port.C, -180, velocity)
        else:
            await runloop.sleep_ms(100)  # Check again in 100ms

########################################################################
# 🤖 Main - Start the Christmas Tree Light Detector
########################################################################
async def main():
    """
    Start the program! This runs three things at the same time:
    
        1. monitor_christmas_light() - Watches the color sensor and figures out if light is on/off
        2. rotate_left_medium_motor() - Dances the left motor when light is detected
        3. rotate_right_medium_motor() - Dances the right motor when light is detected
    
    All three functions run together using run() function.
    """
       
    runloop.run(monitor_christmas_light(), rotate_left_medium_motor(), rotate_right_medium_motor())

runloop.run(main())
sys.exit()


