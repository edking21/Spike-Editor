# 🚀 Quick Start: Sensors Python Deployment

## Overview
This guide shows how to deploy Sensors Python to Google Sites while keeping it integrated with the Spike Editor menu.

---

## Step 1: Update Menu Links (5 minutes)

### Edit `index.html`
Add Sensors Python to the navigation menu:

**In the desktop menu (around line 20):**
```html
<div class="menu-links">
    <a class="active" href="/Spike-Editor/index.html">Home</a>
    <a href="/Spike-Editor/training_camp.html">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html">Challenges</a>
    <a href="/Spike-Editor/robotics.html">Robotics</a>
    <a href="/Spike-Editor/Videos.html">Videos</a>
</div>
```

**In the mobile sidebar (around line 12):**
```html
<div class="mobile-sidebar">
    <a class="active" href="/Spike-Editor/index.html" onclick="closeMobileMenu()">Home</a>
    <a href="/Spike-Editor/training_camp.html" onclick="closeMobileMenu()">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html" onclick="closeMobileMenu()">Challenges</a>
    <a href="/Spike-Editor/robotics.html" onclick="closeMobileMenu()">Robotics</a>
    <a href="/Spike-Editor/Videos.html" onclick="closeMobileMenu()">Videos</a>
</div>
```

---

## Step 2: Generate Deployment Files (2 minutes)

Run the enhanced merge script from PowerShell:

```powershell
# Navigate to utils folder
cd C:\Users\eddyk\source\repos\spike-editor\utils

# Run the enhanced merge script
.\merge_for_sites_enhanced.ps1
```

**Output files created:**
- ✅ `index_for_copy_to_sites.html` - Updated home page with Robotics link
- ✅ `sensor_python_for_copy_to_sites.html` - Robotics output; use clipboard option 4 for the fully inlined embed
- ✅ `training_camp_for_copy_to_sites.html` - Existing (regenerated)
- ✅ `challenges_library_for_copy_to_sites.html` - Existing (regenerated)

---

## Step 3: Deploy to Google Sites

### Option A: Full Integration (Recommended)

**For each of 4 pages on Google Sites:**

1. **Home Page:**
   - Open `index_for_copy_to_sites.html`
   - Copy all content
   - Paste into Google Sites "Home" page
   - Update links from `/Spike-Editor/` to relative paths if needed

2. **Robotics Page:**
   - Choose **4. Robotics projects** when the script asks which page to copy.
   - In the Google Sites Robotics page, replace the existing HTML embed with the clipboard contents, then publish the site.
   - The script inlines the styles, scripts, and referenced images for the clipboard copy. The saved `sensor_python_for_copy_to_sites.html` file is restored afterward and is not the fully inlined embed.

3. **Training Camp & Challenges:**
   - Repeat same process with their respective files

### Option B: Standalone Page (Simpler)

Just create one Google Sites page for Robotics:

1. New Google Sites page: "Robotics"
2. Run the merge script and select **4. Robotics projects** to copy the fully inlined HTML.
3. Paste the clipboard contents into an HTML embed on the page and publish.
4. Add manual back-link if desired

---

## Step 4: Verify It Works

**Test these user flows:**
- [ ] Click Robotics link from home page
- [ ] Hardware setup section displays
- [ ] 4 phase cards are visible
- [ ] Code examples look correct
- [ ] Mobile menu works (on phone)
- [ ] Images display (if any)
- [ ] All fonts render properly

---

## What Does Each File Do?

### `index.html` (Source)
- Main Spike Editor home page
- Desktop & mobile navigation
- Menu system for linking to all modules
- Auto-generated emoji grouping system

**Updated with:** Link to Sensors Python lesson

### `robotics.html` (Source)
- Complete interactive lesson
- Hardware setup instructions
- 4-phase cards with explanations
- Python code examples
- Includes top navigation menu

**Deployed to:** Google Sites as standalone page

### `merge_for_sites_enhanced.ps1` (Tool)
- Processes source HTML files
- Removes navigation elements for Google Sites
- Inlines CSS and JavaScript
- Converts images to base64
- Creates "safe" versions for pasting into Google Sites

---

## File Paths After Deployment

```
Your Google Sites: yourschool.sites.google.com/

├── Home
│   └── Links to: Training Camp, Challenges, Sensors Python, Videos
│
└── Sensors Python
    └── Complete lesson with all 4 phases + hardware setup
```

---

## Troubleshooting

### Menu Links Don't Appear in Google Sites
**Solution:** Google Sites may hide complex navigation. Use simpler manual links:
```html
<p><a href="https://yoursite.sites.google.com/home">Home</a> | 
   <a href="https://yoursite.sites.google.com/sensors-python">Sensors Python</a></p>
```

### Images Not Displaying
**Solution:** Images are embedded as base64. If this fails:
1. Re-run merge script
2. Or manually upload images to Google Sites
3. Update image links in HTML

### Mobile Menu Broken
**Solution:** Google Sites may not support all JavaScript. Simplify menu structure.

### Content Looks Different
**Solution:** Google Sites may override some CSS. Check:
1. Font sizes (Google Sites may enforce minimums)
2. Colors (test contrast)
3. Line height (may be adjusted)

---

## File Sizes

After running merge script, files are typically:
- `index_for_copy_to_sites.html`: ~50-80 KB
- `sensor_python_for_copy_to_sites.html`: ~150-200 KB
- `training_camp_for_copy_to_sites.html`: ~100-150 KB
- `challenges_library_for_copy_to_sites.html`: ~80-120 KB

These are small enough for Google Sites' paste limits (~1 MB per page).

---

## Advanced: Self-Hosted Alternative

If you prefer not to use Google Sites:

**Option 1: GitHub Pages (Free)**
```bash
# Enable in GitHub repository settings
# Files accessible at: https://edking21.github.io/Spike-Editor/
```

**Option 2: Your Own Web Server**
```
yourschool.edu/spike-editor/
├── index.html
├── lessons/
│   ├── robotics.html
│   └── ...
├── styles/
├── scripts/
└── ...
```

---

## Command Quick Reference

```powershell
# Run enhanced merge script (with Sensors Python)
.\merge_for_sites_enhanced.ps1

# Run without Sensors Python (backward compatible)
.\merge_for_sites_enhanced.ps1 -SkipSensorsPython

# List generated files
Get-Item *.html | Where Name -Match "for_copy_to_sites"
```

---

## Support Links

- **Full Deployment Guide:** See `docs/DEPLOYMENT_GUIDE.md`
- **Curriculum Details:** See `docs/SENSORS_PYTHON_README.md`
- **Quick Start:** See `docs/SENSORS_QUICK_START.md`
- **Teaching Tips:** See `docs/SENSORS_CURRICULUM.md`

---

## ✅ You're Ready!

1. ✅ Updated `index.html` menu
2. ✅ Ran `merge_for_sites_enhanced.ps1`
3. ✅ Created Google Sites pages
4. ✅ Deployed HTML files
5. ✅ Tested user flows

**Your Sensors Python curriculum is now live! 🎉**

Questions? Check the full `DEPLOYMENT_GUIDE.md` or test on localhost first:
```
file:///C:/Users/eddyk/source/repos/spike-editor/robotics.html
```
