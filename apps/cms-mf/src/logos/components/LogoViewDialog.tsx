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
import { Eye, Image, Tag, Hash, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';
import type { Logo } from '../types/logo.types';

interface LogoViewDialogProps {
  open: boolean;
  onClose: () => void;
  logo: Logo;
  onEdit?: (logo: Logo) => void;
}

export const LogoViewDialog = ({
  open,
  onClose,
  logo,
  onEdit,
}: LogoViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('[LogoViewDialog] Failed to copy to clipboard:', error);
    }
  };

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
                  {
                    logoUrl && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
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
                            flex: 1,
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          <ExternalLink size={14} />
                          <Typography variant="body2">{logoUrl}</Typography>
                        </Link>
                        <Tooltip title={copiedField === 'imageUrl' ? t('logos.messages.filenameCopied') : 'Copy'}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopy(logoUrl, 'imageUrl')}
                            sx={{ ml: 0.5 }}
                          >
                            {copiedField === 'imageUrl' ? <Check size={16} /> : <Copy size={16} />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )
                  }
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

          {/* Details Card - Consolidated Information */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('logos.viewDialog.details')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* ID */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.id')}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all',
                      color: 'text.primary'
                    }}
                  >
                    {logo.id}
                  </Typography>
                </Box>

                {/* Grid for other fields */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                  {/* Filename */}
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      {t('logos.viewDialog.filename')}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all', flex: 1 }}>
                        {logo.filename}
                      </Typography>
                      <Tooltip title={copiedField === 'filename' ? t('logos.messages.filenameCopied') : 'Copy'}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleCopy(logo.filename, 'filename')}
                        >
                          {copiedField === 'filename' ? <Check size={16} /> : <Copy size={16} />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Extension */}
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      {t('logos.viewDialog.extension')}
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

                  {/* Original URL */}
                  {logo.originalUrl && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        {t('logos.viewDialog.originalUrl')}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
                            flex: 1,
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>
                            {logo.originalUrl}
                          </Typography>
                        </Link>
                        <Tooltip title={copiedField === 'originalUrl' ? t('logos.messages.filenameCopied') : 'Copy'}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopy(logo.originalUrl || '', 'originalUrl')}
                          >
                            {copiedField === 'originalUrl' ? <Check size={16} /> : <Copy size={16} />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  {/* Tags */}
                  {logo.tags && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                        {t('logos.viewDialog.tags')}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {logo.tags.split(',').map((tag: string) => {
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
              </Box>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('logos.viewDialog.metadata')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {/* Created At */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.createdAt')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {logo.createdAt ? format(parseISO(logo.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </Typography>
                  </Box>
                </Box>

                {/* Updated At */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.updatedAt')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {logo.updatedAt ? format(parseISO(logo.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </Typography>
                  </Box>
                </Box>

                {/* Created By */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.createdBy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {logo.createdBy || '-'}
                    </Typography>
                  </Box>
                </Box>

                {/* Updated By */}
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('logos.viewDialog.updatedBy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      {logo.updatedBy || '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button
            onClick={() => onEdit(logo)}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('common.edit')}
          </Button>
        )}
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
