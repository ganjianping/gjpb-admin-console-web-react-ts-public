import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function UnderlineButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);
  const active = !!editor && editor.isActive('underline');
  return (
    <button type="button" title="Underline" aria-label="Underline" style={{ ...styles.buttonStyle, ...(active ? styles.activeStyle : {}) }} onClick={onClick}>U</button>
  );
}
