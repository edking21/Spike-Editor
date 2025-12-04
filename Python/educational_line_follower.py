"""
🎓 Educational Line Follower for Middle School Students
=====================================================

This demonstrates PID control using the physics concept: Force = Mass × Acceleration

Key Learning Concepts:
1. Proportional Control = "Rubber Band Effect"
2. Force increases with distance from target (like F = ma)
3. Self-correcting systems in robotics
4. Real-world applications in self-driving cars

"""

import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light_matrix, port, sound
from time import sleep, sleep_ms

class EducationalLineFollower:
    """
    🚗 Self-Driving Robot Car for Learning Control Systems
    
    This robot demonstrates how force increases with distance from target,
    just like Force = Mass × Acceleration in physics class!
    
    Think of it like a rubber band connecting your robot to the center line:
    - Small distance from center = Weak rubber band = Gentle steering
    - Large distance from center = Strong rubber band = Sharp steering
    
    Args:
        target_light (int): The "center line" light value robot tries to stay on
        speed (int): How fast the robot moves forward
        kp (float): The "rubber band strength" - how hard it pulls back to center
        
    Example:
        # Create a robot that follows a line
        robot = EducationalLineFollower(target_light=60, speed=150, kp=5.0)
        
        # Make it follow the line
        await robot.demonstrate_control()
    """
    
    def __init__(self, target_light: int = 60, speed: int = 150, kp: float = 5.0) -> None:
        self.target_light = target_light  # Our "center line" target
        self.speed = speed                # Forward movement speed
        self.kp = kp                     # "Rubber band strength"
        self.iteration = 0
        
        # Educational tracking variables
        self.max_error_seen = 0
        self.max_force_seen = 0
        
    async def demonstrate_control(self, show_physics: bool = True) -> None:
        """
        🎯 Main demonstration of control theory concepts
        
        This method shows students how:
        1. Distance from target creates "error"
        2. Error creates "force" (like F = ma)
        3. Force creates steering correction
        4. Robot self-corrects back to center
        
        Args:
            show_physics (bool): Whether to display physics analogies
        """
        print("\n🚗 Starting Self-Driving Robot Demonstration!")
        print("Watch how the 'force' changes as the robot moves away from center...\n")
        
        for i in range(100):  # Run for 100 iterations
            await self.follow_with_physics_explanation(show_physics)
            await sleep_ms(50)  # Small delay to see the action
            
        await self.stop_motors()
        print(f"\n📊 Final Stats:")
        print(f"   Max error seen: {self.max_error_seen:.1f}")
        print(f"   Max force generated: {self.max_force_seen:.1f}")
        
    async def follow_with_physics_explanation(self, show_physics: bool = True) -> None:
        """
        🔬 One iteration of line following with physics explanations
        """
        # Step 1: Read the sensor (like robot's "eyes")
        current_light = color_sensor.reflection(port.F)
        
        # Step 2: Calculate "distance from center" (error)
        error = self.target_light - current_light
        distance_from_center = abs(error)
        
        # Step 3: Apply physics! Force = kp × distance (like F = ma)
        steering_force = self.kp * error
        
        # Step 4: Convert force to motor speeds
        left_speed = self.speed + steering_force
        right_speed = self.speed - steering_force
        
        # Step 5: Apply the steering
        motor.run(port.C, -int(left_speed))
        motor.run(port.D, int(right_speed))
        
        # Track maximum values for educational purposes
        if distance_from_center > self.max_error_seen:
            self.max_error_seen = distance_from_center
        if abs(steering_force) > self.max_force_seen:
            self.max_force_seen = abs(steering_force)
            
        # Educational output
        if show_physics and (self.iteration % 10 == 0):  # Show every 10th iteration
            self.explain_physics(current_light, error, steering_force, left_speed, right_speed)
            
        self.iteration += 1
        
    def explain_physics(self, current_light: float, error: float, steering_force: float, 
                       left_speed: float, right_speed: float) -> None:
        """
        🎓 Explain the physics and control theory to students
        """
        direction = "LEFT" if error > 0 else "RIGHT"
        distance_cm = abs(error) * 0.1  # Rough conversion for explanation
        
        print(f"\n🎯 Iteration {self.iteration}:")
        print(f"   Robot is {distance_cm:.1f}cm {direction} of center line")
        print(f"   Error (distance): {error:+6.1f}")
        print(f"   Steering Force:   {steering_force:+6.1f} ← Like F = ma!")
        print(f"   Result: {'Turning toward center' if abs(steering_force) > 1 else 'Going straight'}")
        
        # Visual representation
        if abs(error) > 10:
            print(f"   🔴 BIG error = BIG force = SHARP turn")
        elif abs(error) > 5:
            print(f"   🟡 Medium error = Medium force = Gentle turn")
        else:
            print(f"   🟢 Small error = Small force = Almost straight")
            
    async def compare_different_forces(self) -> None:
        """
        🧪 Hands-on activity: Compare different "rubber band strengths"
        """
        print("\n🧪 Experiment: Different Rubber Band Strengths!")
        
        test_values = [2.0, 5.0, 10.0]  # Different kp values
        
        for kp_value in test_values:
            print(f"\n📏 Testing with kp = {kp_value} ('rubber band strength')")
            self.kp = kp_value
            
            # Simulate robot being off-center by different amounts
            test_errors = [5, 10, 20]  # Different distances from center
            
            for error in test_errors:
                force = self.kp * error
                print(f"   Distance {error:2d} → Force {force:5.1f}")
                
            print(f"   Notice: Stronger 'rubber band' = Bigger forces!")
            await sleep_ms(1000)
            
    async def stop_motors(self) -> None:
        """🛑 Stop both motors safely"""
        motor.stop(port.C)
        motor.stop(port.D)
        print("🛑 Motors stopped safely")

# 🎯 Hands-on Activity Functions for Students

async def activity_1_understand_error():
    """
    Activity 1: Understanding "Error" (Distance from Target)
    """
    print("\n" + "="*50)
    print("📚 ACTIVITY 1: Understanding Error")
    print("="*50)
    print("Error = How far robot is from the center line")
    print("Positive error = Robot is left of center")
    print("Negative error = Robot is right of center")
    
    # Simulate different positions
    target = 60
    positions = [70, 65, 60, 55, 40]  # Different light sensor readings
    
    for pos in positions:
        error = target - pos
        print(f"Sensor reads {pos:2d}, Target is {target:2d} → Error = {error:+3d}")
        
    print("\nNotice: Bigger distance = Bigger error!")
    await sleep_ms(2000)

async def activity_2_force_equals_distance():
    """
    Activity 2: Force = kp × Distance (like F = ma)
    """
    print("\n" + "="*50)
    print("⚡ ACTIVITY 2: Force = kp × Distance")
    print("="*50)
    print("Just like F = ma in physics, steering force increases with distance!")
    
    kp = 5.0  # Rubber band strength
    distances = [1, 5, 10, 20]  # Different distances from center
    
    print(f"Using kp = {kp} ('rubber band strength')")
    for distance in distances:
        force = kp * distance
        print(f"Distance {distance:2d} → Force {force:5.1f}")
        
    print("\nBigger distance = Bigger force = Sharper turn!")
    await sleep_ms(2000)

async def activity_3_compare_rubber_bands():
    """
    Activity 3: Compare Different "Rubber Band Strengths"
    """
    print("\n" + "="*50)
    print("🎈 ACTIVITY 3: Different Rubber Band Strengths")
    print("="*50)
    
    distance = 10  # Robot is 10 units from center
    kp_values = [1.0, 5.0, 10.0]  # Different strengths
    
    print(f"Robot is {distance} units from center line:")
    for kp in kp_values:
        force = kp * distance
        strength = "Weak" if kp < 3 else "Medium" if kp < 8 else "Strong"
        print(f"kp = {kp:4.1f} ({strength:6s} rubber band) → Force = {force:5.1f}")
        
    print("\nStronger rubber band = Bigger force = Faster correction!")
    await sleep_ms(2000)

# 🚗 Main Demonstration Program
async def main():
    """
    🎓 Complete Educational Demonstration
    """
    print("🎓 Welcome to Robot Control Theory Class!")
    print("Today we'll learn how robots use 'Force = Mass × Acceleration'")
    print("to stay on a line, just like self-driving cars!")
    
    # Run all activities
    await activity_1_understand_error()
    await activity_2_force_equals_distance()
    await activity_3_compare_rubber_bands()
    
    # Live robot demonstration
    print("\n" + "="*50)
    print("🤖 LIVE ROBOT DEMONSTRATION")
    print("="*50)
    
    # Set up motors
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
    
    # Create educational robot
    robot = EducationalLineFollower(target_light=60, speed=150, kp=5.0)
    
    # Demonstrate control
    await robot.demonstrate_control(show_physics=True)
    
    # Compare different settings
    await robot.compare_different_forces()
    
    print("\n🎉 Demonstration complete!")
    print("Remember: Just like F = ma, bigger distance = bigger force = bigger correction!")

if __name__ == "__main__":
    runloop.run(main())
    sys.exit()