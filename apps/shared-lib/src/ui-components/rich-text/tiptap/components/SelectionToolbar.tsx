import { useState } from 'react';
import type { Editor } from '@tiptap/react';

interface Props {
  editor: Editor | null;
  selToolbarOpen: boolean;
  selToolbarCoords: { left: number; top: number } | null;
}

export default function SelectionToolbar(props: Readonly<Props>) {
  const { editor, selToolbarOpen, selToolbarCoords } = props;
  // local UI state for color/highlight pickers
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  // code block language picker moved to the SlashMenu; toolbar no longer shows language selector

  if (!selToolbarOpen || !editor) return null;

  return (
    <div
      className="gjp-selection-toolbar"
      style={{ position: 'absolute', left: selToolbarCoords?.left ?? 8, top: selToolbarCoords?.top ?? 8, zIndex: 70 }}
      role="toolbar"
      aria-label="Formatting toolbar"
    >
      <button
        type="button"
        title="Bold (Cmd/Ctrl+B)"
        className={editor.isActive('bold') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleBold().run(); } catch { /* ignore */ } }}
      >
        <strong>B</strong>
      </button>

      <button
        type="button"
        title="Italic (Cmd/Ctrl+I)"
        className={editor.isActive('italic') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleItalic().run(); } catch { /* ignore */ } }}
      >
        <em>I</em>
      </button>

      <button
        type="button"
        title="Underline"
        className={editor.isActive('underline') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().toggleUnderline().run(); } catch { /* ignore */ } }}
      >
        <span style={{ textDecoration: 'underline' }}>U</span>
      </button>

      <button
        type="button"
        title="Strike"
        className={editor.isActive('strike') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleStrike().run(); } catch { /* ignore */ } }}
      >
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </button>

      <button
        type="button"
        title="Inline Code"
        className={editor.isActive('code') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleCode().run(); } catch { /* ignore */ } }}
      >
        <code>{'</>'}</code>
      </button>

      {/* Code block insertion now available via the SlashMenu (\"/\") — language picker moved there. */}

      {/* Text color picker */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          title="Text color"
          onMouseDown={(e) => { e.preventDefault(); setShowColorPicker((s:any) => !s); setShowHighlightPicker(false); }}
        >
          A
        </button>
        {showColorPicker && (
          <div className="gjp-color-palette">
            {['#000000','#dc2626','#f97316','#f59e0b','#84cc16','#06b6d4','#3b82f6','#8b5cf6','#ec4899'].map((c) => (
              <button
                key={c}
                type="button"
                className="gjp-color-swatch"
                title={`Set text color ${c}`}
                aria-label={`Set text color ${c}`}
                style={{ background: c }}
                onMouseDown={(ev) => { ev.preventDefault(); try { (editor.chain() as any).focus().setColor(c).run(); } catch { try { editor.chain().focus().setMark('textStyle', { color: c }).run(); } catch {} } setShowColorPicker(false); }}
              />
            ))}
            <button
              type="button"
              className="gjp-color-clear"
              title="Clear text color"
              aria-label="Clear text color"
              onMouseDown={(ev) => { ev.preventDefault(); try { (editor.chain() as any).focus().unsetColor().run(); } catch { try { editor.chain().focus().setMark('textStyle', { color: null }).run(); } catch {} } setShowColorPicker(false); }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Highlight color picker (background) */}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          title="Highlight color"
          onMouseDown={(e) => { e.preventDefault(); setShowHighlightPicker((s:any) => !s); setShowColorPicker(false); }}
        >
          ▮
        </button>
        {showHighlightPicker && (
          <div className="gjp-color-palette">
            {['#fff59d','#fde68a','#fbcfe8','#bbf7d0','#bfdbfe','#efefef'].map((c) => (
              <button
                key={c}
                type="button"
                className="gjp-color-swatch"
                title={`Set highlight color ${c}`}
                aria-label={`Set highlight color ${c}`}
                style={{ background: c }}
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  try {
                    (editor.chain() as any).focus().toggleHighlight({ color: c }).run();
                    setShowHighlightPicker(false);
                    return;
                  } catch {}
                  try { (editor.chain() as any).focus().setMark('textStyle', { backgroundColor: c }).run(); setShowHighlightPicker(false); return; } catch {}
                  try { (editor.chain() as any).focus().setMark('textStyle', { background: c }).run(); setShowHighlightPicker(false); return; } catch {}
                  try { (editor.chain() as any).focus().setMark('textStyle', { style: `background-color: ${c};` }).run(); setShowHighlightPicker(false); return; } catch {}
                  try { (editor.chain() as any).focus().unsetMark('textStyle').setMark('textStyle', { style: `background-color: ${c};` }).run(); setShowHighlightPicker(false); return; } catch {}
                  setShowHighlightPicker(false);
                }}
              />
            ))}
            <button
              type="button"
              className="gjp-color-clear"
              title="Clear highlight color"
              aria-label="Clear highlight color"
              onMouseDown={(ev) => {
                ev.preventDefault();
                try { (editor.chain() as any).focus().unsetHighlight().run(); setShowHighlightPicker(false); return; } catch {}
                try { (editor.chain() as any).focus().setMark('textStyle', { backgroundColor: null }).run(); setShowHighlightPicker(false); return; } catch {}
                try { (editor.chain() as any).focus().setMark('textStyle', { background: null }).run(); setShowHighlightPicker(false); return; } catch {}
                try { (editor.chain() as any).focus().setMark('textStyle', { style: '' }).run(); setShowHighlightPicker(false); return; } catch {}
                try { (editor.chain() as any).focus().unsetMark('textStyle').run(); setShowHighlightPicker(false); return; } catch {}
                setShowHighlightPicker(false);
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        title="Superscript"
        className={editor.isActive('superscript') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().toggleSuperscript().run(); } catch { /* ignore */ } }}
      >
        xⁿ
      </button>

      <button
        type="button"
        title="Subscript"
        className={editor.isActive('subscript') ? 'is-active' : ''}
        onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().toggleSubscript().run(); } catch { /* ignore */ } }}
      >
        xₙ
      </button>

      <button
        type="button"
        title="Remove formatting"
        className="gjp-btn-remove"
        onMouseDown={(e) => {
          e.preventDefault();
          try { (editor.chain() as any).focus().unsetAllMarks().clearNodes().run(); } catch { try { (editor.chain() as any).focus().setMark('textStyle', { color: null, backgroundColor: null }).run(); } catch {} }
        }}
      >
        <svg className="gjp-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 17L9 10l7-7 6 6-7 7-9 1z" />
          <path d="M14 7l3 3" />
        </svg>
      </button>
    </div>
  );
}
