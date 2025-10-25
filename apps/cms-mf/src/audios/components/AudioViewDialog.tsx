import { useMemo, useState, useRef, useLayoutEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Link,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Eye, Tag, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';

import { getFullAudioUrl } from '../utils/getFullAudioUrl';
import DOMPurify from 'dompurify';
import type { Audio } from '../types/audio.types';

interface AudioViewDialogProps {
  open: boolean;
  audio: Audio;
  onClose: () => void;
  onEdit?: (audio: Audio) => void;
}

const AudioViewDialog = ({ open, onClose, audio, onEdit }: AudioViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [subtitleExpanded, setSubtitleExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  const audioUrl = useMemo(() => (audio.filename ? getFullAudioUrl(audio.filename) : ''), [audio.filename]);
  const coverUrl = useMemo(() => (audio.coverImageFilename ? getFullAudioUrl(`/cover-images/${audio.coverImageFilename}`) : ''), [audio.coverImageFilename]);
  const sizeInMB = useMemo(() => {
    try {
      const bytes = Number(audio.sizeBytes || 0);
      if (!bytes) return '0.00';
      return (bytes / 1024 / 1024).toFixed(2);
    } catch (e) {
      console.error('[AudioViewDialog] size calculation error', e);
      return '-';
    }
  }, [audio.sizeBytes]);
  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('[AudioViewDialog] Failed to copy to clipboard:', error);
    }
  };

  useLayoutEffect(() => {
    const measure = () => {
      if (audioRef?.current) {
        const h = audioRef.current.clientHeight;
        if (h && h !== playerHeight) setPlayerHeight(h);
      }
    };
    measure();
    const t = globalThis.setTimeout(measure, 120);
    globalThis.addEventListener?.('resize', measure);
    return () => {
      globalThis.clearTimeout(t as any);
      globalThis.removeEventListener?.('resize', measure as any);
    };
  }, [audioUrl, audioRef]);

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)' } } }}
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6" component="span">{t('audios.view')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {/* show cover image beside player on wide layouts; stack on small screens */}
              {(() => {
                // measure player height in layout effect (component-level hook)
                // If both cover and audio available, place side-by-side
                if (coverUrl && audioUrl) {
                  return (
                    <Box sx={{ mb: 2, maxWidth: 800, width: '100%', display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          id="audio-cover"
                          src={coverUrl}
                          alt={audio.name}
                          style={{
                            height: playerHeight ? `${playerHeight}px` : 160,
                            width: 'auto',
                            maxWidth: 320,
                            borderRadius: 8,
                            objectFit: 'cover',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 320px', minWidth: 200 }}>
                        <audio ref={audioRef} id="audio-preview" src={audioUrl} controls aria-label={audio.name} style={{ width: '100%', borderRadius: 8 }}>
                          <track kind="captions" />
                        </audio>
                      </Box>
                    </Box>
                  );
                }

                // Only audio
                if (audioUrl) {
                  return (
                    <Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center' }}>
                      <audio ref={audioRef} id="audio-preview" src={audioUrl} controls aria-label={audio.name} style={{ maxWidth: '100%', borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                        <track kind="captions" />
                      </audio>
                    </Box>
                  );
                }

                // Only cover
                if (coverUrl) {
                  return (
                    <Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center' }}>
                      <img id="audio-cover" src={coverUrl} alt={audio.name} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                    </Box>
                  );
                }

                // neither
                return (
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} variant="rounded">
                    <Eye size={32} />
                  </Avatar>
                );
              })()}
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{audio.name}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                {audioUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Audio URL:</Typography>
                    <Link href={audioUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{audioUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'audioUrl' ? t('audios.messages.filenameCopied') : 'Copy'}>
                      <IconButton size="small" onClick={() => handleCopy(audioUrl, 'audioUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'audioUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {(audio as any).originalUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('audios.viewDialog.originalUrl') || 'Original URL'}:</Typography>
                    <Link href={(audio as any).originalUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{(audio as any).originalUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'originalUrl' ? t('audios.messages.filenameCopied') : 'Copy'}>
                      <IconButton size="small" onClick={() => handleCopy((audio as any).originalUrl, 'originalUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'originalUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {coverUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Cover URL:</Typography>
                    <Link href={coverUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{coverUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'coverUrl' ? t('audios.messages.filenameCopied') : 'Copy'}>
                      <IconButton size="small" onClick={() => handleCopy(coverUrl, 'coverUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'coverUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>Audio Details</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'text.primary' }}>{audio.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{audio.name}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Description</Typography>
                  <Typography variant="body2">{audio.description}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('audios.form.subtitle') || 'Subtitle'}</Typography>
                  {((audio as any).subtitle) ? (
                    (() => {
                      const subtitleHtml = (audio as any).subtitle as string;
                      // sanitize incoming HTML from the editor before rendering
                      const sanitized = DOMPurify.sanitize(subtitleHtml || '');
                      // derive plain text to decide whether to show the toggle
                      const tmp = (typeof document !== 'undefined' && document) ? document.createElement('div') : null;
                      if (tmp) tmp.innerHTML = sanitized;
                      const plain = tmp ? (tmp.textContent || tmp.innerText || '') : sanitized.replace(/<[^>]+>/g, '');
                      const shouldShowToggle = plain.length > 240 || plain.split('\n').length > 4;

                      return (
                        <Box>
                          <Box
                            sx={{
                              whiteSpace: 'pre-wrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: subtitleExpanded ? 'none' : 4,
                              '& p': { margin: 0 },
                            }}
                            // render sanitized HTML from the editor
                            dangerouslySetInnerHTML={{ __html: sanitized }}
                          />

                          {shouldShowToggle && (
                            <Button size="small" onClick={() => setSubtitleExpanded((s) => !s)} sx={{ mt: 1, textTransform: 'none' }}>
                              {subtitleExpanded ? (t('audios.actions.less') || 'Less') : (t('audios.actions.more') || 'More...')}
                            </Button>
                          )}
                        </Box>
                      );
                    })()
                  ) : (
                    <Typography variant="body2">-</Typography>
                  )}
                </Box>
                
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Tags</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {audio.tags?.split(',').map((tag: string) => (
                      <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Source Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{audio.sourceName || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Filename</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{audio.filename}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Cover Image Filename</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{audio.coverImageFilename}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Size (MB)</Typography>
                  <Typography variant="body2">{sizeInMB === '-' ? '-' : `${sizeInMB} MB`}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Language</Typography>
                  <Chip label={t(`audios.languages.${audio.lang}`)} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Display Order</Typography>
                  <Typography variant="body2">{audio.displayOrder}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Active</Typography>
                  <Chip icon={audio.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={audio.isActive ? 'Active' : 'Inactive'} color={audio.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>Metadata</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created At</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{audio.createdAt ? format(parseISO(audio.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated At</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{audio.updatedAt ? format(parseISO(audio.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created By</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{audio.createdBy || '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated By</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{audio.updatedBy || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(audio)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.edit')}</Button>
        )}
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AudioViewDialog;
