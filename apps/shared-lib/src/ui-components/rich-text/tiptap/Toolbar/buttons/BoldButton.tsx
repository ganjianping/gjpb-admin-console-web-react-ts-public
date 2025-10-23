import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function BoldButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const active = !!editor && editor.isActive('bold');

  return (
    <button
      type="button"
      title="Bold (Ctrl/Cmd+B)"
      aria-label="Bold"
      style={{ ...styles.buttonStyle, ...(active ? styles.activeStyle : {}) }}
      onClick={onClick}
    >
      <strong>B</strong>
    </button>
  );
}
