import type { Editor } from '@tiptap/react';
import { useCallback } from 'react';
import * as styles from '../../styles';

export default function TaskListButton({ editor }: Readonly<{ editor: Editor | null }>) {
  const onClick = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().toggleTaskList().run();
  }, [editor]);
  const active = !!editor && editor.isActive('taskList');
  return <button type="button" title="Toggle task list" aria-label="Toggle task list" style={{ ...styles.buttonStyle, ...(active ? styles.activeStyle : {}) }} onClick={onClick}>☑</button>;
}

