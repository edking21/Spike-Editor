# Christmas Tree Light Detector
import runloop, time, sys, motor_pair, motor, force_sensor, runloop
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms
from runloop import run

# Conversion constants
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4

# how many times we see each color
red_count = 0
yellow_count = 0
blue_count = 0

# Color codes - these numbers represent different colors to the robot
blue = 3
yellow = 7
red = 9

# Ports on the robot hub
distance_port = port.F
color_port = port.B

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
            Using with wait until:    await runloop.until(is_red)
            Using with repeat until:    await while not (is_red())
    """
    return color_sensor.color(port.F) == color.RED

########################################################################
# 🎯 is_pressed - Function to check if pressed
########################################################################
def is_pressed():
    """
    Examples:
            Using with wait until:    await runloop.until(is_pressed)
            Using with repeat until:    while not (is_pressed())
    """
    return force_sensor.pressed(port.A)

########################################################################
# ☀️ is_near - Function or condition to check if something is close
########################################################################
def is_near(distance_threshold=100): # 100mm (4 inches) minimum
    """
    Examples:
        with if
            if is_near():
        with wait until condition:
            await runloop.until(is_near)
        with repeat until function:
            while not (is_near())
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
    Analyze recent color readings to determine if Christmas light is on/off

    State 1 (OFF): Consistently reads black (0)
    State 2 (ON): Random mix of no color (-1), black (0), or white (10)
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
    """Set power button LED: Green for ON, Red for OFF"""
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
# 🤖 Main - Start and Stop is_near test using Wait until condition
########################################################################
async def main():
       
    runloop.run(monitor_christmas_light(), rotate_left_medium_motor(), rotate_right_medium_motor())

runloop.run(main())
sys.exit()


