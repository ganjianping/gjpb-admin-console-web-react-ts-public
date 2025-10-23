import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function BlockquoteButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    try {
      editor.chain().focus().toggleBlockquote().run();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('toggleBlockquote error', e);
    }
  }, [editor]);
  const active = !!editor && editor.isActive('blockquote');
  return <button type="button" title="Blockquote" aria-label="Blockquote" style={{ ...styles.buttonStyle, ...(active ? styles.activeStyle : {}) }} onClick={onClick}>❝</button>;
}
