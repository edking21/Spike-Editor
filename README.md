# Spike Editor

A small static HTML-based snippet browser and helper for composing Python snippets for LEGO Spike projects.

## Features
- Left emoji column for snippet categories (Motors, Movement, Light, Events, Control, Sensors, Operators, Functions).
- Dynamically generated snippet buttons — clicking copies a snippet to the clipboard using `copySnippetWithLineInsert(preId)`.
- Smart indentation: attempts to detect whether to indent the clipboard contents based on the caret position and previous colon-terminated lines.
- Optional on-page test editor (created on demand) for trying paste behavior and caret placement helpers.
- Optional on-page debug panel for diagnostic logs and clipboard previews.

## Quick start
1. Open `index.html` in a modern browser (or serve the folder and open via `http://localhost:8000/Spike-Editor/index.html`).

PowerShell (from the repository root) — serves the current folder:

```powershell
python -m http.server 8000
# then open http://localhost:8000/Spike-Editor/index.html
```

## How to use
- Click an emoji in the left column to load that category's snippets.
- Click a snippet button to copy its text to the clipboard. The main handler is `copySnippetWithLineInsert(preId)`.
- The script will call `navigator.clipboard.writeText(...)` and falls back to a hidden textarea `document.execCommand('copy')` if the Clipboard API fails.

## Developer toggles (runtime)
- Debug panel (hidden by default):
	- `enableSnippetDebug()` — show debug panel and start appending messages
	- `disableSnippetDebug()` — hide debug panel
- Test editor:
	- `enableSnippetTestEditor()` — create (if needed) and show the on-page test editor
	- `disableSnippetTestEditor()` — hide the test editor

## Notes & troubleshooting
- Clipboard API requires a secure context (HTTPS or `localhost`) and user gesture in some browsers. If `navigator.clipboard.writeText` fails, the fallback copy is used automatically.
- If the debug panel or test editor doesn't appear, check the console for errors and run the enable functions in the DevTools console.
- To remove the test editor container manually: `document.getElementById('snippet-test-editor-container')?.remove()`.

## Extending snippets
- Snippets are defined in `index.html` under the `snippetData` object. Each bucket (1..8) contains `snippets` with fields like `id`, `buttonText`, `emoji`, `color`, `textComment`, `textPython`, and optional `textFunction`.
- Edit or add snippet objects in `snippetData` to change buttons and clipboard contents.

## Contributing
- This is a small static project; PRs for improved UX, accessibility, or snippet content are welcome.

## License
- No license file included. Add one if you intend to publish with a specific license.
