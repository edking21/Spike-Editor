import color
import color_sensor
import motor_pair
import runloop
from hub import port

PAIR = motor_pair.PAIR_1
SPEED = int(0.25 * 1100)

motor_pair.pair(PAIR, port.C, port.D)


async def watch_black():
    while True:
        await runloop.until(lambda: color_sensor.color(port.B) == color.BLACK)
        motor_pair.stop(PAIR)
        await runloop.until(lambda: color_sensor.color(port.B) != color.BLACK)


async def watch_blue():
    while True:
        await runloop.until(lambda: color_sensor.color(port.B) == color.BLUE)
        motor_pair.move(PAIR, 0, velocity=SPEED)
        await runloop.until(lambda: color_sensor.color(port.B) != color.BLUE)


async def main():
    motor_pair.move(PAIR, 0, velocity=SPEED)
    while True:
        await runloop.sleep_ms(100)


runloop.run(main(), watch_black(), watch_blue())
