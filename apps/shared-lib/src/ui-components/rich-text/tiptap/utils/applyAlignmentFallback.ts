export function applyAlignmentFallback(align: 'left' | 'center' | 'right' | 'justify') {
  try {
    const sel = globalThis.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const root = document.querySelector('.gjp-tiptap-editor');
    if (!root) return;

    const selector = 'p,h1,h2,h3,h4,h5,h6,li,div,pre';
    const anchor = sel.anchorNode;
    let el: HTMLElement | null = null;
    if (anchor) el = anchor.nodeType === 3 ? anchor.parentElement : (anchor as HTMLElement | null);
    while (el && !selector.split(',').includes(el.tagName.toLowerCase())) el = el.parentElement;
    if (el) el.style.textAlign = align;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('applyAlignmentFallback failed', err);
  }
}
