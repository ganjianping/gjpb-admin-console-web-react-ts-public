import type { Editor } from '@tiptap/react';
import type { RefObject } from 'react';

export function coordsAtPosSafe(editor: Editor | null, pos: number, containerRef: RefObject<HTMLElement> | null) {
  try {
    const view = (editor as any)?.view;
    if (!view || !containerRef?.current) return null;
    const coords = view.coordsAtPos(pos);
    const containerRect = containerRef.current.getBoundingClientRect();
    return { left: coords.left - containerRect.left, top: coords.bottom - containerRect.top + 4 };
  } catch {
    return null;
  }
}

export async function insertTableFallback(editor: Editor | null, rows = 3, cols = 3, withHeaderRow = true) {
  if (!editor) return;
  try {
    try {
      (editor.chain() as any).focus().insertTable({ rows, cols, withHeaderRow }).run();
      return;
    } catch {
      // fallback in case some setups use a different API
      try {
        (editor.chain() as any).focus().insertTable?.({ rows, cols, withHeaderRow }).run();
        return;
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}

export function deleteRange(editor: Editor | null, from: number, to: number) {
  if (!editor) return;
  try {
    editor.chain().focus().command(({ tr }) => { tr.delete(from, to); return true; }).run();
  } catch {
    // ignore
  }
}

export function safeChainFocus(editor: Editor | null) {
  try { return (editor?.chain?.() as any)?.focus?.(); } catch { return null; }
}
