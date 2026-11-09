# Sensors Word Blocks - Student Activity Worksheet

**Name:** ________________  **Date:** ________________  **Class:** ________________

## 🤖 Objective
Learn to program a SPIKE robot that uses three sensors to move intelligently:
- **Force Sensor** (Touch) - Detects pressure
- **Distance Sensor** - Measures how far away objects are  
- **Color Sensor** - Detects colors

---

## 📋 Part 1: Hardware Setup

Check off each step as you complete it:

- [ ] Get your LEGO SPIKE robot and all sensors
- [ ] Connect **Force Sensor** to **Port A**
- [ ] Connect **Distance Sensor** to **Port B**
- [ ] Connect **Color Sensor** to **Port F**
- [ ] Check **Motors** are on **Ports C & D**
- [ ] Ask teacher to verify connections

**Draw your robot setup:**

```
      Port A: ___________
      Port B: ___________
      Port C: ___________
      Port D: ___________
      Port F: ___________
```

---

## 🎮 Part 2: Understanding the Code

### Key Terms (Fill in the blanks)

**Sensor:** A device that measures _________________________ from the environment

**Port:** A numbered _________________________ on the hub where sensors connect

**Velocity:** How _________________________ the motors spin (0-1100 units)

**Function:** A reusable block of _________________________ 

**Condition:** Something that is either _________________________ or _________________________

---

## 📝 Part 3: The Four Phases

### Phase 1: Move Until Touch 🛑

**What does the robot do?**
Robot moves _________________________ until the Force Sensor is pressed, then stops.

**What sensor is used?** 
Port _____

**Write the code:**
```python
motor_pair.move(motor_pair.PAIR_1, 0)
await runloop.until(________________)
```

**Test it:** Push your robot forward until you press the Force Sensor.
- ✅ Robot stopped? Yes / No
- ✅ What happened? _________________________________

---

### Phase 2: Move Until Near ☀️

**What does the robot do?**
Robot moves _________________________ until the Distance Sensor detects something within 200mm (7.8 inches), then stops.

**What sensor is used?**
Port _____

**What is 200mm?**
This is about _________________________ inches, or the length of a _________________________.

**Write the code:**
```python
motor_pair.move(motor_pair.PAIR_1, 0)
await runloop.until(________________)
```

**Test it:** Move your hand closer to the robot's distance sensor.
- ✅ Robot stopped? Yes / No
- ✅ How close to the sensor did you have to be? About ________ cm
- ✅ How could you make it stop farther away? _________________________________

---

### Phase 3: Move Until Touch Again 🛑

**What does the robot do?**
Robot moves _________________________ until the Force Sensor is pressed a second time, then stops.

**Write the code:**
```python
motor_pair.move(motor_pair.PAIR_1, 0)
await runloop.until(________________)
```

**Test it:** Let the robot move until you press the Force Sensor again.
- ✅ Robot stopped? Yes / No

---

### Phase 4: Repeat Back & Forth ↔️

**What does the robot do?**
Robot bounces back and forth (forward 1 second, backward 1 second) until the Force Sensor is pressed.

**This uses a LOOP - what's a loop?**
A loop is code that _________________________ over and over until something tells it to stop.

**Write the code:**
```python
while not is_touch_2():
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(0.3 * 1100))
    sleep_ms(1000)
    motor_pair.move(motor_pair.PAIR_1, 0, velocity=int(-0.3 * 1100))
    sleep_ms(1000)
```

**What does `while not is_touch_2()` mean?**
"While the Force Sensor is _________________________, keep bouncing"

**Test it:** Press the Force Sensor to stop the bouncing motion.
- ✅ Robot bounced? Yes / No
- ✅ Did it stop when you pressed the sensor? Yes / No

---

## 🔧 Part 4: Modifications & Experiments

### Experiment 1: Speed Adjustment
Change the speed from 30% to 50%:

**Original code:** `int(0.3 * 1100)` 
**New code:** `int(0.5 * 1100)`

**Results:**
- Speed increased? Yes / No
- Motor sound changed? Yes / No  
- Robot movement smoother? Yes / No

### Experiment 2: Distance Adjustment
Change the distance threshold from 200mm to 300mm:

**Original code:** `is_near(200)`
**New code:** `is_near(300)`

**Results:**
- Robot stops farther away? Yes / No
- More distance from sensor needed? Yes / No

### Experiment 3: Add Sound
Add `await sound.beep(60, 100)` after each phase completes.

**How to modify:**
```python
motor_pair.stop(motor_pair.PAIR_1)
await sound.beep(60, 100)  # Add this line
sleep(1)
```

**Results:**
- Beep sound played? Yes / No
- Timing of beep felt right? Yes / No

---

## ❌ Part 5: Troubleshooting

**My robot doesn't stop on touch:**
- [ ] Check Force Sensor is connected to Port A
- [ ] Make sure you're pressing it hard enough
- [ ] Reload the program

**Distance sensor not working:**
- [ ] Make sure sensor is clean
- [ ] Point it directly at your hand/object
- [ ] Try moving closer

**Motors not moving:**
- [ ] Check motors are on Ports C & D
- [ ] Look for Python error messages
- [ ] Try running the program again

**Describe your problem:** _________________________________________________________________

**How did you fix it?** _________________________________________________________________

---

## 🎓 Part 6: Reflection Questions

**1. Which sensor was easiest to understand?**
- [ ] Force Sensor
- [ ] Distance Sensor  
- [ ] Color Sensor

Why? __________________________________________________________________

**2. What was the hardest part?**

__________________________________________________________________

**3. How could a robot use these sensors in the real world?**

__________________________________________________________________

**4. If you could add a 5th phase, what would it do?**

__________________________________________________________________

**5. Rate your understanding (1-5 stars):**

Sensor types: ⭐⭐⭐⭐⭐

Using sensors in code: ⭐⭐⭐⭐⭐

Writing conditions: ⭐⭐⭐⭐⭐

Overall program: ⭐⭐⭐⭐⭐

---

## 🚀 Part 7: Challenge Levels

### Level 1: Modifications (15 minutes)
- [ ] Change robot speed to 50%
- [ ] Change distance threshold to 150mm
- [ ] Add a beep after each phase
- [ ] Print messages like "Phase 1 Complete!"

### Level 2: Features (30 minutes)
- [ ] Add light effects using `light_matrix.show_image()`
- [ ] Create different sounds for different phases
- [ ] Extend Phase 4 from 1 second to 2 seconds
- [ ] Combine two sensors (stop if touch OR distance)

### Level 3: Design Challenge (45 minutes)
Create your own robot behavior! Plan it here:

**My robot will:**
_________________________________________________________________

**Sensors it will use:**
- Force Sensor? Yes / No
- Distance Sensor? Yes / No
- Color Sensor? Yes / No

**What will make it stop?**
_________________________________________________________________

**Sketch your code idea:**
```python
async def main():
    motor_pair.pair(motor_pair.PAIR_1, port.C, port.D)
    
    # YOUR CODE HERE
    
    motor_pair.stop(motor_pair.PAIR_1)
```

---

## 📊 Part 8: Sensor Data Table

**Record actual distances your Distance Sensor measured:**

| Object | Distance (mm) | Distance (inches) | Notes |
|--------|---------------|-------------------|-------|
| Your hand | _____ | _____ | Closest: _____ |
| Textbook | _____ | _____ | Closest: _____ |
| Empty space | _____ | _____ | No object |
| Chair | _____ | _____ | Closest: _____ |

**Questions:**
- What was the shortest distance measured? _________________
- What was the longest distance measured? _________________
- Is 200mm a good threshold for detecting nearby objects? Yes / No

---

## ✅ Checklist: I can now...

- [ ] Identify all three sensors and their ports
- [ ] Explain what each sensor measures
- [ ] Read and understand sensor functions like `is_pressed()` and `is_near()`
- [ ] Use `await runloop.until()` to wait for conditions
- [ ] Use `while not` loops to repeat actions
- [ ] Modify speed and distance thresholds
- [ ] Add sound and light effects to my program
- [ ] Debug sensor problems on my robot
- [ ] Design my own multi-phase robot program
- [ ] Explain how real robots use sensors to be intelligent

---

## 👥 Peer Review

**Exchange worksheets with a partner. Rate their responses:**

**Vocabulary definitions:** Correct? ✅ / Partially ⚠️ / Needs help ❌

**Code understanding:** Correct? ✅ / Partially ⚠️ / Needs help ❌

**Modifications worked:** Yes? ✅ / Partially ⚠️ / No ❌

**One thing they did well:** __________________________________________________________________

**One suggestion for improvement:** __________________________________________________________________

---

## 🎓 Teacher Signature

I have completed this worksheet and demonstrated my robot working.

**Student Signature:** _____________________________ **Date:** ________

**Teacher Comments:** 

__________________________________________________________________

__________________________________________________________________

**Grade/Score:** ________

---

**Great work! You're now a SPIKE sensor programmer! 🤖**
