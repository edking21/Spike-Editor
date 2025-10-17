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
        target_light (int): The desired light intensity the robot tries to stay on.
            Defaults to 60.
        speed (int): How fast the robot moves.
            Defaults to 180.
        kp (float): Proportional gain for steering correction.
            Defaults to 6.8.
           
    Example:
        Basic usage example:

            line_follower = LineFollow(target_light=60, speed=180, kp=6.8)
            
            # Parent code controls the loop
            for i in range(100):
                await line_follower.follow_line()

    Note:
        - Target_light is computed from half the difference between the value returned from the sensor when positioning over the light then over the dark. 
        - Higher speeds are mostly for competition runs. 
        - kp is the gain in a PID controller.
        """

def __init__(self, target_light=70, speed=140, kp=6.5):
        self.target_light = target_light
        self.speed = speed
        self.kp = kp
        self.iteration = 0
    
    async def follow_line(self):
        """Execute one iteration of line following behavior.
        
        This method performs a single iteration of the line following control loop.
        It reads the light sensor value, calculates steering correction using proportional
        control, and adjusts motor speeds accordingly. The parent code is responsible
        for calling this method repeatedly in a loop.
        
        The control algorithm works by:
        1. Reading light reflection from the color sensor
        2. Calculating error as (target_light - current_light)
        3. Applying proportional gain (kp) to generate steering correction
        4. Adjusting left/right motor speeds based on correction
        
        Motor behavior:
        - Left motor (port C): Runs in reverse direction (-speed)
        - Right motor (port D): Runs in forward direction (+speed)
        - Steering correction added or subtracted from left, added or subtracted from right
        
        Returns:
            None: Executes one control iteration and returns.
        
        Raises:
            Usually no errors, but the robot might have problems if the motors or sensors stop working properly.
        
        Note:
            - Color sensor must be set to reflection mode before calling this method.
            - Parent code should call this method repeatedly in a loop for continuous line following
            - Each call performs one sensor reading and motor speed adjustment
            - Debug information is printed each iteration showing sensor readings and calculated motor speeds
        
        Example:
            # Parent code controls the loop
            line_follower = LineFollow(60, 180, 6.8)
            
            # Run for specific number of iterations
            for i in range(100):
                await line_follower.follow_line()
                await sleep_ms(100)  # Add delay between iterations
            
            # Or run indefinitely
            while True:
                await line_follower.follow_line()
                await sleep_ms(100)
        """
        # Turn On Butterfly For 2 Seconds
        # light_matrix.show_image(light_matrix.IMAGE_BUTTERFLY) # pyright: ignore[reportUndefinedVariable]
        # sleep(2)        # pyright: ignore[reportUndefinedVariable] # Perform one line following iteration
        # Perform one line following iteration
        light_intensity = color_sensor.reflection(port.F) # pyright: ignore[reportUndefinedVariable]
        steering_correction = self.kp * (self.target_light - light_intensity)
        
        left_speed = self.speed + steering_correction
        right_speed = self.speed - steering_correction
        
        motor.run(port.C, -int(left_speed)) # pyright: ignore[reportUndefinedVariable]
        motor.run(port.D, int(right_speed)) # pyright: ignore[reportUndefinedVariable]
        
        self.debug_print(self.iteration, self.target_light, self.speed, self.kp, light_intensity, 
                         steering_correction, left_speed, right_speed)
        
        self.iteration += 1

    def debug_print(self, iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed):
        """Debug printing utility"""
        print("Iteration: {:3d} | Target_Light: {:3d} | Speed: {:3d} | KP: {:6.2f} | Steering_Correction: {:6.2f} | Left_Speed: {:6.2f} | Right_Speed: {:6.2f}".format(
            iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed))
        

    async def stop_motors(self):
        """Stop both motors"""
        motor.stop(port.C) # pyright: ignore[reportUndefinedVariable]
        motor.stop(port.D) # pyright: ignore[reportUndefinedVariable]