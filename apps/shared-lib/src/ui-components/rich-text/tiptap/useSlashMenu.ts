import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { defaultMenuItems, type MenuItem } from './menuItems';
import { coordsAtPosSafe, deleteRange, insertTableFallback, safeChainFocus } from './utils/editorUtils';

type UseSlashMenuReturn = {
  slashOpen: boolean;
  menuCoords: { left: number; top: number } | null;
  menuItems: MenuItem[];
  filteredItems: Array<{ id: string; label: string; parentId?: string; item: MenuItem }>;
  selectedIndex: number;
  openSubmenu: string | null;
  setOpenSubmenu: (s: string | null) => void;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  openSlashMenuAt: (pos: number) => void;
  closeSlashMenu: () => void;
  handleMenuAction: (id: string) => void;
  handleKeyDown: (e: KeyboardEvent | any) => boolean;
};

export default function useSlashMenu(editor: Editor | null, containerRef: React.RefObject<any> | null, menuItemsIn: MenuItem[] = defaultMenuItems): UseSlashMenuReturn {
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState<number | null>(null);
  const [slashQuery, setSlashQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuCoords, setMenuCoords] = useState<{ left: number; top: number } | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const menuItems = menuItemsIn;
  // Build a flattened list that keeps track of parent group id for child items.
  // Each entry: { id, label, parentId?: string, item }
  type FlatItem = { id: string; label: string; parentId?: string; item: MenuItem };
  const flattenedActionItems: FlatItem[] = menuItems.flatMap((it) => {
    if (it.children && Array.isArray(it.children)) {
      return (it.children as MenuItem[]).map((ch) => ({ id: ch.id, label: ch.label, parentId: it.id, item: ch }));
    }
    return [{ id: it.id, label: it.label, parentId: undefined, item: it } as FlatItem];
  });
  const filteredItems: FlatItem[] = flattenedActionItems.filter((it) => it.label.toLowerCase().includes(slashQuery.trim().toLowerCase()));

  useEffect(() => { setSelectedIndex(0); }, [slashQuery, slashOpen]);

  const openSlashMenuAt = (pos: number) => {
    setSlashPos(pos);
    setSlashOpen(true);
    const coords = coordsAtPosSafe(editor as any, pos, containerRef);
    setMenuCoords(coords);
  };

  const closeSlashMenu = () => {
    setSlashOpen(false);
    setSlashPos(null);
    setSlashQuery('');
    setMenuCoords(null);
    setOpenSubmenu(null);
  };

  const applyAndClose = (action: () => void) => {
    try { action(); } catch { /* ignore */ }
    closeSlashMenu();
    try { safeChainFocus(editor)?.run?.(); } catch { /* ignore */ }
  };

  const handleMenuAction = (id: string) => {
    switch (id) {
      case 'heading-1':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setNode('heading', { level: 1 }).run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'heading-2':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setNode('heading', { level: 2 }).run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'heading-3':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setNode('heading', { level: 3 }).run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-left':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setTextAlign('left').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-center':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setTextAlign('center').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-right':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setTextAlign('right').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-justify':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setTextAlign('justify').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'bulleted':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().toggleBulletList().run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'numbered':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().toggleOrderedList().run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'quote':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().toggleBlockquote().run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'code':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
            try { editor?.chain().focus().setNode('codeBlock').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'image':
        // image handling is expected to be triggered by UI in the host component
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
          }
        });
        break;
      case 'table':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
          }
          insertTableFallback(editor, 3, 3, true);
        });
        break;
      case 'link':
        applyAndClose(() => {
          if (slashPos != null) {
            const selTo = editor!.state.selection.from;
            deleteRange(editor, slashPos - 1, selTo);
          }
        });
        break;
      default:
        closeSlashMenu();
    }
  };

  useEffect(() => {
    if (!editor) return;
    const onUpdateQuery = () => {
      if (slashPos == null) return;
      try {
        const selTo = editor.state.selection.from;
        const raw = editor.state.doc.textBetween(slashPos, selTo, '\n', '');
        setSlashQuery(raw || '');
        const coords = coordsAtPosSafe(editor as any, selTo, containerRef);
        setMenuCoords(coords);
      } catch {
        setSlashQuery('');
      }
    };
    editor.on('update', onUpdateQuery);
    return () => { try { editor.off('update', onUpdateQuery); } catch { /* ignore */ } };
  }, [editor, slashPos]);

  const handleKeyDown = (e: KeyboardEvent | any) => {
    if (!slashOpen) return false;
    if (e.key === 'ArrowDown') {
      e.preventDefault?.();
      setSelectedIndex((i) => Math.min(i + 1, Math.max(0, filteredItems.length - 1)));
      return true;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault?.();
      setSelectedIndex((i) => Math.max(0, i - 1));
      return true;
    }
    if (e.key === 'ArrowRight') {
      // Open the parent submenu if current selection belongs to a group
      e.preventDefault?.();
      const itm = filteredItems[selectedIndex] || filteredItems[0];
      if (itm && itm.parentId) {
        setOpenSubmenu(itm.parentId);
      }
      return true;
    }
    if (e.key === 'ArrowLeft') {
      // Close any open submenu
      e.preventDefault?.();
      if (openSubmenu) setOpenSubmenu(null);
      return true;
    }
    if (e.key === 'Enter') {
      e.preventDefault?.();
      const itm = filteredItems[selectedIndex] || filteredItems[0];
      if (itm) handleMenuAction(itm.id);
      return true;
    }
    if (e.key === 'Escape') {
      closeSlashMenu();
      return true;
    }
    return false;
  };

  return {
    slashOpen,
    menuCoords,
    menuItems,
    filteredItems,
    selectedIndex,
    openSubmenu,
    setOpenSubmenu,
    setSelectedIndex,
    openSlashMenuAt,
    closeSlashMenu,
    handleMenuAction,
    handleKeyDown,
  };
}
