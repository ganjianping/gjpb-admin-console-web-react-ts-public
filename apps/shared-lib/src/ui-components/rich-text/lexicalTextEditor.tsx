import React, { useCallback, useEffect, useMemo } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import type { EditorState, LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list';
import { TOGGLE_LINK_COMMAND, LinkNode } from '@lexical/link';
import DOMPurify from 'dompurify';
import { Box, IconButton, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import LinkIcon from '@mui/icons-material/Link';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

interface LexicalTextEditorProps {
  value?: string; // HTML
  onChange?: (html: string) => void;
  placeholder?: string;
}

class SimpleErrorBoundary extends React.Component<{ children: React.ReactNode; onError: (err: Error) => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('[LexicalTextEditor] render error', err);
    try { this.props.onError(err); } catch (e) { console.error(e); }
  }
  render() {
    if (this.state.hasError) return <div />;
    return this.props.children as any;
  }
}

const LexicalTextEditor: React.FC<LexicalTextEditorProps> = ({ value = '', onChange, placeholder }) => {
  const initialConfig = useMemo(() => ({
    namespace: 'lexical-text-editor',
    onError: (err: Error) => console.error('[LexicalTextEditor]', err),
    // register nodes required by the toolbar commands (lists, links)
    nodes: [ListNode, ListItemNode, LinkNode],
  }), []);

  const handleChange = useCallback((_editorState: EditorState, editor: LexicalEditor) => {
    try {
      // if we're hydrating programmatically, ignore the first onChange to avoid
      // a render loop where parent updates value -> re-hydrate -> onChange -> repeat
      const ignoreRef = (editor as any).__ignoreNextOnChange as { current?: boolean } | undefined;
      if (ignoreRef?.current) {
        ignoreRef.current = false;
        return;
      }

      // Read editor state instead of performing an update to avoid disturbing selection
      _editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null as any);
        const sanitized = DOMPurify.sanitize(html || '');
        const lastEmitted = (editor as any).__lastEmittedHtml as string | undefined;
        if (lastEmitted === sanitized) return;
        (editor as any).__lastEmittedHtml = sanitized;
        onChange?.(sanitized);
      });
    } catch (e) {
      console.error('[LexicalTextEditor] onChange error', e);
    }
  }, [onChange]);

  // Hydration is handled by the EditorHydrator component below which watches `value`.

  // toolbar will dispatch Lexical commands via the editor instance

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box sx={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1, p: 1 }}>
        <style>{`
          .lexical-text-editor__input[contenteditable],
          .lexical-text-editor__input[contenteditable] * {
            writing-mode: horizontal-tb !important;
            -webkit-writing-mode: horizontal-tb !important;
            text-orientation: mixed !important;
            white-space: pre-wrap !important;
            word-break: normal !important;
            overflow-wrap: anywhere !important;
            direction: ltr !important;
            width: 100% !important;
            min-width: 160px !important;
            font-size: 14px !important;
            line-height: 24px !important; /* tighter rows */
          }
          .lexical-text-editor__input[contenteditable] p,
          .lexical-text-editor__input[contenteditable] div {
            display: block !important;
            margin: 0 !important; /* remove default paragraph margins which increase row height */
            padding: 0 !important;
            line-height: inherit !important;
          }
          .lexical-text-editor__input[contenteditable] li {
            display: list-item !important; /* allow markers */
            margin: 0.2em 0 !important;
            padding: 0 !important;
            line-height: inherit !important;
          }
          .lexical-text-editor__input[contenteditable] span,
          .lexical-text-editor__input[contenteditable] a,
          .lexical-text-editor__input[contenteditable] strong,
          .lexical-text-editor__input[contenteditable] em {
            display: inline !important;
          }
          /* restore default list marker spacing so ordered/bulleted lists are visible */
          .lexical-text-editor__input[contenteditable] ol,
          .lexical-text-editor__input[contenteditable] ul {
            padding-left: 1.2em !important;
            margin: 0 0 0 1.2em !important;
            list-style-position: outside !important;
          }
          .lexical-text-editor__input[contenteditable] ol {
            list-style-type: decimal !important;
          }
          .lexical-text-editor__input[contenteditable] ul {
            list-style-type: disc !important;
          }
        `}</style>
        <Toolbar />

        <RichTextPlugin
          contentEditable={<ContentEditable className="lexical-text-editor__input" style={{ display: 'block', width: '100%', minWidth: 160, whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'anywhere', writingMode: 'horizontal-tb', fontSize: 14, lineHeight: '18px', padding: 0, margin: 0 }} />}
          placeholder={<div style={{ color: 'rgba(0,0,0,0.6)' }}>{placeholder || 'Enter subtitle...'}</div>}
          ErrorBoundary={SimpleErrorBoundary as any}
        />

        <HistoryPlugin />
  <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
        <EditorHydrator value={value} />
      </Box>
    </LexicalComposer>
  );
};

const Toolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const toggleBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const toggleItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  const insertUnorderedList = () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  const insertOrderedList = () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  const toggleLink = () => {
    const url = globalThis.prompt?.('Enter URL');
    if (typeof url === 'string') editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
      <Tooltip title="Bold"><IconButton size="small" onClick={toggleBold}><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
      <Tooltip title="Italic"><IconButton size="small" onClick={toggleItalic}><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
  <Tooltip title="Bulleted list"><IconButton size="small" onClick={insertUnorderedList}><FormatListBulletedIcon fontSize="small" /></IconButton></Tooltip>
  <Tooltip title="Numbered list"><IconButton size="small" onClick={insertOrderedList}><FormatListNumberedIcon fontSize="small" /></IconButton></Tooltip>
      <Tooltip title="Insert Link"><IconButton size="small" onClick={toggleLink}><LinkIcon fontSize="small" /></IconButton></Tooltip>
      <Box sx={{ flex: 1 }} />
  <Tooltip title="Undo"><IconButton size="small" onClick={undo}><UndoIcon fontSize="small" /></IconButton></Tooltip>
  <Tooltip title="Redo"><IconButton size="small" onClick={redo}><RedoIcon fontSize="small" /></IconButton></Tooltip>
    </Box>
  );
};

const EditorHydrator: React.FC<{ value: string }> = ({ value }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!editor) return;
    try {
      const last = (editor as any).__lastHydratedValue as string | undefined;
      if (!value || value === last) return;

      // If the user is currently interacting with the editor (selection present), skip hydration.
      let isFocused = false;
      let currentHtml = '';
      editor.getEditorState().read(() => {
        try {
          // $getSelection will be non-null when focused/has selection
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const sel = (globalThis as any).$getSelection ? (globalThis as any).$getSelection() : null;
          isFocused = Boolean(sel);
        } catch (e) {
          console.debug('[LexicalTextEditor] selection check error', e);
        }
        try {
          currentHtml = $generateHtmlFromNodes(editor, null as any) || '';
        } catch (e) {
          console.debug('[LexicalTextEditor] generate html error', e);
          currentHtml = '';
        }
      });

      const sanitizedCurrent = DOMPurify.sanitize(currentHtml || '');
      if (sanitizedCurrent === value) {
        (editor as any).__lastHydratedValue = value;
        return;
      }

      if (isFocused) {
        // user is typing — don't replace nodes and reset caret
        return;
      }

      // ignore the next onChange emitted by programmatic hydration
      (editor as any).__ignoreNextOnChange = { current: true };
      editor.update(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, doc);
        const root = $getRoot();
        root.clear();
        for (const n of nodes) root.append(n);
      });
      (editor as any).__lastHydratedValue = value;
    } catch (e) {
      console.error('[LexicalTextEditor] EditorHydrator error', e);
    }
  }, [editor, value]);
  return null;
};

export default LexicalTextEditor;
