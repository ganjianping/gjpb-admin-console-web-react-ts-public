import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function AlignButtons({ editor }: Readonly<{ editor: Editor | null }>) {
  const left = useCallback(() => { if (!editor) return; try { editor.chain().focus().setTextAlign('left').run(); } catch { /* fallback handled elsewhere */ } }, [editor]);
  const center = useCallback(() => { if (!editor) return; try { editor.chain().focus().setTextAlign('center').run(); } catch { } }, [editor]);
  const right = useCallback(() => { if (!editor) return; try { editor.chain().focus().setTextAlign('right').run(); } catch { } }, [editor]);
  return (
    <>
      <button type="button" title="Align left" aria-label="Align left" style={styles.buttonStyle} onClick={left}>⟵</button>
      <button type="button" title="Align center" aria-label="Align center" style={styles.buttonStyle} onClick={center}>↔</button>
      <button type="button" title="Align right" aria-label="Align right" style={styles.buttonStyle} onClick={right}>⟶</button>
    </>
  );
}
