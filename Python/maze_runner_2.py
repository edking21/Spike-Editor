import color
import color_sensor
import motor_pair
import runloop
from app import sound
from hub import light_matrix, port
from runloop import run

PAIR = motor_pair.PAIR_1
SPEED = int(0.25 * 1100)  # 25% speed

def sees_black():
    return color_sensor.color(port.B) == color.BLACK

def does_not_see_black():
    return color_sensor.color(port.B) != color.BLACK

def sees_blue():
    return color_sensor.color(port.B) == color.BLUE

def does_not_see_blue():
    return color_sensor.color(port.B) != color.BLUE

async def watch_black():
    while True:
        # Hand the function to runloop.until (no parentheses); it keeps checking for us
        await runloop.until(sees_black)
        motor_pair.stop(PAIR)  # stop at black
        await runloop.until(does_not_see_black)

async def watch_blue():
    while True:
        await runloop.until(sees_blue)
        motor_pair.move(PAIR, 0, velocity=SPEED)
        await runloop.until(does_not_see_blue)

async def main():
    run(watch_black(), watch_blue() )
    motor_pair.move(PAIR, 0, velocity=SPEED)  # start forward

    while True:
        await runloop.sleep_ms(100)

try:
    run(main())
except SystemExit:
    pass

