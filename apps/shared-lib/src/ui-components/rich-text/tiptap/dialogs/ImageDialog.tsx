import { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import * as tiptapStyles from '../styles/inlineStyles';
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
  const { editor, open, overlayRef, form, setForm, onClose, selection } = props;
  if (!open) return null;

  const [previewError, setPreviewError] = useState(false);
  const hasUrl = Boolean(form.url?.trim());

  useEffect(() => { setPreviewError(false); }, [form.url]);

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={560}>
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
            if (selection && editor) {
              try { 
                // Insert at the saved position directly using insertContentAt
                // Do NOT call focus() first as it may move the cursor
                const pos = selection.from;
                editor.chain()
                  .insertContentAt(pos, {
                    type: 'image',
                    attrs
                  })
                  .run();
                
                // Set cursor position right after the inserted image
                // Image node typically takes 1 position
                const cursorPos = pos + 1;
                editor.chain()
                  .focus()
                  .setTextSelection(cursorPos)
                  .run();
              } catch { 
                // Fallback: try with setTextSelection approach
                try {
                  editor.chain()
                    .setTextSelection({ from: selection.from, to: selection.to })
                    .deleteSelection()
                    .setImage(attrs)
                    .focus()
                    .run();
                } catch {
                  // Final fallback: just insert at current position
                  editor?.chain().focus().setImage(attrs).run();
                }
              }
            } else {
              // No selection saved, insert at current position
              editor?.chain().focus().setImage(attrs).run();
            }
          } catch (err) {
            insertRawImg(err);
          }

          onClose();
        }}
        style={tiptapStyles.dialogFormStyle}
      >
        <header style={tiptapStyles.dialogHeaderStyle}>
          <h3 style={tiptapStyles.dialogTitleStyle}>Insert image</h3>
          <p style={tiptapStyles.dialogDescriptionStyle}>
            Paste a hosted image URL and adjust optional sizing or descriptive text before inserting it into the editor.
          </p>
        </header>

        <div style={tiptapStyles.dialogBodyStyle}>
          <div style={tiptapStyles.dialogFieldColumnStyle}>
            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-image-url" style={tiptapStyles.dialogLabelStyle}>Image URL</label>
              <input
                id="gjp-image-url"
                autoFocus
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>Supports any publicly accessible HTTPS image.</span>
            </div>

            <div style={tiptapStyles.dialogFieldRowStyle}>
              <div style={{ flex: '1 1 120px', minWidth: 120 }}>
                <div style={tiptapStyles.dialogFieldGroupStyle}>
                  <label htmlFor="gjp-image-width" style={tiptapStyles.dialogLabelStyle}>Width</label>
                  <input
                    id="gjp-image-width"
                    value={form.width}
                    onChange={(e) => setForm({ ...form, width: e.target.value })}
                    placeholder="auto"
                    style={tiptapStyles.dialogInputStyle}
                  />
                </div>
              </div>
              <div style={{ flex: '1 1 120px', minWidth: 120 }}>
                <div style={tiptapStyles.dialogFieldGroupStyle}>
                  <label htmlFor="gjp-image-height" style={tiptapStyles.dialogLabelStyle}>Height</label>
                  <input
                    id="gjp-image-height"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    placeholder="auto"
                    style={tiptapStyles.dialogInputStyle}
                  />
                </div>
              </div>
            </div>

            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-image-alt" style={tiptapStyles.dialogLabelStyle}>Alt text</label>
              <input
                id="gjp-image-alt"
                value={form.alt}
                onChange={(e) => setForm({ ...form, alt: e.target.value })}
                placeholder="Short description for accessibility"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>Tell readers what is shown for better accessibility.</span>
            </div>
          </div>

          <aside style={tiptapStyles.dialogPreviewWrapperStyle}>
            <div style={tiptapStyles.dialogPreviewSurfaceStyle}>
              {hasUrl && !previewError ? (
                <img
                  src={form.url}
                  alt={form.alt || 'Preview'}
                  style={tiptapStyles.dialogPreviewImageStyle}
                  onError={() => setPreviewError(true)}
                  onLoad={() => setPreviewError(false)}
                />
              ) : (
                <div style={tiptapStyles.dialogPreviewEmptyStyle}>
                  {previewError ? 'Unable to load preview.' : 'Image preview will appear here.'}
                </div>
              )}
            </div>
            <span style={tiptapStyles.dialogHintStyle}>
              {previewError ? 'Check that the URL is correct and allows direct access.' : 'Preview updates automatically as you type.'}
            </span>
          </aside>
        </div>

        <div style={tiptapStyles.dialogFooterStyle}>
          <button type="button" style={tiptapStyles.secondaryButtonStyle} onClick={() => onClose()}>Cancel</button>
          <button type="submit" style={tiptapStyles.primaryButtonStyle} disabled={!hasUrl}>Insert image</button>
        </div>
      </form>
    </DialogWrapper>
  );
}
