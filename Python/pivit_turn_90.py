import sys, motor, motor_pair, runloop # pyright: ignore[reportMissingImports]
import color, motion_sensor # pyright: ignore[reportMissingImports]
from hub import port # pyright: ignore[reportMissingImports]
from runloop import run # pyright: ignore[reportMissingImports]
from time import sleep, sleep_ms # pyright: ignore[reportMissingImports]


async def pivot_turn_90(direction):
    if direction not in ("left", "right"):
        raise ValueError("direction must be 'left' or 'right'")

    motion_sensor.reset_yaw(0)
    sleep_ms(100)

    if direction == "left":
        steering = -50# right wheel forward, left wheel stopped
        target_reached = lambda: motion_sensor.tilt_angles()[0] >= 887
    else:# direction == "right"
        steering = 50# left wheel forward, right wheel stopped
        target_reached = lambda: motion_sensor.tilt_angles()[0] <= -887

    motor_pair.move(
        motor_pair.PAIR_1,
        steering,
        velocity=150
    )

    await runloop.until(target_reached)

    motor_pair.stop(motor_pair.PAIR_1, stop=motor.BRAKE)
    sleep_ms(500)

