import type { CSSProperties } from 'react';

export const toolbarStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginBottom: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
};

export const buttonStyle: CSSProperties = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid rgba(0,0,0,0.08)',
  background: 'white',
  cursor: 'pointer',
};

export const activeStyle: CSSProperties = {
  background: 'rgba(0,0,0,0.06)',
};

export const dialogOverlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20000,
  background: 'rgba(0,0,0,0.35)'
};

export const dialogInnerStyle: CSSProperties = {
  width: 520,
  background: 'white',
  borderRadius: 8,
  padding: 16,
  boxShadow: '0 8px 24px rgba(16,24,40,0.2)'
};

export const dialogInputStyle: CSSProperties = {
  padding: 8,
  borderRadius: 6,
  border: '1px solid #e5e7eb'
};

export const bubbleMenuStyle: CSSProperties = {
  position: 'absolute',
  transform: 'translateX(-50%)',
  zIndex: 9999,
};

export const bubbleInnerStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  padding: 8,
  alignItems: 'center',
};

export default {} as const;
