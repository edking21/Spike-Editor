# Import statements - these bring in special functions we need for our robot
import runloop, time, sys, motor_pair, motor, force_sensor, runloop # pyright: ignore[reportMissingImports]
import color, color_sensor, distance_sensor # pyright: ignore[reportMissingImports]
from hub import light, light_matrix, port, sound # pyright: ignore[reportMissingImports]
from time import sleep, sleep_ms
from runloop import run # pyright: ignore[reportMissingImports]

# Variables to count how many times we see each color
# Think of these like scoreboards that keep track of points
red_count = 0
yellow_count = 0
blue_count = 0

# Color codes - these numbers represent different colors to the robot
blue = 3
yellow = 7
red = 9

# Connect two motors together so they work as a team
# Port C and D are where we plugged in our motors
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# Remember the last color we saw so we don't count the same color twice in a row
last_color = None

# This is like a stop sign for our program - when it's True, everything stops
should_stop = False

# This function watches for blue colors
# The "async" means it can work at the same time as other functions
async def check_blue():
    # Use "global" to access variables from outside this function
    global blue_count, last_color, should_stop
    
    # Keep checking until we're told to stop
    while not should_stop:
        # Ask the color sensor what color it sees right now
        current_color = color_sensor.color(port.F)
        
        # If we see blue AND it's different from the last color we saw
        if current_color == blue and last_color != blue:
            # Light up the hub with the color we found
            light.color(light.POWER, current_color)
            # Remember this color for next time
            last_color = blue
            # Add 1 to our blue counter
            blue_count += 1
        
        # Wait a tiny bit before checking again (100 milliseconds)
        await runloop.sleep_ms(100)

# This function watches for yellow colors (works just like check_blue)
async def check_yellow():
    global yellow_count, last_color, should_stop
    while not should_stop:
        current_color = color_sensor.color(port.F)
        if current_color == yellow and last_color != yellow:
            light.color(light.POWER, current_color)
            last_color = yellow
            yellow_count += 1

        await runloop.sleep_ms(100)

# This function watches for red colors (works just like the others)
async def check_red():
    global red_count, last_color, should_stop
    while not should_stop:
        current_color = color_sensor.color(port.F)
        if current_color == red and last_color != red:
            light.color(light.POWER, current_color)
            last_color = red
            red_count += 1

        await runloop.sleep_ms(100)

# This function watches for someone waving their hand near the robot
async def check_hand_wave():
    global blue_count, yellow_count, should_stop
    
    while not should_stop:
        # Check how far away the nearest object is (in millimeters)
        distance = distance_sensor.distance(port.B)
        print("Distance {:6.2f}".format(distance))

        # If something is very close (less than 50mm away) and the sensor is working
        if distance != -1 and distance < 50:
            # Stop the motors from moving
            motor_pair.stop(motor_pair.PAIR_1)
            # Tell all other functions to stop too
            should_stop = True
            # Show our final results - how many of each color we counted
            print("Blue count:{:2d}  Yellow count:{:2d}  Red count:{:2d}".format(blue_count, yellow_count, red_count))
            # Exit this loop
            break

        # Wait a bit before checking distance again
        await runloop.sleep_ms(100)

# This is our main function - it starts everything up
async def main():
    # Start the motors moving forward at normal speed
    motor_pair.move(motor_pair.PAIR_1, 0)

    # Run all our checking functions at the same time
    # It's like having multiple people doing different jobs simultaneously
    run(check_blue(), check_yellow(), check_red(), check_hand_wave())

# Start our main function and run the whole program
runloop.run(main())
# When everything is done, exit the program
sys.exit()