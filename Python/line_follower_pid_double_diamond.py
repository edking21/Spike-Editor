# Line Follower - Proportional Control (Double Diamond)
#########################################################################
# 🛻 main
#########################################################################
async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    robot = LineFollow(target_light=70, speed=140, kp=6.5)

    for i in range(300):
        if distance_sensor.distance(port.B) < 50 and distance_sensor.distance(port.B) != -1:
            motor_pair.stop(motor_pair.PAIR_1)
            sleep(2)
        await robot.follow_line()
        sleep_ms(100)


##############################################################################
##############################################################################
##############################################################################

import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light_matrix, port, sound
from time import sleep, sleep_ms

##############################################################################
# 🚙 Class LineFollow
############################################################
class LineFollow:
    """A robot that follows a line using proportional control.

    The color sensor measures reflected light, and the robot adjusts its
    motor speeds to follow the target reflection value.

    Attributes:
        target_light (int): Target reflection value. Defaults to 60.
        speed (int): Base motor speed. Defaults to 180.
        kp (float): Proportional gain for steering correction. Defaults to 6.8.

    Args:
        target_light (int): Target reflection value.
        speed (int): Base motor speed.
        kp (float): Proportional gain for steering correction.

    Example:
        line_follower = LineFollow(target_light=60, speed=180, kp=6.8)

        for i in range(100):
            await line_follower.follow_line()

    Note:
        - Set target_light to the midpoint of the measured reflection values
          for the line and its background.
        - Higher speeds are generally suited to competition runs.
        - kp controls how strongly the robot responds to reflection error.
    """

    def __init__(self, target_light=60, speed=180, kp=6.8):
        self.target_light = target_light
        self.speed = speed
        self.kp = kp
        self.iteration = 0

    async def follow_line(self):
        """Execute one iteration of line following behavior.

        This method performs one iteration of the line-following control loop.
        It reads the color sensor, calculates a proportional steering correction,
        and adjusts the motor speeds. The parent code calls this method repeatedly.

        The control algorithm works by:
        1. Reading light reflection from the color sensor
        2. Calculating error as (target_light - current_light)
        3. Applying proportional gain (kp) to generate steering correction
        4. Adjusting left/right motor speeds based on correction

        Motor behavior:
        - The left motor (port C) runs at `-(speed + steering_correction)`.
        - The right motor (port D) runs at `speed - steering_correction`.

        Returns:
            None.

        Note:
            - Each call reads the color sensor on port F once and adjusts the
              motor speeds once.
            - Call this method repeatedly for continuous line following.
            - Each call prints debug values for the current iteration.

        Example:
            line_follower = LineFollow(60, 180, 6.8)

            for i in range(100):
                await line_follower.follow_line()
                sleep_ms(100)  # Add a delay between iterations.

            while True:
                await line_follower.follow_line()
                sleep_ms(100)
        """

        light_intensity = color_sensor.reflection(port.F)  # pyright: ignore[reportUndefinedVariable]
        steering_correction = self.kp * (self.target_light - light_intensity)

        left_speed = self.speed + steering_correction
        right_speed = self.speed - steering_correction

        motor.run(port.C, -int(left_speed))  # pyright: ignore[reportUndefinedVariable]
        motor.run(port.D, int(right_speed))  # pyright: ignore[reportUndefinedVariable]

        self.debug_print(self.iteration, self.target_light, self.speed, self.kp, light_intensity,
                        steering_correction, left_speed, right_speed)

        self.iteration += 1

    def debug_print(self, iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed):
        """Print the supplied line-following debug values."""
        print("Iteration: {:3d} | Target_Light: {:3d} | Speed: {:3d} | KP: {:6.2f} | Steering_Correction: {:6.2f} | Left_Speed: {:6.2f} | Right_Speed: {:6.2f}".format(
            iteration, target_light, speed, kp, light_intensity, steering_correction, left_speed, right_speed))


    async def stop_motors(self):
        """Stop both motors"""
        motor.stop(port.C)  # pyright: ignore[reportUndefinedVariable]
        motor.stop(port.D)  # pyright: ignore[reportUndefinedVariable]

runloop.run(main())
sys.exit()
