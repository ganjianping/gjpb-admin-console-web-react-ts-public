import React from 'react';
import { Editor } from '@tiptap/react';
import DOMPurify from 'dompurify';
import * as tiptapStyles from '../../styles';
import DialogWrapper from './DialogWrapper';

interface LinkForm { url: string; text: string }

interface LinkDialogProps {
  editor: Editor | null;
  open: boolean;
    overlayRef: React.RefObject<HTMLDialogElement | null>;
  form: LinkForm;
  setForm: (f: LinkForm) => void;
  onClose: () => void;
  selection?: { from: number; to: number } | null;
}

export default function LinkDialog(props: Readonly<LinkDialogProps>) {
  const { editor, open, overlayRef, form, setForm, onClose } = props;
  if (!open) return null;

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={520}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { url, text } = form;
          if (!url) return;
          try {
            if (props.selection && editor) {
              try { editor.chain().focus().setTextSelection({ from: props.selection.from, to: props.selection.to }).run(); } catch { /* ignore */ }
            }
            const sel = globalThis.getSelection();
            const collapsed = !sel || sel.rangeCount === 0 || sel.isCollapsed;
            if (collapsed) {
              const safeText = DOMPurify.sanitize(text || url);
              const html = `<a href="${url}" target="_blank" rel="noopener noreferrer">${safeText}</a>`;
              editor?.chain().focus().insertContent(html).run();
            } else {
              editor?.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank', rel: 'noopener noreferrer' }).run();
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to insert link from dialog', err);
          }
          onClose();
        }}
        style={tiptapStyles.dialogInnerStyle}
      >
        <h3 style={{ margin: '0 0 8px 0' }}>Insert link</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <label htmlFor="gjp-link-url" style={{ fontSize: 13 }}>URL</label>
          <input
            id="gjp-link-url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://example.com"
            style={tiptapStyles.dialogInputStyle}
          />

          <label htmlFor="gjp-link-text" style={{ fontSize: 13 }}>Text to display</label>
          <input
            id="gjp-link-text"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Leave empty to use the URL"
            style={tiptapStyles.dialogInputStyle}
          />

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
            <button type="button" style={{ ...tiptapStyles.buttonStyle }} onClick={() => onClose()}>Cancel</button>
            <button type="submit" style={{ ...tiptapStyles.buttonStyle, background: '#0f172a', color: 'white' }}>Insert</button>
          </div>
        </div>
      </form>
    </DialogWrapper>
  );
}
