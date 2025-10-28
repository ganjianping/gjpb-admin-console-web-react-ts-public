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
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import '../i18n/translations';
import {
  Eye,
  Edit,
  Tag,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Calendar,
  User,
  Copy,
  Check,
} from 'lucide-react';
import type { CmsFile } from '../types/file.types';
import { getFullFileUrl } from '../utils/getFullFileUrl';

interface FileViewDialogProps {
  open: boolean;
  onClose: () => void;
  file: CmsFile;
  onEdit?: (file: CmsFile) => void;
}

const formatFileSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return '-';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
};

const tryFormatDate = (value?: string | null) => {
  if (!value) return '-';
  try {
    return format(parseISO(value), 'yyyy-MM-dd HH:mm');
  } catch {
    return value;
  }
};

const FileViewDialog = ({
  open,
  onClose,
  file,
  onEdit,
}: FileViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const filenameUrl = useMemo(() => getFullFileUrl(file.filename || ''), [file.filename]);
  const originalUrl = file.originalUrl || '';
  const formattedSize = useMemo(() => formatFileSize(file.sizeBytes), [file.sizeBytes]);

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 1500);
    } catch (error) {
      console.error('[FileViewDialog] Failed to copy to clipboard:', error);
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
      <DialogTitle
        sx={{
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Eye size={20} />
        <Typography variant="h6" component="span">
          {t('files.view')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '1px solid',
              borderColor: 'divider',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CardContent
              sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {file.name}
              </Typography>

              <Stack spacing={1.5} sx={{ width: '100%' }}>
                {filenameUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {t('files.viewDialog.filenameUrl')}
                    </Typography>
                    <Link
                      href={filenameUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        textDecoration: 'none',
                        color: 'primary.main',
                        wordBreak: 'break-all',
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
                        {filenameUrl}
                      </Typography>
                    </Link>
                    <Tooltip
                      title={
                        copiedField === 'filenameUrl'
                          ? t('files.messages.urlCopied')
                          : t('files.actions.copyUrl')
                      }
                    >
                      <IconButton size="small" onClick={() => handleCopy(filenameUrl, 'filenameUrl')}>
                        {copiedField === 'filenameUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {originalUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {t('files.viewDialog.originalUrl')}
                    </Typography>
                    <Link
                      href={originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        textDecoration: 'none',
                        color: 'primary.main',
                        wordBreak: 'break-all',
                        flex: 1,
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
                        {originalUrl}
                      </Typography>
                    </Link>
                    <Tooltip
                      title={
                        copiedField === 'originalUrl'
                          ? t('files.messages.urlCopied')
                          : t('files.actions.copyUrl')
                      }
                    >
                      <IconButton size="small" onClick={() => handleCopy(originalUrl, 'originalUrl')}>
                        {copiedField === 'originalUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}
              >
                {t('files.viewDialog.details')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}
                  >
                    {file.id}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.columns.name')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {file.name}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.sourceName')}
                  </Typography>
                  <Typography variant="body2">{file.sourceName || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.filename')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}
                  >
                    {file.filename}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.extension')}
                  </Typography>
                  <Chip label={file.extension || '-'} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.mimeType')}
                  </Typography>
                  <Typography variant="body2">{file.mimeType || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.sizeBytes')}
                  </Typography>
                  <Typography variant="body2">{formattedSize}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.lang')}
                  </Typography>
                  <Chip
                    label={t(`files.languages.${file.lang}`)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.displayOrder')}
                  </Typography>
                  <Typography variant="body2">{file.displayOrder}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.form.isActive')}
                  </Typography>
                  <Chip
                    icon={file.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    label={file.isActive ? t('files.status.active') : t('files.status.inactive')}
                    color={file.isActive ? 'success' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('files.columns.tags')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {file.tags
                      ?.split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <Chip
                          key={tag}
                          icon={<Tag size={14} />}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      ))}
                    {!file.tags && <Typography variant="body2">-</Typography>}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}
              >
                {t('files.viewDialog.metadata')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar size={18} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t('files.viewDialog.createdAt')}
                    </Typography>
                    <Typography variant="body2">{tryFormatDate(file.createdAt)}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar size={18} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t('files.viewDialog.updatedAt')}
                    </Typography>
                    <Typography variant="body2">{tryFormatDate(file.updatedAt)}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={18} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t('files.viewDialog.createdBy')}
                    </Typography>
                    <Typography variant="body2">{file.createdBy || '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={18} />
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                      {t('files.viewDialog.updatedBy')}
                    </Typography>
                    <Typography variant="body2">{file.updatedBy || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>{t('files.actions.close')}</Button>
        {onEdit && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(file)}
          startIcon={<Edit size={16} />}
        >
            {t('files.actions.edit')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FileViewDialog;
