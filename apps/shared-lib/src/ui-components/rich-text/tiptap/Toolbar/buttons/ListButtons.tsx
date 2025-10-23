import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function ListButtons({ editor }: Readonly<{ editor: Editor | null }>) {
  const bullet = useCallback(() => { if (!editor) return; editor.chain().focus().toggleBulletList().run(); }, [editor]);
  const ordered = useCallback(() => { if (!editor) return; editor.chain().focus().toggleOrderedList().run(); }, [editor]);
  return (
    <>
      <button type="button" title="Bullet list" aria-label="Bullet list" style={{ ...styles.buttonStyle, ...(editor?.isActive('bulletList') ? styles.activeStyle : {}) }} onClick={bullet}>• List</button>
      <button type="button" title="Ordered list" aria-label="Ordered list" style={{ ...styles.buttonStyle, ...(editor?.isActive('orderedList') ? styles.activeStyle : {}) }} onClick={ordered}>1. List</button>
    </>
  );
}
