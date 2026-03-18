const fs = require('fs');
const path = require('path');

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function extractLastInlineScript(html) {
    const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
    assert(scripts.length > 0, 'No inline <script> block found');
    return scripts[scripts.length - 1][1];
}

function createMockWindow() {
    const windowObj = {
        console,
        prompt: () => '',
        alert: () => {},
        find: () => true,
        fetch: async () => ({ ok: false }),
        document: {
            body: {
                classList: {
                    toggle: () => {},
                    remove: () => {}
                }
            },
            addEventListener: () => {},
            getElementById: () => null,
            createElement: () => ({
                className: '',
                textContent: '',
                style: {},
                classList: { add: () => {} },
                setAttribute: () => {},
                appendChild: () => {},
                addEventListener: () => {}
            })
        }
    };

    windowObj.window = windowObj;
    return windowObj;
}

function runScript(code, windowObj, label) {
    try {
        const fn = new Function('window', 'document', code);
        fn(windowObj, windowObj.document);
    } catch (error) {
        throw new Error(`${label} failed: ${error.message}`);
    }
}

function main() {
    const repoRoot = path.resolve(__dirname, '..');
    const sharedJsPath = path.join(repoRoot, 'scripts', 'spike-shared.js');
    const indexPath = path.join(repoRoot, 'index.html');
    const trainingPath = path.join(repoRoot, 'Training Camp.html');
    const classLibraryPath = path.join(repoRoot, 'Class Library.html');

    const sharedJs = fs.readFileSync(sharedJsPath, 'utf8');
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    const trainingHtml = fs.readFileSync(trainingPath, 'utf8');
    const classLibraryHtml = fs.readFileSync(classLibraryPath, 'utf8');

    const indexInlineScript = extractLastInlineScript(indexHtml);
    const trainingInlineScript = extractLastInlineScript(trainingHtml);
    const classLibraryInlineScript = extractLastInlineScript(classLibraryHtml);

    const windowObj = createMockWindow();

    runScript(sharedJs, windowObj, 'spike-shared.js');

    assert(windowObj.SpikeShared, 'window.SpikeShared is missing');
    assert(typeof windowObj.SpikeShared.bootstrapPage === 'function', 'bootstrapPage is missing');

    const bootstrapResult = windowObj.SpikeShared.bootstrapPage({
        dropdownId: 'training-camp-dropdown',
        toggleDropdownFnName: 'toggleTrainingCampDropdown',
        closeDropdownFnName: 'closeTrainingCampDropdown'
    });

    assert(bootstrapResult.renderers, 'renderers missing from bootstrap result');
    assert(bootstrapResult.snippetData, 'snippetData missing from bootstrap result');
    assert(typeof windowObj.toggleMobileMenu === 'function', 'toggleMobileMenu was not bound');
    assert(typeof windowObj.closeMobileMenu === 'function', 'closeMobileMenu was not bound');
    assert(typeof windowObj.searchCurrentPage === 'function', 'searchCurrentPage was not bound');
    assert(typeof windowObj.toggleTrainingCampDropdown === 'function', 'toggleTrainingCampDropdown was not bound');
    assert(typeof windowObj.closeTrainingCampDropdown === 'function', 'closeTrainingCampDropdown was not bound');

    runScript(indexInlineScript, windowObj, 'index inline script');
    runScript(trainingInlineScript, windowObj, 'training inline script');
    runScript(classLibraryInlineScript, windowObj, 'class library inline script');

    console.log('Smoke test passed: shared bootstrap + index/training/class scripts are valid.');
}

main();
