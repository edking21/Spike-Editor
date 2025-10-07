import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light_matrix, port, sound
from time import sleep, sleep_ms

async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
    
    # Set constant needed light reflection
    target_light = 60
    speed = 200 # Base speed for both wheels
    KP = 0.8  # Proportional gain for control
    
    # Loop to continuously adjust motor speed based on light intensity correction
    for i in range(100):  # Run for 100 iterations (adjust as needed)
        # Read light intensity from color sensor (0-100%)
        light_intensity = color_sensor.reflection(port.F)
        
        # Calculate correction (signed, not absolute)
        correction = KP * (target_light - light_intensity)
        
        # Calculate wheel velocities
        left_speed = speed - correction    # Left motor speed
        right_speed = speed + correction   # Right motor speed
      
        # Start moving at speed - equivalent to word block
        # Left motor turns counter-clockwise for positive values
        motor.run(port.C, -int(left_speed))   # Left wheel 
        motor.run(port.D, int(right_speed))  # Right wheel
        
        # Optional: Print current values for debugging
        print("Iteration ", i , "Light= ", light_intensity, "target_light " , target_light , "correction " ,correction)
        print("Left Speed=" , left_speed, "Right Speed=" , right_speed)
        
        # Small delay before next reading
        sleep_ms(100)  # 100ms delay
    
    # Stop motors when loop ends
    motor.stop(port.C)
    motor.stop(port.D)

runloop.run(main())
sys.exit()