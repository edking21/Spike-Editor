# Sensors Python - Quick Start Guide for Teachers

## 📋 What You Have

This is a complete middle school robotics curriculum teaching LEGO SPIKE sensor programming with Python:

### Files Created:
1. **sensor_python.html** - Interactive web lesson page
2. **sensor_three_touch_near.py** - Complete working example code
3. **SENSORS_PYTHON_README.md** - Full curriculum documentation

## 🚀 Quick Start (5 Minutes)

### Step 1: Access the Lesson
Open [sensor_python.html](../lessons/sensor_python.html) in a web browser. This shows:
- Learning objectives
- Hardware setup instructions
- 4-phase Python robot movement explanation
- Sensor reference guide
- Teacher tips and extensions

### Step 2: Gather Materials
Students need:
- LEGO SPIKE Prime robot
- Force Sensor (Touch) 
- Distance Sensor (Ultrasonic)
- Color Sensor
- Cables and hub

### Step 3: Setup Hardware
Connect:
- Port A: Force Sensor
- Port B: Distance Sensor
- Port C: Motor (left wheel)
- Port D: Motor (right wheel)
- Port F: Color Sensor

### Step 4: Load Example Code
- Copy `sensor_three_touch_near.py` to your SPIKE robot
- Or type it into the SPIKE Python environment
- Press Run!

## 🎯 The 4 Phases Explained

### Phase 1: Move Until Touch 🛑
```
Robot: Moves forward
Sensor: Force Sensor (Port A)
Trigger: When pressed
Action: Robot stops
```

### Phase 2: Move Until Near ☀️
```
Robot: Moves forward
Sensor: Distance Sensor (Port B)
Trigger: When object is within 200mm
Action: Robot stops
```

### Phase 3: Move Until Touch Again 🛑
```
Robot: Moves forward
Sensor: Force Sensor (Port A)
Trigger: When pressed
Action: Robot stops
```

### Phase 4: Repeat Back & Forth ↔️
```
Robot: Bounces forward/backward
Sensor: Force Sensor (Port A)
Trigger: When pressed to stop
Action: Loop stops
```

## 📚 Teaching Sequence (45 minutes)

| Time | Activity | Notes |
|------|----------|-------|
| 5 min | **Intro** | Show sensor types, discuss applications |
| 10 min | **Build** | Connect sensors (they'll need help!) |
| 10 min | **Phase 1** | Code & test Move Until Touch |
| 10 min | **Phase 2-3** | Add distance sensor, test |
| 10 min | **Phase 4** | Demonstrate while loop, test bouncing |

## 💡 Key Teaching Points

### Concepts to Emphasize:
1. **Sensors make robots smart** - Robots can "feel" and "see" their world
2. **Conditions control behavior** - `if` sensor is true, then do something
3. **Wait vs. Repeat** - `await until` waits, `while` repeats
4. **Functions simplify code** - `is_pressed()` is cleaner than the full sensor call

### Common Student Struggles:
- ❌ "My robot doesn't stop!" → Check sensor is plugged in
- ❌ "It's too slow!" → Increase velocity (20% → 50%)
- ❌ "Phase 4 never stops!" → Force sensor needs harder press
- ❌ "Distance sensor broken!" → Clear line of sight needed

## 🔧 Troubleshooting

**Distance sensor returns -1 (nothing detected)**
- Check the sensor is clean
- Make sure object is within 2 meters
- Point sensor directly at object

**Touch sensor not working**
- Press harder on the sensor
- Verify cable connection
- Reload program if needed

**Motor not moving**
- Check motors are on ports C & D
- Verify `motor_pair.pair()` was called
- Try `motor_pair.move(PAIR_1, 0, velocity=330)`

## 🎓 Extension Ideas (Ordered by Difficulty)

### Easy (15 minutes)
- Change speed: `int(0.2 * 1100)` for 20%, `int(0.5 * 1100)` for 50%
- Add beep: `await sound.beep(60, 100)` after each phase
- Print messages: `print("Phase 1 complete!")`

### Medium (30 minutes)
- Add light effects: `light_matrix.show_image(light_matrix.IMAGE_HAPPY)`
- Change distance threshold: `is_near(100)` for closer, `is_near(500)` for farther
- Combine phases: Only move if BOTH sensors agree

### Hard (45+ minutes)
- Create custom behavior sequences
- Use color sensor for line detection
- Build maze navigation with multiple sensor types
- Design obstacle avoidance robot

## 📖 Resources for Students

### Vocabulary
- **Async/Await**: Python keywords for waiting on conditions
- **Velocity**: How fast motors spin (0-1100 units)
- **Threshold**: Decision boundary (distance < 200mm)
- **Port**: Numbered connection point on hub (A, B, C, D, E, F)

### Code Examples in HTML
Open lessons/sensor_python.html and scroll down for:
- Phase descriptions with code snippets
- Teacher tips section
- Vocabulary explanations
- Extension activity ideas

## 🎯 Learning Outcomes Checklist

By end of lesson, students should be able to:

- ✅ Identify the three sensor types and their ports
- ✅ Explain what each sensor measures
- ✅ Read and modify sensor threshold values
- ✅ Use `await runloop.until()` for wait conditions
- ✅ Use `while not` loops for repeat conditions
- ✅ Debug code when sensors don't work
- ✅ Explain the difference between "wait" and "repeat"
- ✅ Design multi-phase robot behaviors

## 📝 Assessment Ideas

### Quick Checks
- "What port is the distance sensor on?" → Port B
- "When does Phase 4 stop?" → When touch sensor pressed
- "How would you make the robot go faster?" → Increase velocity

### Hands-On Activities
1. **Sensor Hunt**: Mark different obstacles, robot must find them
2. **Distance Calibration**: Students find distance threshold for their setup
3. **Speed Tuning**: Find optimal speeds for smooth movement
4. **Modification Challenge**: Change code to add a new phase

### Project Ideas
- Build a "security robot" that patrols and stops when something is near
- Create a "bumper car" that bounces around a marked area
- Design a "mail delivery robot" that stops at specific distances
- Implement "traffic light" behavior with color sensor

## 📞 Support

For questions about:
- **SPIKE Python API**: See official LEGO documentation
- **This curriculum**: Check SENSORS_PYTHON_README.md
- **General robotics**: Consult training_camp.html for more lessons
- **Code examples**: Look at Python folder for reference files

## ✨ Tips for Success

1. **Test hardware first** - Verify each sensor works individually
2. **Start with Phase 1** - Don't try all 4 phases at once
3. **Go slow** - Let students experiment and modify code
4. **Celebrate wins** - When robot works, make a big deal of it!
5. **Document changes** - Have students write down what they modified
6. **Pair programming** - Coding with a partner is more fun
7. **Encourage debugging** - Help students find and fix problems

---

**You've got this! Happy teaching! 🤖**

*For more information, see SENSORS_PYTHON_README.md or open lessons/sensor_python.html*
