import sys, motor_pair, runloop # pyright: ignore[reportMissingImports]
import color, color_sensor # pyright: ignore[reportMissingImports]
from hub import port # pyright: ignore[reportMissingImports]

motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
color_port = port.F

async def main():
    runloop.run(when_color_is_blue(), when_color_is_green(), when_color_is_black())

async def when_color_is_blue():
    while True:
        await runloop.until(lambda: color_sensor.color(color_port) == color.BLUE)
        motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.2 * 1100))

async def when_color_is_green():
    while True:
        await runloop.until(lambda: color_sensor.color(color_port) == color.GREEN)
        motor_pair.move(motor_pair.PAIR_1, 0, velocity=-int(0.2 * 1100))

async def when_color_is_black():
    while True:
        await runloop.until(lambda: color_sensor.color(color_port) == color.BLACK)
        sys.exit()

runloop.run(main())
sys.exit()