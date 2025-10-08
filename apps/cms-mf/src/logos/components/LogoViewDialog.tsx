import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import { X, Image } from 'lucide-react';
import type { LogoFormData } from '../types/logo.types';

interface LogoViewDialogProps {
  open: boolean;
  onClose: () => void;
  logo: LogoFormData;
}

export const LogoViewDialog = ({
  open,
  onClose,
  logo,
}: LogoViewDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">{t('logos.view')}</Typography>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Logo Preview */}
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            {logo.logoUrl ? (
              <Avatar
                src={logo.logoUrl}
                alt={logo.name}
                sx={{ width: 120, height: 120 }}
                variant="rounded"
              />
            ) : (
              <Avatar
                sx={{ width: 120, height: 120, bgcolor: 'primary.main' }}
                variant="rounded"
              >
                <Image size={48} />
              </Avatar>
            )}
          </Box>

          {/* Logo Details */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.name')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {logo.name}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.filename')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {logo.filename}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.extension')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {logo.extension}
            </Typography>

            {logo.originalUrl && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('logos.columns.originalUrl')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-all' }}>
                  {logo.originalUrl}
                </Typography>
              </>
            )}

            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.tags')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {logo.tags || '-'}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.lang')}
            </Typography>
            <Chip label={logo.lang} size="small" sx={{ mb: 2 }} />

            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.displayOrder')}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {logo.displayOrder}
            </Typography>

            <Typography variant="subtitle2" color="text.secondary">
              {t('logos.columns.isActive')}
            </Typography>
            <Chip
              label={logo.isActive ? t('logos.status.active') : t('logos.status.inactive')}
              color={logo.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
