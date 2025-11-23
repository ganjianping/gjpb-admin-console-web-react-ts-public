import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Editor } from '@tiptap/react';
import * as tiptapStyles from '../styles/inlineStyles';
import DialogWrapper from './DialogWrapper';

interface YoutubeForm {
  url: string;
  width: string;
  height: string;
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

type ParsedSource =
  | { provider: 'youtube'; src: string; videoId: string }
  | { provider: 'file'; src: string }
  | { provider: null };

const extractVideoId = (input: string) => {
  const raw = input.trim();
  if (!raw) return null;

  const directMatch = /^[A-Za-z0-9_-]{6,}$/.exec(raw);
  if (directMatch) return directMatch[0];

  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/(?:embed\/|watch\?v=|shorts\/)([A-Za-z0-9_-]{6,})/i,
    /youtube\.com\/.*[?&]v=([A-Za-z0-9_-]{6,})/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(raw);
    if (match?.[1]) return match[1];
  }

  return null;
};

const buildYoutubeEmbedUrl = (videoId: string) => `https://www.youtube.com/embed/${videoId}`;

const isDirectVideoUrl = (input: string) => /\bhttps?:\/\/.+\.(mp4|webm|ogg|ogv|mov|m4v|avi|mkv|flv|wmv|3gp)(?:\?.*)?(?:#.*)?$/i.test(input.trim());

const parseDimension = (input: string) => {
  const trimmed = input.trim();
  if (!trimmed) return { value: null, error: null };
  const numeric = Number.parseInt(trimmed, 10);
  if (Number.isNaN(numeric) || numeric <= 0) {
    return { value: null, error: 'Dimensions must be a positive number of pixels.' };
  }
  return { value: String(numeric), error: null };
};

export default function YoutubeDialog(props: Readonly<YoutubeDialogProps>) {
  const { editor, open, overlayRef, form, setForm, onClose, selection } = props;
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const source = useMemo<ParsedSource>(() => {
    const raw = form.url.trim();
    if (!raw) return { provider: null };

    const videoId = extractVideoId(raw);
    if (videoId) {
      return { provider: 'youtube', videoId, src: buildYoutubeEmbedUrl(videoId) };
    }

    if (isDirectVideoUrl(raw)) {
      return { provider: 'file', src: raw };
    }

    return { provider: null };
  }, [form.url]);

  const dimensions = useMemo(() => {
    const widthResult = parseDimension(form.width);
    const heightResult = parseDimension(form.height);
    return {
      width: widthResult.value,
      height: heightResult.value,
      error: widthResult.error || heightResult.error,
    };
  }, [form.width, form.height]);

  useEffect(() => {
    if (open) setSubmitAttempted(false);
  }, [open]);

  if (!open) return null;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!editor) return;
    if (dimensions.error) return;
    if (source.provider == null) return;

    const attrs: Record<string, any> = {
      provider: source.provider,
      src: source.src,
    };
    if (source.provider === 'youtube') attrs.videoId = source.videoId;
    // Store dimensions as numbers for the HTML width/height attributes
    if (dimensions.width) attrs.width = dimensions.width;
    if (dimensions.height) attrs.height = dimensions.height;

    // Insert at the saved position if available
    try {
      if (selection) {
        // Insert at the exact saved position
        const pos = selection.from;
        if ((editor.commands as any)?.insertYoutube) {
          // First delete any selection, then insert at position
          if (selection.from !== selection.to) {
            editor.chain()
              .deleteRange({ from: selection.from, to: selection.to })
              .run();
          }
          editor.chain().setTextSelection(pos).run();
          (editor.commands as any).insertYoutube(attrs);
          // Keep cursor at the insertion position to avoid jumping rows
          editor.chain()
            .focus(undefined, { scrollIntoView: false })
            .setTextSelection(pos)
            .run();
        } else {
          editor.chain()
            .insertContentAt(pos, { type: 'youtube', attrs })
            .run();
          // Keep cursor at the insertion position to avoid jumping rows
          editor.chain()
            .focus(undefined, { scrollIntoView: false })
            .setTextSelection(pos)
            .run();
        }
      } else {
        // No saved selection, insert at current position
        if ((editor.commands as any)?.insertYoutube) {
          (editor.commands as any).insertYoutube(attrs);
          editor.chain().focus(undefined, { scrollIntoView: false }).run();
        } else {
          editor.chain().focus(undefined, { scrollIntoView: false }).insertContent({ type: 'youtube', attrs }).run();
        }
      }
    } catch {
      try {
        const pos = selection?.from;
        if (source.provider === 'youtube') {
          const iframe = `<iframe src="${source.src}" frameborder="0" allowfullscreen${dimensions.width ? ` width="${dimensions.width}"` : ''}${dimensions.height ? ` height="${dimensions.height}"` : ''}></iframe>`;
          if (pos !== undefined) {
            editor.chain().insertContentAt(pos, iframe).run();
            editor.chain().focus(undefined, { scrollIntoView: false }).setTextSelection(pos).run();
          } else {
            editor.chain().focus(undefined, { scrollIntoView: false }).insertContent(iframe).run();
          }
        } else {
          const video = `<video controls src="${source.src}"${dimensions.width ? ` width="${dimensions.width}"` : ''}${dimensions.height ? ` height="${dimensions.height}"` : ''}></video>`;
          if (pos !== undefined) {
            editor.chain().insertContentAt(pos, video).run();
            editor.chain().focus(undefined, { scrollIntoView: false }).setTextSelection(pos).run();
          } else {
            editor.chain().focus(undefined, { scrollIntoView: false }).insertContent(video).run();
          }
        }
      } catch {
        // ignore hard failure
      }
    }
    onClose();
  };

  const errorMessage = (() => {
    if (dimensions.error) return dimensions.error;
    if (submitAttempted && source.provider == null) {
      return 'Please enter a valid YouTube link (e.g., youtube.com/watch?v=...) or direct video URL (e.g., https://example.com/video.mp4)';
    }
    return null;
  })();

  const widthPx = dimensions.width ? `${dimensions.width}px` : undefined;
  const heightPx = dimensions.height ? `${dimensions.height}px` : undefined;
  const previewContent = (() => {
    if (source.provider === 'youtube') {
      const computedHeight = heightPx
        ? heightPx
        : dimensions.width
          ? `${Math.round(Number(dimensions.width) * 9 / 16)}px`
          : '315px';
      return (
        <iframe
          title="Video preview"
          src={source.src}
          style={{
            border: 'none',
            borderRadius: 10,
            width: widthPx ?? '100%',
            height: computedHeight,
            minHeight: computedHeight,
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    if (source.provider === 'file') {
      return (
        <video
          controls
          src={source.src}
          style={{
            width: widthPx ?? '100%',
            height: heightPx ?? 'auto',
            minHeight: heightPx ?? '180px',
            borderRadius: 10,
            background: '#000',
          }}
        />
      );
    }
    return null;
  })();

  return (
    <DialogWrapper open={open} overlayRef={overlayRef} onClose={onClose} width={560}>
      <form onSubmit={onSubmit} style={tiptapStyles.dialogFormStyle}>
        <header style={tiptapStyles.dialogHeaderStyle}>
          <h3 style={tiptapStyles.dialogTitleStyle}>Embed Video</h3>
          <p style={tiptapStyles.dialogDescriptionStyle}>
            YouTube: Paste a video link, share URL, or just the video ID<br />
            Direct video: Paste a URL ending in .mp4, .webm, .mov, .ogg, .mkv, etc.<br />
            Optionally set custom dimensions (default: 16:9 aspect ratio)
          </p>
        </header>

        <div style={tiptapStyles.dialogBodyStyle}>
          <div style={tiptapStyles.dialogFieldColumnStyle}>
            <div style={tiptapStyles.dialogFieldGroupStyle}>
              <label htmlFor="gjp-video-url" style={tiptapStyles.dialogLabelStyle}>Video URL or ID</label>
              <input
                id="gjp-video-url"
                autoFocus
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                style={tiptapStyles.dialogInputStyle}
              />
              <span style={tiptapStyles.dialogHintStyle}>YouTube (URL or ID) • Direct video files (.mp4, .webm, .mov, .ogg, .mkv, etc.)</span>
            </div>

            <div style={tiptapStyles.dialogFieldRowStyle}>
              <div style={{ flex: '1 1 140px', minWidth: 120 }}>
                <div style={tiptapStyles.dialogFieldGroupStyle}>
                  <label htmlFor="gjp-video-width" style={tiptapStyles.dialogLabelStyle}>Width (px)</label>
                  <input
                    id="gjp-video-width"
                    value={form.width}
                    onChange={(e) => setForm({ ...form, width: e.target.value })}
                    placeholder="auto"
                    style={tiptapStyles.dialogInputStyle}
                  />
                  <span style={tiptapStyles.dialogHintStyle}>Leave empty for responsive width.</span>
                </div>
              </div>
              <div style={{ flex: '1 1 140px', minWidth: 120 }}>
                <div style={tiptapStyles.dialogFieldGroupStyle}>
                  <label htmlFor="gjp-video-height" style={tiptapStyles.dialogLabelStyle}>Height (px)</label>
                  <input
                    id="gjp-video-height"
                    value={form.height}
                    onChange={(e) => setForm({ ...form, height: e.target.value })}
                    placeholder="auto"
                    style={tiptapStyles.dialogInputStyle}
                  />
                  <span style={tiptapStyles.dialogHintStyle}>Leave empty to keep aspect ratio.</span>
                </div>
              </div>
            </div>

            {errorMessage ? <div style={{ ...tiptapStyles.dialogHintStyle, color: '#dc2626' }}>{errorMessage}</div> : null}
          </div>

          <aside style={tiptapStyles.dialogPreviewWrapperStyle}>
            <div style={{ ...tiptapStyles.dialogPreviewSurfaceStyle, minHeight: 180 }}>
              {previewContent || (
                <div style={tiptapStyles.dialogPreviewEmptyStyle}>
                  Preview appears after entering a supported URL.
                </div>
              )}
            </div>
            <span style={tiptapStyles.dialogHintStyle}>
              Preview updates automatically based on the provided link and dimensions.
            </span>
          </aside>
        </div>

        <div style={tiptapStyles.dialogFooterStyle}>
          <button type="button" style={tiptapStyles.secondaryButtonStyle} onClick={() => onClose()}>Cancel</button>
          <button type="submit" style={tiptapStyles.primaryButtonStyle} disabled={source.provider == null || Boolean(dimensions.error)}>Embed video</button>
        </div>
      </form>
    </DialogWrapper>
  );
}
