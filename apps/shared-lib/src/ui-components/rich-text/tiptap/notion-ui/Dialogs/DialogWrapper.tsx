import React, { useEffect } from 'react';
import * as tiptapStyles from '../../styles';

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
  const { open, overlayRef, onClose: _onClose, width = 520, children } = props;

  useEffect(() => {
    const el = overlayRef?.current as HTMLElement | null;
    if (!el) return;

    // Focus the overlay for keyboard handling
    try { el.focus(); } catch { /* ignore */ }

    // Do not close the wrapper on Escape key or overlay clicks —
    // require callers to explicitly call `onClose` (usually via a Cancel button).
    // We keep focus behavior but no automatic close handlers.
    return undefined;
  }, [open, overlayRef]);

  if (!open) return null;

  return (
    <dialog ref={overlayRef as React.RefObject<HTMLDialogElement>} open style={tiptapStyles.dialogOverlayStyle} aria-modal="true">
      <div style={{ ...tiptapStyles.dialogInnerStyle, width }}>{children}</div>
    </dialog>
  );
}
