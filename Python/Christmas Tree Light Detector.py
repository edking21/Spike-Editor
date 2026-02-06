########################################################################
# 🎄 Christmas Tree Light Detector
# Monitors a Christmas light and shows status on hub power button
########################################################################

import runloop, sys
import color_sensor
from hub import light, port
from time import sleep_ms

# Color sensor port (change to match your connection)
color_port = port.B

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
    print("Connect color sensor to port A and place 1cm from light")

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
               
                print("Readings: %s | State: %s" % (reading_buffer[-5:], light_state))

        except Exception as e:
            print("Error: %s" % e)
            light.color(light.POWER, yellow) # Error indicator



        await runloop.sleep_ms(100)# Check every 100ms

########################################################################
# 🚀 Run the detector
########################################################################
async def main():
    await monitor_christmas_light()

runloop.run(main())
sys.exit()
