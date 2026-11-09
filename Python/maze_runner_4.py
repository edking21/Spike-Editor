import color
import color_sensor
import motor_pair
import runloop
from hub import port

COLOR_PORT = port.F
SPEED = int(0.2 * 1100)

motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)


async def main():
    while True:
        current_color = color_sensor.color(COLOR_PORT)

        if current_color == color.BLUE:
            motor_pair.move(motor_pair.PAIR_1, 0, velocity=SPEED)
        elif current_color == color.GREEN:
            motor_pair.move(motor_pair.PAIR_1, 0, velocity=-SPEED)
        elif current_color == color.BLACK:
            motor_pair.stop(motor_pair.PAIR_1)
            break

        await runloop.sleep_ms(50)


runloop.run(main())
