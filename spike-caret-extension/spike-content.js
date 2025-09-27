(function(){
  function getCaretColumnFromCommonEditors(){
    try {
      // Monaco editor (common in web IDEs)
      if (window.monaco && monaco.editor) {
        const eds = monaco.editor.getEditors?.() || [];
        const ed = eds[0] || monaco.editor.getFocusedEditor?.();
        const pos = ed?.getPosition?.();
        if (pos && typeof pos.column === 'number') return pos.column - 1; // 0-based
      }
    } catch(e) {}

    try {
      // CodeMirror 5
      if (window.CodeMirror && Array.isArray(window.CodeMirror.instances)) {
        const cm = window.CodeMirror.instances[0];
        const cur = cm?.getCursor?.();
        if (cur && typeof cur.ch === 'number') return cur.ch; // already 0-based
      }
    } catch(e) {}

    try {
      // CodeMirror 6 (very environment-specific; best-effort)
      const view = window.view || window.cmView;
      const sel = view?.state?.selection?.main;
      if (sel && typeof sel.head === 'number') {
        // Count column by scanning the current line
        const doc = view.state.doc;
        const line = doc.lineAt(sel.head);
        return sel.head - line.from; // 0-based column
      }
    } catch(e) {}

    try {
      // Fallback: active textarea/input
      const el = document.activeElement;
      if (el && (el.tagName || '').toLowerCase() === 'textarea') {
        const v = el.value || '';
        const i = typeof el.selectionStart === 'number' ? el.selectionStart : 0;
        const lineStart = v.lastIndexOf('\n', Math.max(0, i - 1)) + 1;
        return Math.max(0, i - lineStart);
      }
    } catch(e) {}

    return 0;
  }

  // Log a confirmation when Ctrl+Shift+R is pressed in the SPIKE tab
  window.addEventListener('keydown', (ev) => {
    if (!ev.repeat && ev.ctrlKey && ev.shiftKey && (ev.key === 'r' || ev.key === 'R')) {
      console.log('[SPIKE caret broadcaster] Ctrl+Shift+R detected');
    }
  }, true);

  // Send caret on Ctrl+Alt+R (existing behavior)
  window.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey && ev.altKey && (ev.key === 'r' || ev.key === 'R')) {
      const column = getCaretColumnFromCommonEditors();
      window.postMessage({ type: 'spike-caret', column }, '*');
      console.log('[SPIKE caret broadcaster] sent', column);
    }
  }, true);
})();
