# Spike Editor Utilities

This directory contains utility scripts and tools for the Spike Editor project.

## Files

- `merge_for_sites.ps1` - PowerShell script to merge HTML files with utils.js for Google Sites deployment
- `run_merge.bat` - Batch file wrapper for easier script execution
- `enable_powershell_context.reg` - Registry file to add PowerShell context menu

## Usage

### Merging Files for Google Sites

1. **Using the batch file (Recommended):**
   ```
   Double-click: utils\run_merge.bat
   ```

2. **Using PowerShell directly:**
   ```powershell
   cd utils
   .\merge_for_sites.ps1
   ```

The script will:
- Automatically navigate to the project root directory
- Create `index_for_copy_to_sites.html` in the project root
- Create `training_camp_for_copy_to_sites.html` in the project root
- Offer to open files in Notepad
- Allow copying content to clipboard

## Workflow

1. Edit snippets in the main `index.html` or `Training Camp.html`
2. Run the merge script from the utils folder: `utils\run_merge.bat`
3. Copy the generated content to Google Sites

## File Structure

```
Spike Editor/
├── index.html                          # Main HTML file
├── Training Camp.html                   # Training camp version
├── utils.js                            # Shared JavaScript utilities
├── index_for_copy_to_sites.html        # Generated: Main page for Google Sites
├── training_camp_for_copy_to_sites.html # Generated: Training camp for Google Sites
└── utils/                              # Utility scripts folder
    ├── merge_for_sites.ps1             # Merge script (moved here)
    ├── run_merge.bat                   # Batch wrapper
    ├── enable_powershell_context.reg   # PowerShell context menu
    └── README.md                       # This file
```

## Notes

- The merge script automatically navigates to the project root to find source files
- Generated files are placed in the project root for easy access
- Run the script from the utils folder, but it will work with files in the parent directory
- All source file paths are relative to the project root (../ prefix)
