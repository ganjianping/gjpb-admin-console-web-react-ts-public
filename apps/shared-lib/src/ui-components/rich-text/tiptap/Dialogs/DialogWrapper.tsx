import React, { useEffect } from 'react';
import * as tiptapStyles from '../styles';

interface DialogWrapperProps {
  open: boolean;
  overlayRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
  width?: number | string;
  children: React.ReactNode;
}

// Lightweight, non-native modal overlay implemented with divs. This avoids
// browser <dialog> interactions which can interfere with other dialogs on the page.
export default function DialogWrapper(props: Readonly<DialogWrapperProps>) {
  const { open, overlayRef, onClose, width = 520, children } = props;

  useEffect(() => {
    const el = overlayRef?.current as HTMLElement | null;
    if (!el) return;

    // Focus the overlay for keyboard handling
    try { el.focus(); } catch { /* ignore */ }

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const onClick = (e: MouseEvent) => {
      if (e.target === el) onClose();
    };
    document.addEventListener('keydown', onKey);
    el.addEventListener('click', onClick as EventListener);
    return () => {
      document.removeEventListener('keydown', onKey);
      el.removeEventListener('click', onClick as EventListener);
    };
  }, [open, overlayRef]);

  if (!open) return null;

  return (
    <dialog ref={overlayRef as React.RefObject<HTMLDialogElement>} open style={tiptapStyles.dialogOverlayStyle} aria-modal="true">
      <div style={{ ...tiptapStyles.dialogInnerStyle, width }}>{children}</div>
    </dialog>
  );
}
