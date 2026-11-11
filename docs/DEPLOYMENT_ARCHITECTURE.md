# 🎯 Complete Sensors Python Deployment Architecture

This document explains the entire deployment pipeline from GitHub to Google Sites.

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Repository                         │
│  edking21/Spike-Editor                                           │
│                                                                  │
│  Source Files:                                                  │
│  • index.html (main menu)                                       │
│  • robotics.html (lesson page)                     │
│  • styles/spike-shared.css (styling)                            │
│  • scripts/spike-shared.js (interaction)                        │
│  • Python/sensor_three_touch_near.py (code)                     │
│  • docs/* (curriculum guides)                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Local Testing (Desktop)
                   file:///...robotics.html
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              merge_for_sites_enhanced.ps1 Script                 │
│                                                                  │
│  Actions:                                                       │
│  1. Reads source HTML files                                     │
│  2. Removes mobile navigation (for Google Sites)                │
│  3. Inlines CSS and JavaScript                                  │
│  4. Converts images to base64                                   │
│  5. Generates "_for_copy_to_sites.html" versions                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   Generated Files (utils/)
                  • index_for_copy_to_sites.html
                  • sensor_python_for_copy_to_sites.html
                  • training_camp_for_copy_to_sites.html
                  • challenges_library_for_copy_to_sites.html
                              ↓
                    Copy to Clipboard
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Google Sites Pages                            │
│                                                                  │
│  Page 1: Home Page                                              │
│    Paste: index_for_copy_to_sites.html                          │
│    Result: Main menu with all links                             │
│                                                                  │
│  Page 2: Sensors Python Lesson                                  │
│    Paste: sensor_python_for_copy_to_sites.html                  │
│    Result: Interactive lesson with hardware setup               │
│                                                                  │
│  Page 3: Training Camp                                          │
│    Paste: training_camp_for_copy_to_sites.html                  │
│    Result: Existing training content                            │
│                                                                  │
│  Page 4: Challenges                                             │
│    Paste: challenges_library_for_copy_to_sites.html             │
│    Result: Existing challenge content                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                   User Access (Browser)
             yourschool.sites.google.com/
                              ↓
        ┌─────────────────┬──────────────┬───────────────┐
        ↓                 ↓              ↓               ↓
    Home Page      Sensors Python   Training Camp   Challenges
    Menu System    Interactive      Existing        Existing
                   Lesson           Content         Content
```

---

## 🔄 Complete Workflow

### Phase 1: Development (You)
```
1. Create/Edit curriculum files
   • robotics.html
   • docs/SENSORS_PYTHON_README.md
   • docs/SENSORS_QUICK_START.md
   • Python/sensor_three_touch_near.py

2. Test locally
   • Open in browser: file:///...robotics.html
   • Verify all sections display correctly
   • Test links and navigation
   • Check mobile responsiveness

3. Update menu in index.html
   • Add Sensors Python link to desktop menu
   • Add Sensors Python link to mobile sidebar
   • Verify both work in browser

4. Commit to GitHub
   git add .
   git commit -m "Add Sensors Python curriculum"
   git push origin main
```

### Phase 2: Build (Merge Script)
```
1. Run merge_for_sites_enhanced.ps1
   .\merge_for_sites_enhanced.ps1

2. Script processes files
   • Reads source HTML
   • Removes Google Sites incompatible code
   • Inlines CSS and JavaScript
   • Converts images to base64
   • Creates "_for_copy_to_sites.html" versions

3. Output files generated (in utils/ folder)
   ✓ index_for_copy_to_sites.html (~50-80 KB)
   ✓ sensor_python_for_copy_to_sites.html (~150-200 KB)
   ✓ training_camp_for_copy_to_sites.html (~100-150 KB)
   ✓ challenges_library_for_copy_to_sites.html (~80-120 KB)
```

### Phase 3: Deploy (Google Sites)
```
1. Create Google Sites pages (if new)
   • Home
   • Sensors Python
   • Training Camp
   • Challenges

2. For each page:
   a. Select corresponding "_for_copy_to_sites.html" file
   b. Open in text editor
   c. Select all content (Ctrl+A)
   d. Copy to clipboard (Ctrl+C)
   e. Go to Google Sites page
   f. Click edit
   g. Paste HTML directly
   h. Preview and publish

3. Verify navigation
   • Test all menu links
   • Check mobile menu
   • Test back/forward navigation
   • Verify page loads correctly
```

### Phase 4: Teach (Classroom)
```
1. Teacher opens Google Sites home
2. Clicks "Sensors Python" link
3. Shows lesson on projector
4. Guides students through 4 phases
5. Students:
   • Follow along with hardware
   • Download Python code
   • Complete worksheet
   • Test and modify code
```

---

## 🔗 File Relationships

```
index.html (main menu)
    ├─ Links to: training_camp.html
    ├─ Links to: challenges_library.html
    ├─ Links to: robotics.html (NEW)
    └─ Links to: Videos.html

robotics.html (lesson page)
    ├─ Includes: styles/spike-shared.css
    ├─ Includes: scripts/spike-shared.js
    ├─ Links back to: index.html (Home)
    └─ References: Python/sensor_three_touch_near.py

docs/
    ├─ SENSORS_PYTHON_README.md (full curriculum)
    ├─ SENSORS_QUICK_START.md (teacher overview)
    ├─ SENSORS_STUDENT_WORKSHEET.md (75+ activities)
    ├─ SENSORS_CHEAT_SHEET.md (code reference)
    ├─ DEPLOYMENT_GUIDE.md (this project's deployment)
    ├─ QUICK_DEPLOY.md (quick deployment guide)
    └─ MENU_INTEGRATION_GUIDE.md (menu changes)

Python/
    └─ sensor_three_touch_near.py (working example code)
```

---

## 📦 What Gets Deployed

### To Google Sites (Embedded HTML)
```
From Generated Files:
• index_for_copy_to_sites.html
• sensor_python_for_copy_to_sites.html
• training_camp_for_copy_to_sites.html
• challenges_library_for_copy_to_sites.html

Includes:
✓ All HTML content
✓ CSS styles (inlined)
✓ JavaScript code (inlined)
✓ Images (as base64)
✓ Ready to paste into Google Sites

Excludes:
✗ External file references
✗ Relative path links
✗ Media files
✗ Server-side code
```

### NOT Deployed (Kept in GitHub)
```
• Python code files (users download separately)
• Documentation files (linked, not embedded)
• Raw images (converted to base64)
• Node modules/build tools
• Version control files (.git)
• Configuration files
```

---

## 🎯 User Access Paths

### Teacher on Desktop
```
1. Browser → yourschool.sites.google.com (home)
2. Click "Sensors Python" link
3. Load: robotics.html
4. See: Lesson with hardware setup + 4 phases
5. Can: Show on projector for class
6. Can: Share links to student worksheet
7. Can: Direct students to Python code file
```

### Student on Mobile
```
1. Browser → yourschool.sites.google.com
2. Tap hamburger menu (☰)
3. Tap "Sensors Python"
4. Load: robotics.html (responsive)
5. See: Same lesson, mobile-friendly
6. Can: Follow along on phone
7. Can: Access code from link
8. Can: Download worksheet
```

### Student Accessing Code
```
1. From Sensors Python lesson page
2. Click link to: Python/sensor_three_touch_near.py
3. Download .py file
4. Open in text editor
5. Copy code to SPIKE Editor
6. Run on robot
```

---

## 🔧 How merge_for_sites_enhanced.ps1 Works

### Input Processing
```
Input Files:
├─ index.html
│   Contains: desktop menu, mobile sidebar, emoji groups
│   Size: ~30-40 KB
│
├─ robotics.html
│   Contains: full lesson with hardware setup
│   Size: ~80-100 KB
│
├─ styles/spike-shared.css
│   Contains: all styling rules
│   Size: ~40-60 KB
│
└─ scripts/spike-shared.js
    Contains: menu functionality, search, etc.
    Size: ~20-30 KB
```

### Transformations
```
Step 1: Remove Google Sites Incompatible Elements
   <div class="mobile-sidebar">     ← REMOVED
   <div class="mobile-overlay">     ← REMOVED
   <div class="top-menu">           ← REMOVED
   <div class="menu-links">         ← REMOVED
   <button class="menu-search">     ← REMOVED

Step 2: Inline External Files
   <link rel="stylesheet"           ← REPLACED WITH:
   href="./styles/spike-shared.css">   <style>...all CSS...</style>

   <script src="./scripts/spike-shared.js"></script>
                                    ← REPLACED WITH:
                                       <script>...all JS...</script>

Step 3: Convert Images to Base64
   ./images/robot.jpg              ← REPLACED WITH:
                                      data:image/jpeg;base64,/9j/4AA...

Step 4: Adjust Styling for Google Sites
   padding: 50px 2px 2px 2px;     ← CHANGED TO:
                                      padding: 0px 2px 2px 2px;
```

### Output Files
```
Output Files:
├─ index_for_copy_to_sites.html
│   Size: ~50-80 KB (all-in-one, no external refs)
│
├─ sensor_python_for_copy_to_sites.html
│   Size: ~150-200 KB (complete lesson + styles + js)
│
├─ training_camp_for_copy_to_sites.html
│   Size: ~100-150 KB
│
└─ challenges_library_for_copy_to_sites.html
    Size: ~80-120 KB

Note: Larger due to inlined CSS, JS, and base64 images
      But still well under Google Sites paste limit (~1MB)
```

---

## 💾 Deployment Checklist

### Before Running Script
- [ ] index.html has Sensors Python link in both menus
- [ ] robotics.html exists and is complete
- [ ] All CSS and JS files exist
- [ ] Images directory populated
- [ ] No broken links in source files

### Running Script
- [ ] Navigate to utils folder
- [ ] Run: `.\merge_for_sites_enhanced.ps1`
- [ ] Verify all 4 files generated successfully
- [ ] Check file sizes are reasonable
- [ ] Review output messages for warnings

### Before Google Sites Deployment
- [ ] Open generated files in text editor
- [ ] Spot check for obvious errors
- [ ] Copy one file to clipboard
- [ ] Create Google Sites page
- [ ] Paste content

### Google Sites Deployment
- [ ] Content pastes successfully
- [ ] Page loads without errors
- [ ] All text renders correctly
- [ ] Images display (if any)
- [ ] Menu items are visible
- [ ] Links work (at least some)
- [ ] Mobile version displays correctly

### After Deployment
- [ ] Share URL with teachers
- [ ] Get initial feedback
- [ ] Test from multiple devices
- [ ] Monitor for any issues

---

## 🚨 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Links broken in Google Sites | Absolute paths (/Spike-Editor/) | Update to Google Sites URL |
| Menu missing on Google Sites | CSS/JS not inlined | Re-run merge script |
| Images not showing | Base64 encoding failed | Re-run, check image sizes |
| Content looks different | Google Sites CSS override | Adjust or accept differences |
| File too large for paste | Includes too many assets | Split into separate pages |
| Mobile menu not working | JavaScript disabled | Provide text-based navigation |
| Fonts look wrong | Font restrictions | Use system fonts in fallback |

---

## 📈 Scaling for More Lessons

Want to add another lesson (e.g., Sensors Word Blocks)?

```
1. Create lessons/sensor_word_blocks.html
2. Add link to index.html menu (both desktop & mobile)
3. Update merge_for_sites_enhanced.ps1:
   - Add parameter for new file
   - Add processing step for new file
   - Add output file generation
4. Run updated script
5. Deploy new page to Google Sites
6. Update all internal cross-links
```

---

## 📝 Final Summary

```
Source (GitHub)
    ↓
Local Testing
    ↓
Menu Update (index.html)
    ↓
Merge Script (merge_for_sites_enhanced.ps1)
    ↓
Generated Files (utils/*_for_copy_to_sites.html)
    ↓
Google Sites (Paste & Publish)
    ↓
Classroom Use (Students & Teachers)
```

---

## 🎓 Teaching with This Setup

### For Teachers:
1. Share Google Sites URL with class
2. Students access from any device
3. No setup required on student machines
4. Teacher can project lesson full-screen
5. All materials in one place
6. Works on phones, tablets, laptops

### For Students:
1. Open Google Sites (from school/home)
2. Click "Sensors Python"
3. Follow lesson
4. Download Python code when ready
5. Copy to SPIKE Editor
6. Run on robot
7. Complete worksheet

### For School IT:
1. Single Google Sites URL to share
2. All content self-contained
3. No external dependencies
4. No complex server setup
5. Automatic backups (Google)
6. Mobile-friendly
7. Easy to update (just paste new HTML)

---

**You're all set! Follow the phases above and your Sensors Python curriculum will be live on Google Sites. 🚀**
