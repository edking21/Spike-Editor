function refreshSnippets(buttonId) {
    const column = document.getElementById('snippet-column');
    column.innerHTML = '';

    const data = snippetData[buttonId];
    if (!data) return;

    data.snippets.forEach((snippet, index) => {
        const snippetDiv = document.createElement('div');
        snippetDiv.className = 'snippet movement';

        const preId = `snippet-${buttonId}-${index}`;
        const pre = document.createElement('pre');
        pre.id = preId;
        pre.contentEditable = true;
        pre.style.display = 'none';

        // build the copy text: include function definition (if any), comment, then python body
        const parts = [];
        parts.push(snippet.textPython);
        pre.textContent = parts.join('\n') + '\n';

        //console.log(`BUILDING PRE HERE AS: ${pre.textContent}`);

        snippetDiv.appendChild(pre);

        const button = document.createElement('button');
        // emoji slightly larger via CSS class
        button.innerHTML = `<span class="emoji">${snippet.emoji}</span><span class="label">${snippet.buttonText}</span>`;
        button.style.backgroundColor = snippet.color;
        button.style.color = (buttonId === 4 || buttonId === 5 || buttonId === 6) ? '#000000' : '#ffffff';
        button.title = snippet.buttonText; // keep accessible label

        button.addEventListener('click', () => copySnippetWithLineInsert(preId));

        snippetDiv.appendChild(button);
        column.appendChild(snippetDiv);
    });
}

function copySnippetWithLineInsert(preId) {
    const el = document.getElementById(preId);
    if (!el) {
        console.warn(`copySnippetWithLineInsert: element with id ${preId} not found`);
        alert('Snippet not available to copy. Try clicking the left-column emoji to reload snippets.');
        return;
    }

    const text = el.textContent || '';

    // do not add additional indentation here; keep text as authored
    const textToCopy = text;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).catch(() => fallbackCopy(textToCopy));
    } else {
        fallbackCopy(textToCopy);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { console.error('fallback copy failed', e); }
    document.body.removeChild(textarea);
}

async function fetchGitHubRelease() {
    /**
     * Fetches the latest release information from the GitHub repository and updates the UI.
     * 
     * This function makes an API call to the GitHub releases endpoint to retrieve the latest
     * release data for the Spike-Editor repository. It updates the release-info element with
     * the fetched release name or falls back to a default version if the request fails.
     * 
     * @async
     * @function fetchGitHubRelease
     * @returns {Promise<void>} A promise that resolves when the release information has been fetched and displayed
     * @throws {Error} Throws an error if the GitHub API request fails or returns a non-ok response
     * 
     * @example
     * // Call the function to update release information
     * await fetchGitHubRelease();
     * 
     * @description
     * - Makes a GET request to 'https://api.github.com/repos/edking21/Spike-Editor/releases/latest'
     * - On success: Updates the 'release-info' element with "© 2025 Spike Editor - Release {release.name}"
     * - On failure: Falls back to "© 2025 Spike Editor - Release v1.0.0" and logs a warning
     * - Requires an HTML element with id 'release-info' to exist in the DOM
     */
    try {
        const response = await fetch('https://api.github.com/repos/edking21/Spike-Editor/releases/latest');
        if (response.ok) {
            const release = await response.json();
            const releaseInfo = document.getElementById('release-info');
            releaseInfo.textContent = `© 2025 Spike Editor - Release ${release.name}`;
        } else {
            throw new Error('Failed to fetch release');
        }
    } catch (error) {
        console.warn('Could not fetch GitHub release:', error);
        const releaseInfo = document.getElementById('release-info');
        releaseInfo.textContent = '© 2025 Spike Editor - Release v1.0.0';
    }
}
