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
import { Eye, Image as LucideImage, Tag, Hash, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';
import type { Image } from '../types/image.types';
import { getFullImageUrl } from '../utils/getFullImageUrl';

interface ImageViewDialogProps {
  open: boolean;
  onClose: () => void;
  image: Image;
  onEdit?: (image: Image) => void;
}

const ImageViewDialog = ({
  open,
  onClose,
  image,
  onEdit,
}: ImageViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const imageUrl = useMemo(() => {
    const resolved = getFullImageUrl(image.thumbnailFilename || image.filename || '');
    return resolved || image.originalUrl || '';
  }, [image.filename, image.thumbnailFilename, image.originalUrl]);
  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('[ImageViewDialog] Failed to copy to clipboard:', error);
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)' } } }}>
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6" component="span">{t('images.view')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {imageUrl ? (
                  <Avatar src={imageUrl} alt={image.name} sx={{ width: 64, height: 64 }} variant="rounded" />
                ) : (
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} variant="rounded">
                    <LucideImage size={32} />
                  </Avatar>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{image.name}</Typography>
                  {imageUrl && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                      <Link href={imageUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, '&:hover': { textDecoration: 'underline' } }}>
                        <ExternalLink size={14} />
                        <Typography variant="body2">{imageUrl}</Typography>
                      </Link>
                      <Tooltip title={copiedField === 'imageUrl' ? t('images.messages.filenameCopied') : 'Copy'}>
                        <IconButton size="small" onClick={() => handleCopy(imageUrl, 'imageUrl')} sx={{ ml: 0.5 }}>
                          {copiedField === 'imageUrl' ? <Check size={16} /> : <Copy size={16} />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                <Chip icon={image.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={image.isActive ? t('images.status.active') : t('images.status.inactive')} color={image.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>{t('images.viewDialog.details')}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.id')}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'text.primary' }}>{image.id}</Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.filename')}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all', flex: 1 }}>{image.filename}</Typography>
                      <Tooltip title={copiedField === 'filename' ? t('images.messages.filenameCopied') : 'Copy'}>
                        <IconButton size="small" onClick={() => handleCopy(image.filename, 'filename')}>
                          {copiedField === 'filename' ? <Check size={16} /> : <Copy size={16} />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.extension')}</Typography>
                    <Chip label={image.extension} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.language')}</Typography>
                    <Chip label={t(`images.languages.${image.lang}`)} size="small" sx={{ fontWeight: 600 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.displayOrder')}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Hash size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{image.displayOrder}</Typography>
                    </Box>
                  </Box>
                  {image.originalUrl && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.originalUrl')}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Link href={image.originalUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                          <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{image.originalUrl}</Typography>
                        </Link>
                        <Tooltip title={copiedField === 'originalUrl' ? t('images.messages.filenameCopied') : 'Copy'}>
                          <IconButton size="small" onClick={() => handleCopy(image.originalUrl || '', 'originalUrl')}>
                            {copiedField === 'originalUrl' ? <Check size={16} /> : <Copy size={16} />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                  {image.tags && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.tags')}</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {image.tags.split(',').map((tag: string) => {
                          const trimmedTag = tag.trim();
                          return (
                            <Chip key={trimmedTag} icon={<Tag size={14} />} label={trimmedTag} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>{t('images.viewDialog.metadata')}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.createdAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{image.createdAt ? format(parseISO(image.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.updatedAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{image.updatedAt ? format(parseISO(image.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.createdBy')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{image.createdBy || '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('images.viewDialog.updatedBy')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{image.updatedBy || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(image)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.edit')}</Button>
        )}
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageViewDialog;
