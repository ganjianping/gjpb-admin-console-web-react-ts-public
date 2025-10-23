// Utility to attach copy buttons and line-number gutters to code blocks inside the TipTap editor.
// Exposes an init function that returns a cleanup function which disconnects the observer.

export function initCodeEnhancer(rootSelector = '.gjp-tiptap-editor') {
  const createGutter = (linesCount: number) => {
    const gutter = document.createElement('div');
    gutter.className = 'gjp-code-gutter';
    for (let i = 0; i < linesCount; i++) {
      const ln = document.createElement('div');
      ln.textContent = String(i + 1);
      gutter.appendChild(ln);
    }
    return gutter;
  };

  const createCopyButton = (content: HTMLElement) => {
    const btn = document.createElement('button');
    btn.className = 'gjp-code-copy-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Copy code');
    btn.textContent = 'Copy';
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
  const codeNode = content.querySelector('code') || content;
  const codeText = (codeNode instanceof HTMLElement) ? codeNode.innerText : content.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
      } catch (err) {
        // log clipboard error and try fallback
        // eslint-disable-next-line no-console
        console.warn('clipboard write failed', err);
        try {
          const range = document.createRange();
          range.selectNodeContents(content);
          const sel = globalThis.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
          // fallback copy
          // eslint-disable-next-line deprecation/deprecation
          document.execCommand('copy');
          sel?.removeAllRanges();
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
        } catch (error_) {
          // eslint-disable-next-line no-console
          console.error('copy failed', error_);
        }
      }
    });
    return btn;
  };

  const processPre = (pre: HTMLElement) => {
    if (pre.dataset.gjpProcessed) return;
    const codeEl = pre.querySelector<HTMLElement>('code');

    const wrap = document.createElement('div');
    wrap.className = 'gjp-code-wrap';

    const content = document.createElement('div');
    content.className = 'gjp-code-content';

    if (codeEl) {
      const lines = (codeEl.innerText || '').split('\n');
      const gutter = createGutter(lines.length);
      content.appendChild(codeEl);
      wrap.appendChild(gutter);
    } else {
      const text = pre.innerText || '';
      const lines = text.split('\n');
      const gutter = createGutter(lines.length);
      const c = document.createElement('code');
      c.textContent = text;
      content.appendChild(c);
      wrap.appendChild(gutter);
    }

    wrap.appendChild(content);
    pre.innerHTML = '';
    pre.appendChild(wrap);

  const btn = createCopyButton(content);

    if (codeEl) {
      const classes = Array.from(codeEl.classList);
      const langMatch = classes.find((c) => c.startsWith('language-'));
      if (langMatch) {
        const label = document.createElement('div');
        label.className = 'gjp-code-lang';
        label.textContent = langMatch.replace('language-', '');
        pre.appendChild(label);
      }
    }

    pre.style.position = pre.style.position || 'relative';
    pre.appendChild(btn);
    pre.dataset.gjpProcessed = '1';
  };

  const attachButtons = (root: ParentNode | Element | Document = document) => {
    const pres = (root instanceof Element ? root : document).querySelectorAll<HTMLElement>('.gjp-tiptap-editor pre');
    for (const pre of Array.from(pres)) processPre(pre);
  };

  // initial attach
  try { attachButtons(document); } catch (e) { console.error('codeEnhancer initial attach failed', e); }

  // observe for dynamic content changes inside tiptap editor
  const editorRoot = document.querySelector(rootSelector);
  let mo: MutationObserver | null = null;
  if (editorRoot) {
    mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes?.length) {
          for (const node of Array.from(m.addedNodes)) {
            attachButtons(node as ParentNode);
          }
        }
      }
    });
    mo.observe(editorRoot, { childList: true, subtree: true });
  }

  return () => {
    try {
      if (mo) mo.disconnect();
    } catch { /* ignore */ }
  };
}
