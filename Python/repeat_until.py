
from hub import port # pyright: ignore[reportMissingImports]
from time import sleep_ms
import distance_sensor, motor_pair # pyright: ignore[reportMissingImports]
async def main():

    def is_near(distance_threshold=200): # 200mm (7.8 inches)
        distance = distance_sensor.distance(port.B)
        return distance < distance_threshold

    while not is_near():
        await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10 * int(360/17.5),
            0, velocity=int(.2 * 1100))
        sleep_ms(200)

        if is_near(): break

        await motor_pair.move_for_degrees(motor_pair.PAIR_1, -10 * int(360/17.5),
            0, velocity=int(.2 * 1100))
        sleep_ms(200)

    motor_pair.stop(motor_pair.PAIR_1)
    print("Hand Detected! Stopped repeating.")