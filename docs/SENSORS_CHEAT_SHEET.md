# Sensors Python - Quick Reference Cheat Sheet

## 🤖 Robot Hardware Setup

```
LEGO SPIKE Prime Hub
    │
    ├─ Port A: Force Sensor (Touch) ────→ 🛑 is_pressed()
    │
    ├─ Port B: Distance Sensor ─────────→ ☀️  is_near()
    │
    ├─ Port C: Motor (Left Wheel) ──────→ Motor Pair
    │
    ├─ Port D: Motor (Right Wheel) ─────→ Motor Pair
    │
    └─ Port F: Color Sensor ───────────→ 🧿 is_blue()
```

---

## 📝 Sensor Functions Quick Reference

### Force Sensor (Touch)
```python
# Check if pressed
if force_sensor.pressed(port.A):
    print("Pressed!")

# Sensor function wrapper
def is_pressed():
    return force_sensor.pressed(port.A)
```

### Distance Sensor
```python
# Read distance in millimeters
distance = distance_sensor.distance(port.B)

# Check if close (default 200mm)
if distance < 200:
    print("Something is near!")

# Sensor function wrapper
def is_near(distance_threshold=200):
    distance = distance_sensor.distance(port.B)
    if distance == -1:
        return False  # No object detected
    return distance < distance_threshold
```

### Color Sensor
```python
# Check for blue
if color_sensor.color(port.F) == color.BLUE:
    print("I see blue!")

# Sensor function wrapper
def is_blue():
    return color_sensor.color(port.F) == color.BLUE
```

---

## 🎮 Motor Control Cheat Sheet

### Setup
```python
# Pair motors C and D together
motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
```

### Movement
```python
# Move forward at 30% speed
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))

# Move backward at 30% speed
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(-0.3 * 1100))

# Stop
motor_pair.stop(motor_pair.PAIR_1)

# Speed percentages
10% speed = int(0.1 * 1100) = 110 units
20% speed = int(0.2 * 1100) = 220 units
30% speed = int(0.3 * 1100) = 330 units  ← DEFAULT
50% speed = int(0.5 * 1100) = 550 units
100% speed = int(1.0 * 1100) = 1100 units
```

---

## ⏱️ Time Control

```python
# Sleep/wait
from time import sleep, sleep_ms

sleep(1)          # Wait 1 second
sleep(2)          # Wait 2 seconds
sleep_ms(1000)    # Wait 1000 milliseconds = 1 second
sleep_ms(500)     # Wait 500 milliseconds = 0.5 seconds
```

---

## 🔄 Program Control Structures

### Wait Until (Async/Await)
```python
# Wait until sensor returns true
await runloop.until(is_pressed)

# Wait until distance sensor detects object
await runloop.until(is_near)

# Wait with custom threshold
await runloop.until(lambda: is_near(100))

# Wait until blue detected
await runloop.until(is_blue)
```

### Repeat Until (While Loop)
```python
# Repeat WHILE condition is false
while not is_pressed():
    # Do something repeatedly
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=330)
    sleep_ms(100)

# Repeat UNTIL condition is true
while not is_near():
    # Do something repeatedly
    # ...

# Repeat forever
while True:
    # Do something forever
    # (need a break statement to exit)
```

---

## 🎯 The 4 Phases

### Phase 1: Move Until Touch
```python
# Start moving
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))

# Wait for touch
await runloop.until(is_pressed)

# Stop
motor_pair.stop(motor_pair.PAIR_1)
```

### Phase 2: Move Until Near
```python
# Start moving
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))

# Wait for distance sensor
await runloop.until(is_near)

# Stop
motor_pair.stop(motor_pair.PAIR_1)
```

### Phase 3: Move Until Touch Again
```python
# Same as Phase 1 - Move until touch again
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))
await runloop.until(is_pressed)
motor_pair.stop(motor_pair.PAIR_1)
```

### Phase 4: Repeat Back & Forth
```python
# Bounce until touch sensor pressed
while not is_pressed():
    # Move forward 1 second
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=330)
    sleep_ms(1000)
    
    # Move backward 1 second
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=-330)
    sleep_ms(1000)

# Stop bouncing
motor_pair.stop(motor_pair.PAIR_1)
```

---

## 🔊 Add Sound Effects

```python
from hub import sound

# Simple beep
await sound.beep(60, 100)  # Frequency, duration(ms)

# Different sounds
await sound.beep(100, 200)  # Lower pitch, longer
await sound.beep(30, 100)   # Very low pitch
await sound.beep(120, 50)   # High pitch, quick

# After each phase completes
motor_pair.stop(motor_pair.PAIR_1)
await sound.beep(60, 200)  # "Phase complete!" beep
```

---

## 💡 Add Light Effects

```python
from hub import light_matrix

# Show emotions
light_matrix.show_image(light_matrix.IMAGE_HAPPY)      # Happy face
light_matrix.show_image(light_matrix.IMAGE_ANGRY)      # Angry face
light_matrix.show_image(light_matrix.IMAGE_SAD)        # Sad face
light_matrix.show_image(light_matrix.IMAGE_SLEEPING)   # Sleeping
light_matrix.show_image(light_matrix.IMAGE_SURPRISED)  # Surprised

# After phase completes
motor_pair.stop(motor_pair.PAIR_1)
light_matrix.show_image(light_matrix.IMAGE_HAPPY)
```

---

## 🎨 Common Modifications

### Change Speed (10% → 50%)
```python
# Original (30%)
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))

# Modified (50%)
motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.5 * 1100))
```

### Change Distance Threshold (200mm → 100mm)
```python
# Original (200mm)
await runloop.until(is_near)

# Modified (100mm - closer)
await runloop.until(lambda: is_near(100))

# Modified (300mm - farther)
await runloop.until(lambda: is_near(300))
```

### Change Time Duration (1 second → 2 seconds)
```python
# Original
sleep_ms(1000)  # 1 second

# Modified
sleep_ms(2000)  # 2 seconds
```

### Add Debug Print Statements
```python
print("Phase 1 starting...")
motor_pair.move(motor_pair.PAIR_1, 0, velocity=330)
await runloop.until(is_pressed)
print("Phase 1 complete!")
motor_pair.stop(motor_pair.PAIR_1)
```

---

## ❌ Troubleshooting Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Touch sensor not working | Press harder, check port A connection |
| Distance sensor returns -1 | Clean lens, clear line of sight, move closer |
| Robot doesn't move | Check motors on ports C & D, reload code |
| Program too slow | Increase velocity (0.3 → 0.5), reduce sleep time |
| Phase 4 never stops | Touch sensor must be pressed to exit while loop |
| Sensor function error | Import all needed modules at top |

---

## 📊 Sensor Range Thresholds

### Distance Sensor
```
Good detection range: 50mm - 2000mm
Recommended thresholds:
  - Very close:    50mm  (2 inches)
  - Close:        100mm  (4 inches)
  - Medium:       200mm  (8 inches)  ← DEFAULT
  - Far:          500mm  (20 inches)
```

### Force Sensor
```
On/Off (no threshold):
  - Not pressed: False
  - Pressed:     True
  
Intensity (0-100):
  - light touch:  10-30
  - normal:       40-70
  - hard press:   80-100
```

### Color Sensor
```
Available colors:
  color.NONE      (no color)
  color.BLACK
  color.PURPLE
  color.BLUE      ← Most common
  color.CYAN
  color.GREEN
  color.YELLOW
  color.RED
  color.WHITE
```

---

## 🔗 Program Structure Template

```python
# 1. IMPORTS
import runloop, time, sys, motor_pair
import force_sensor, distance_sensor, color_sensor
from hub import light, light_matrix, port, sound
from time import sleep, sleep_ms

# 2. CONSTANTS
SPEED_PERCENT = 0.3
SPEED_UNITS = int(SPEED_PERCENT * 1100)
DISTANCE_THRESHOLD = 200  # mm

# 3. SENSOR FUNCTIONS
def is_pressed():
    return force_sensor.pressed(port.A)

def is_near(threshold=200):
    distance = distance_sensor.distance(port.B)
    if distance == -1:
        return False
    return distance < threshold

def is_blue():
    return color_sensor.color(port.F) == color.BLUE

# 4. MAIN PROGRAM
async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
    
    # PHASE 1
    print("Phase 1: Move until touch")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=SPEED_UNITS)
    await runloop.until(is_pressed)
    motor_pair.stop(motor_pair.PAIR_1)
    await sound.beep(60, 100)
    sleep(1)
    
    # PHASE 2
    print("Phase 2: Move until near")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=SPEED_UNITS)
    await runloop.until(is_near)
    motor_pair.stop(motor_pair.PAIR_1)
    await sound.beep(60, 100)
    sleep(1)
    
    # PHASE 3
    print("Phase 3: Move until touch again")
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=SPEED_UNITS)
    await runloop.until(is_pressed)
    motor_pair.stop(motor_pair.PAIR_1)
    await sound.beep(60, 100)
    sleep(1)
    
    # PHASE 4
    print("Phase 4: Bounce until touch")
    while not is_pressed():
        motor_pair.move(motor_pair.PAIR_1, 0, velocity=SPEED_UNITS)
        sleep_ms(1000)
        motor_pair.move(motor_pair.PAIR_1, 0, velocity=-SPEED_UNITS)
        sleep_ms(1000)
    
    motor_pair.stop(motor_pair.PAIR_1)
    light_matrix.show_image(light_matrix.IMAGE_HAPPY)
    await sound.beep(60, 200)

# 5. RUN PROGRAM
runloop.run(main())
sys.exit()
```

---

## 📚 Key Vocabulary

| Term | Meaning |
|------|---------|
| **Sensor** | Device that measures something from environment |
| **Port** | Connection point on hub (A, B, C, D, E, F) |
| **Velocity** | Speed of motor (units 0-1100) |
| **Async/Await** | Keywords for waiting on conditions |
| **While Loop** | Code that repeats until condition becomes true |
| **Function** | Reusable block of code |
| **Threshold** | Decision boundary/limit value |
| **Condition** | Something that is true or false |

---

## 🎯 Success Indicators

✅ Robot moves forward when powered on
✅ Force sensor stops motion when pressed
✅ Distance sensor detects objects within 200mm
✅ Color sensor identifies blue color
✅ Phase 1 completes (touch stops motion)
✅ Phase 2 completes (distance stops motion)
✅ Phase 3 completes (touch stops motion again)
✅ Phase 4 bounces and stops on touch
✅ All 4 phases run in sequence

---

## 🚨 Emergency Stops

```python
# If robot won't stop, press on the hub
# Or quickly press the force sensor
# Or hold down the touch sensor

# In code, to create emergency exit:
if force_sensor.pressed(port.A):
    motor_pair.stop(motor_pair.PAIR_1)
    sys.exit()
```

---

**📌 Remember:** Sensors make robots smart! Save this cheat sheet for quick reference! 🤖
