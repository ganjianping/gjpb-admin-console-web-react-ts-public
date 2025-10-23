import { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import DOMPurify from 'dompurify';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Mention from '@tiptap/extension-mention';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';

// create a lowlight instance and register a few common languages (keep bundle minimal)
const lowlight = createLowlight();
lowlight.register({ javascript: js as any, typescript: ts as any, css: css as any });

interface TiptapTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Number of empty paragraph rows to show when editor is initially empty */
  initialRows?: number;
  lineHeight?: number | string;
}

export default function TiptapTextEditor(props: Readonly<TiptapTextEditorProps>) {
  const { value = '', onChange, placeholder = 'Enter rich text...', lineHeight = 1.4, initialRows = 3 } = props;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
  // enable alignment for headings, paragraphs, list items and blockquotes
  TextAlign.configure({ types: ['heading', 'paragraph', 'listItem', 'blockquote'] }),
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder }),
      // UX improvements & extra nodes
      Dropcursor.configure({ color: '#94a3b8' }),
      Gapcursor,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Mention,
      TextStyle,
      Color,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    onUpdate: ({ editor }: { editor: Editor }) => {
      // sanitize HTML before sending out
      const dirty = editor.getHTML();
      const clean = DOMPurify.sanitize(dirty);
      onChange?.(clean);
    },
  });

  useEffect(() => {
    if (!editor) return;
    // If external value is non-empty, sync it
    if (value && value !== editor.getHTML()) {
      (editor.commands as any).setContent(value, { preserveWhitespace: false });
      return;
    }

    // If value is empty (no external content) and editor is empty, initialize with a few empty paragraphs
    if (!value) {
      try {
        const text = editor.getText?.() ?? '';
        if (text.trim() === '') {
          const emptyContent = Array.from({ length: initialRows }).map(() => '<p><br></p>').join('');
          if (editor.getHTML() !== emptyContent) {
            (editor.commands as any).setContent(emptyContent, { preserveWhitespace: false });
          }
        }
      } catch {
        // ignore
      }
    }
  }, [value, editor]);

  // selection tooltip state
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const onSelectionChange = () => {
      try {
        const sel = globalThis.getSelection();
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
          setTooltipVisible(false);
          return;
        }
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) {
          setTooltipVisible(false);
          return;
        }
        const container = editorContainerRef.current;
        if (!container) return;
        // ensure selection is inside the editor
        if (!container.contains(range.startContainer)) { setTooltipVisible(false); return; }
        const containerRect = container.getBoundingClientRect();
        const top = rect.top - containerRect.top - 44; // above selection
        const left = rect.left - containerRect.left + rect.width / 2;
        setTooltipPos({ top: Math.max(top, 8), left });
        setTooltipVisible(true);
      } catch {
        setTooltipVisible(false);
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () => document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  if (!editor) return null;

  // simple counts (avoid conditional hooks)
  const text = editor ? editor.getText() : '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
    marginBottom: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderRadius: 6,
    border: '1px solid rgba(0,0,0,0.08)',
    background: 'white',
    cursor: 'pointer',
  };

  const activeStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.06)',
  };

  // helper for link insertion
  const promptForLink = () => {
    const url = globalThis.prompt('Enter a URL to link to (include http/https):', 'https://');
    if (!url) return;
    try {
      // basic validation
      // allow relative links too
      editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
    } catch (e) {
      // log and bail
      // eslint-disable-next-line no-console
      console.error('Failed to insert link', e);
      return;
    }
  };

  const clearFormatting = () => editor.chain().focus().clearNodes().unsetAllMarks().run();

  // Fallback: apply alignment by setting style.textAlign on block-level elements within the selection
  const applyAlignmentFallback = (align: 'left' | 'center' | 'right' | 'justify') => {
    try {
      const sel = globalThis.getSelection();
      if (!sel || sel.rangeCount === 0) return;
  const root = document.querySelector('.gjp-tiptap-editor');
      if (!root) return;

      const selector = 'p,h1,h2,h3,h4,h5,h6,li,div,pre';
      // Simple fallback: set alignment on nearest block ancestor of the selection anchor
      const anchor = sel.anchorNode;
      let el: HTMLElement | null = null;
      if (anchor) el = anchor.nodeType === 3 ? anchor.parentElement : (anchor as HTMLElement | null);
      while (el && !selector.split(',').includes(el.tagName.toLowerCase())) el = el.parentElement;
      if (el) el.style.textAlign = align;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('applyAlignmentFallback failed', err);
    }
  };

  return (
    <div>
      <div style={toolbarStyle}>
        <select
          aria-label="Heading"
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: Number(v) as any }).run();
          }}
          defaultValue="p"
          style={{ padding: 6, borderRadius: 6 }}
        >
          <option value="p">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
        </select>

        <button
          type="button"
          title="Bold (Ctrl/Cmd+B)"
          aria-label="Bold"
          style={{ ...buttonStyle, ...(editor.isActive('bold') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          title="Italic (Ctrl/Cmd+I)"
          aria-label="Italic"
          style={{ ...buttonStyle, ...(editor.isActive('italic') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          title="Underline"
          aria-label="Underline"
          style={{ ...buttonStyle, ...(editor.isActive('underline') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <button
          type="button"
          title="Code block"
          aria-label="Code block"
          style={{ ...buttonStyle, ...(editor.isActive('codeBlock') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >code</button>

        <button
          type="button"
          title="Insert image (set size)"
          aria-label="Insert image"
          style={buttonStyle}
          onClick={() => {
            const url = globalThis.prompt('Image URL (include http/https):', 'https://');
            if (!url) return;
            const width = globalThis.prompt('Width (e.g. 400 or 50%, leave empty for auto):', '');
            const height = globalThis.prompt('Height (e.g. 300 or 50%, leave empty for auto):', '');
            const alt = globalThis.prompt('Alt text (optional):', '');
            const attrs: any = { src: url };
            if (width && width.toString().trim()) attrs.width = width.toString().trim();
            if (height && height.toString().trim()) attrs.height = height.toString().trim();
            if (alt && alt.toString().trim()) attrs.alt = alt.toString().trim();
            try {
              editor.chain().focus().setImage(attrs as any).run();
            } catch (e) {
              // fallback to basic insertion if setImage with attrs fails
              // eslint-disable-next-line no-console
              console.error('setImage failed with attrs, falling back', e);
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
        >🖼</button>

        <button
          type="button"
          title="Insert table"
          aria-label="Insert table"
          style={buttonStyle}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >▦</button>

        <button
          type="button"
          title="Toggle task list"
          aria-label="Toggle task list"
          style={{ ...buttonStyle, ...(editor.isActive('taskList') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >☑</button>

        <button
          type="button"
          title="Blockquote"
          aria-label="Blockquote"
          style={{ ...buttonStyle, ...(editor.isActive('blockquote') ? activeStyle : {}) }}
          onClick={() => {
            try {
              const sel = globalThis.getSelection();
              if (sel && !sel.isCollapsed) sel.collapse(sel.anchorNode, sel.anchorOffset);
              editor.chain().focus().toggleBlockquote().run();
            } catch (e) {
              // log the original error then attempt fallback
              // eslint-disable-next-line no-console
              console.error('toggleBlockquote failed', e);
              // fallback: wrap nearest block ancestor in a blockquote element
              const sel = globalThis.getSelection();
              const anchor = sel?.anchorNode;
              const el = anchor && (anchor.nodeType === 3 ? anchor.parentElement : (anchor as HTMLElement | null));
              const block = el?.closest('p,h1,h2,h3,div') as HTMLElement | null;
              if (block) {
                const wrapper = document.createElement('blockquote');
                wrapper.innerHTML = block.innerHTML;
                block.parentElement?.replaceChild(wrapper, block);
              } else {
                // eslint-disable-next-line no-console
                console.error('blockquote fallback: no block found');
              }
            }
          }}
        >❝</button>

        {/* Alignment buttons */}
        <button
          type="button"
          title="Align left"
          aria-label="Align left"
          style={{ ...buttonStyle }}
          onClick={() => {
            try {
              const sel = globalThis.getSelection();
              if (sel && !sel.isCollapsed) sel.collapse(sel.anchorNode, sel.anchorOffset);
              (editor as any).chain().focus().setTextAlign('left').run();
            } catch {
              applyAlignmentFallback('left');
            }
          }}
        >⟵</button>
        <button
          type="button"
          title="Align center"
          aria-label="Align center"
          style={{ ...buttonStyle }}
          onClick={() => {
            try {
              const sel = globalThis.getSelection();
              if (sel && !sel.isCollapsed) sel.collapse(sel.anchorNode, sel.anchorOffset);
              (editor as any).chain().focus().setTextAlign('center').run();
            } catch {
              applyAlignmentFallback('center');
            }
          }}
        >↔</button>
        <button
          type="button"
          title="Align right"
          aria-label="Align right"
          style={{ ...buttonStyle }}
          onClick={() => {
            try {
              const sel = globalThis.getSelection();
              if (sel && !sel.isCollapsed) sel.collapse(sel.anchorNode, sel.anchorOffset);
              (editor as any).chain().focus().setTextAlign('right').run();
            } catch {
              applyAlignmentFallback('right');
            }
          }}
        >⟶</button>

        <button
          type="button"
          title="Bullet list"
          aria-label="Bullet list"
          style={{ ...buttonStyle, ...(editor.isActive('bulletList') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >• List</button>

        <button
          type="button"
          title="Ordered list"
          aria-label="Ordered list"
          style={{ ...buttonStyle, ...(editor.isActive('orderedList') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >1. List</button>

        <button
          type="button"
          title="Horizontal rule"
          aria-label="Horizontal rule"
          style={buttonStyle}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >—</button>

        <button
          type="button"
          title="Insert link"
          aria-label="Insert link"
          style={buttonStyle}
          onClick={promptForLink}
        >🔗</button>

        <button
          type="button"
          title="Remove link"
          aria-label="Remove link"
          style={buttonStyle}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >⤫</button>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" title="Undo" style={buttonStyle} onClick={() => editor.chain().focus().undo().run()}>↺</button>
          <button type="button" title="Redo" style={buttonStyle} onClick={() => editor.chain().focus().redo().run()}>↻</button>
          <button type="button" title="Clear formatting" style={buttonStyle} onClick={clearFormatting}>✖</button>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', marginLeft: 8 }}>
          {words} words • {chars} chars
        </div>
      </div>

  <div ref={editorContainerRef} style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: 8, minHeight: 140, position: 'relative' }}>
        {/* scoped styles: light code block theme with line numbers + improved copy UI */}
        <style>{`
          .gjp-tiptap-editor pre {
            position: relative;
            background: #f5f5f5; /* light gray */
            border: 1px solid #dddddd;
            border-radius: 8px;
            overflow: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre;
            color: #0f172a;
            padding: 0; /* inner padding moved to content area */
            box-shadow: 0 1px 0 rgba(0,0,0,0.02);
            padding: 8px;
          }

          /* wrapper holds the gutter (line numbers) and code content */
          .gjp-code-wrap {
            display: grid;
            grid-template-columns: auto 1fr;
            width: 100%;
          }
          .gjp-code-gutter {
            background: #efefef;
            padding: 12px 10px;
            text-align: right;
            user-select: none;
            color: #6b7280; /* muted */
            font-size: 12px;
            border-right: 1px solid #e0e0e0;
            line-height: 1.6;
          }
          .gjp-code-gutter div { padding: 0 6px; }

          .gjp-code-content {
            padding: 12px 16px;
            overflow: auto;
            white-space: pre;
            color: #0f172a;
          }

          .gjp-tiptap-editor code {
            background: transparent;
            padding: 0;
            border-radius: 4px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 13px;
            color: inherit;
          }

          /* copy button sits above the pre content */
          .gjp-code-copy-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background: white;
            border: 1px solid #d1d5db;
            color: #0f172a;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 1px 2px rgba(16,24,40,0.06);
            transition: transform .12s ease, background .12s ease;
          }
          .gjp-code-copy-btn:hover { transform: translateY(-1px); background: #fafafa; }
          .gjp-code-copy-btn.copied { background: #16a34a; color: white; border-color: rgba(0,0,0,0.06); }

          .gjp-code-lang {
            position: absolute;
            top: 8px;
            left: 8px;
            background: #f3f4f6; /* subtle chip */
            color: #374151;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            text-transform: lowercase;
            letter-spacing: .2px;
            border: 1px solid #e6e6e6;
          }

          .gjp-tiptap-editor blockquote {
            position: relative;
            margin: 0 0 14px 0;
            padding: 14px 18px;
            border-left: 4px solid rgba(99,102,241,0.85);
            background: rgba(99,102,241,0.06);
            color: #0f172a;
            font-style: normal;
            border-radius: 8px;
            font-size: 15px;
            line-height: 1.6;
          }
          .gjp-tiptap-editor blockquote p { margin: 0; }
          .gjp-tiptap-editor blockquote::before {
            content: '“';
            position: absolute;
            left: 8px;
            top: 6px;
            font-size: 28px;
            color: rgba(99,102,241,0.85);
            line-height: 1;
            font-weight: 600;
            transform: translateY(-2px);
            opacity: 0.95;
          }
          .gjp-blockquote-fallback { border-left-color: #2563eb; background: rgba(37,99,235,0.06); }
        `}</style>

        <style>{`
          .gjp-bubble-menu { background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 12px rgba(16,24,40,0.08); }
          .gjp-bubble-menu button { margin: 0; }
        `}</style>

        {/* Editor content */}
        <EditorContent
          editor={editor}
          className="gjp-tiptap-editor"
          style={{
            lineHeight: lineHeight,
            minHeight: 120,
          }}
        />

        {/* Custom selection tooltip (appears above selection) */}
        {tooltipVisible && (
          <div
            className="gjp-bubble-menu"
            style={{
              position: 'absolute',
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translateX(-50%)',
              zIndex: 9999,
            }}
          >
            <div style={{ display: 'flex', gap: 8, padding: 8, alignItems: 'center' }}>
              <button
                type="button"
                aria-label="Bold"
                style={{ ...buttonStyle, ...(editor.isActive('bold') ? activeStyle : {}) }}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >B</button>
              <button
                type="button"
                aria-label="Italic"
                style={{ ...buttonStyle, ...(editor.isActive('italic') ? activeStyle : {}) }}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              ><em>I</em></button>
              <button
                type="button"
                aria-label="Code"
                style={{ ...buttonStyle, ...(editor.isActive('code') ? activeStyle : {}) }}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >code</button>
              <button
                type="button"
                aria-label="Link"
                style={buttonStyle}
                onClick={() => promptForLink()}
              >🔗</button>
              <button
                type="button"
                aria-label="Unlink"
                style={buttonStyle}
                onClick={() => editor.chain().focus().unsetLink().run()}
              >⤫</button>
            </div>
          </div>
        )}

      {/* add copy buttons and line-number gutters to code blocks */}
      <script>{`(function(){
        const attachButtons = (root = document) => {
          const pres = (root instanceof Element ? root : document).querySelectorAll('.gjp-tiptap-editor pre');
          pres.forEach(pre => {
            if ((pre as HTMLElement).dataset.gjpProcessed) return;

            const codeEl = pre.querySelector('code');

            // create wrapper (gutter + content)
            const wrap = document.createElement('div');
            wrap.className = 'gjp-code-wrap';

            const gutter = document.createElement('div');
            gutter.className = 'gjp-code-gutter';

            const content = document.createElement('div');
            content.className = 'gjp-code-content';

            if (codeEl) {
              // compute line count and populate gutter
              const lines = codeEl.innerText.split('\n');
              lines.forEach((_, i) => {
                const ln = document.createElement('div');
                ln.textContent = String(i + 1);
                gutter.appendChild(ln);
              });

              // move code element into content
              content.appendChild(codeEl);
            } else {
              // fallback: use textContent
              const text = pre.innerText || '';
              const lines = text.split('\n');
              lines.forEach((_, i) => {
                const ln = document.createElement('div');
                ln.textContent = String(i + 1);
                gutter.appendChild(ln);
              });
              const c = document.createElement('code');
              c.textContent = text;
              content.appendChild(c);
            }

            // clear pre and assemble
            pre.innerHTML = '';
            wrap.appendChild(gutter);
            wrap.appendChild(content);
            pre.appendChild(wrap);

            // copy button
            const btn = document.createElement('button');
            btn.className = 'gjp-code-copy-btn';
            btn.type = 'button';
            btn.setAttribute('aria-label', 'Copy code');
            btn.textContent = 'Copy';
            btn.addEventListener('click', async (e) => {
              e.stopPropagation();
              const codeText = (content.querySelector('code') || content).innerText;
              try {
                await navigator.clipboard.writeText(codeText);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
              } catch (err) {
                try {
                  const range = document.createRange();
                  range.selectNodeContents(content);
                  const sel = globalThis.getSelection();
                  sel?.removeAllRanges();
                  sel?.addRange(range);
                  document.execCommand('copy');
                  sel?.removeAllRanges();
                  btn.textContent = 'Copied!';
                  btn.classList.add('copied');
                  setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1500);
                } catch (e) {
                  // eslint-disable-next-line no-console
                  console.error('copy failed', e);
                }
              }
            });

            // language label (if present on code element, e.g., <code class="language-js">)
            if (codeEl) {
              const langMatch = Array.from(codeEl.classList).find(c => c.startsWith('language-'));
              if (langMatch) {
                const label = document.createElement('div');
                label.className = 'gjp-code-lang';
                label.textContent = langMatch.replace('language-', '');
                pre.appendChild(label);
              }
            }

            pre.style.position = pre.style.position || 'relative';
            pre.appendChild(btn);

            // mark processed
            (pre as HTMLElement).dataset.gjpProcessed = '1';
          });
        };

        // initial attach
        attachButtons(document);

        // observe for dynamic content changes inside tiptap editor
        const editorRoot = document.querySelector('.gjp-tiptap-editor');
        if (editorRoot) {
          const mo = new MutationObserver((mutations) => {
            mutations.forEach(m => {
              if (m.addedNodes && m.addedNodes.length) {
                m.addedNodes.forEach(node => attachButtons(node));
              }
            });
          });
          mo.observe(editorRoot, { childList: true, subtree: true });
        }
      })();`}</script>
    </div>
  </div>
  );
}
