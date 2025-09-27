# SPIKE Caret Broadcaster (Chrome MV3)

This minimal extension injects a content script into `https://spike.legoeducation.com/prime/project` and, when you press `Ctrl+Alt+R` in that tab, it detects the caret column (best effort for Monaco/CodeMirror/textarea) and posts it to all tabs via `window.postMessage({ type: 'spike-caret', column })`.

Your `index.html` already listens for this message and, with "Spike caret" mode selected, will pad clipboard lines to that column.

## Install (Developer Mode)
1. Open Chrome → `chrome://extensions`.
2. Toggle "Developer mode" (top-right).
3. Click "Load unpacked" and select the folder `spike-caret-extension` in this workspace.

## Use
1. Open the SPIKE editor: `https://spike.legoeducation.com/prime/project`.
2. Ensure the extension shows as enabled.
3. Click inside the SPIKE editor where you want to paste; set the caret.
4. Press `Ctrl+Alt+R`. The extension will post the caret column.
5. Switch to your `index.html` tab, choose Clipboard align → "Spike caret (from other tab)".
6. Click a snippet; paste into the SPIKE editor — all lines start at the caret column.

## Notes
- Column is 0-based inside the code; the visual column in SPIKE should match (we subtract 1 for Monaco to match 0-based).
- If the SPIKE editor uses a different underlying editor, you may need to tweak `spike-content.js` to read the caret position.
- This is a demo-quality extension; it injects on page complete. If the editor loads later, you can refresh the page.
