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
import '../i18n/translations'; // Initialize websites translations
import { Eye, Globe, Tag, Hash, CheckCircle2, XCircle } from 'lucide-react';
import type { WebsiteFormData } from '../types/website.types';
import { LANGUAGE_OPTIONS } from '../constants';

interface WebsiteViewDialogProps {
  open: boolean;
  onClose: () => void;
  website: WebsiteFormData;
}

export const WebsiteViewDialog = ({
  open,
  onClose,
  website,
}: WebsiteViewDialogProps) => {
  const { t } = useTranslation();

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
          {t('websites.view')}
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
                {website.logoUrl ? (
                  <Avatar
                    src={website.logoUrl}
                    alt={website.name}
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
                    <Globe size={32} />
                  </Avatar>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {website.name}
                  </Typography>
                  <Link
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      textDecoration: 'none',
                      color: 'primary.main',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <Globe size={14} />
                    <Typography variant="body2">{website.url}</Typography>
                  </Link>
                </Box>
                <Chip
                  icon={website.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  label={website.isActive ? t('websites.status.active') : t('websites.status.inactive')}
                  color={website.isActive ? 'success' : 'default'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Description Card */}
          {website.description && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: 'text.secondary' }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                  {website.description}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Details Grid */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Details
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {/* Language */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Language
                  </Typography>
                  <Chip 
                    label={LANGUAGE_OPTIONS.find(opt => opt.value === website.lang)?.label || website.lang} 
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                {/* Display Order */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Display Order
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Hash size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {website.displayOrder}
                    </Typography>
                  </Box>
                </Box>

                {/* Tags */}
                {website.tags && (
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {website.tags.split(',').map((tag) => {
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
