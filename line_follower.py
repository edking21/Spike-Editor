"""
LEGO Spike Prime Line Follower Robot
====================================

This program implements a proportional (P) controller for line following using a color sensor.
The robot follows a line by continuously adjusting left and right motor speeds based on 
light reflection values from the color sensor.

Hardware Setup:
- Left motor: Port C (inverted for counter-clockwise forward motion)
- Right motor: Port D (clockwise forward motion)  
- Color sensor: Port F (measures light reflection)
- Motor pair: PAIR_1 (ports C and D paired)

Control Algorithm:
- Uses proportional control (P-controller) with gain KP
- Calculates steering correction based on difference between target and actual light values
- Applies correction by adding to left motor speed and subtracting from right motor speed
- Higher light reflection (white surface) vs lower reflection (dark line) drives steering

Tunable Parameters:
- target_light: Target reflection value (60 = balance between white/dark)
- speed: Base forward speed for both motors (180)
- KP: Proportional gain for steering response (7)

Author: Ed King
Date: October 7, 2025
"""
import runloop, sys, motor_pair, motor
import color_sensor
from hub import port
from time import sleep_ms

async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    # trial and error veriables, affect how the robot catches the line after a corner
    target_light = 60 # higher covers more white less blue, lower covers less white more blue
    speed = 180 # higher finish sooner, too high creates wiggle or failed line catch
    KP = 7 # higher creates faster steering, too high creates wiggle or failed line catch

    # Loop to continuously adjust motor speed based on light intensity correction
    for i in range(300):# Run for 300 iterations (adjust as needed)
        
        # Read light intensity from color sensor (0-100%)
        light_intensity = color_sensor.reflection(port.F)

        # find how much to change the speed of the left and right motors
        steering_correction = KP * (target_light - light_intensity)

        # apply the correction to the motors
        left_speed = speed + steering_correction    # Left motor speed
        right_speed = speed - steering_correction   # Right motor speed

        # Left motor turns counter-clockwise for positive values
        # The left motor is mounted in the opposite direction, so its speed must be inverted
        motor.run(port.C, -int(left_speed))# Left wheel
        motor.run(port.D, int(right_speed))# Right wheel

        # print debug in the console
        print( i , "light_intensity: ", light_intensity, "target_light " , target_light ,
         "steering_correction " ,steering_correction , "Left Speed=" , left_speed, "Right Speed=" , right_speed)

        # Small delay before next reading
        sleep_ms(100)# 100ms delay

    # Stop motors when loop ends
    motor.stop(port.C)
    motor.stop(port.D)

    
runloop.run(main())
sys.exit()