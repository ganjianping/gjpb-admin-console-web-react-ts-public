import { useEffect, useState, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import { IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
// styles are provided to buttons and dialogs via direct imports in those components
// FloatingMenu from @tiptap/react isn't available in this build; render our own absolute menu
import ImageDialog from './dialogs/ImageDialog';
import LinkDialog from './dialogs/LinkDialog';
import YoutubeDialog from './dialogs/YoutubeDialog';
import { initCodeEnhancer } from './utils/codeEnhancer';
import './styles/editor.css';
// icons are provided by menuItems; keep this file focused
import TableToolbar from './components/TableToolbar';
import SelectionToolbar from './components/SelectionToolbar';
import SlashMenu from './components/SlashMenu';
import useSlashMenu from './hooks/useSlashMenu';
import useToolbarPositioning from './hooks/useToolbarPositioning';
import useTiptapEditor from './hooks/useTiptapEditor';

// TiptapTextEditor
// - Props: value, onChange, placeholder, initialRows
// - Uses hooks: useTiptapEditor (editor init + sanitization), useSlashMenu (slash commands),
//   useToolbarPositioning (selection/table toolbar coords).
// - Dialogs (image/link) are kept here because they manage native <dialog> focus and selection snapshots.

interface TiptapTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  /** Number of empty paragraph rows to show when editor is initially empty */
  initialRows?: number;
  lineHeight?: number | string;
}

export default function TiptapTextEditor(props: Readonly<TiptapTextEditorProps>) {
  const { value = '', onChange, placeholder = 'Enter rich text...', lineHeight = 1.8, initialRows = 0 } = props;
  const editor = useTiptapEditor({ value, onChange, placeholder, initialRows });

  // Calculate dynamic minHeight based on initialRows and lineHeight
  const lineHeightNum = typeof lineHeight === 'number' ? lineHeight : Number.parseFloat(String(lineHeight)) || 1.8;
  const fontSize = 16; // Base font size in px
  const singleLineHeight = fontSize * lineHeightNum;
  const calculatedMinHeight = Math.max(singleLineHeight * initialRows, singleLineHeight);

  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  // Fullscreen-like (in-page full-window) state: use a fixed-position overlay that stays in the same browser window/screen
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // When entering fullscreen, lock body scroll and attach Escape handler to exit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
    if (isFullscreen) {
      // lock body scroll
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = prevOverflow;
        document.removeEventListener('keydown', onKey);
      };
    }
    return undefined;
  }, [isFullscreen]);
  // Image dialog state (kept in host to manage native <dialog> focus and selection snapshot)
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageForm, setImageForm] = useState({ url: '', width: '', height: '', alt: '' });
  const imageOverlayRef = useRef<HTMLDialogElement | null>(null);
  const [imageSelection, setImageSelection] = useState<{ from: number; to: number } | null>(null);
  // Link dialog state (kept in host; hooks perform editor transformations)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkForm, setLinkForm] = useState({ url: '', text: '' });
  const linkOverlayRef = useRef<HTMLDialogElement | null>(null);
  const [linkSelection, setLinkSelection] = useState<{ from: number; to: number } | null>(null);
  // Youtube dialog state (host-managed for preview + validation)
  const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
  const [youtubeForm, setYoutubeForm] = useState({ url: '', width: '', height: '' });
  const youtubeOverlayRef = useRef<HTMLDialogElement | null>(null);
  const [youtubeSelection, setYoutubeSelection] = useState<{ from: number; to: number } | null>(null);

  // Slash menu handled by `useSlashMenu` (caret coords, query, keyboard, actions); UI is `SlashMenu`.
  const {
    slashOpen,
    menuCoords,
    menuItems,
    filteredItems,
    selectedIndex,
    openSubmenu,
    setOpenSubmenu,
    openSlashMenuAt,
    handleMenuAction,
    handleKeyDown,
  } = useSlashMenu(editor, editorContainerRef);
  // Selection/table toolbar coords from `useToolbarPositioning` (returns visibility + coords)
  const { selToolbarOpen, selToolbarCoords, showTableToolbar, tableToolbarCoords } = useToolbarPositioning(editor, editorContainerRef);

  // Focus the dialog overlay when opened so Escape closes it.
  useEffect(() => {
    const el = imageOverlayRef.current;
    if (!el) return;
    const otherOpen = document.querySelector('dialog[open]');
    if (imageDialogOpen) {
      // Only focus the overlay if there's no other native dialog open or it's this one
      if (!otherOpen || otherOpen === el) {
        try { el.focus(); } catch { /* ignore */ }
      }
    }
  }, [imageDialogOpen]);

  // Close the dialog on Escape for keyboard accessibility.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setImageDialogOpen(false); };
    if (imageDialogOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [imageDialogOpen]);

  // Link dialog focus/close handled here (host) so hooks run before DOM dialog interactions.
  useEffect(() => {
    const el = linkOverlayRef.current;
    if (!el) return;
    const otherOpen = document.querySelector('dialog[open]');
    if (linkDialogOpen) {
      if (!otherOpen || otherOpen === el) {
        try { el.focus(); } catch { /* ignore */ }
      }
    }
  }, [linkDialogOpen]);

  useEffect(() => {
    const onKeyLink = (e: KeyboardEvent) => { if (e.key === 'Escape') setLinkDialogOpen(false); };
    if (linkDialogOpen) document.addEventListener('keydown', onKeyLink);
    return () => document.removeEventListener('keydown', onKeyLink);
  }, [linkDialogOpen]);

  useEffect(() => {
    const el = youtubeOverlayRef.current;
    if (!el) return;
    const otherOpen = document.querySelector('dialog[open]');
    if (youtubeDialogOpen) {
      if (!otherOpen || otherOpen === el) {
        try { el.focus(); } catch { /* ignore */ }
      }
    }
  }, [youtubeDialogOpen]);

  useEffect(() => {
    const onKeyYoutube = (e: KeyboardEvent) => { if (e.key === 'Escape') setYoutubeDialogOpen(false); };
    if (youtubeDialogOpen) document.addEventListener('keydown', onKeyYoutube);
    return () => document.removeEventListener('keydown', onKeyYoutube);
  }, [youtubeDialogOpen]);

  // Listen for a custom event to open the link dialog (toolbar buttons emit this).
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const ev = e as CustomEvent<{ selectedText?: string }>;
        const selected = ev?.detail?.selectedText || '';
        // capture current editor selection before the dialog steals focus
        if (editor) {
          try {
            const s = editor.state.selection;
            setLinkSelection({ from: (s as any).from, to: (s as any).to });
          } catch {
            setLinkSelection(null);
          }
        }
        setLinkForm({ url: 'https://', text: selected });
        setLinkDialogOpen(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('failed to open link dialog from event', err);
      }
    };
    globalThis.addEventListener('gjp-open-link-dialog', handler as EventListener);
    return () => globalThis.removeEventListener('gjp-open-link-dialog', handler as EventListener);
  }, [editor]);

  

  // Initialize code enhancer (adds copy buttons/gutters) and cleanup on unmount.
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    try {
      cleanup = initCodeEnhancer('.gjp-tiptap-editor');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('initCodeEnhancer failed', err);
    }
    return () => { try { cleanup?.(); } catch { /* ignore */ } };
  }, []);

  // Handle slash menu actions that need host intervention (dialogs).
  const handleMenuActionLocal = (id: string) => {
    // Capture the selection BEFORE handleMenuAction deletes the slash
    let capturedSelection: { from: number; to: number } | null = null;
    let selectedText = '';
    
    if (id === 'image' || id === 'link' || id === 'youtube') {
      try {
        const s = editor.state.selection;
        // The handleMenuAction will delete the slash, so we need to save current position
        capturedSelection = { from: (s as any).from, to: (s as any).to };
        
        // Extract selected text for the link dialog
        if (id === 'link' && s.from !== s.to) {
          try {
            selectedText = editor.state.doc.textBetween(s.from, s.to, ' ');
          } catch {
            selectedText = '';
          }
        }
      } catch {
        capturedSelection = null;
      }
    }

    // Now call handleMenuAction which will delete the slash and query
    try { handleMenuAction(id); } catch { /* ignore */ }
    
    // After handleMenuAction, we need to capture the NEW cursor position
    // because handleMenuAction deleted the slash and moved the cursor
    if (id === 'image' || id === 'link' || id === 'youtube') {
      try {
        // Get the cursor position AFTER deletion
        const s = editor.state.selection;
        capturedSelection = { from: (s as any).from, to: (s as any).to };
      } catch {
        // Keep the original captured selection if this fails
      }
    }
    
    // After handleMenuAction, open dialogs with the captured selection
    if (id === 'image') {
      setImageSelection(capturedSelection);
      setImageForm({ url: '', width: '', height: '', alt: '' });
      setImageDialogOpen(true);
    }
    if (id === 'link') {
      setLinkSelection(capturedSelection);
      setLinkForm({ url: 'https://', text: selectedText });
      setLinkDialogOpen(true);
    }
    if (id === 'youtube') {
      setYoutubeSelection(capturedSelection);
      setYoutubeForm({ url: '', width: '', height: '' });
      setYoutubeDialogOpen(true);
    }
  };

  // Render the editor container, editor content, toolbars, menus, and dialogs.
  return (
    <div>
      <div
        ref={editorContainerRef}
        style={{
          border: isFullscreen ? 'none' : '1px solid rgba(0,0,0,0.12)',
          borderRadius: isFullscreen ? 0 : 6,
          padding: isFullscreen ? 16 : 8,
          minHeight: isFullscreen ? '100vh' : calculatedMinHeight + 16,
          position: isFullscreen ? 'fixed' : 'relative',
          top: isFullscreen ? 0 : undefined,
          left: isFullscreen ? 0 : undefined,
          right: isFullscreen ? 0 : undefined,
          bottom: isFullscreen ? 0 : undefined,
          width: isFullscreen ? '100%' : undefined,
          height: isFullscreen ? '100vh' : undefined,
          overflow: isFullscreen ? 'auto' : undefined,
          zIndex: isFullscreen ? 1400 : undefined,
          background: isFullscreen ? '#fff' : undefined,
          boxShadow: isFullscreen ? '0 4px 20px rgba(0,0,0,0.12)' : undefined,
        }}
      >
        <IconButton
          size="small"
          aria-pressed={isFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
          sx={{
            position: 'absolute',
            top: 2,
            right: 12,
            zIndex: 1401,
            backgroundColor: 'rgba(255,255,255,0.95)',
            border: '1px solid rgba(0,0,0,0.08)',
            padding: '6px',
            borderRadius: 1,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
        >
          {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
        </IconButton>
        {/* Editor content */}
        <EditorContent
          editor={editor}
          className="gjp-tiptap-editor"
          style={{
            lineHeight: lineHeight,
            minHeight: isFullscreen ? 'calc(100vh - 96px)' : calculatedMinHeight,
          }}
          onKeyDown={(e: any) => {
            // let the slash hook handle navigation/selection when open
            try {
              if (handleKeyDown(e)) return;
            } catch { /* ignore */ }

            // detect slash key to open the Notion-like menu
            if (e.key === '/') {
              try {
                const pos = editor.state.selection.from;
                // schedule open on next tick so the slash is in the document
                setTimeout(() => openSlashMenuAt(pos), 0);
              } catch {
                // ignore
              }
            }
          }}
        />

        {/* Selection toolbar (extracted) */}
        <SelectionToolbar editor={editor} selToolbarOpen={selToolbarOpen} selToolbarCoords={selToolbarCoords} />

        {/* Notion-like Floating Menu (custom absolute positioned when user types '/') */}
        <SlashMenu
          open={slashOpen}
          menuCoords={menuCoords}
          menuItems={menuItems}
          filteredItems={filteredItems}
          selectedIndex={selectedIndex}
          openSubmenu={openSubmenu}
          setOpenSubmenu={setOpenSubmenu}
          handleMenuAction={handleMenuActionLocal}
        />

        {/* Table toolbar: quick table operations when inside a table (extracted) */}
        <TableToolbar
          editor={editor}
          visible={showTableToolbar}
          selToolbarOpen={selToolbarOpen}
          selToolbarCoords={selToolbarCoords}
          tableToolbarCoords={tableToolbarCoords}
        />

        <ImageDialog
          editor={editor}
          open={imageDialogOpen}
          overlayRef={imageOverlayRef}
          form={imageForm}
          setForm={setImageForm}
          selection={imageSelection}
          onClose={() => setImageDialogOpen(false)}
        />

        <LinkDialog
          editor={editor}
          open={linkDialogOpen}
          overlayRef={linkOverlayRef}
          form={linkForm}
          setForm={setLinkForm}
          selection={linkSelection}
          onClose={() => setLinkDialogOpen(false)}
        />

        <YoutubeDialog
          editor={editor}
          open={youtubeDialogOpen}
          overlayRef={youtubeOverlayRef}
          form={youtubeForm}
          setForm={setYoutubeForm}
          selection={youtubeSelection}
          onClose={() => setYoutubeDialogOpen(false)}
        />
    </div>
  </div>
  );
}
