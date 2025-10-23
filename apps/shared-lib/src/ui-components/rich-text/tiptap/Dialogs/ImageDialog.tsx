import React from 'react';
import { Editor } from '@tiptap/react';
import * as tiptapStyles from '../styles';
import DialogWrapper from './DialogWrapper';

interface ImageForm { url: string; width: string; height: string; alt: string }

interface ImageDialogProps {
  editor: Editor | null;
  open: boolean;
  overlayRef: React.RefObject<HTMLDialogElement | null>;
  form: ImageForm;
  setForm: (f: ImageForm) => void;
  onClose: () => void;
  selection?: { from: number; to: number } | null;
}

export default function ImageDialog(props: Readonly<ImageDialogProps>) {
  const { editor, open, overlayRef, form, setForm, onClose } = props;
  if (!open) return null;

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={520}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { url, width, height, alt } = form;
          if (!url) return;

          const attrs: any = { src: url };
          if (width?.toString().trim()) attrs.width = width.toString().trim();
          if (height?.toString().trim()) attrs.height = height.toString().trim();
          if (alt?.toString().trim()) attrs.alt = alt.toString().trim();

          const insertRawImg = (reason?: unknown) => {
            // eslint-disable-next-line no-console
            console.error('setImage failed, inserting raw img', reason);
            const styleParts: string[] = [];
            if (width?.toString().trim()) styleParts.push(`width:${width.toString().trim()}`);
            if (height?.toString().trim()) styleParts.push(`height:${height.toString().trim()}`);
            const styleAttr = styleParts.length ? ` style="${styleParts.join(';')}"` : '';
            const altAttr = alt?.toString().trim() ? ` alt="${alt.toString().trim()}"` : '';
            const html = `<p><img src="${url}"${altAttr}${styleAttr} /></p>`;
            try {
              editor?.chain().focus().insertContent(html).run();
            } catch (error_) {
              // eslint-disable-next-line no-console
              console.error('insertContent fallback failed, trying minimal setImage', error_);
              editor?.chain().focus().setImage({ src: url }).run();
            }
          };

          try {
            // restore selection if provided (modals steal focus and DOM selection)
            if (props.selection && editor) {
              try { editor.chain().focus().setTextSelection({ from: props.selection.from, to: props.selection.to }).run(); } catch { /* ignore */ }
            }
            editor?.chain().focus().setImage(attrs).run();
          } catch (err) {
            insertRawImg(err);
          }

          onClose();
        }}
        style={tiptapStyles.dialogInnerStyle}
      >
        <h3 style={{ margin: '0 0 8px 0' }}>Insert image</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <label htmlFor="gjp-image-url" style={{ fontSize: 13 }}>URL</label>
          <input
            id="gjp-image-url"
            autoFocus
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            style={tiptapStyles.dialogInputStyle}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="gjp-image-width" style={{ fontSize: 13 }}>Width</label>
                    <input
                id="gjp-image-width"
                value={form.width}
                      onChange={(e) => setForm({ ...form, width: e.target.value })}
                      placeholder="e.g. 400 or 50%"
                      style={{ width: '100%', ...tiptapStyles.dialogInputStyle }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="gjp-image-height" style={{ fontSize: 13 }}>Height</label>
                    <input
                id="gjp-image-height"
                value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                      placeholder="e.g. 300 or 50%"
                      style={{ width: '100%', ...tiptapStyles.dialogInputStyle }}
              />
            </div>
          </div>

          <label htmlFor="gjp-image-alt" style={{ fontSize: 13 }}>Alt text</label>
          <input
            id="gjp-image-alt"
            value={form.alt}
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
            placeholder="Short description for accessibility"
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
