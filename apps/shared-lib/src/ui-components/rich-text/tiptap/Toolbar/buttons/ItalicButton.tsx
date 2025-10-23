import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function ItalicButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleItalic().run();
  }, [editor]);
  const active = !!editor && editor.isActive('italic');
  return (
    <button
      type="button"
      title="Italic (Ctrl/Cmd+I)"
      aria-label="Italic"
      style={{ ...styles.buttonStyle, ...(active ? styles.activeStyle : {}) }}
      onClick={onClick}
    ><em>I</em></button>
  );
}
