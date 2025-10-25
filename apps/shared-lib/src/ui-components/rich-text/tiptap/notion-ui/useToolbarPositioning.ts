import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';

export default function useToolbarPositioning(editor: Editor | null, containerRef: React.RefObject<any> | null) {
  const [selToolbarOpen, setSelToolbarOpen] = useState(false);
  const [selToolbarCoords, setSelToolbarCoords] = useState<{ left: number; top: number } | null>(null);
  const [showTableToolbar, setShowTableToolbar] = useState(false);
  const [tableToolbarCoords, setTableToolbarCoords] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!editor) return;

    const onSelection = () => {
      try {
        const sel = editor.state.selection;
        const empty = sel.empty;
        if (!empty && sel.from !== sel.to) {
          setSelToolbarOpen(true);
          try {
            const view = (editor as any).view;
            if (view && containerRef?.current) {
              const start = view.coordsAtPos(sel.from);
              const end = view.coordsAtPos(sel.to);
              const containerRect = containerRef.current.getBoundingClientRect();
              const left = ((start.left + end.right) / 2) - containerRect.left;
              const top = Math.min(start.top, end.top) - containerRect.top - 42; // place above selection
              setSelToolbarCoords({ left, top });
            }
          } catch {
            setSelToolbarCoords(null);
          }
        } else {
          setSelToolbarOpen(false);
          setSelToolbarCoords(null);
        }
      } catch {
        setSelToolbarOpen(false);
        setSelToolbarCoords(null);
      }
    };

    const onTableCheck = () => {
      try {
        const sel = editor.state.selection;
        const view = (editor as any).view;
        if (!view || !containerRef?.current) {
          setShowTableToolbar(false);
          setTableToolbarCoords(null);
          return;
        }

        if ((editor as any)?.isActive?.('table')) {
          setShowTableToolbar(true);
          try {
            const pos = sel.from;
            const coords = view.coordsAtPos(pos);
            const containerRect = containerRef.current.getBoundingClientRect();
            const left = Math.max(8, coords.left - containerRect.left - 120);
            const top = coords.top - containerRect.top - 44;
            setTableToolbarCoords({ left, top });
          } catch {
            setTableToolbarCoords(null);
          }
        } else {
          setShowTableToolbar(false);
          setTableToolbarCoords(null);
        }
      } catch {
        setShowTableToolbar(false);
        setTableToolbarCoords(null);
      }
    };

    editor.on('selectionUpdate', onSelection);
    editor.on('selectionUpdate', onTableCheck);
    return () => {
      try {
        editor.off('selectionUpdate', onSelection);
        editor.off('selectionUpdate', onTableCheck);
      } catch {
        /* ignore */
      }
    };
  }, [editor, containerRef]);

  return { selToolbarOpen, selToolbarCoords, showTableToolbar, tableToolbarCoords };
}
