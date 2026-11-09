# 🤖 Sensors Word Blocks - Project Index

## Complete Middle School Robotics Curriculum

This is a comprehensive curriculum for teaching LEGO Education SPIKE sensor programming to middle school students using all three sensors in combination.

---

## 📚 Project Files

### For Teachers 👨‍🏫
1. **[SENSORS_QUICK_START.md](./SENSORS_QUICK_START.md)** - Start here! 5-minute overview for teachers
   - Quick setup instructions
   - Teaching sequence (45 minutes)
   - Troubleshooting guide
   - Extension ideas

2. **[SENSORS_WORD_BLOCKS_README.md](./SENSORS_WORD_BLOCKS_README.md)** - Complete curriculum guide
   - Learning objectives
   - Detailed lesson plan
   - Vocabulary and concepts
   - Standards alignment
   - Code reference

3. **[sensor_word_blocks.html](./sensor_word_blocks.html)** - Interactive web lesson
   - Visual lesson presentation
   - Hardware setup guide
   - 4-phase explanations
   - Sensor reference
   - Teacher tips
   - Extension activities

### For Students 👨‍🎓
1. **[SENSORS_STUDENT_WORKSHEET.md](./SENSORS_STUDENT_WORKSHEET.md)** - Hands-on activity guide
   - Hardware setup checklist
   - Code understanding exercises
   - Modification experiments
   - Troubleshooting practice
   - Reflection questions
   - Challenge levels

2. **[Python/sensor_three_touch_near.py](./Python/sensor_three_touch_near.py)** - Working example code
   - Complete 4-phase program
   - Well-commented code
   - Ready to run on SPIKE robot

---

## 🎯 What Students Will Learn

### Sensors
- 🛑 **Force Sensor (Touch)** - Port A - Detect pressure/contact
- ☀️ **Distance Sensor (Ultrasonic)** - Port B - Measure distance to objects
- 🧿 **Color Sensor** - Port F - Detect colors on surfaces

### Programming Concepts
- Using sensor functions to make decisions
- `await runloop.until()` - Wait for conditions
- `while not` loops - Repeat until condition
- Motor control and velocity
- Async/await programming patterns

### Robot Behaviors
1. **Phase 1:** Move forward until touch sensor pressed
2. **Phase 2:** Move forward until distance sensor detects object
3. **Phase 3:** Move forward until touch sensor pressed again
4. **Phase 4:** Bounce back and forth until touch sensor stops it

---

## 📖 How to Use This Curriculum

### Option 1: Quick Lesson (45 minutes)
1. Read [SENSORS_QUICK_START.md](./SENSORS_QUICK_START.md)
2. Have students build hardware per instructions
3. Show [sensor_word_blocks.html](./sensor_word_blocks.html) on projector
4. Load [Python/sensor_three_touch_near.py](./Python/sensor_three_touch_near.py) on robots
5. Run each phase one by one
6. Students complete [SENSORS_STUDENT_WORKSHEET.md](./SENSORS_STUDENT_WORKSHEET.md)

### Option 2: Full Unit (Multiple Classes)
1. Follow detailed [SENSORS_WORD_BLOCKS_README.md](./SENSORS_WORD_BLOCKS_README.md)
2. Use worksheet for multiple sessions
3. Assign extension challenges
4. Have students design their own programs

### Option 3: Hands-On Lab
1. Students work through worksheet step-by-step
2. Test each phase independently
3. Modify and experiment with code
4. Present their modifications to class

---

## 🔧 Hardware Requirements

Per robot:
- LEGO SPIKE Prime hub
- 2 Large Motors (Ports C & D)
- 1 Force Sensor (Port A)
- 1 Distance Sensor (Port B)
- 1 Color Sensor (Port F)
- USB cable and SPIKE app or Python environment
- Small object for testing distance sensor

---

## 💾 Code Files Available

### Main Example
- **sensor_three_touch_near.py** - Complete 4-phase program (NEW!)

### Other Sensor Examples
- **getting_started_sensors.py** - Basic sensor introduction
- **sensor_four_square.py** - Four-square challenge
- **is_near_explanation.md** - Distance sensor deep dive

---

## ✨ Key Features

### For Teachers
- ✅ Complete lesson plans with timing
- ✅ Vocabulary and concepts explained
- ✅ Troubleshooting guide included
- ✅ Standards alignment information
- ✅ Multiple assessment options
- ✅ Extensions for advanced students

### For Students  
- ✅ Step-by-step worksheet
- ✅ Hands-on experiments
- ✅ Reflection questions
- ✅ Challenge levels (easy to hard)
- ✅ Real example code to learn from
- ✅ Troubleshooting help

### For Classrooms
- ✅ Scalable (works for 1 or 30 students)
- ✅ Equipment-friendly (standard SPIKE parts)
- ✅ Time-flexible (45 min to multi-week)
- ✅ Modular (can use parts independently)
- ✅ Assessment-ready (built-in checkpoints)

---

## 📊 Learning Outcomes

Students will be able to:

✅ **Understand** three sensor types and their applications

✅ **Identify** ports and connections for each sensor

✅ **Read** sensor values in Python code

✅ **Implement** wait conditions using `await runloop.until()`

✅ **Implement** repeat loops using `while not`

✅ **Combine** multiple sensors in one program

✅ **Debug** sensor-based programs

✅ **Modify** code to adjust behavior

✅ **Design** multi-phase robot programs

✅ **Apply** concepts to real-world scenarios

---

## 🎓 Standards Alignment

### CSTA (Computer Science Teachers Association)
- Level 2 (Grades 6-8): Understanding programs and algorithms
- Level 2: Implementing and testing algorithms  
- Debugging and testing skills

### NGSS (Next Generation Science Standards)
- MS-ETS1: Engineering Design
- MS-PS4: Waves and Their Applications in Technologies for Information Transfer

### 21st Century Skills
- Computational Thinking
- Problem Solving
- Collaboration
- Communication
- Critical Thinking

---

## 🚀 Quick Navigation

### I want to...
- **Start teaching immediately** → [SENSORS_QUICK_START.md](./SENSORS_QUICK_START.md)
- **Show students on a screen** → [sensor_word_blocks.html](./sensor_word_blocks.html)
- **Get detailed curriculum** → [SENSORS_WORD_BLOCKS_README.md](./SENSORS_WORD_BLOCKS_README.md)
- **Give students to work on** → [SENSORS_STUDENT_WORKSHEET.md](./SENSORS_STUDENT_WORKSHEET.md)
- **Load working example code** → [Python/sensor_three_touch_near.py](./Python/sensor_three_touch_near.py)
- **Troubleshoot a problem** → See "Troubleshooting" in SENSORS_QUICK_START.md
- **Find extension activities** → See "Extension Ideas" in SENSORS_QUICK_START.md

---

## 📞 Support Resources

### Documentation
- [LEGO Education SPIKE Documentation](https://education.lego.com)
- [MicroPython for SPIKE](https://lego.github.io/spike-doc/)
- [Spike Editor Repository](https://github.com/edking21/Spike-Editor)

### In This Repository
- [training_camp.html](./training_camp.html) - More SPIKE lessons
- [challenges_library.html](./challenges_library.html) - Robot challenges
- [Python/](./Python/) - More example code

---

## ✅ Checklist: Ready to Teach?

- [ ] Read SENSORS_QUICK_START.md
- [ ] Review sensor_word_blocks.html
- [ ] Download Python/sensor_three_touch_near.py
- [ ] Gather hardware (sensors, motors, hub)
- [ ] Test one robot with example code
- [ ] Print or share SENSORS_STUDENT_WORKSHEET.md with students
- [ ] Plan your lesson timing
- [ ] Identify extension activities
- [ ] Prepare troubleshooting answers

**You're ready! Let's go teach some robotics! 🤖**

---

## 📝 Modifications & Suggestions

This curriculum is designed to be flexible:

- **Timing:** Adapt 45-minute lesson to your schedule
- **Content:** Pick and choose which phases to cover
- **Difficulty:** Use challenge levels to differentiate
- **Sensors:** Add color sensor activities for advanced students
- **Context:** Adapt real-world applications to your community

**Want to customize this curriculum?**
- Modify the Python code for your needs
- Adjust the worksheet for your grade level
- Add your own real-world examples
- Create additional phases and challenges

---

## 📅 Suggested Timeline

### Single Class Session (45 minutes)
- Introduction & Hardware Setup (10 min)
- Phase 1 Coding & Testing (10 min)
- Phases 2-3 Coding & Testing (15 min)
- Phase 4 & Troubleshooting (10 min)

### Multi-Day Unit (5 days, 45 min each)
- Day 1: Intro, hardware, Phase 1
- Day 2: Phases 2-3
- Day 3: Phase 4, debugging
- Day 4: Modifications & experiments
- Day 5: Challenge projects & presentations

### Extended Unit (2-3 weeks)
- Week 1: All 4 phases + mastery
- Week 2: Modifications, extensions, real-world applications
- Week 3: Custom design challenges, peer presentations

---

## 🏆 Assessment Options

### Formative (During Learning)
- Worksheet completion
- Code modification experiments
- Troubleshooting demonstrations
- Peer reviews

### Summative (End of Unit)
- Working robot demonstration
- Code explanation (can they explain their code?)
- Modification quiz (change speed, distance, add features)
- Design challenge project

---

**Last Updated:** 2026-11-09

**Created for:** Middle School STEM/Robotics Classes

**Curriculum Version:** 1.0 - Complete Sensors Word Blocks

---

# 🎉 Welcome to Sensors Word Blocks!

This comprehensive curriculum will help your students understand how robots use sensors to make smart decisions. By combining the Force Sensor, Distance Sensor, and Color Sensor, students will learn the fundamental concepts of sensor-driven robotics programming.

**Let's build amazing robots! 🤖**
