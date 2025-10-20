# Merge Script Usage

This directory contains scripts to automatically merge `index.html` with `utils.js` to create a standalone file for Google Sites deployment.

## Files

- `merge_for_sites.bat` - Simple batch script
- `merge_for_sites.ps1` - More feature-rich PowerShell script

## Usage

### Option 1: Batch Script (Simple)
1. Double-click `merge_for_sites.bat`
2. The script will create `index_for_copy_to_sites.html`
3. The file will automatically open in Notepad

### Option 2: PowerShell Script (Recommended)
1. Right-click in the folder and select "Open PowerShell window here"
2. Run: `.\merge_for_sites.ps1`
3. Follow the prompts to open the file and/or copy to clipboard

### Manual PowerShell Execution
```powershell
# Basic usage
.\merge_for_sites.ps1

# Custom file names
.\merge_for_sites.ps1 -SourceFile "index.html" -UtilsFile "utils.js" -OutputFile "custom_output.html"
```

## Workflow

1. Edit your snippets in `index.html`
2. Update utility functions in `utils.js` if needed
3. Run one of the merge scripts
4. Copy the generated file content to Google Sites

## Notes

- The script replaces `<script src="./utils.js"></script>` with the actual JavaScript content
- Proper indentation is maintained in the merged file
- The output file is ready for copy-paste into Google Sites
- The PowerShell script can optionally copy content directly to your clipboard

## Troubleshooting

- If PowerShell script doesn't run, try: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Make sure both `index.html` and `utils.js` exist in the same directory
- The scripts must be run from the directory containing the source files
