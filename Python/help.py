#
from hub import port, button
from app import sound
import runloop
import color_sensor
import color

 
async def main():
    # This is story #1: Kiki is going for a walk. She's outside and happy, until...       
    await runloop.until(lambda: button.pressed() & button.LEFT)
 
   
    await runloop.until(lambda: color_sensor.color(port.B) == color.BLUE)     
    await sound.play('Traffic')   

    await runloop.until(lambda: color_sensor.color(port.B) == color.YELLOW)
    await sound.play('Ring Tone')  
    await runloop.until(lambda: color_sensor.color(port.B) == color.GREEN)     
    await sound.play('Dog Bark 1')     
    await sound.play('Dog Bark 1')
 
    # This is story #2.     
    await runloop.until(lambda: button.pressed() & button.RIGHT)
 


    await runloop.until(lambda: color_sensor.color(port.B) == color.BLUE)     
    await sound.play('Door Knock')
 
    await runloop.until(lambda: color_sensor.color(port.B) == color.YELLOW)
    await sound.play('Glass Breaking')

    await runloop.until(lambda: color_sensor.color(port.B) == color.GREEN) 
    await sound.play('Dog Bark 3')
  
runloop.run(main())



