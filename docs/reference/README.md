# Spike Editor

A small static HTML-based snippet browser and helper for composing Python snippets for LEGO Spike projects.

## Features

### Core Functionality
- **Category Navigation**: Left emoji column for snippet categories (Motors, Movement, Light, Events, Control, Sensors, Operators, Functions)
- **Smart Snippet Management**: Dynamically generated snippet buttons with intelligent clipboard copying via `copySnippetWithLineInsert(preId)`
- **Intelligent Indentation**: Automatic indentation detection based on caret position and preceding colon-terminated lines
- **Cross-browser Clipboard Support**: Primary Clipboard API with automatic fallback to `document.execCommand('copy')`

### Development Tools
- **On-demand Test Editor**: In-page editor for testing paste behavior and caret placement
- **Debug Panel**: Diagnostic logging and clipboard content preview
- **Runtime Toggles**: Enable/disable features during development without code changes

## Quick Start

### Local Development
1. Open `index.html` in a modern browser, or serve the folder locally:

**PowerShell** (from repository root):
```powershell
python -m http.server 8000
# Navigate to: http://localhost:8000/Spike-Editor/index.html
```

**Node.js** (alternative):
```bash
npx http-server -p 8000
# Navigate to: http://localhost:8000/Spike-Editor/index.html
```

### Basic Usage
1. Click an emoji in the left column to load snippet categories
2. Click snippet buttons to copy code to clipboard
3. Paste into your LEGO Spike Python environment

## Developer Tools

### Debug Panel
```javascript
enableSnippetDebug()    // Show debug panel and start logging
disableSnippetDebug()   // Hide debug panel
```

### Test Editor
```javascript
enableSnippetTestEditor()    // Create and show on-page test editor
disableSnippetTestEditor()   // Hide test editor
```

### Manual Cleanup
```javascript
// Remove test editor if needed
document.getElementById('snippet-test-editor-container')?.remove()
```

## Project Structure

```
Spike Editor/
├── index.html          # Main application file
├── README.md          # This documentation
└── assets/            # Static assets (if any)
```

## Customizing Snippets

Snippets are defined in `index.html` within the `snippetData` object:

```javascript
snippetData = {
    1: {  // Category number (1-8)
        snippets: [
            {
                id: "unique-id",
                buttonText: "Display Text",
                emoji: "🔧",
                color: "#ff6b6b",
                textComment: "// Description",
                textPython: "actual_python_code()",
                textFunction: "optional_function_wrapper()"  // Optional
            }
        ]
    }
}
```

### Adding New Categories
1. Add a new numbered key to `snippetData`
2. Include corresponding emoji in the left navigation
3. Update category handling logic if needed

### Snippet Properties
- `id`: Unique identifier for the snippet
- `buttonText`: Text displayed on the button
- `emoji`: Icon for visual identification
- `color`: Button color theme
- `textComment`: Descriptive comment
- `textPython`: Actual Python code to copy
- `textFunction`: Optional function wrapper

## Browser Compatibility

### Clipboard API Requirements
- **Secure Context**: HTTPS or `localhost` required
- **User Gesture**: Clipboard access needs user interaction
- **Fallback Support**: Automatic fallback for older browsers

### Supported Browsers
- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+

## Troubleshooting

### Common Issues

**Clipboard not working:**
- Ensure you're using HTTPS or localhost
- Check browser permissions for clipboard access
- Verify user interaction triggered the copy action

**Debug panel not showing:**
- Check browser console for errors
- Run `enableSnippetDebug()` in DevTools console
- Ensure JavaScript is enabled

**Snippets not loading:**
- Verify `snippetData` object syntax
- Check for JavaScript console errors
- Ensure proper HTML structure

### Development Tips
- Use browser DevTools for debugging
- Test clipboard functionality across different browsers
- Validate snippet JSON structure before deployment

## Contributing

### Guidelines
- PRs welcome for UX improvements, accessibility, or snippet content
- Follow existing code style and structure
- Test changes across supported browsers
- Update documentation for new features

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Test changes locally
4. Submit PR with clear description

## License

No license file currently included. Consider adding an appropriate license for public distribution.

## Project Status

**Current Version**: Static HTML implementation
**Maintenance**: Active development for educational use
**Dependencies**: None (vanilla HTML/CSS/JavaScript)
