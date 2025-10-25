import { useEffect, useMemo, useRef } from 'react';
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
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';

type UseTiptapEditorArgs = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  initialRows?: number;
};

type LanguageMeta = {
  module: string;
  aliases?: string[];
};

const languageMap: Record<string, LanguageMeta> = {
  javascript: { module: 'javascript', aliases: ['js', 'node', 'nodejs'] },
  typescript: { module: 'typescript', aliases: ['ts'] },
  css: { module: 'css' },
  json: { module: 'json' },
  bash: { module: 'bash', aliases: ['sh', 'shell', 'zsh', 'bash'] },
  html: { module: 'xml', aliases: ['markup'] },
  xml: { module: 'xml' },
  yaml: { module: 'yaml', aliases: ['yml'] },
  python: { module: 'python', aliases: ['py'] },
  java: { module: 'java' },
  go: { module: 'go', aliases: ['golang'] },
  php: { module: 'php' },
  ruby: { module: 'ruby', aliases: ['rb'] },
  swift: { module: 'swift' },
  kotlin: { module: 'kotlin', aliases: ['kt'] },
  markdown: { module: 'markdown', aliases: ['md'] },
  sql: { module: 'sql', aliases: ['pgsql', 'postgres', 'mysql'] },
  plaintext: { module: 'plaintext', aliases: ['text', 'plain'] },
};

const resolveLanguage = (langIn: string) => {
  const key = langIn.trim().toLowerCase();
  if (!key) return null;
  // Direct match
  if (languageMap[key]) return key;
  // Find by alias
  for (const [name, meta] of Object.entries(languageMap)) {
    if (meta.aliases?.includes(key)) return name;
  }
  return key;
};

export default function useTiptapEditor({ value = '', onChange, placeholder = 'Enter rich text...', initialRows = 3 }: UseTiptapEditorArgs) {
  // Memoise lowlight so we don't recreate the registry on every render.
  const lowlight = useMemo(() => {
    const instance = createLowlight();
    instance.register({ javascript: js as any, typescript: ts as any, css: css as any, json: json as any, bash: bash as any });
    return instance;
  }, []);

  const registeredRef = useRef(new Set<string>(['javascript', 'typescript', 'css', 'json', 'bash', 'plaintext']));
  const pendingRef = useRef(new Map<string, Promise<void>>());
  const failedRef = useRef(new Set<string>());

  const ensureLanguage = useMemo(() => {
    return (langRaw: string) => {
      const lang = resolveLanguage(langRaw);
      if (!lang) return Promise.resolve();
      if (registeredRef.current.has(lang) || failedRef.current.has(lang)) return Promise.resolve();

      if (['plaintext', 'text', 'plain'].includes(lang)) {
        registeredRef.current.add(lang);
        return Promise.resolve();
      }

      if (pendingRef.current.has(lang)) return pendingRef.current.get(lang)!;

      const meta = languageMap[lang];
      const moduleName = meta?.module ?? lang;
      const loadPromise = import(/* webpackChunkName: "hljs-[request]" */ `highlight.js/lib/languages/${moduleName}`)
        .then((mod) => {
          const fn = (mod as any).default ?? mod;
          lowlight.register({ [lang]: fn as any });
          registeredRef.current.add(lang);
        })
        .catch(() => {
          failedRef.current.add(lang);
        })
        .finally(() => {
          pendingRef.current.delete(lang);
        });

      pendingRef.current.set(lang, loadPromise);
      return loadPromise;
    };
  }, [lowlight]);

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
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'gjp-code-block',
        },
      }),
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
      await ensureLanguage(lang);
    };
  }

  useEffect(() => {
    if (!editor) return undefined;

    const scanCodeBlocks = () => {
      try {
        const languages = new Set<string>();
        editor.state.doc.descendants((node) => {
          if (node.type?.name === 'codeBlock') {
            const attrLang = (node.attrs as any)?.language ?? '';
            const classLang = ((node.attrs as any)?.class || '')
              .toString()
              .split(' ')
              .find((token: string) => token.startsWith('language-'))
              ?.replace('language-', '');
            const lang = attrLang || classLang || '';
            if (lang) languages.add(lang);
          }
          return true;
        });
        languages.forEach((lang) => { void ensureLanguage(lang); });
      } catch {
        // ignore scanning issues
      }
    };

    scanCodeBlocks();
    editor.on('update', scanCodeBlocks);
    return () => {
      try { editor.off('update', scanCodeBlocks); } catch { /* ignore */ }
    };
  }, [editor, ensureLanguage]);

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
