# Merge Script Usage

This repository uses `utils/merge_for_sites.ps1` to merge source HTML files with `utils/utils.js` and produce Google Sites-ready files in the `utils` folder.

## Usage

1. Open PowerShell in the repository root.
2. Run: `./utils/merge_for_sites.ps1`
3. Follow prompts to open files and/or copy output to clipboard.

## Manual PowerShell Examples

```powershell
# Basic usage
.\utils\merge_for_sites.ps1

# Custom output file name (written inside utils/)
.\utils\merge_for_sites.ps1 -IndexOutputFile "custom_output.html"
```

## Workflow

1. Edit snippets in `index.html`, `Training Camp.html`, or `Class Library.html`.
2. Update utility functions in `utils/utils.js`.
3. Run `./utils/merge_for_sites.ps1`.
4. Use generated files from `utils/`:
	- `index_for_copy_to_sites.html`
	- `training_camp_for_copy_to_sites.html`
	- `class_library_for_copy_to_sites.html`

## Notes

- Script location: `utils/merge_for_sites.ps1`
- It replaces `<script src="./utils/utils.js"></script>` (and legacy `<script src="./utils.js"></script>`) with inlined JS.
- Output directories are auto-created if missing.

## Troubleshooting

- If PowerShell script doesn't run, try: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Make sure source HTML files exist in repo root and `utils/utils.js` exists.
