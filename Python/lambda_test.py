import runloop, sys, motor_pair, distance_sensor # pyright: ignore[reportMissingImports]
from hub import port # pyright: ignore[reportMissingImports]
from time import sleep_ms

async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

    while True:

        motor_pair.move(motor_pair.PAIR_1, 0)

        await runloop.until (lambda: is_near ()) 

        motor_pair.stop(motor_pair.PAIR_1)
        sleep_ms(10) # pyright: ignore[reportUndefinedVariable]

def is_near(distance_threshold=100): # 100mm (4 inches) minimum
    distance = distance_sensor.distance(port.B)
    print ("Distance {:6.2f}".format(distance_sensor.distance(port.B)))
    return distance != -1 and distance < distance_threshold

runloop.run(main())
sys.exit()
