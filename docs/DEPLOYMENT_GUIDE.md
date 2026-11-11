# 🚀 Deployment Guide: Sensors Python on Google Sites

This guide explains how to deploy the Sensors Python curriculum to Google Sites while maintaining integration with the Spike Editor menu system.

---

## 📋 Overview

The Sensors Python curriculum consists of:
- **Interactive Lesson**: `robotics.html` - Interactive 4-phase lesson with hardware setup
- **Student Worksheet**: `docs/SENSORS_STUDENT_WORKSHEET.md` - 75+ hands-on activities
- **Cheat Sheet**: `docs/SENSORS_CHEAT_SHEET.md` - Code reference and snippets
- **Python Code**: `Python/sensor_three_touch_near.py` - Working 4-phase program

---

## 🎯 Deployment Options

### Option 1: Full Integration (Recommended)
**Best for:** Teachers who want Sensors Python seamlessly integrated into Spike Editor experience

**Setup:**
1. Add "Robotics" link to the Spike Editor main menu
2. robotics.html displays with full Spike Editor navigation
3. Users can navigate: Home → Sensors Python → Back to Home
4. Run `merge_for_sites.ps1` to generate Google Sites version

**Result:** Students see Spike Editor branding and can access all materials from one place

---

### Option 2: Standalone Google Sites Page
**Best for:** Teachers who want Sensors Python as a dedicated curriculum on its own page

**Setup:**
1. Create separate Google Sites page for "Sensors Python"
2. Embed merged HTML with minimal/no Spike Editor menu
3. Standalone access without Spike Editor integration
4. All materials accessible from one dedicated page

**Result:** Clean, focused learning environment specifically for sensor programming

---

### Option 3: Both (Hybrid)
**Best for:** Teachers who want maximum flexibility

**Setup:**
1. Add Sensors Python to Spike Editor menu
2. Also create standalone Google Sites page
3. Teachers can choose which experience to use
4. Both versions available simultaneously

**Result:** Most flexible - teachers and students pick their preferred access method

---

## 🔧 Deployment Steps

### Step 1: Prepare Merge Script (One-Time Setup)

The updated `merge_for_sites.ps1` now includes robotics.html. Run it:

```powershell
cd C:\Users\eddyk\source\repos\spike-editor\utils
.\merge_for_sites.ps1
```

This creates:
- `index_for_copy_to_sites.html` - Updated with Robotics menu link
- `sensor_python_for_copy_to_sites.html` - Ready for Google Sites
- `training_camp_for_copy_to_sites.html` - Existing content
- `challenges_library_for_copy_to_sites.html` - Existing content

### Step 2: Add Menu Link (Full Integration Only)

Edit `index.html` to add Sensors Python to the main menu:

```html
<div class="menu-links">
    <a class="active" href="/Spike-Editor/index.html">Home</a>
    <a href="/Spike-Editor/training_camp.html">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html">Challenges</a>
    <a href="/Spike-Editor/robotics.html">Robotics</a>
    <a href="/Spike-Editor/Videos.html">Videos</a>
</div>
```

And in mobile sidebar:
```html
<a href="/Spike-Editor/robotics.html" onclick="closeMobileMenu()">Robotics</a>
```

### Step 3: Deploy to Google Sites

#### For Full Integration:
1. Copy content from `index_for_copy_to_sites.html`
2. Paste into your Google Sites homepage
3. Copy content from `sensor_python_for_copy_to_sites.html`
4. Paste into a new "Sensors Python" page on Google Sites
5. Update the links in navigation to point to your Google Sites URLs

#### For Standalone Page:
1. Copy content from `sensor_python_for_copy_to_sites.html`
2. Create new Google Sites page: "Sensors Python Lesson"
3. Paste HTML content
4. Add back/home links if desired

### Step 4: Verify Navigation

Test these user flows:
- ✅ Home → Robotics link works
- ✅ Sensors Python page displays correctly
- ✅ Menu items are clickable
- ✅ Mobile menu opens/closes
- ✅ Code examples are visible and readable
- ✅ Hardware setup diagram displays

---

## 📁 File Structure After Deployment

```
Google Sites (your-site.sites.google.com)
├── Home (index_for_copy_to_sites.html pasted)
│   ├── Links to Training Camp
│   ├── Links to Challenges
│   ├── Links to Sensors Python
│   └── Links to Videos
│
├── Training Camp (training_camp_for_copy_to_sites.html pasted)
├── Challenges (challenges_library_for_copy_to_sites.html pasted)
├── Videos (existing)
│
└── Sensors Python (NEW - sensor_python_for_copy_to_sites.html pasted)
    └── Full lesson with hardware setup & 4 phases
```

---

## 🎓 Teaching Workflow

### For Teachers Using Google Sites:
1. Navigate to Google Sites home
2. Click "Robotics" menu link
3. Show lesson on projector (full screen)
4. Guide students through 4 phases
5. Link students to worksheet from lesson page
6. Share Python code file

### For Students:
1. Access Google Sites Sensors Python page
2. View hardware setup requirements
3. Follow learning objectives
4. Download Python code (`sensor_three_touch_near.py`)
5. Open student worksheet (`SENSORS_STUDENT_WORKSHEET.md`)
6. Reference cheat sheet (`SENSORS_CHEAT_SHEET.md`) as needed

---

## 🔄 Keeping Files in Sync

When you update source files in GitHub:

1. **Local Testing:**
   ```powershell
   cd C:\Users\eddyk\source\repos\spike-editor
   # Edit your files
   # Test in browser: file:///C:/Users/eddyk/source/repos/spike-editor/robotics.html
   ```

2. **Generate Deployment Files:**
   ```powershell
   cd utils
   .\merge_for_sites.ps1
   ```

3. **Deploy to Google Sites:**
   - Copy updated `_for_copy_to_sites.html` files
   - Paste into corresponding Google Sites pages
   - Verify display and links

4. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Update Sensors Python deployment files"
   git push origin main
   ```

---

## 🛠️ Customization

### Change Menu Order
Edit these files to reorder menu items:
- `index.html` - Desktop menu
- Mobile sidebar in `index.html`
- Update corresponding links in `merge_for_sites.ps1` if needed

### Customize Colors
Edit `styles/spike-shared.css`:
- `.lesson-header` - Changes Sensors Python header color
- `.phase-card` - Changes 4-phase card styling

### Add New Lessons
To add another lesson (e.g., Sensors Word Blocks):
1. Create `lessons/sensor_word_blocks.html`
2. Update `merge_for_sites.ps1` to include it
3. Add menu link in `index.html`
4. Run merge script and deploy

---

## ❓ Troubleshooting

### Issue: Menu not showing in Google Sites
**Solution:** Google Sites may remove complex CSS. Use simpler styling or add manual navigation links.

### Issue: Images not displaying
**Solution:** The merge script converts images to base64. If this fails:
- Check image file sizes (large images may exceed limits)
- Re-run merge script
- Manually upload images to Google Sites and update links

### Issue: Links pointing to GitHub instead of Google Sites
**Solution:** Update absolute paths in generated files:
- Find: `/Spike-Editor/`
- Replace with: relative path to your Google Sites pages

### Issue: Mobile menu not working
**Solution:** Google Sites may not support all JavaScript. Test on mobile and simplify menu if needed.

---

## 📊 Performance Tips

1. **Optimize images:** Keep JPGs under 100KB each
2. **Test on slow connection:** Lesson loads via Google Sites CDN
3. **Cache friendly:** Merge script now generates static HTML for fast loading
4. **Mobile responsive:** All CSS is included in merged output

---

## 🚀 Advanced Deployment

### Self-Hosted Option
If you prefer not to use Google Sites:

1. Host `_for_copy_to_sites.html` files on your own web server
2. Users access directly: `yourschool.edu/spike-editor/`
3. Full control over styling and navigation
4. No Google Sites limitations

### GitHub Pages Option
1. Enable GitHub Pages in repository settings
2. Access at: `https://edking21.github.io/Spike-Editor/`
3. No merge needed - uses source files directly
4. Auto-updates on each push

---

## 📞 Support & Questions

**For deployment issues:**
- Check browser console for JavaScript errors
- Test on different browsers/devices
- Verify all file paths in generated HTML
- Review this deployment guide

**For curriculum questions:**
- See `docs/SENSORS_PYTHON_README.md`
- Check `docs/SENSORS_QUICK_START.md`
- Reference `docs/SENSORS_CHEAT_SHEET.md`

---

## 📝 Checklist Before Going Live

- [ ] Run `merge_for_sites.ps1` successfully
- [ ] Test `sensor_python_for_copy_to_sites.html` locally
- [ ] Verify all menu links work
- [ ] Check hardware setup section displays correctly
- [ ] Test 4-phase cards render properly
- [ ] Verify images/diagrams display
- [ ] Test on mobile device
- [ ] Test in Google Sites embed
- [ ] Verify navigation links in Google Sites
- [ ] Share links with teachers/students
- [ ] Collect feedback and iterate

---

**Ready to deploy? Let's make sensor education accessible! 🤖**
