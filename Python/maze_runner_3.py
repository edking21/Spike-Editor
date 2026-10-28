
SPEED = int(0.25 * 1100)  # 25% speed

async def watch_black(): # stop on black
    while True:
        await runloop.until(lambda: color_sensor.color(port.B) == color.BLACK)
        motor_pair.stop(motor_pair.PAIR_1)  # stop at black
        await runloop.until(lambda: color_sensor.color(port.B) != color.BLACK)

async def watch_blue(): # move on blue
    while True:
        await runloop.until(lambda: color_sensor.color(port.B) == color.BLUE)
        motor_motor.move(motor_pair.PAIR_1, 0, velocity=SPEED)
        await runloop.until(lambda: color_sensor.color(port.B) != color.BLUE)

async def main():
    run(watch_black(), watch_blue())
    motor_motor_pair.move(motor_pair.PAIR_1, 0, velocity=SPEED)  # start forward

    while True:
        await runloop.sleep_ms(100)

try:
    run(main())
except SystemExit:
    pass
