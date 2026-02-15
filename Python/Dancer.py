# dancer.py
import runloop, time, sys, motor, runloop, distance_sensor
from hub import port
from time import sleep_ms

async def rotate_right_medium_motor():
    velocity = int(0.75*1100)
    while True:

        # rotate cw
        await motor.run_for_degrees(port.D, 180, velocity)
        
        # turn off 4 pixels lights
        distance_sensor.show(port.F, [0,0,0,0])

        # rotate cw
        await motor.run_for_degrees(port.D, 180, velocity)
        
        # turn on the lower 2 pixels lights (blinks)
        distance_sensor.show(port.F, [0,0,50,50])

async def rotate_left_medium_motor():
    velocity = int(0.75*1100)
    while True:

        # rotate cw then ccw
        await motor.run_for_degrees(port.C, 180, velocity)
        await motor.run_for_degrees(port.C, -180, velocity)

runloop.run(rotate_left_medium_motor(), rotate_right_medium_motor())
sys.exit()

