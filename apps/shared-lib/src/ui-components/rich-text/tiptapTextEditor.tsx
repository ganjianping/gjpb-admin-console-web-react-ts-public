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
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import css from 'highlight.js/lib/languages/css';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
// styles are provided to buttons and dialogs via direct imports in those components
import Toolbar from './tiptap/Toolbar/Toolbar';
import ImageDialog from './tiptap/Dialogs/ImageDialog';
import LinkDialog from './tiptap/Dialogs/LinkDialog.tsx';
import { initCodeEnhancer } from './tiptap/utils/codeEnhancer';
import './tiptap/editor.css';

// create a lowlight instance and register a few common languages (keep bundle minimal)
const lowlight = createLowlight();
lowlight.register({ javascript: js as any, typescript: ts as any, css: css as any });

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

  if (!editor) return null;

  // simple counts (avoid conditional hooks)
  const text = editor ? editor.getText() : '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  // styles imported from separate file to keep component focused (see ./tiptap/styles.ts)

  // link insertion is opened by toolbar LinkButton which dispatches an event the parent listens for

  const clearFormatting = () => editor.chain().focus().clearNodes().unsetAllMarks().run();

  // alignment fallback moved to utils/applyAlignmentFallback.ts

  return (
    <div>
      <Toolbar
        editor={editor}
        onOpenImageDialog={() => {
          // capture current selection for image insertion
          if (editor) {
            try {
              const s = editor.state.selection;
              setImageSelection({ from: (s as any).from, to: (s as any).to });
            } catch {
              setImageSelection(null);
            }
          }
          setImageForm({ url: '', width: '', height: '', alt: '' });
          setImageDialogOpen(true);
        }}
        words={words}
        chars={chars}
        onClearFormatting={clearFormatting}
      />

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
        />

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

        {/* code enhancer: attach copy buttons and gutters via a DOM utility */}
    </div>
  </div>
  );
}
