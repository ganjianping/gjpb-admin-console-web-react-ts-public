import { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface TiptapTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export default function TiptapTextEditor({ value = '', onChange, placeholder = 'Enter rich text...' }: TiptapTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange?.(editor.getHTML());
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

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()}>&lt;/&gt;</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        <div style={{ flex: 1 }} />
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>↺</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>↻</button>
      </div>
      <div style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: 8 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
