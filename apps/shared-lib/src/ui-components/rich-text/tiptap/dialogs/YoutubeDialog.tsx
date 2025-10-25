import { useEffect, useMemo, useState, FormEvent } from 'react';
import { Editor } from '@tiptap/react';
import * as tiptapStyles from '../styles/inlineStyles';
import DialogWrapper from './DialogWrapper';

interface YoutubeForm {
  url: string;
  start: string;
  title: string;
}

interface YoutubeDialogProps {
  editor: Editor | null;
  open: boolean;
  overlayRef: React.RefObject<HTMLDialogElement | null>;
  form: YoutubeForm;
  setForm: (form: YoutubeForm) => void;
  onClose: () => void;
  selection?: { from: number; to: number } | null;
}

const extractVideoId = (input: string) => {
  if (!input) return null;
  const raw = input.trim();
  if (!raw) return null;

  const directMatch = /^[A-Za-z0-9_-]{6,}$/.exec(raw);
  if (directMatch) return directMatch[0];

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/(?:embed\/|watch\?v=|shorts\/)([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/.*[?&]v=([A-Za-z0-9_-]{6,})/,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(raw);
    if (match?.[1]) return match[1];
  }

  return null;
};

const buildEmbedUrl = (videoId: string, startSeconds: number | null) => {
  const params = new URLSearchParams();
  if (startSeconds && startSeconds > 0) params.set('start', String(startSeconds));
  const query = params.toString();
  return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`;
};

export default function YoutubeDialog(props: Readonly<YoutubeDialogProps>) {
  const { editor, open, overlayRef, form, setForm, onClose, selection } = props;
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const parsed = useMemo(() => {
    const videoId = extractVideoId(form.url);
    const start = form.start.trim();
    const startSeconds = start ? Number.parseInt(start, 10) : null;
    if (start && (Number.isNaN(startSeconds) || startSeconds < 0)) {
      return { videoId, startSeconds: null, error: 'Start time must be a positive number of seconds.' };
    }
    return { videoId, startSeconds: startSeconds ?? null, error: null as string | null };
  }, [form.url, form.start]);

  const embedSrc = parsed.videoId ? buildEmbedUrl(parsed.videoId, parsed.startSeconds) : null;

  useEffect(() => {
    if (open) setSubmitAttempted(false);
  }, [open]);

  if (!open) return null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!editor) return;

    if (!parsed.videoId) return;
    if (parsed.error) return;

    const attrs: any = {
      videoId: parsed.videoId,
      src: buildEmbedUrl(parsed.videoId, parsed.startSeconds),
    };
    if (form.title.trim()) attrs.title = form.title.trim();
    if (selection) {
      try { editor.chain().focus().setTextSelection({ from: selection.from, to: selection.to }).run(); } catch { /* ignore */ }
    }

    try {
      if ((editor.commands as any)?.insertYoutube) {
        (editor.commands as any).insertYoutube(attrs);
      } else {
        editor.chain().focus().insertContent({ type: 'youtube', attrs }).run();
      }
    } catch {
      try {
        const fallbackSrc = buildEmbedUrl(parsed.videoId, parsed.startSeconds);
        const titleAttr = form.title.trim() ? form.title.trim() : 'YouTube video';
        editor
          .chain()
          .focus()
          .insertContent(`<iframe src="${fallbackSrc}" title="${titleAttr}" frameborder="0" allowfullscreen></iframe>`)
          .run();
      } catch {
        // ignore hard failure
      }
    }
    onClose();
  };

  const errorMessage = (() => {
    if (parsed.error) return parsed.error;
    if (submitAttempted && !parsed.videoId) return 'Please enter a valid YouTube link or video id.';
    return null;
  })();

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={560}>
      <form onSubmit={onSubmit} style={tiptapStyles.dialogFormStyle}>
        <header style={tiptapStyles.dialogHeaderStyle}>
          <h3 style={tiptapStyles.dialogTitleStyle}>Embed YouTube video</h3>
          <p style={tiptapStyles.dialogDescriptionStyle}>
            Paste a YouTube link or video id. Optionally provide a start time or title to show alongside the embed.
          </p>
        </header>

        <div style={tiptapStyles.dialogBodyStyle}>
          <div style={tiptapStyles.dialogFieldColumnStyle}>
            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-youtube-url" style={tiptapStyles.dialogLabelStyle}>Video URL or ID</label>
              <input
                id="gjp-youtube-url"
                autoFocus
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=abcdefghijk"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>Accepts full URLs (watch, share, embed) or plain video ids.</span>
            </div>

            <div style={tiptapStyles.dialogFieldRowStyle}>
              <div style={{ flex: '1 1 140px', minWidth: 140 }}>
                <div style={tiptapStyles.dialogFieldGroupStyle}>
                  <label htmlFor="gjp-youtube-start" style={tiptapStyles.dialogLabelStyle}>Start time (sec)</label>
                  <input
                    id="gjp-youtube-start"
                    value={form.start}
                    onChange={(e) => setForm({ ...form, start: e.target.value })}
                    placeholder="0"
                    style={tiptapStyles.dialogInputStyle}
                  />
                  <span style={tiptapStyles.dialogHintStyle}>Optional. Leave blank to start from the beginning.</span>
                </div>
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 160 }}>
                <div style={tiptapStyles.dialogFieldGroupStyle}>
                  <label htmlFor="gjp-youtube-title" style={tiptapStyles.dialogLabelStyle}>Label</label>
                  <input
                    id="gjp-youtube-title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Optional title or description"
                    style={tiptapStyles.dialogInputStyle}
                  />
                  <span style={tiptapStyles.dialogHintStyle}>Used as the iframe title for accessibility.</span>
                </div>
              </div>
            </div>

            {errorMessage ? <div style={{ ...tiptapStyles.dialogHintStyle, color: '#dc2626' }}>{errorMessage}</div> : null}
          </div>

          <aside style={tiptapStyles.dialogPreviewWrapperStyle}>
            <div style={tiptapStyles.dialogPreviewSurfaceStyle}>
              {embedSrc ? (
                <iframe
                  title={form.title || 'YouTube preview'}
                  src={embedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: 10, minHeight: 160 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={tiptapStyles.dialogPreviewEmptyStyle}>
                  Preview appears after entering a valid video URL or id.
                </div>
              )}
            </div>
            <span style={tiptapStyles.dialogHintStyle}>
              Preview updates automatically based on the provided link.
            </span>
          </aside>
        </div>

        <div style={tiptapStyles.dialogFooterStyle}>
          <button type="button" style={tiptapStyles.secondaryButtonStyle} onClick={() => onClose()}>Cancel</button>
          <button type="submit" style={tiptapStyles.primaryButtonStyle} disabled={!parsed.videoId || Boolean(parsed.error)}>Embed video</button>
        </div>
      </form>
    </DialogWrapper>
  );
}
