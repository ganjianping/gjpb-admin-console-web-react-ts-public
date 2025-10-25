import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
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
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import html from 'highlight.js/lib/languages/xml';
import markdown from 'highlight.js/lib/languages/markdown';
import go from 'highlight.js/lib/languages/go';
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';

type UseTiptapEditorArgs = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  initialRows?: number;
};

export default function useTiptapEditor({ value = '', onChange, placeholder = 'Enter rich text...', initialRows = 3 }: UseTiptapEditorArgs) {
  // create a lowlight instance and register a few common languages (keep bundle minimal)
  const lowlight = createLowlight();
  // Register a set of common languages for highlighting. Keep bundle reasonable — add more on demand.
  lowlight.register({
    javascript: js as any,
    typescript: ts as any,
    css: css as any,
    python: python as any,
    java: java as any,
    json: json as any,
    bash: bash as any,
    html: html as any,
    markdown: markdown as any,
    go: go as any,
    php: php as any,
    sql: sql as any,
    xml: xml as any,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph', 'listItem', 'blockquote'] }),
      Link.configure({ openOnClick: true }),
      Placeholder.configure({ placeholder }),
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
    onUpdate: ({ editor }: { editor: any }) => {
      try {
        const dirty = editor.getHTML();
        const clean = DOMPurify.sanitize(dirty);
        onChange?.(clean);
      } catch {
        // ignore
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    // If external value is non-empty, sync it
    if (value && value !== editor.getHTML()) {
      try { (editor.commands as any).setContent(value, { preserveWhitespace: false }); } catch { /* ignore */ }
      return;
    }

    // If value is empty (no external content) and editor is empty, initialize with a few empty paragraphs
    if (!value) {
      try {
        const text = editor.getText?.() ?? '';
        if (text.trim() === '') {
          const emptyContent = Array.from({ length: initialRows }).map(() => '<p><br></p>').join('');
          if (editor.getHTML() !== emptyContent) {
            try { (editor.commands as any).setContent(emptyContent, { preserveWhitespace: false }); } catch { /* ignore */ }
          }
        }
      } catch {
        // ignore
      }
    }
  }, [value, editor]);

  return editor;
}
