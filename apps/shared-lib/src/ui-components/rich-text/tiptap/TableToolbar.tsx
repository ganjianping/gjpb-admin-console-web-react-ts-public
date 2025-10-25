import type { Editor } from '@tiptap/react';

interface TableToolbarProps {
  editor: Editor | null;
  visible: boolean;
  selToolbarOpen: boolean;
  selToolbarCoords: { left: number; top: number } | null;
  tableToolbarCoords: { left: number; top: number } | null;
}

export default function TableToolbar(props: Readonly<TableToolbarProps>) {
  const { editor, visible, selToolbarOpen, selToolbarCoords, tableToolbarCoords } = props;
  if (!visible || !editor) return null;

  // compute effective coords to avoid overlapping selection toolbar
  const effective = (() => {
    if (!tableToolbarCoords) return tableToolbarCoords;
    try {
      if (selToolbarOpen && selToolbarCoords) {
        const padding = 8;
        const selToolbarHeight = 40;
        const selBottom = selToolbarCoords.top + selToolbarHeight;
        if ((tableToolbarCoords.top ?? 0) < selBottom + padding) {
          return { left: tableToolbarCoords.left, top: selBottom + padding };
        }
      }
    } catch {
      // ignore
    }
    return tableToolbarCoords;
  })();

  return (
    <div
      className="gjp-table-toolbar"
      style={{ position: 'absolute', left: effective?.left ?? 8, top: effective?.top ?? 8, zIndex: 85 }}
      role="toolbar"
      aria-label="Table operations"
    >
      <button type="button" title="Add row above" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addRowBefore().run(); } catch {} }}>
        Row ↑
      </button>
      <button type="button" title="Add row below" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addRowAfter().run(); } catch {} }}>
        Row ↓
      </button>
      <button type="button" title="Delete row" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().deleteRow().run(); } catch {} }}>
        Del row
      </button>
      <span className="gjp-table-toolbar-sep" />
      <button type="button" title="Add column left" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addColumnBefore().run(); } catch {} }}>
        Col ←
      </button>
      <button type="button" title="Add column right" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addColumnAfter().run(); } catch {} }}>
        Col →
      </button>
      <button type="button" title="Delete column" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().deleteColumn().run(); } catch {} }}>
        Del col
      </button>
      <span className="gjp-table-toolbar-sep" />
      <button type="button" title="Delete table" onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().deleteTable().run(); } catch {} }}>
        Del table
      </button>
    </div>
  );
}
