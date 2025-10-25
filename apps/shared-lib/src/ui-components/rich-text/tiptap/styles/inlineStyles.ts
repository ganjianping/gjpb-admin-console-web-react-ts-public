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
  background: 'rgba(0,0,0,0.35)',
  borderRadius: 10,
  border: 'none',
  padding: 6
};

export const dialogInnerStyle: CSSProperties = {
  width: 520,
  background: 'white',
  borderRadius: 10,
  padding: 20
};

export const dialogInputStyle: CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d0d5dd',
  background: '#f9fafb',
  fontSize: 14,
  transition: 'border-color 120ms ease, box-shadow 120ms ease'
};

export const dialogFormStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18
};

export const dialogHeaderStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6
};

export const dialogTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 600,
  color: '#111827'
};

export const dialogDescriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: '#4b5563',
  lineHeight: 1.5
};

export const dialogBodyStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 20
};

export const dialogFieldColumnStyle: CSSProperties = {
  flex: '1 1 240px',
  display: 'flex',
  flexDirection: 'column',
  gap: 14
};

export const dialogFieldGroupStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6
};

export const dialogFieldRowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap'
};

export const dialogLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.2,
  textTransform: 'uppercase',
  color: '#475467'
};

export const dialogHintStyle: CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
  lineHeight: 1.4
};

export const dialogPreviewWrapperStyle: CSSProperties = {
  flex: '0 0 180px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10
};

export const dialogPreviewSurfaceStyle: CSSProperties = {
  borderRadius: 10,
  background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
  border: 'none',
  padding: 8,
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};

export const dialogPreviewImageStyle: CSSProperties = {
  maxWidth: '100%',
  maxHeight: '100%',
  borderRadius: 6,
  boxShadow: '0 12px 30px rgba(15,23,42,0.18)',
  objectFit: 'contain',
  background: 'white'
};

export const dialogPreviewEmptyStyle: CSSProperties = {
  fontSize: 13,
  color: '#94a3b8',
  textAlign: 'center',
  padding: '16px 8px'
};

export const dialogFooterStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 4
};

export const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  padding: '8px 14px',
  background: '#0f172a',
  color: 'white',
  border: '1px solid #0f172a',
  fontWeight: 600,
  boxShadow: '0 8px 20px rgba(15,23,42,0.18)'
};

export const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  padding: '8px 14px',
  background: 'white',
  color: '#0f172a',
  fontWeight: 600
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
