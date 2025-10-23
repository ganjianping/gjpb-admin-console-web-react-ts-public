import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function TableButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);
  return <button type="button" title="Insert table" aria-label="Insert table" style={styles.buttonStyle} onClick={onClick}>▦</button>;
}
