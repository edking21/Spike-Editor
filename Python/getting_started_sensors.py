# <challenge name here>

import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms

DEGREES_PER_CM = 21        
DEGREES_PER_INCH = 53       
MM_PER_INCH = 25.4         

########################################################################
# 🛑 is_color_red - Function to check if the color sensor sees red
########################################################################
def is_color_red():
    return color_sensor.color(port.F) == color.RED

########################################################################
# 🎯 is_pressed - Function to check if pressed
########################################################################
def is_pressed():
    return force_sensor.pressed(port.A)

########################################################################
# ☀️ is_near - Function or condition to check if something is close
# Example with lambda: is_close = lambda: is_near(50)  # Creates a function that checks if within 50mm
########################################################################
def is_near(distance_threshold=100): # 100mm (4 inches) minimum
    distance = distance_sensor.distance(port.B)

    if distance == -1:
        print("Warning: Distance sensor not detecting anything")
        return False

    print ("Distance {:5.2f} cm {:6.2f} inches ".format(distance / 10, distance / 25.4))
    
    return distance < distance_threshold

########################################################################
# 🤖 Main - The main program that runs our robot
########################################################################
async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    while True:

        motor_pair.move(motor_pair.PAIR_1, 0)

        # You could also use a lambda here: is_very_close = lambda: is_near(30)
        if is_near():

            motor_pair.stop(motor_pair.PAIR_1)
            sleep_ms(10) # Wait 10 milliseconds before checking again

runloop.run(main())
sys.exit()
