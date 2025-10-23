import type { Editor } from '@tiptap/react';
import BoldButton from './buttons/BoldButton';
import ItalicButton from './buttons/ItalicButton';
import LinkButton from './buttons/LinkButton';
import UnderlineButton from './buttons/UnderlineButton';
import CodeBlockButton from './buttons/CodeBlockButton';
import TableButton from './buttons/TableButton';
import TaskListButton from './buttons/TaskListButton';
import BlockquoteButton from './buttons/BlockquoteButton';
import AlignButtons from './buttons/AlignButtons';
import ListButtons from './buttons/ListButtons';
import UnlinkButton from './buttons/UnlinkButton';
import * as styles from '../styles';

type Props = {
  editor: Editor | null;
  onOpenImageDialog: () => void;
};
type PropsExt = Readonly<Props & { words?: number; chars?: number; onClearFormatting?: () => void }>;

export default function Toolbar({ editor, onOpenImageDialog, words = 0, chars = 0, onClearFormatting }: PropsExt) {
  return (
    <div style={styles.toolbarStyle}>
      <select
        aria-label="Heading"
        onChange={(e) => {
          const v = e.target.value;
          if (!editor) return;
          if (v === 'p') editor.chain().focus().setParagraph().run();
          else editor.chain().focus().setHeading({ level: Number(v) as any }).run();
        }}
        defaultValue="p"
        style={{ padding: 6, borderRadius: 6 }}
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
      </select>

      <BoldButton editor={editor} />
      <ItalicButton editor={editor} />
      <LinkButton editor={editor} />
      <UnderlineButton editor={editor} />
      <CodeBlockButton editor={editor} />
      <button type="button" title="Insert image (set size)" aria-label="Insert image" style={styles.buttonStyle} onClick={onOpenImageDialog}>🖼</button>
      <TableButton editor={editor} />
      <TaskListButton editor={editor} />
      <BlockquoteButton editor={editor} />
      <AlignButtons editor={editor} />
      <ListButtons editor={editor} />
      <UnlinkButton editor={editor} />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 8 }}>
        <button type="button" title="Undo" style={styles.buttonStyle} onClick={() => editor?.chain().focus().undo().run()}>↺</button>
        <button type="button" title="Redo" style={styles.buttonStyle} onClick={() => editor?.chain().focus().redo().run()}>↻</button>
        <button type="button" title="Clear formatting" style={styles.buttonStyle} onClick={() => onClearFormatting?.()}>✖</button>
      </div>

      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', marginLeft: 8 }}>
        {words} words • {chars} chars
      </div>
    </div>
  );
}
