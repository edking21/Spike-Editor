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
- Create `index_for_copy_to_sites.html`
- Create `training_camp_for_copy_to_sites.html`
- Offer to open files in Notepad
- Allow copying content to clipboard

## Workflow

1. Edit snippets in the main `index.html` or `Training Camp.html`
2. Run the merge script from the utils folder
3. Copy the generated content to Google Sites

## File Structure

```
Spike Editor/
├── index.html                          # Main HTML file
├── Training Camp.html                   # Training camp version
├── utils.js                            # Shared JavaScript utilities
├── utils/                              # Utility scripts folder
│   ├── merge_for_sites.ps1            # Merge script
│   ├── run_merge.bat                  # Batch wrapper
│   └── README.md                      # This file
└── [generated files]                   # Output files for Google Sites
```

## Notes

- The merge script automatically looks for source files in the parent directory
- Generated files are placed in the project root for easy access
- All paths in the PowerShell script are relative to the project root
