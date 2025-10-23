import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function LinkButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    // open a modal via a custom event so parent can handle showing the link dialog
    const ev = new CustomEvent('gjp-open-link-dialog', { detail: { selectedText: (globalThis.getSelection()?.toString() || '') } });
  globalThis.dispatchEvent(ev as unknown as Event);
  }, [editor]);

  return (
    <button
      type="button"
      title="Insert link"
      aria-label="Insert link"
      style={styles.buttonStyle}
      onClick={onClick}
    >🔗</button>
  );
}
