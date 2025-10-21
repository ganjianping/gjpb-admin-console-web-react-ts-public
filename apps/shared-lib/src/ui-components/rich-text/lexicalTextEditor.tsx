// Clean implementation of LexicalTextEditor (no custom link nodes/plugins)
import React, { useCallback, useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical';
import { ListNode, ListItemNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface LexicalTextEditorProps {
  onChange?: (html: string) => void;
  placeholder?: string;
}

const SimpleErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const Toolbar: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const toggleBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
      <Tooltip title="Bold">
        <IconButton size="small" onClick={toggleBold}>
          <span style={{ fontWeight: 'bold' }}>B</span>
        </IconButton>
      </Tooltip>
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Undo">
        <IconButton size="small" onClick={undo}>↺</IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton size="small" onClick={redo}>↻</IconButton>
      </Tooltip>
    </Box>
  );
};

export const LexicalTextEditor: React.FC<LexicalTextEditorProps> = ({ onChange, placeholder }) => {
  const initialConfig = useMemo(() => ({
    namespace: 'lexical-text-editor',
    onError: (err: Error) => console.error('[LexicalTextEditor]', err),
    nodes: [ListNode, ListItemNode],
  }), []);

  const handleChange = useCallback((editorState: any, editor: any) => {
    try {
      const ignoreRef = (editor as any).__ignoreNextOnChange as { current?: boolean } | undefined;
      if (ignoreRef?.current) {
        ignoreRef.current = false;
        return;
      }
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null as any);
        onChange?.(html as string);
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[LexicalTextEditor] onChange error', e);
    }
  }, [onChange]);

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
            line-height: 24px !important;
          }
          .lexical-text-editor__input[contenteditable] p,
          .lexical-text-editor__input[contenteditable] div {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            line-height: inherit !important;
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
      </Box>
    </LexicalComposer>
  );
};

export default LexicalTextEditor;

