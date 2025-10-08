class LineFollow:
    """A robot that can follow a line.
    
    This robot uses a light sensor to see the edge between the dark and light and automatically steers
    the wheels to stay over the edge by adjusting the motor speeds.
   
    Attributes:
        target_light (int): The desired light intensity the robot tries to stay on.
            Defaults to 60.
        speed (int): How fast the robot moves.
            Defaults to 180.
        kp (float): Proportional gain for steering correction.
            Defaults to 6.8.

    Args:
        iterations (str): Number of iterations to run the line following loop. If None, runs indefinitely.
            Defaults to None.
           
    Example:
        Basic usage example:

            line_follower = LineFollow(target_light=60, speed=180, kp=6.8)

            await line_follower.follow_line(iterations=30)  # Run for 30 iterations then stop

    Note:
        - Target_light is computed from half the difference between the value returned from the sensor when positioning over the light then over the dark. 
        - Higher speeds are mostly for competition runs. 
        - kp is the gain in a PID controller.
        """

    def __init__(self, target_light=60, speed=180, kp=6.8):
        self.target_light = target_light
        self.speed = speed
        self.kp = kp
    
    async def follow_line(self, iterations=None):
        """Execute line following behavior using proportional control algorithm.
        
        This method implements the main control loop for line following. It continuously
        reads light sensor values, calculates steering corrections using proportional
        control, and adjusts motor speeds to keep the color sensor centered on the edge between 
        light and dark.
        
        The control algorithm works by:
        1. Reading light reflection from the color sensor
        2. Calculating error as (target_light - current_light)
        3. Applying proportional gain (kp) to generate steering correction
        4. Adjusting left/right motor speeds based on correction
        5. Repeating until stopped or iteration limit reached
        
        Motor behavior:
        - Left motor (port C): Runs in reverse direction (-speed)
        - Right motor (port D): Runs in forward direction (+speed)
        - Steering correction added or subtracted from left, added or subtracted from right
        
        Args:
            iterations (str): Number of iterations to run the line following loop. If None, runs indefinitely.
                Defaults to None.
        
        Raises:
            Usually no errors, but the robot might have problems if the motors or sensors stop working properly.
        
        Raises:
            No explicit exceptions raised, but hardware communication errors
            from motor or sensor operations may propagate.
        
        Note:
            - Color sensor must be set to relection mode before calling this method.
            - If no iterations runs indefinitely until manually stopped. 
            - Each iteration includes one sensor reading and motor speed adjustment.
            - Method includes 100ms delay between iterations for stable control
            - Debug information is printed each iteration showing sensor readings and calculated motor speeds
            - Motors are automatically stopped when method completes
        
        Example:
            # Run indefinitely

            await line_follower.follow_line()
            
            # Run for 50 iterations then stop
            
            await line_follower.follow_line(iterations=50)
        """
        iteration = 0


        while True:
            # Perform line following iteration
            light_intensity = color_sensor.reflection(port.F) # pyright: ignore[reportUndefinedVariable]
            steering_correction = self.kp * (self.target_light - light_intensity)
            
            left_speed = self.speed + steering_correction
            right_speed = self.speed - steering_correction
            
            motor.run(port.C, -int(left_speed)) # pyright: ignore[reportUndefinedVariable]
            motor.run(port.D, int(right_speed)) # pyright: ignore[reportUndefinedVariable]
            
            self.debug_print(iteration, self.target_light, self.speed, self.kp,  light_intensity, 
                             steering_correction, left_speed, right_speed)
            sleep_ms(100) # pyright: ignore[reportUndefinedVariable]
            
            iteration += 1
            
            # Break if we've reached the specified number of iterations
            if iterations is not None and iteration >= iterations:
                break
        
        # Stop motors when done
        await self.stop_motors()


    def debug_print(self, iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed):
        """Debug printing utility"""
        print("Iteration: {:3d} | Target_Light: {:3d} | Speed: {:3d} | KP: {:6.2f} | Steering_Correction: {:6.2f} | Left_Speed: {:6.2f} | Right_Speed: {:6.2f}".format(
            iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed))
        

    async def stop_motors(self):
        """Stop both motors"""
        motor.stop(port.C) # pyright: ignore[reportUndefinedVariable]
        motor.stop(port.D) # pyright: ignore[reportUndefinedVariable]