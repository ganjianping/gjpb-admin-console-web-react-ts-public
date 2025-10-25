import { useEffect, useState, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
// styles are provided to buttons and dialogs via direct imports in those components
// FloatingMenu from @tiptap/react isn't available in this build; render our own absolute menu
import ImageDialog from './tiptap/Dialogs/ImageDialog';
import LinkDialog from './tiptap/Dialogs/LinkDialog.tsx';
import { initCodeEnhancer } from './tiptap/utils/codeEnhancer';
import './tiptap/editor.css';
// icons are provided by menuItems; keep this file focused
import TableToolbar from './tiptap/TableToolbar';
import SelectionToolbar from './tiptap/SelectionToolbar';
import SlashMenu from './tiptap/SlashMenu';
import useSlashMenu from './tiptap/useSlashMenu';
import useToolbarPositioning from './tiptap/useToolbarPositioning';
import useTiptapEditor from './tiptap/useTiptapEditor';

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
  const { value = '', onChange, placeholder = 'Enter rich text...', lineHeight = 1.4, initialRows = 3 } = props;
  const editor = useTiptapEditor({ value, onChange, placeholder, initialRows });

  

  const editorContainerRef = useRef<HTMLDivElement | null>(null);
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
  }, []);

  
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
    try { handleMenuAction(id); } catch { /* ignore */ }
    if (id === 'image') {
      try {
        const s = editor.state.selection;
        setImageSelection({ from: (s as any).from, to: (s as any).to });
      } catch {
        setImageSelection(null);
      }
      setImageForm({ url: '', width: '', height: '', alt: '' });
      setImageDialogOpen(true);
    }
    if (id === 'link') {
      try {
        const s = editor.state.selection;
        setLinkSelection({ from: (s as any).from, to: (s as any).to });
      } catch {
        setLinkSelection(null);
      }
      setLinkForm({ url: 'https://', text: '' });
      setLinkDialogOpen(true);
    }
  };

  // Render the editor container, editor content, toolbars, menus, and dialogs.
  return (
    <div>
      <div ref={editorContainerRef} style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: 8, minHeight: 140, position: 'relative' }}>
        {/* Editor content */}
        <EditorContent
          editor={editor}
          className="gjp-tiptap-editor"
          style={{
            lineHeight: lineHeight,
            minHeight: 60,
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
    </div>
  </div>
  );
}
