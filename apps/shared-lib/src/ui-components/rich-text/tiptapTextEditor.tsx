import { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import DOMPurify from 'dompurify';

interface TiptapTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  lineHeight?: number | string;
}

export default function TiptapTextEditor(props: Readonly<TiptapTextEditorProps>) {
  const { value = '', onChange, placeholder = 'Enter rich text...', lineHeight = 1.4 } = props;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder }),
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
    if (value !== editor.getHTML()) {
      // setContent may accept options; pass as object to satisfy types
      (editor.commands as any).setContent(value, { preserveWhitespace: false });
    }
  }, [value, editor]);

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
        </select>

        <button
          type="button"
          title="Bold (Ctrl/Cmd+B)"
          style={{ ...buttonStyle, ...(editor.isActive('bold') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          title="Italic (Ctrl/Cmd+I)"
          style={{ ...buttonStyle, ...(editor.isActive('italic') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          title="Underline"
          style={{ ...buttonStyle, ...(editor.isActive('underline') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <button
          type="button"
          title="Code block"
          style={{ ...buttonStyle, ...(editor.isActive('codeBlock') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >code</button>

        <button
          type="button"
          title="Blockquote"
          style={{ ...buttonStyle, ...(editor.isActive('blockquote') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >❝</button>

        <button
          type="button"
          title="Bullet list"
          style={{ ...buttonStyle, ...(editor.isActive('bulletList') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >• List</button>

        <button
          type="button"
          title="Ordered list"
          style={{ ...buttonStyle, ...(editor.isActive('orderedList') ? activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >1. List</button>

        <button
          type="button"
          title="Horizontal rule"
          style={buttonStyle}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >—</button>

        <button
          type="button"
          title="Insert link"
          style={buttonStyle}
          onClick={promptForLink}
        >🔗</button>

        <button
          type="button"
          title="Remove link"
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

      <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: 8, minHeight: 140 }}>
        {/* scoped styles to make code blocks look nicer */}
        <style>{`
          .gjp-tiptap-editor pre {
            background: #f6f8fa;
            border: 1px solid #e1e4e8;
            padding: 12px;
            border-radius: 6px;
            overflow: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.5;
            white-space: pre;
            color: #111827;
          }
          .gjp-tiptap-editor code {
            background: #f1f3f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace;
            font-size: 12px;
          }
          .gjp-tiptap-editor pre code { background: transparent; padding: 0; }
          .gjp-tiptap-editor pre::-webkit-scrollbar { height: 8px; }
          .gjp-tiptap-editor pre::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        `}</style>

        <EditorContent
          editor={editor}
          className="gjp-tiptap-editor"
          style={{
            lineHeight: lineHeight,
            minHeight: 120,
          }}
        />
      </div>
    </div>
  );
}
