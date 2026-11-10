# Sensors Python - Middle School Robotics Curriculum

## Overview

**Sensors Python** is a comprehensive middle school robotics curriculum designed to teach students how to program LEGO Education SPIKE robots using **Python** and **all three sensors** in combination:

1. 🛑 **Force Sensor (Touch)** - Port A
2. ☀️ **Distance Sensor (Ultrasonic)** - Port B  
3. 🧿 **Color Sensor** - Port F

This project teaches students to write Python code for sensor-driven robot behavior and conditional logic. It covers async/await programming patterns and demonstrates how to use sensor functions for event-based robot control.

**Note:** These Python concepts and sensor functions are shared with the Word Blocks visual programming interface. Learning these foundations makes both approaches easier.

## Learning Objectives

By completing this curriculum, students will be able to:

- ✅ **Understand sensor types** - Know what each sensor measures and how to use it
- ✅ **Read sensor values** - Access sensor data in Python code
- ✅ **Implement wait conditions** - Use `await runloop.until()` for event-based programming
- ✅ **Implement repeat loops** - Use `while` loops with sensor conditions
- ✅ **Combine multiple sensors** - Program complex robot behaviors using multiple sensors
- ✅ **Debug sensor programs** - Troubleshoot common sensor issues
- ✅ **Design robot sequences** - Plan multi-phase robot movement programs

## Project: Move Until Touch → Near → Touch → Repeat

### What Does This Robot Do?

The main project teaches students to program a robot that follows this sequence:

1. **Phase 1: Move Until Touch (Force Sensor)**
   - Robot moves forward at 30% speed
   - Waits for the force sensor (Touch) on Port A to be pressed
   - Stops when touched

2. **Phase 2: Move Until Near (Distance Sensor)**
   - Robot moves forward at 30% speed
   - Waits for distance sensor on Port B to detect something within 200mm
   - Stops when something is nearby

3. **Phase 3: Move Until Touch Again (Force Sensor)**
   - Robot moves forward at 30% speed
   - Waits for force sensor on Port A to be pressed again
   - Stops when touched

4. **Phase 4: Repeat Back & Forth (Force Sensor Control)**
   - Robot bounces back and forth (forward 1s, backward 1s)
   - Repeats until force sensor on Port A is pressed
   - Perfect for demonstrating `while not` loop logic

### Hardware Setup Required

```
Port A: Force Sensor (Touch Sensor)
Port B: Distance Sensor (Ultrasonic Sensor)
Port C: Motor (Left Drive Wheel)
Port D: Motor (Right Drive Wheel)
Port F: Color Sensor (for future extensions)
```

### Key Concepts Taught

#### 1. Sensor Functions
```python
def is_pressed():
    """Check if Force Sensor on port A is pressed"""
    return force_sensor.pressed(port.A)

def is_near(distance_threshold=200):
    """Check if object is closer than 200mm"""
    distance = distance_sensor.distance(port.B)
    return distance < distance_threshold

def is_blue():
    """Check if Color Sensor sees blue"""
    return color_sensor.color(port.F) == color.BLUE
```

#### 2. Wait Until (Async Await)
```python
# Wait until condition is true (using function)
await runloop.until(is_pressed)

# Wait until condition is true (using lambda for override)
await runloop.until(lambda: is_near(100))  # Only 100mm threshold
```

#### 3. Repeat Until (While Loop)
```python
# Repeat while condition is false
while not is_pressed():
    # Do something repeatedly
    motor_pair.move(PAIR_1, 0, velocity=330)
    sleep_ms(1000)
```

#### 4. Motor Control
```python
# Start moving forward at 30% speed (330 out of 1100 max)
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))

# Stop moving
motor_pair.stop(motor_pair.PAIR_1)
```

## Files in This Project

### Python Examples
- **`sensor_three_touch_near.py`** - Main example implementing all 4 phases
- **`getting_started_sensors.py`** - Basic sensor introduction
- **`sensor_four_square.py`** - Four-square challenge using sensors
- **`is_near_explanation.md`** - Detailed explanation of distance sensor usage

### HTML/Web Content
- **`../lessons/sensor_python.html`** - Interactive lesson page with:
  - Learning objectives
  - Hardware setup guide
  - 4 phase cards with explanations
  - Sensor legend and reference
  - Teacher tips and extension activities

### Documentation
- **`SENSORS_PYTHON_README.md`** - This file

## Teaching Guide

### Lesson Plan (45-60 minutes)

#### Phase 1: Introduction (10 minutes)
- Introduce the three sensors
- Explain sensor ports and connections
- Discuss how sensors help robots make decisions

#### Phase 2: Hands-On Assembly (10 minutes)
- Students connect Force Sensor to Port A
- Students connect Distance Sensor to Port B
- Students verify motor connections (Ports C & D)
- Test each sensor individually

#### Phase 3: Coding Phase 1 (10 minutes)
- Load `sensor_three_touch_near.py`
- Run only Phase 1 code (Move Until Touch)
- Discuss the `await runloop.until()` syntax
- Students test by touching the sensor

#### Phase 4: Coding Phases 2-3 (15 minutes)
- Explain distance threshold (200mm = 7.8 inches)
- Add Phase 2 code (Move Until Near)
- Test with hand/object as obstacle
- Add Phase 3 code (Move Until Touch Again)

#### Phase 5: Repeat Loop Challenge (10 minutes)
- Explain `while not is_pressed()` syntax
- Add Phase 4 code (Repeat Back & Forth)
- Test the bouncing motion
- Challenge: Try different speeds!

#### Phase 6: Extensions (Optional, 5-15 minutes)
- Adjust speed (10%, 50%, 100%)
- Change distance threshold
- Add sound effects with `sound.beep()`
- Add light effects with `light_matrix.show_image()`

### Vocabulary to Teach

| Term | Definition | Example |
|------|-----------|---------|
| **Sensor** | A device that measures something from the environment | Force Sensor measures pressure |
| **Threshold** | A limit value used to trigger decisions | 200mm is the distance threshold |
| **Await** | Pause execution until a condition is true | `await runloop.until(is_pressed)` |
| **Condition** | Something that is either True or False | `is_pressed()` returns True/False |
| **Function** | A reusable block of code | `is_pressed()` is a function |
| **Loop** | Code that repeats | `while not is_pressed()` loops |
| **Velocity** | Speed of movement | 330 units = 30% speed |

## Common Issues & Troubleshooting

### Problem: Distance Sensor Returns -1
**Solution:** The sensor needs a clear line of sight. Remove obstacles and ensure sensor is pointing at object.

### Problem: Robot Won't Stop on Touch
**Solution:** Force Sensor may not be properly pressed. Press harder or check sensor connection.

### Problem: Program Runs Too Fast/Slow
**Solution:** Adjust velocity parameter. Current is `int(0.3 * 1100)`. Try:
- 10% speed: `int(0.1 * 1100)`
- 50% speed: `int(0.5 * 1100)`
- 100% speed: `int(1.0 * 1100)`

### Problem: Repeat Loop Never Ends
**Solution:** Make sure you're pressing the touch sensor. Loop continues `while not is_pressed()`.

## Extensions & Challenge Ideas

### Level 1: Basic Modifications
- Change speed of movement (10%, 50%, 100%)
- Adjust distance threshold (100mm, 300mm, 500mm)
- Add different sleep durations between phases

### Level 2: Adding Features
- Add sound effects: `await sound.beep(60, 200)` when each phase completes
- Add light effects: `light_matrix.show_image(light_matrix.IMAGE_HAPPY)`
- Add console messages with `print()`

### Level 3: Combining Sensors
- Stop if EITHER touch sensor OR distance sensor triggers
- Use color sensor to detect if on a colored line
- Combine multiple sensor readings

### Level 4: Design Challenges
- Design your own robot behavior sequence
- Create obstacle course navigation
- Build line-following with distance safety stop
- Implement button-based mode selection

## Standards & Competencies

This curriculum aligns with:

- **CSTA (Computer Science Teachers Association)** Standards:
  - Level 2 (Grades 6-8): Understanding programs and algorithms
  - Level 2: Implementing and testing algorithms

- **NGSS (Next Generation Science Standards)**:
  - MS-ETS1: Engineering Design
  - MS-PS4: Waves and Their Applications
  
- **Skills Developed**:
  - Computational Thinking
  - Problem Solving
  - Debugging
  - Logical Reasoning
  - Systems Thinking

## Quick Reference: Code Snippets

### Import Statements
```python
import runloop, time, sys, motor_pair, motor, force_sensor
import color, color_sensor, distance_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms
```

### Constants
```python
DEGREES_PER_CM = 21
DEGREES_PER_INCH = 53
MM_PER_INCH = 25.4
```

### Sensor Checks
```python
# Force Sensor
force_sensor.pressed(port.A)

# Distance Sensor (returns distance in mm)
distance_sensor.distance(port.B)

# Color Sensor
color_sensor.color(port.F) == color.BLUE
```

### Motor Control
```python
# Pair motors
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)

# Move forward at 30% speed
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))

# Stop
motor_pair.stop(motor_pair.PAIR_1)

# Rotate degrees
await motor_pair.move_for_degrees(motor_pair.PAIR_1, 360, 0)
```

### Program Structure
```python
async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
    
    # Phase 1: Your code here
    
    # Phase 2: Your code here
    
    # Phase 3: Your code here

runloop.run(main())
sys.exit()
```

## Resources

- [LEGO Education SPIKE Documentation](https://education.lego.com/en-us/products/spike-prime/)
- [MicroPython for SPIKE](https://lego.github.io/spike-doc/)
- [Spike Editor Repository](https://github.com/edking21/Spike-Editor)

## Author & Credits

Created for the **Spike Editor** project to teach middle school students STEM concepts through hands-on robotics programming.

## License

This educational material is provided as-is for classroom use. Modify and adapt as needed for your students!

---

**Happy Robot Programming! 🤖**
