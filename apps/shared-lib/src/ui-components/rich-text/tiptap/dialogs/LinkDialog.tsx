import { useMemo } from 'react';
import { Editor } from '@tiptap/react';
import DOMPurify from 'dompurify';
import * as tiptapStyles from '../styles/inlineStyles';
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
  const { editor, open, overlayRef, form, setForm, onClose, selection } = props;
  if (!open) return null;

  const cleanedUrl = form.url.trim();
  const cleanedText = form.text.trim();
  const hasUrl = cleanedUrl.length > 0;

  const isValidUrl = useMemo(() => {
    if (!hasUrl) return false;
    try {
      const url = new URL(cleanedUrl);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }, [cleanedUrl, hasUrl]);

  const previewText = cleanedText || cleanedUrl;
  const sanitizedPreviewText = DOMPurify.sanitize(previewText);

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={520}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { url, text } = form;
          if (!url) return;
          try {
            if (selection && editor) {
              try { editor.chain().focus().setTextSelection({ from: selection.from, to: selection.to }).run(); } catch { /* ignore */ }
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
        style={tiptapStyles.dialogFormStyle}
      >
        <header style={tiptapStyles.dialogHeaderStyle}>
          <h3 style={tiptapStyles.dialogTitleStyle}>Insert link</h3>
          <p style={tiptapStyles.dialogDescriptionStyle}>
            Point readers to another page and (optionally) customise the text that appears in the editor.
          </p>
        </header>

        <div style={tiptapStyles.dialogBodyStyle}>
          <div style={tiptapStyles.dialogFieldColumnStyle}>
            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-link-url" style={tiptapStyles.dialogLabelStyle}>Destination URL</label>
              <input
                id="gjp-link-url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://example.com/article"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>
                Use a secure URL (https://) for best compatibility and reader trust.
              </span>
            </div>

            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-link-text" style={tiptapStyles.dialogLabelStyle}>Text to display</label>
              <input
                id="gjp-link-text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder="Leave empty to show the URL"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>
                If left blank the full URL will be inserted. You can change the label later from the editor.
              </span>
            </div>
          </div>

          <aside style={tiptapStyles.dialogPreviewWrapperStyle}>
            <div style={tiptapStyles.dialogPreviewSurfaceStyle}>
              {hasUrl ? (
                <a
                  href={isValidUrl ? cleanedUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isValidUrl ? '#0f172a' : '#9ca3af',
                    textDecoration: isValidUrl ? 'none' : 'line-through',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'rgba(15,23,42,0.08)',
                    }}
                  >
                    🔗
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: sanitizedPreviewText }} />
                </a>
              ) : (
                <div style={tiptapStyles.dialogPreviewEmptyStyle}>A preview link will appear here.</div>
              )}
            </div>
            <span style={tiptapStyles.dialogHintStyle}>
              {isValidUrl
                ? 'Preview uses the current values. Link opens in a new tab once inserted.'
                : hasUrl
                  ? 'Enter a valid http(s) URL to enable the insert button.'
                  : 'Provide a URL to enable the insert button.'}
            </span>
          </aside>
        </div>
        <div style={tiptapStyles.dialogFooterStyle}>
          <button type="button" style={tiptapStyles.secondaryButtonStyle} onClick={() => onClose()}>Cancel</button>
          <button type="submit" style={tiptapStyles.primaryButtonStyle} disabled={!isValidUrl}>Insert link</button>
        </div>
      </form>
    </DialogWrapper>
  );
}
