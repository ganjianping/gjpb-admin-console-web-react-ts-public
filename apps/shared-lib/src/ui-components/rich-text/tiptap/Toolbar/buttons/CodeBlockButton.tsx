import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function CodeBlockButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleCodeBlock().run();
  }, [editor]);
  const active = !!editor && editor.isActive('codeBlock');
  return <button type="button" title="Code block" aria-label="Code block" style={{ ...styles.buttonStyle, ...(active ? styles.activeStyle : {}) }} onClick={onClick}>code</button>;
}

