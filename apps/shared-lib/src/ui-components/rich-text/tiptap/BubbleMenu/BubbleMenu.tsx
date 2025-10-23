// lightweight presentational bubble menu for text selection actions
import { Editor } from '@tiptap/react';
import * as tiptapStyles from '../styles';

interface BubbleMenuProps {
  editor: Editor | null;
  visible: boolean;
  pos: { top: number; left: number };
  onOpenLink: () => void;
}

export default function BubbleMenu(props: Readonly<BubbleMenuProps>) {
  const { editor, visible, pos, onOpenLink } = props;
  if (!visible || !editor) return null;

  return (
    <div className="gjp-bubble-menu" style={{ ...tiptapStyles.bubbleMenuStyle, top: pos.top, left: pos.left }}>
      <div style={tiptapStyles.bubbleInnerStyle}>
        <button
          type="button"
          aria-label="Bold"
          style={{ ...tiptapStyles.buttonStyle, ...(editor.isActive('bold') ? tiptapStyles.activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >B</button>
        <button
          type="button"
          aria-label="Italic"
          style={{ ...tiptapStyles.buttonStyle, ...(editor.isActive('italic') ? tiptapStyles.activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        ><em>I</em></button>
        <button
          type="button"
          aria-label="Code"
          style={{ ...tiptapStyles.buttonStyle, ...(editor.isActive('code') ? tiptapStyles.activeStyle : {}) }}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >code</button>
        <button
          type="button"
          aria-label="Link"
          style={tiptapStyles.buttonStyle}
          onClick={() => onOpenLink()}
        >🔗</button>
        <button
          type="button"
          aria-label="Unlink"
          style={tiptapStyles.buttonStyle}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >⤫</button>
      </div>
    </div>
  );
}
