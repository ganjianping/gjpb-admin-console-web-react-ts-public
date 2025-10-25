import { Node, mergeAttributes } from '@tiptap/core';

// A minimal YouTube embed node for TipTap
// Stores a videoId and src; renders an iframe inside a wrapper div

export interface YoutubeOptions {
  HTMLAttributes?: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtube: {
      insertYoutube: (attrs: { videoId: string; src?: string }) => ReturnType;
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div.youtube-embed',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes ?? {}, HTMLAttributes ?? {});
    const videoId = node.attrs.videoId || '';
    const src = node.attrs.src || `https://www.youtube.com/embed/${videoId}`;
    const title = node.attrs.title || 'YouTube video';
    return [
      'div',
      { ...attrs, class: ['youtube-embed', ...(attrs.class ? [attrs.class] : [])].join(' ') },
      [
        'iframe',
        {
          src,
          width: '560',
          height: '315',
          frameborder: '0',
          allowfullscreen: 'true',
          title,
        },
      ],
    ];
  },

  addCommands() {
    return {
      insertYoutube:
        (attrs: { videoId: string; src?: string; title?: string }) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
    };
  },
});

export default Youtube;
