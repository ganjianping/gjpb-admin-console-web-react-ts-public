// Migration shim: export the TipTap-based editor under the old LexicalTextEditor module
import React from 'react';
import TiptapTextEditor from './tiptapTextEditor';

export interface LexicalTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export const LexicalTextEditor: React.FC<LexicalTextEditorProps> = (props) => {
  return <TiptapTextEditor {...props} />;
};

export default LexicalTextEditor;

