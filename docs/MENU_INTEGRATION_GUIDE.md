# Spike Editor Navigation

The Robotics project hub is linked from the Spike Editor navigation for desktop and mobile users.

---

## Current Menu Structure

The Spike Editor currently has these main sections:
1. Home (index.html)
2. Training Camp (training_camp.html)
3. Challenges (challenges_library.html)
4. Robotics (robotics.html)
5. Videos (Videos.html)

---

## File: `index.html`

### Location 1: Desktop Menu Bar (Line ~20-25)

**Current:**
```html
<div class="menu-links">
    <a class="active" href="/Spike-Editor/index.html">Home</a>
    <a href="/Spike-Editor/training_camp.html">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html">Challenges</a>
    <a href="/Spike-Editor/Videos.html">Videos</a>
</div>
```

**Updated:**
```html
<div class="menu-links">
    <a class="active" href="/Spike-Editor/index.html">Home</a>
    <a href="/Spike-Editor/training_camp.html">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html">Challenges</a>
    <a href="/Spike-Editor/robotics.html">Robotics</a>
    <a href="/Spike-Editor/Videos.html">Videos</a>
</div>
```

**What changed:** Added a `<a>` tag for Robotics between Challenges and Videos

---

### Location 2: Mobile Sidebar (Line ~10-17)

**Current:**
```html
<div class="mobile-sidebar">
    <a class="active" href="/Spike-Editor/index.html" onclick="closeMobileMenu()">Home</a>
    <a href="/Spike-Editor/training_camp.html" onclick="closeMobileMenu()">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html" onclick="closeMobileMenu()">Challenges</a>
    <a href="/Spike-Editor/Videos.html" onclick="closeMobileMenu()">Videos</a>
</div>
```

**Updated:**
```html
<div class="mobile-sidebar">
    <a class="active" href="/Spike-Editor/index.html" onclick="closeMobileMenu()">Home</a>
    <a href="/Spike-Editor/training_camp.html" onclick="closeMobileMenu()">Training Camp</a>
    <a href="/Spike-Editor/challenges_library.html" onclick="closeMobileMenu()">Challenges</a>
    <a href="/Spike-Editor/robotics.html" onclick="closeMobileMenu()">Robotics</a>
    <a href="/Spike-Editor/Videos.html" onclick="closeMobileMenu()">Videos</a>
</div>
```

**What changed:** Added the Robotics link with `onclick="closeMobileMenu()"` for mobile users

---

## Why These Changes?

### Location 1: Desktop Menu Bar
- Shows on full-size screens (tablets, laptops)
- Located at top of page
- Horizontal layout
- Used by most teachers during lesson planning

### Location 2: Mobile Sidebar
- Shows on small screens (phones)
- Slides out as hamburger menu
- Vertical layout
- Used by students and teachers with mobile devices

**Both menus should match** so all users can access Robotics regardless of device.

---

## Testing the Changes

### Test 1: Check it renders locally

```bash
# Open in browser
file:///C:/Users/eddyk/source/repos/spike-editor/index.html

# Verify:
- ✅ Robotics appears after Challenges and before Videos
- ✅ Menu items are clickable
- ✅ Clicking "Robotics" navigates to robotics.html
```

### Test 2: Mobile view

In your browser developer tools:
```
1. Press F12 to open Developer Tools
2. Click mobile/responsive icon (top-left of DevTools)
3. Simulate iPhone or Android
4. Verify:
   - ✅ Hamburger menu (☰) appears
   - ✅ Click hamburger menu
   - ✅ Robotics appears in sidebar after Challenges
   - ✅ Clicking it navigates correctly
   - ✅ Menu closes after selecting
```

### Test 3: Navigation works

```
1. Click "Sensors Python" from Home
2. Should load: robotics.html
3. Page displays:
   - ✅ Header: "🤖 Sensors Python"
   - ✅ Learning objectives
   - ✅ Hardware setup section
   - ✅ 4 phase cards
   - ✅ Top menu still visible with Home link
```

### Test 4: Back navigation

```
1. On Sensors Python page
2. Click "Home" in top menu
3. Should return to index.html
4. ✅ Home page displays
5. ✅ "Robotics" link visible in menu
```

---

## Alternative Menu Placements

### Option A: After Challenges (Recommended)
```html
<a href="/Spike-Editor/challenges_library.html">Challenges</a>
<a href="/Spike-Editor/robotics.html">Robotics</a>
<a href="/Spike-Editor/Videos.html">Videos</a>
```
**Why:** Sensors is a curriculum module, similar to Training Camp and Challenges

### Option B: After Training Camp
```html
<a href="/Spike-Editor/training_camp.html">Training Camp</a>
<a href="/Spike-Editor/robotics.html">Robotics</a>
<a href="/Spike-Editor/challenges_library.html">Challenges</a>
```
**Why:** Both are sequential learning experiences

### Option C: Last (Before Videos)
```html
<a href="/Spike-Editor/challenges_library.html">Challenges</a>
<a href="/Spike-Editor/Videos.html">Videos</a>
<a href="/Spike-Editor/robotics.html">Robotics</a>
```
**Why:** Keeps established items first, new items last

---

## Implementation Checklist

- [ ] Open `C:\Users\eddyk\source\repos\spike-editor\index.html`
- [ ] Find desktop menu `<div class="menu-links">` section
- [ ] Add Robotics link:
  ```html
  <a href="/Spike-Editor/robotics.html">Robotics</a>
  ```
- [ ] Find mobile sidebar `<div class="mobile-sidebar">` section
- [ ] Add same link with `onclick="closeMobileMenu()"`
- [ ] Save file
- [ ] Test in browser (F5 to refresh)
- [ ] Test mobile view (F12 → mobile icon)
- [ ] Test navigation both ways (Home ↔ Sensors Python)
- [ ] Commit to GitHub
- [ ] Run merge_for_sites_enhanced.ps1
- [ ] Deploy to Google Sites

---

## Commit Message

```bash
git add index.html
git commit -m "Add Sensors Python to main navigation menu

- Added Robotics link to desktop menu bar
- Added Robotics link to mobile sidebar
- Enables easy access from Spike Editor home page
- Users can navigate between Home and Sensors Python"
```

---

## After Menu Update

### Next: Generate Deployment Files

```powershell
cd C:\Users\eddyk\source\repos\spike-editor\utils
.\merge_for_sites_enhanced.ps1
```

This creates the Google Sites-ready versions automatically.

---

## FAQ

**Q: Why must I update both desktop and mobile?**
A: Different users use different devices. Desktop menu for laptops, mobile sidebar for phones. Both must work.

**Q: Can I use a different URL?**
A: Yes, but use consistent paths:
- GitHub: `/Spike-Editor/robotics.html` ✅
- Google Sites: may need relative paths (set during deployment)
- Self-hosted: depends on your server structure

**Q: What if the menu looks crowded?**
A: You can use a dropdown or reorganize. Current structure supports up to ~8 items comfortably.

**Q: Will this affect existing links?**
A: No. Only adding new link, not changing existing ones.

**Q: How do I remove it later?**
A: Simply delete the two `<a>` tags. One line each to add, one line each to remove.

---

## Preview: Updated Menu

```
☰ Menu                    (Mobile)
  Home
  Training Camp
  Challenges
  🆕 Sensors Python      ← NEW
  Videos

Home | Training Camp | Challenges | 🆕 Sensors Python | Videos   (Desktop)
```

---

## Support

- **Merge Script:** See `merge_for_sites_enhanced.ps1`
- **Deploy Guide:** See `docs/DEPLOYMENT_GUIDE.md`
- **Quick Start:** See `docs/QUICK_DEPLOY.md`
- **Curriculum:** See `docs/SENSORS_PYTHON_README.md`

---

**You're ready to integrate! Follow the steps above and Sensors Python will be accessible from the main Spike Editor menu. 🚀**
