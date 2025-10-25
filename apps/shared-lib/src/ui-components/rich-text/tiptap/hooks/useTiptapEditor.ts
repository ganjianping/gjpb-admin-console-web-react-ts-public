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
// Note: additional languages are lazy-loaded at runtime via dynamic imports to keep bundle size small.
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
  // Register a couple of very common languages synchronously to keep UX nice for JS/TS/CSS snippets.
  lowlight.register({ javascript: js as any, typescript: ts as any, css: css as any });

  // Track which languages we've registered so we don't re-import repeatedly.
  const registered = new Set<string>(['javascript', 'typescript', 'css']);

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

  // Attach a helper to the editor instance so UI controls can lazy-load languages on demand.
  // Usage: await (editor as any).loadCodeLanguage('python')
  if (editor) {
    (editor as any).loadCodeLanguage = async (lang: string) => {
      if (!lang) return;
      if (registered.has(lang)) return;
      try {
        // map a few common aliases to highlight.js module names
        const map: Record<string, string> = {
          html: 'xml',
          xml: 'xml',
          js: 'javascript',
          ts: 'typescript',
          py: 'python',
        };
        const moduleName = map[lang] ?? lang;
        // dynamic import to keep bundle small; highlight.js language modules export a function
        const mod = await import(/* webpackChunkName: "hljs-[request]" */ `highlight.js/lib/languages/${moduleName}`);
        const fn = (mod as any).default ?? mod;
        lowlight.register({ [lang]: fn as any });
        registered.add(lang);
      } catch (err) {
        // ignore — language may not exist; fail silently so editor remains usable
      }
    };
  }

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
