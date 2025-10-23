import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function UnlinkButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => { if (!editor) return; editor.chain().focus().unsetLink().run(); }, [editor]);
  return <button type="button" title="Remove link" aria-label="Remove link" style={styles.buttonStyle} onClick={onClick}>⤫</button>;
}
