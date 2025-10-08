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
        self.is_running = False
        self.iteration = 0
    
    async def follow_line(self, iterations=None):
        """Start or check the line following background loop.
        
        This method starts a persistent background control loop for line following if one
        is not already running. If the loop is already active, the method returns immediately
        without taking any action. The background loop continuously reads light sensor values,
        calculates steering corrections, and adjusts motor speeds.
        
        The control algorithm works by:
        1. Reading light reflection from the color sensor
        2. Calculating error as (target_light - current_light)
        3. Applying proportional gain (kp) to generate steering correction
        4. Adjusting left/right motor speeds based on correction
        5. Repeating continuously in the background
        
        Motor behavior:
        - Left motor (port C): Runs in reverse direction (-speed)
        - Right motor (port D): Runs in forward direction (+speed)
        - Steering correction added or subtracted from left, added or subtracted from right
        
        Args:
            iterations (int, optional): Maximum number of control loop iterations
                to execute. If None (default), runs indefinitely in the background.
        
        Returns:
            None: Returns immediately if loop is already running, otherwise starts the loop.
        
        Raises:
            Usually no errors, but the robot might have problems if the motors or sensors stop working properly.
        
        Note:
            - Color sensor must be set to reflection mode before calling this method.
            - Loop runs continuously in the background until stop_motors() is called
            - Each iteration includes one sensor reading and motor speed adjustment.
            - Method includes 100ms delay between iterations for stable control
            - Debug information is printed each iteration showing sensor readings and calculated motor speeds
            - Motors continue running after method returns
        
        Example:
            # Start the background line following loop
            await line_follower.follow_line()
            
            # Try to start again - will return immediately since already running
            await line_follower.follow_line()
            
            # Stop the loop when needed
            await line_follower.stop_motors()
        """
        # Check if already running - if so, return immediately
        if self.is_running:
            return
        
        # Mark as running and start the background loop
        self.is_running = True
        self.iteration = 0
        
        # Start the continuous background loop
        await self._background_line_follow_loop(iterations)
    
    async def _background_line_follow_loop(self, iterations=None):
        """Internal background loop for line following."""
        while self.is_running:
            # Perform line following iteration
            light_intensity = color_sensor.reflection(port.F) # pyright: ignore[reportUndefinedVariable]
            steering_correction = self.kp * (self.target_light - light_intensity)
            
            left_speed = self.speed + steering_correction
            right_speed = self.speed - steering_correction
            
            motor.run(port.C, -int(left_speed)) # pyright: ignore[reportUndefinedVariable]
            motor.run(port.D, int(right_speed)) # pyright: ignore[reportUndefinedVariable]
            
            self.debug_print(self.iteration, self.target_light, self.speed, self.kp, light_intensity, 
                             steering_correction, left_speed, right_speed)
            sleep_ms(100) # pyright: ignore[reportUndefinedVariable]
            
            self.iteration += 1
            
            # Break if we've reached the specified number of iterations
            if iterations is not None and self.iteration >= iterations:
                break
        
        # Mark as stopped when loop ends
        self.is_running = False


    def debug_print(self, iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed):
        """Debug printing utility"""
        print("Iteration: {:3d} | Target_Light: {:3d} | Speed: {:3d} | KP: {:6.2f} | Steering_Correction: {:6.2f} | Left_Speed: {:6.2f} | Right_Speed: {:6.2f}".format(
            iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed))
        

    async def stop_motors(self):
        """Stop both motors and the line following loop"""
        self.is_running = False
        motor.stop(port.C) # pyright: ignore[reportUndefinedVariable]
        motor.stop(port.D) # pyright: ignore[reportUndefinedVariable]