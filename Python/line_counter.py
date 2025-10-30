# Color Line Counter Robot
# This robot drives forward and counts different colored lines it crosses
# When it gets close to something (like a wall), it stops and shows the results

import time
import motor_pair, color_sensor, distance_sensor # pyright: ignore[reportMissingImports]
import color, runloop, sys # pyright: ignore[reportMissingImports]
from runloop import sleep_ms, run # pyright: ignore[reportMissingImports]
from hub import port, light, light_matrix # pyright: ignore[reportMissingImports]

# Set up the robot's wheels (motors on ports C and D)
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# Color numbers that the sensor uses
RED_COLOR = 9
YELLOW_COLOR = 7
BLUE_COLOR = 3

# This class keeps track of how many colored lines we've seen
class ColorCounter:
    """
    A class to count different colored lines detected by a color sensor.
    
    This class maintains counts for red, yellow, and blue lines and prevents
    double-counting by tracking the last color seen.
    
    Example usage:
        # Create a new counter
        counter = ColorCounter()
        
        # Look for red lines using sensor on port A
        counter.look_for_color(9, 'red', port.A)  # 9 is RED_COLOR
        
        # Check how many red lines we've found
        print(f"Found {counter.red_count} red lines")
        
        # Get all counts
        total_lines = counter.red_count + counter.yellow_count + counter.blue_count
    """
    
    def __init__(self):
        """
        Initialize a new ColorCounter with all counts set to zero.
        
        Example:
            counter = ColorCounter()
            # counter.red_count is now 0
            # counter.yellow_count is now 0  
            # counter.blue_count is now 0
        """
        # Start with zero counts for each color
        self.red_count = 0
        self.yellow_count = 0
        self.blue_count = 0
        self.last_color_seen = None  # Remember what color we just saw

    def look_for_color(self, target_color, color_name, sensor_port):
        """
        Check if we see a specific color and count it.
        
        Args:
            target_color (int): The color number to look for (e.g., 9 for red)
            color_name (str): Name of the color ('red', 'yellow', or 'blue')
            sensor_port: The port where the color sensor is connected
            
        Example:
            # Look for red lines using the color sensor on port A
            counter.look_for_color(RED_COLOR, 'red', port.A)
            
            # After calling this, if a red line was detected:
            # counter.red_count will be incremented by 1
            # The hub's power button will show the current color
            # Counts will be printed to console
        """
        # What color is the sensor seeing right now?
        current_color = color_sensor.color(sensor_port)
        
        # Show the current color on the hub's power button
        light.color(light.POWER, current_color)
        
        # Only count if we see the target color AND it's different from last time
        # (This prevents counting the same line multiple times)
        if current_color == target_color and self.last_color_seen != target_color:
            # Add 1 to the count for this color
            if color_name == 'red':
                self.red_count += 1
            elif color_name == 'yellow':
                self.yellow_count += 1
            elif color_name == 'blue':
                self.blue_count += 1

            # Show our current counts
            print(f"Red lines: {self.red_count}, Yellow lines: {self.yellow_count}, Blue lines: {self.blue_count}")
        
        # Remember this color for next time
        self.last_color_seen = current_color

# Main program that runs the robot
async def main():
    # Create our color counter
    counter = ColorCounter()
    
    # Start moving forward at medium speed
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=220)

    # Keep going until we need to stop
    while True:
        # Check for each type of colored line
        counter.look_for_color(RED_COLOR, 'red', port.A)
        counter.look_for_color(YELLOW_COLOR, 'yellow', port.A)
        counter.look_for_color(BLUE_COLOR, 'blue', port.A)

        # Check how far away the nearest object is
        distance = distance_sensor.distance(port.B)
        
        # If we're very close to something (less than 10cm), stop and show results
        if distance is not None and distance < 10:
            # Stop the robot
            motor_pair.stop(motor_pair.PAIR_1)
          
            # Show red results
            light.color(light.POWER, color.RED)
            await light_matrix.write("Red")
            await light_matrix.write(str(counter.red_count))
            await sleep_ms(2000)  # Wait 2 seconds

            # Show yellow results
            light.color(light.POWER, color.YELLOW)
            await light_matrix.write("Yellow")
            await light_matrix.write(str(counter.yellow_count))
            await sleep_ms(2000)  # Wait 2 seconds

            # Show blue results
            light.color(light.POWER, color.BLUE)
            await light_matrix.write("Blue")
            await light_matrix.write(str(counter.blue_count))
            await sleep_ms(2000)  # Wait 2 seconds

            break  # Exit the while loop (stop the program)

        # Wait a tiny bit before checking again (10 milliseconds)
        await sleep_ms(100)

# Start the program
run(main())
