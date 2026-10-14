from hub import port # pyright: ignore[reportMissingImports]
import distance_sensor, runloop, motor_pair # pyright: ignore[reportMissingImports]
async def main():

    def is_near(distance_threshold=200): # 200mm (7.8 inches)
        distance = distance_sensor.distance(port.B)
        return distance < distance_threshold

    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.2 * 1100))

    # Drive forward until an object is closer than 200 mm
    await runloop.until ( is_near)

    # Drive forward until an object is closer than 10 cm
    await runloop.until ( lambda: is_near(100))

    # stop moving
    motor_pair.stop(motor_pair.PAIR_1)
    print("Stopped 10 cm from the obstacle")
 
runloop.run(main())
