import { Node, mergeAttributes } from '@tiptap/core';

// A minimal YouTube embed node for TipTap
// Stores a videoId and src; renders an iframe inside a wrapper div

export interface YoutubeOptions {
  HTMLAttributes?: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      insertYoutube: (attrs: { src: string; videoId?: string | null; provider?: 'youtube' | 'file'; title?: string | null; width?: string | null; height?: string | null }) => ReturnType;
    };
  }
}

export const Youtube = Node.create<YoutubeOptions>({
  name: 'youtube',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      videoId: { default: null },
      src: { default: null },
      title: { default: null },
      provider: { default: 'youtube' },
      width: { default: null },
      height: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.video-embed',
      },
      {
        tag: 'div.youtube-embed',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes ?? {}, HTMLAttributes ?? {});
    const provider = node.attrs.provider || 'youtube';
    const videoId = node.attrs.videoId || '';
    const src = node.attrs.src || (provider === 'youtube' ? `https://www.youtube.com/embed/${videoId}` : null);
    const title = node.attrs.title || 'Video';
    const width = node.attrs.width || null;
    const height = node.attrs.height || null;

    const baseClass = ['video-embed'];
    if (provider === 'youtube') baseClass.push('youtube-embed');
    if (provider === 'file') baseClass.push('video-file');
    const wrapperAttrs: Record<string, any> = {
      ...attrs,
      class: [...baseClass, ...(attrs.class ? [attrs.class] : [])].join(' '),
      'data-provider': provider,
    };

    if (provider === 'file') {
      const videoAttributes: Record<string, any> = {
        src,
        controls: 'controls',
        preload: 'metadata',
      };
      if (width) videoAttributes.width = width;
      if (height) videoAttributes.height = height;
      return ['div', wrapperAttrs, ['video', videoAttributes]];
    }

    const iframeAttributes: Record<string, any> = {
      src,
      frameborder: '0',
      allowfullscreen: 'true',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
      title,
    };
    if (width) iframeAttributes.width = width;
    if (height) iframeAttributes.height = height;

    return ['div', wrapperAttrs, ['iframe', iframeAttributes]];
  },

  addCommands() {
    return {
      insertYoutube:
        (attrs: { videoId?: string | null; src: string; title?: string | null; provider?: 'youtube' | 'file'; width?: string | null; height?: string | null }) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs: { provider: 'youtube', ...attrs } });
        },
    };
  },
});

export default Youtube;
