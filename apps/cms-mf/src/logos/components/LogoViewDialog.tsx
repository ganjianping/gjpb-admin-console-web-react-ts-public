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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import '../i18n/translations';
import { Eye, Image, Tag, Hash, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
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

  // Get logo base URL from local storage and construct full logo URL
  const logoUrl = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings || !logo.filename) return null;

      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const logoBaseUrlSetting = appSettings.find(
        (setting) => setting.name === 'logo_base_url'
      );

      if (!logoBaseUrlSetting) return null;

      const baseUrl = logoBaseUrlSetting.value.endsWith('/') 
        ? logoBaseUrlSetting.value 
        : `${logoBaseUrlSetting.value}/`;
      
      return `${baseUrl}${logo.filename}`;
    } catch (error) {
      console.error('[LogoViewDialog] Error constructing logo URL:', error);
      return null;
    }
  }, [logo.filename]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
          },
        },
      }}
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
          {t('logos.view')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Header Card with Logo and Name */}
          <Card 
            elevation={0}
            sx={{ 
              background: (theme) => theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {logoUrl ? (
                  <Avatar
                    src={logoUrl}
                    alt={logo.name}
                    sx={{ width: 64, height: 64 }}
                    variant="rounded"
                  />
                ) : (
                  <Avatar
                    sx={{ 
                      width: 64, 
                      height: 64,
                      bgcolor: 'primary.main',
                    }}
                    variant="rounded"
                  >
                    <Image size={32} />
                  </Avatar>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {logo.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {logo.filename}
                  </Typography>
                </Box>
                <Chip
                  icon={logo.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  label={logo.isActive ? t('logos.status.active') : t('logos.status.inactive')}
                  color={logo.isActive ? 'success' : 'default'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Original URL Card */}
          {logo.originalUrl && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                  {t('logos.viewDialog.originalUrl')}
                </Typography>
                <Link
                  href={logo.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    textDecoration: 'none',
                    color: 'primary.main',
                    wordBreak: 'break-all',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <ExternalLink size={14} />
                  <Typography variant="body2">{logo.originalUrl}</Typography>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Logo URL Card */}
          {logoUrl && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                  {t('logos.viewDialog.imageUrl')}
                </Typography>
                <Link
                  href={logoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    textDecoration: 'none',
                    color: 'primary.main',
                    wordBreak: 'break-all',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <ExternalLink size={14} />
                  <Typography variant="body2">{logoUrl}</Typography>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Details Grid */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('logos.viewDialog.details')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {/* File Extension */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.fileExtension')}
                  </Typography>
                  <Chip 
                    label={logo.extension} 
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Language */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.language')}
                  </Typography>
                  <Chip 
                    label={t(`logos.languages.${logo.lang}`)} 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Display Order */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.displayOrder')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Hash size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {logo.displayOrder}
                    </Typography>
                  </Box>
                </Box>

                {/* Tags */}
                {logo.tags && (
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      {t('logos.viewDialog.tags')}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {logo.tags.split(',').map((tag) => {
                        const trimmedTag = tag.trim();
                        return (
                          <Chip
                            key={trimmedTag}
                            icon={<Tag size={14} />}
                            label={trimmedTag}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
