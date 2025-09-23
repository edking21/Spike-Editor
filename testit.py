from hub import light_matrix
import runloop, motor_pair, port, force_sensor

async def main():

    
    # move forward for 10cm
    await motor_pair.move_for_degrees(motor_pair.PAIR_1, 10*21, 0, velocity=movement_speed)

    # Turn On Angry Face For 2 Seconds
    light_matrix.show_image(light_matrix.IMAGE_ANGRY)
    sleep(2)

runloop.run(main)
