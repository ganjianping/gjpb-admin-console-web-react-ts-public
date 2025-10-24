import { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import DOMPurify from 'dompurify';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Mention from '@tiptap/extension-mention';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
// styles are provided to buttons and dialogs via direct imports in those components
// FloatingMenu from @tiptap/react isn't available in this build; render our own absolute menu
import ImageDialog from './tiptap/Dialogs/ImageDialog';
import LinkDialog from './tiptap/Dialogs/LinkDialog.tsx';
import { initCodeEnhancer } from './tiptap/utils/codeEnhancer';
import './tiptap/editor.css';

// create a lowlight instance and register a few common languages (keep bundle minimal)
const lowlight = createLowlight();
lowlight.register({ javascript: js as any, typescript: ts as any, css: css as any });

// Small SVG icon components moved out of the main component for accessibility/lint
const HeadingIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5"/><path d="M20 12v7"/><path d="M20 5v4"/><path d="M10 12h8"/></svg>
);
const AlignmentIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 10h18"/><path d="M3 14h18"/><path d="M3 18h18"/></svg>
);
const BulletedIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="1"/><circle cx="6" cy="12" r="1"/><circle cx="6" cy="18" r="1"/><path d="M10 6h8M10 12h8M10 18h8"/></svg>
);
const NumberedIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6h8M10 12h8M10 18h8"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>
);
const QuoteIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 14.5V21H3v-6.5"/><path d="M7 10V3h6v7"/></svg>
);
const CodeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);
const ImageIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
);
const TableIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>
);
const LinkIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07l-1.41 1.41"/><path d="M14 10a5 5 0 0 0-7.07 0L5.52 11.41a5 5 0 0 0 7.07 7.07L14 18"/></svg>
);

interface TiptapTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Number of empty paragraph rows to show when editor is initially empty */
  initialRows?: number;
  lineHeight?: number | string;
}

export default function TiptapTextEditor(props: Readonly<TiptapTextEditorProps>) {
  const { value = '', onChange, placeholder = 'Enter rich text...', lineHeight = 1.4, initialRows = 3 } = props;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
  // enable alignment for headings, paragraphs, list items and blockquotes
  TextAlign.configure({ types: ['heading', 'paragraph', 'listItem', 'blockquote'] }),
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder }),
      // UX improvements & extra nodes
      Dropcursor.configure({ color: '#94a3b8' }),
      Gapcursor,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Mention,
      TextStyle,
      Color,
      Highlight,
      Superscript,
      Subscript,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value,
    onUpdate: ({ editor }: { editor: Editor }) => {
      // sanitize HTML before sending out
      const dirty = editor.getHTML();
      const clean = DOMPurify.sanitize(dirty);
      onChange?.(clean);
    },
  });

  useEffect(() => {
    if (!editor) return;
    // If external value is non-empty, sync it
    if (value && value !== editor.getHTML()) {
      (editor.commands as any).setContent(value, { preserveWhitespace: false });
      return;
    }

    // If value is empty (no external content) and editor is empty, initialize with a few empty paragraphs
    if (!value) {
      try {
        const text = editor.getText?.() ?? '';
        if (text.trim() === '') {
          const emptyContent = Array.from({ length: initialRows }).map(() => '<p><br></p>').join('');
          if (editor.getHTML() !== emptyContent) {
            (editor.commands as any).setContent(emptyContent, { preserveWhitespace: false });
          }
        }
      } catch {
        // ignore
      }
    }
  }, [value, editor]);

  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  // image insertion modal state
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageForm, setImageForm] = useState({ url: '', width: '', height: '', alt: '' });
  const imageOverlayRef = useRef<HTMLDialogElement | null>(null);
  const [imageSelection, setImageSelection] = useState<{ from: number; to: number } | null>(null);
  // link insertion modal state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ url: '', text: '' });
  const linkOverlayRef = useRef<HTMLDialogElement | null>(null);
  const [linkSelection, setLinkSelection] = useState<{ from: number; to: number } | null>(null);

  // Notion-like slash command menu state
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashPos, setSlashPos] = useState<number | null>(null);
  const [slashQuery, setSlashQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuCoords, setMenuCoords] = useState<{ left: number; top: number } | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  // selection toolbar (bold/italic/underline) state
  const [selToolbarOpen, setSelToolbarOpen] = useState(false);
  const [selToolbarCoords, setSelToolbarCoords] = useState<{ left: number; top: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  // table toolbar state (visible when cursor is inside a table)
  const [showTableToolbar, setShowTableToolbar] = useState(false);
  const [tableToolbarCoords, setTableToolbarCoords] = useState<{ left: number; top: number } | null>(null);

  // focus the overlay so Escape key can be handled
  useEffect(() => {
    const el = imageOverlayRef.current;
    if (!el) return;
    const otherOpen = document.querySelector('dialog[open]');
    if (imageDialogOpen) {
      // Only focus the overlay if there's no other native dialog open or it's this one
      if (!otherOpen || otherOpen === el) {
        try { el.focus(); } catch { /* ignore */ }
      }
    }
  }, [imageDialogOpen]);

  // close modal on Escape via document listener (accessibility-friendly)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setImageDialogOpen(false); };
    if (imageDialogOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [imageDialogOpen]);

  // focus/close handling for link dialog (moved here so hooks run before early return)
  useEffect(() => {
    const el = linkOverlayRef.current;
    if (!el) return;
    const otherOpen = document.querySelector('dialog[open]');
    if (linkDialogOpen) {
      if (!otherOpen || otherOpen === el) {
        try { el.focus(); } catch { /* ignore */ }
      }
    }
  }, [linkDialogOpen]);

  useEffect(() => {
    const onKeyLink = (e: KeyboardEvent) => { if (e.key === 'Escape') setLinkDialogOpen(false); };
    if (linkDialogOpen) document.addEventListener('keydown', onKeyLink);
    return () => document.removeEventListener('keydown', onKeyLink);
  }, [linkDialogOpen]);

  // listen for toolbar LinkButton custom event to open link dialog
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ev = e as CustomEvent<{ selectedText?: string }>;
        const selected = ev?.detail?.selectedText || '';
        // capture current editor selection before the dialog steals focus
        if (editor) {
          try {
            const s = editor.state.selection;
            setLinkSelection({ from: (s as any).from, to: (s as any).to });
          } catch {
            setLinkSelection(null);
          }
        }
        setLinkForm({ url: 'https://', text: selected });
        setLinkDialogOpen(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('failed to open link dialog from event', err);
      }
    };
    globalThis.addEventListener('gjp-open-link-dialog', handler as EventListener);
    return () => globalThis.removeEventListener('gjp-open-link-dialog', handler as EventListener);
  }, []);

  // selection tooltip removed — BubbleMenu extraction deleted. Keep editorContainerRef for other uses.

  // initialize code enhancer (attach copy buttons, gutters) and cleanup on unmount
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    try {
      cleanup = initCodeEnhancer('.gjp-tiptap-editor');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('initCodeEnhancer failed', err);
    }
    return () => { try { cleanup?.(); } catch { /* ignore */ } };
  }, []);

  // simple counts (avoid conditional hooks) - removed unused variables
  // styles imported from separate file to keep component focused (see ./tiptap/styles.ts)

  // alignment fallback moved to utils/applyAlignmentFallback.ts

  // Notion-like menu helper functions
  const openSlashMenuAt = (pos: number) => {
    setSlashPos(pos);
    setSlashOpen(true);
    // compute menu coords relative to editor container
    try {
      const view = (editor as any).view;
      if (view && editorContainerRef.current) {
        const coords = view.coordsAtPos(pos);
        const containerRect = editorContainerRef.current.getBoundingClientRect();
        setMenuCoords({ left: coords.left - containerRect.left, top: coords.bottom - containerRect.top + 4 });
      } else {
        setMenuCoords(null);
      }
    } catch {
      setMenuCoords(null);
    }
  };

  const closeSlashMenu = () => {
    setSlashOpen(false);
    setSlashPos(null);
    setSlashQuery('');
    setMenuCoords(null);
  };

  const applyAndClose = (action: () => void) => {
    try { action(); } catch { /* ignore */ }
    closeSlashMenu();
    // ensure editor focus
    try { editor.chain().focus().run(); } catch { /* ignore */ }
  };

  // menu items - keep small and extensible. Use children for submenus (headings & alignment)
  const menuItems: Array<any> = [
    {
      id: 'headings',
      label: 'Headings',
      icon: HeadingIcon,
      children: [
        { id: 'heading-1', label: 'Heading 1' },
        { id: 'heading-2', label: 'Heading 2' },
        { id: 'heading-3', label: 'Heading 3' },
      ],
    },
    {
      id: 'alignment',
      label: 'Alignment',
      
      icon: AlignmentIcon,
      children: [
        { id: 'align-left', label: 'Align left' },
        { id: 'align-center', label: 'Align center' },
        { id: 'align-right', label: 'Align right' },
        { id: 'align-justify', label: 'Justify' },
      ],
    },
    { id: 'bulleted', label: 'Bulleted list', icon: BulletedIcon },
    { id: 'numbered', label: 'Numbered list', icon: NumberedIcon },
    { id: 'quote', label: 'Quote', icon: QuoteIcon },
    { id: 'code', label: 'Code block', icon: CodeIcon },
    { id: 'image', label: 'Image', icon: ImageIcon },
    { id: 'table', label: 'Table', icon: TableIcon },
    { id: 'link', label: 'Link', icon: LinkIcon },
  ];

  // compute flattened actionable items and filtered items (used for keyboard navigation)
  const flattenedActionItems = menuItems.flatMap((it) => (it.children ? it.children : it));
  const filteredItems = flattenedActionItems.filter((it: any) => it.label.toLowerCase().includes(slashQuery.trim().toLowerCase()));

  // when query or open state changes, reset selectedIndex
  useEffect(() => { setSelectedIndex(0); }, [slashQuery, slashOpen]);

  // update slashQuery based on editor content between slashPos and current cursor
  useEffect(() => {
    if (!editor) return;
    const onUpdateQuery = () => {
      if (slashPos == null) return;
      try {
        const selTo = editor.state.selection.from;
        const raw = editor.state.doc.textBetween(slashPos, selTo, '\n', '');
        setSlashQuery(raw || '');
        // recompute menu coords so it follows caret while typing
        try {
          const view = (editor as any).view;
          if (view && editorContainerRef.current) {
            const coords = view.coordsAtPos(selTo);
            const containerRect = editorContainerRef.current.getBoundingClientRect();
            setMenuCoords({ left: coords.left - containerRect.left, top: coords.bottom - containerRect.top + 4 });
          }
        } catch {
          // ignore
        }
      } catch {
        setSlashQuery('');
      }
    };
    editor.on('update', onUpdateQuery);
    // also listen for selection changes to show/hide selection toolbar
    const onSelection = () => {
      try {
        const sel = editor.state.selection;
        const empty = sel.empty;
        if (!empty && sel.from !== sel.to) {
          setSelToolbarOpen(true);
          // compute middle coords of selection
          try {
            const view = (editor as any).view;
            if (view && editorContainerRef.current) {
              const start = view.coordsAtPos(sel.from);
              const end = view.coordsAtPos(sel.to);
              const containerRect = editorContainerRef.current.getBoundingClientRect();
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
    
      // also detect if cursor is inside a table to show table operations toolbar
      const onTableCheck = () => {
        try {
          const sel = editor.state.selection;
          const view = (editor as any).view;
          if (!view || !editorContainerRef.current) {
            setShowTableToolbar(false);
            setTableToolbarCoords(null);
            return;
          }

          // editor.isActive('table') is true when selection is inside a table
          if ((editor as any)?.isActive?.('table')) {
            setShowTableToolbar(true);
            try {
              const pos = sel.from;
              const coords = view.coordsAtPos(pos);
              const containerRect = editorContainerRef.current.getBoundingClientRect();
              // position toolbar to the left of selection and slightly above
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
    return () => { try { editor.off('update', onUpdateQuery); } catch { /* ignore */ } };
  }, [editor, slashPos]);

    // table toolbar state
  // table toolbar state is declared above with other toolbar states

  // handler to perform actions by id
  const handleMenuAction = (id: string) => {
    switch (id) {
      case 'heading-1':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setNode('heading', { level: 1 }).run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'heading-2':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setNode('heading', { level: 2 }).run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'heading-3':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setNode('heading', { level: 3 }).run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-left':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setTextAlign('left').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-center':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setTextAlign('center').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-right':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setTextAlign('right').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'align-justify':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setTextAlign('justify').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'bulleted':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().toggleBulletList().run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'numbered':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().toggleOrderedList().run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'quote':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().toggleBlockquote().run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'code':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
            try { editor.chain().focus().setNode('codeBlock').run(); } catch { /* ignore */ }
          }
        });
        break;
      case 'image':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
          }
          try {
            const s = editor.state.selection;
            setImageSelection({ from: (s as any).from, to: (s as any).to });
          } catch {
            setImageSelection(null);
          }
          setImageForm({ url: '', width: '', height: '', alt: '' });
          setImageDialogOpen(true);
        });
        break;
      case 'table':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
          }
          try {
            // insert a 3x3 table with header row when available
            try { (editor.chain() as any).focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); } catch {
              // some setups use a different API name; attempt insertTable fallback
              try { (editor.chain() as any).focus().insertTable?.({ rows: 3, cols: 3, withHeaderRow: true }).run(); } catch { /* ignore */ }
            }
          } catch {
            // ignore insertion failures
          }
        });
        break;
      case 'link':
        applyAndClose(() => {
          if (slashPos) {
            const selTo = editor.state.selection.from;
            editor.chain().focus().command(({ tr }) => { tr.delete(slashPos - 1, selTo); return true; }).run();
          }
          try {
            const s = editor.state.selection;
            setLinkSelection({ from: (s as any).from, to: (s as any).to });
          } catch {
            setLinkSelection(null);
          }
          setLinkForm({ url: 'https://', text: '' });
          setLinkDialogOpen(true);
        });
        break;
      default:
        closeSlashMenu();
    }
  };

  // compute effective table toolbar coords to avoid overlapping the selection toolbar
  // If the selection toolbar is open and the table toolbar would overlap it, move the table toolbar
  // below the selection toolbar with a small padding.
  const effectiveTableToolbarCoords = (() => {
    if (!tableToolbarCoords) return tableToolbarCoords;
    try {
      // If selection toolbar is visible, prefer placing table toolbar below it to avoid covering
      if (selToolbarOpen && selToolbarCoords) {
        const padding = 8;
        // approximate selection toolbar height; keep a safe vertical gap
        const selToolbarHeight = 40;
        const selBottom = selToolbarCoords.top + selToolbarHeight;
        // if table toolbar would appear above or overlap the selection toolbar, move it below
        if ((tableToolbarCoords.top ?? 0) < selBottom + padding) {
          return { left: tableToolbarCoords.left, top: selBottom + padding };
        }
      }
    } catch {
      // ignore and fall back to original coords
    }
    return tableToolbarCoords;
  })();

  // Remove the original toolbar and use a compact container with floating menu
  return (
    <div>

      <div ref={editorContainerRef} style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: 8, minHeight: 140, position: 'relative' }}>
        {/* styles moved to tiptap/editor.css */}

        {/* Editor content */}
        <EditorContent
          editor={editor}
          className="gjp-tiptap-editor"
          style={{
            lineHeight: lineHeight,
            minHeight: 120,
          }}
          onKeyDown={(e: any) => {
            if (slashOpen) {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, Math.max(0, filteredItems.length - 1)));
                return;
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(0, i - 1));
                return;
              }
              if (e.key === 'Enter') {
                e.preventDefault();
                const itm = filteredItems[selectedIndex] || filteredItems[0];
                if (itm) handleMenuAction(itm.id);
                return;
              }
              if (e.key === 'Escape') {
                closeSlashMenu();
                return;
              }
              // allow other typing to flow through and update query via editor.update
            }

            // detect slash key to open the Notion-like menu
            if (e.key === '/') {
              try {
                const pos = editor.state.selection.from;
                // schedule open on next tick so the slash is in the document
                setTimeout(() => openSlashMenuAt(pos), 0);
              } catch {
                // ignore
              }
            }
          }}
        />

        {/* Notion-like Floating Menu (custom absolute positioned when user types '/') */}
        {slashOpen && (
          <dialog
              className="gjp-floating-menu"
              open
              style={{
                position: 'absolute',
                left: menuCoords?.left ?? 8,
                top: menuCoords?.top ?? 8,
                zIndex: 60,
              }}
              aria-label="Insert menu"
            >
            <div className="gjp-floating-menu__list">
              {/* If there are no matches at the child/actionable level, show empty */}
              {filteredItems.length === 0 && <div className="gjp-floating-menu__empty">No results</div>}

              {menuItems.map((it) => {
                // If item has children render a parent + submenu
                if (it.children && Array.isArray(it.children)) {
                  const children = it.children as Array<any>;
                  const q = slashQuery.trim().toLowerCase();
                  const matchingChildren = q ? children.filter((c) => c.label.toLowerCase().includes(q)) : children;
                  // if no children match and parent doesn't match the query, skip
                  if (matchingChildren.length === 0 && !(it.label.toLowerCase().includes(q))) return null;

                  return (
                    <div
                      key={it.id}
                      className="gjp-floating-menu__group"
                      onMouseEnter={() => setOpenSubmenu(it.id)}
                      onMouseLeave={() => setOpenSubmenu(null)}
                      style={{ position: 'relative' }}
                    >
                      <button
                        type="button"
                        className={`gjp-floating-menu__item ${openSubmenu === it.id ? 'is-open' : ''}`}
                        onClick={() => setOpenSubmenu((s) => (s === it.id ? null : it.id))}
                      >
                        <span className="gjp-floating-menu__icon">
                          {(() => {
                            const IconComp = it.icon as any;
                            return IconComp ? <IconComp size={16} /> : null;
                          })()}
                        </span>
                        <span className="gjp-floating-menu__label">{it.label}</span>
                        <span className="gjp-floating-menu__chev">▸</span>
                      </button>

                      {(openSubmenu === it.id || slashQuery.trim()) && (
                        <div className="gjp-floating-submenu" style={{ position: 'absolute', left: '100%', top: 0, minWidth: 140, zIndex: 65 }}>
                          {matchingChildren.map((ch) => (
                            <button
                              key={ch.id}
                              type="button"
                              className="gjp-floating-menu__item gjp-floating-submenu__item"
                              onClick={() => handleMenuAction(ch.id)}
                            >
                              <span className="gjp-floating-menu__label">{ch.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // simple actionable item (no children)
                const q = slashQuery.trim().toLowerCase();
                if (q && !it.label.toLowerCase().includes(q)) return null;
                return (
                  <button
                    key={it.id}
                    type="button"
                    className={`gjp-floating-menu__item`}
                    onClick={() => handleMenuAction(it.id)}
                  >
                    <span className="gjp-floating-menu__icon">
                      {(() => {
                        const IconComp = it.icon as any;
                        return IconComp ? <IconComp size={16} /> : null;
                      })()}
                    </span>
                    <span className="gjp-floating-menu__label">{it.label}</span>
                  </button>
                );
              })}
            </div>
          </dialog>
        )}

  {/* BubbleMenu removed — selection tooltip disabled */}

        <ImageDialog
          editor={editor}
          open={imageDialogOpen}
          overlayRef={imageOverlayRef}
          form={imageForm}
          setForm={setImageForm}
          selection={imageSelection}
          onClose={() => setImageDialogOpen(false)}
        />

        <LinkDialog
          editor={editor}
          open={linkDialogOpen}
          overlayRef={linkOverlayRef}
          form={linkForm}
          setForm={setLinkForm}
          selection={linkSelection}
          onClose={() => setLinkDialogOpen(false)}
        />

        {/* Selection toolbar (bold/italic/underline + extras) positioned above selection */}
        {selToolbarOpen && (
          <div
            className="gjp-selection-toolbar"
            style={{ position: 'absolute', left: selToolbarCoords?.left ?? 8, top: selToolbarCoords?.top ?? 8, zIndex: 70 }}
            role="toolbar"
            aria-label="Formatting toolbar"
          >
            <button
              type="button"
              title="Bold (Cmd/Ctrl+B)"
              className={editor.isActive('bold') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleBold().run(); } catch { /* ignore */ } }}
            >
              <strong>B</strong>
            </button>

            <button
              type="button"
              title="Italic (Cmd/Ctrl+I)"
              className={editor.isActive('italic') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleItalic().run(); } catch { /* ignore */ } }}
            >
              <em>I</em>
            </button>

            <button
              type="button"
              title="Underline"
              className={editor.isActive('underline') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().toggleUnderline().run(); } catch { /* ignore */ } }}
            >
              <span style={{ textDecoration: 'underline' }}>U</span>
            </button>

            <button
              type="button"
              title="Strike"
              className={editor.isActive('strike') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleStrike().run(); } catch { /* ignore */ } }}
            >
              <span style={{ textDecoration: 'line-through' }}>S</span>
            </button>

            <button
              type="button"
              title="Inline Code"
              className={editor.isActive('code') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { editor.chain().focus().toggleCode().run(); } catch { /* ignore */ } }}
            >
              <code>{'</>'}</code>
            </button>

            {/* Link moved to slash menu */}

            {/* Text color picker */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                title="Text color"
                onMouseDown={(e) => { e.preventDefault(); setShowColorPicker((s) => !s); setShowHighlightPicker(false); }}
              >
                A
              </button>
              {showColorPicker && (
                <div className="gjp-color-palette">
                  {['#000000','#dc2626','#f97316','#f59e0b','#84cc16','#06b6d4','#3b82f6','#8b5cf6','#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="gjp-color-swatch"
                      title={`Set text color ${c}`}
                      aria-label={`Set text color ${c}`}
                      style={{ background: c }}
                      onMouseDown={(ev) => { ev.preventDefault(); try { (editor.chain() as any).focus().setColor(c).run(); } catch { try { editor.chain().focus().setMark('textStyle', { color: c }).run(); } catch {} } setShowColorPicker(false); }}
                    />
                  ))}
                  <button
                    type="button"
                    className="gjp-color-clear"
                    title="Clear text color"
                    aria-label="Clear text color"
                    onMouseDown={(ev) => { ev.preventDefault(); try { (editor.chain() as any).focus().unsetColor().run(); } catch { try { editor.chain().focus().setMark('textStyle', { color: null }).run(); } catch {} } setShowColorPicker(false); }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Highlight color picker (background) */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                title="Highlight color"
                onMouseDown={(e) => { e.preventDefault(); setShowHighlightPicker((s) => !s); setShowColorPicker(false); }}
              >
                ▮
              </button>
              {showHighlightPicker && (
                <div className="gjp-color-palette">
                  {['#fff59d','#fde68a','#fbcfe8','#bbf7d0','#bfdbfe','#efefef'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="gjp-color-swatch"
                      title={`Set highlight color ${c}`}
                      aria-label={`Set highlight color ${c}`}
                      style={{ background: c }}
                      onMouseDown={(ev) => {
                        ev.preventDefault();
                        // Primary: use the official Highlight extension if available
                        try {
                          (editor.chain() as any).focus().toggleHighlight({ color: c }).run();
                          setShowHighlightPicker(false);
                          return;
                        } catch {
                          // fallthrough to mark-based fallbacks below
                        }

                        // Fallbacks: try a few ways to set background via textStyle mark
                        try {
                          (editor.chain() as any).focus().setMark('textStyle', { backgroundColor: c }).run();
                          setShowHighlightPicker(false);
                          return;
                        } catch {
                          /* continue to next fallback */
                        }
                        try {
                          (editor.chain() as any).focus().setMark('textStyle', { background: c }).run();
                          setShowHighlightPicker(false);
                          return;
                        } catch {
                          /* continue */
                        }
                        try {
                          (editor.chain() as any).focus().setMark('textStyle', { style: `background-color: ${c};` }).run();
                          setShowHighlightPicker(false);
                          return;
                        } catch {
                          /* continue */
                        }
                        try {
                          (editor.chain() as any).focus().unsetMark('textStyle').setMark('textStyle', { style: `background-color: ${c};` }).run();
                          setShowHighlightPicker(false);
                          return;
                        } catch {
                          /* ignore */
                        }
                        setShowHighlightPicker(false);
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    className="gjp-color-clear"
                    title="Clear highlight color"
                    aria-label="Clear highlight color"
                    onMouseDown={(ev) => {
                      ev.preventDefault();
                      // Primary: use the official Highlight extension's unset command
                      try {
                        (editor.chain() as any).focus().unsetHighlight().run();
                        setShowHighlightPicker(false);
                        return;
                      } catch {
                        // fallthrough to mark-based fallbacks below
                      }

                      // Fallbacks: try to clear background-only attributes on textStyle
                      try {
                        (editor.chain() as any).focus().setMark('textStyle', { backgroundColor: null }).run();
                        setShowHighlightPicker(false);
                        return;
                      } catch {
                        /* continue */
                      }
                      try {
                        (editor.chain() as any).focus().setMark('textStyle', { background: null }).run();
                        setShowHighlightPicker(false);
                        return;
                      } catch {
                        /* continue */
                      }
                      try {
                        // remove any style attribute (may remove other styles too)
                        (editor.chain() as any).focus().setMark('textStyle', { style: '' }).run();
                        setShowHighlightPicker(false);
                        return;
                      } catch {
                        /* continue */
                      }
                      try {
                        // Fallback: remove the textStyle mark entirely
                        (editor.chain() as any).focus().unsetMark('textStyle').run();
                        setShowHighlightPicker(false);
                        return;
                      } catch {
                        /* ignore */
                      }
                      setShowHighlightPicker(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              title="Superscript"
              className={editor.isActive('superscript') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().toggleSuperscript().run(); } catch { /* ignore */ } }}
            >
              xⁿ
            </button>

            <button
              type="button"
              title="Subscript"
              className={editor.isActive('subscript') ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().toggleSubscript().run(); } catch { /* ignore */ } }}
            >
              xₙ
            </button>

            <button
              type="button"
              title="Remove formatting"
              className="gjp-btn-remove"
              onMouseDown={(e) => {
                e.preventDefault();
                try {
                  // preferred: unset marks and clear node formatting
                  (editor.chain() as any).focus().unsetAllMarks().clearNodes().run();
                } catch {
                  // fallback: unset some common marks / textStyle
                  try { (editor.chain() as any).focus().setMark('textStyle', { color: null, backgroundColor: null }).run(); } catch { /* ignore */ }
                }
              }}
            >
              <svg className="gjp-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 17L9 10l7-7 6 6-7 7-9 1z" />
                <path d="M14 7l3 3" />
              </svg>
            </button>
          </div>
        )}

        {/* Table toolbar: quick table operations when inside a table */}
        {showTableToolbar && (
          <div
            className="gjp-table-toolbar"
            style={{ position: 'absolute', left: effectiveTableToolbarCoords?.left ?? 8, top: effectiveTableToolbarCoords?.top ?? 8, zIndex: 85 }}
            role="toolbar"
            aria-label="Table operations"
          >
            <button
              type="button"
              title="Add row above"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addRowBefore().run(); } catch { /* ignore */ } }}
            >
              Row ↑
            </button>
            <button
              type="button"
              title="Add row below"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addRowAfter().run(); } catch { /* ignore */ } }}
            >
              Row ↓
            </button>
            <button
              type="button"
              title="Delete row"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().deleteRow().run(); } catch { /* ignore */ } }}
            >
              Del row
            </button>
            <span className="gjp-table-toolbar-sep" />
            <button
              type="button"
              title="Add column left"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addColumnBefore().run(); } catch { /* ignore */ } }}
            >
              Col ←
            </button>
            <button
              type="button"
              title="Add column right"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().addColumnAfter().run(); } catch { /* ignore */ } }}
            >
              Col →
            </button>
            <button
              type="button"
              title="Delete column"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().deleteColumn().run(); } catch { /* ignore */ } }}
            >
              Del col
            </button>
            <span className="gjp-table-toolbar-sep" />
            <button
              type="button"
              title="Delete table"
              onMouseDown={(e) => { e.preventDefault(); try { (editor.chain() as any).focus().deleteTable().run(); } catch { /* ignore */ } }}
            >
              Del table
            </button>
          </div>
        )}

        {/* code enhancer: attach copy buttons and gutters via a DOM utility */}
    </div>
  </div>
  );
}
