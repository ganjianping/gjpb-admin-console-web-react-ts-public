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
import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import '../i18n/translations';
import { Eye, Image as LucideImageRu, Tag, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';
import type { ImageRu } from '../types/imageRu.types';

interface ImageRuViewDialogProps {
  open: boolean;
  onClose: () => void;
  imageRu: ImageRu;
  onEdit?: (imageRu: ImageRu) => void;
}

const ImageRuViewDialog = ({
  open,
  onClose,
  imageRu,
  onEdit,
}: ImageRuViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  // Use URLs directly from API response
  const filenameUrl = imageRu.fileUrl || '';
  const thumbnailUrl = imageRu.thumbnailFileUrl || '';
  const sizeInKB = useMemo(() => {
    try {
      const bytes = Number(imageRu.sizeBytes || 0);
      if (!bytes) return '0.00';
      return (bytes / 1024).toFixed(2);
    } catch (e) {
      return '-';
    }
  }, [imageRu.sizeBytes]);
  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('[ImageRuViewDialog] Failed to copy to clipboard:', error);
    }
  };
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
        <Typography variant="h6" component="span">{t('imageRus.view')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Big imageRu preview */}
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {filenameUrl ? (
                <Box sx={{ mb: 2, maxWidth: 800, width: '100%', textAlign: 'center' }}>
                  <img src={filenameUrl} alt={imageRu.altText || imageRu.name} style={{ maxWidth: '100%', maxHeight: 800, borderRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }} />
                </Box>
              ) : (
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} variant="rounded">
                  <LucideImageRu size={32} />
                </Avatar>
              )}
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{imageRu.name}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                {/* Clickable full URLs for filename and thumbnailFilename */}
                {filenameUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>ImageRu URL:</Typography>
                    <Link href={filenameUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{filenameUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'filenameUrl' ? t('imageRus.messages.filenameCopied') : 'Copy'}>
                      <IconButton size="small" onClick={() => handleCopy(filenameUrl, 'filenameUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'filenameUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                {thumbnailUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Thumbnail URL:</Typography>
                    <Link href={thumbnailUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{thumbnailUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'thumbnailUrl' ? t('imageRus.messages.filenameCopied') : 'Copy'}>
                      <IconButton size="small" onClick={() => handleCopy(thumbnailUrl, 'thumbnailUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'thumbnailUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
          {/* Details grid for all metadata fields */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>ImageRu Details</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'text.primary' }}>{imageRu.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{imageRu.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Source Name</Typography>
                  <Typography variant="body2">{imageRu.sourceName}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Filename</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{imageRu.filename}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Thumbnail Filename</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{imageRu.thumbnailFilename}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Extension</Typography>
                  <Chip label={imageRu.extension} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>MIME Type</Typography>
                  <Typography variant="body2">{imageRu.mimeType}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Size (KB)</Typography>
                  <Typography variant="body2">{sizeInKB !== '-' ? `${sizeInKB} KB` : '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Width</Typography>
                  <Typography variant="body2">{imageRu.width}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Height</Typography>
                  <Typography variant="body2">{imageRu.height}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Language</Typography>
                  <Chip label={t(`imageRus.languages.${imageRu.lang}`)} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Display Order</Typography>
                  <Typography variant="body2">{imageRu.displayOrder}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Active</Typography>
                  <Chip icon={imageRu.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={imageRu.isActive ? 'Active' : 'Inactive'} color={imageRu.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Alt Text</Typography>
                  <Typography variant="body2">{imageRu.altText}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Tags</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {imageRu.tags?.split(',').map((tag: string) => (
                      <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Original URL</Typography>
                  <Link href={imageRu.originalUrl} target="_blank" rel="noopener noreferrer" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.875rem' }}>{imageRu.originalUrl}</Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>{t('imageRus.viewDialog.metadata')}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('imageRus.viewDialog.createdAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{imageRu.createdAt ? format(parseISO(imageRu.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('imageRus.viewDialog.updatedAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{imageRu.updatedAt ? format(parseISO(imageRu.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('imageRus.viewDialog.createdBy')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{imageRu.createdBy || '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('imageRus.viewDialog.updatedBy')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{imageRu.updatedBy || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(imageRu)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.edit')}</Button>
        )}
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageRuViewDialog;
