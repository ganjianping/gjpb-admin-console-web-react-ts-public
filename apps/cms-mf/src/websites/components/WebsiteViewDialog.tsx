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
import { getFullLogoUrl } from '../utils/getFullLogoUrl';
import { LANGUAGE_OPTIONS } from '../constants';

import type { Website } from '../types/website.types';

interface WebsiteViewDialogProps {
  open: boolean;
  onClose: () => void;
  website: Website;
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
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
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
                    src={getFullLogoUrl(website.logoUrl)}
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
                {/* Row 1: ID & Language */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>ID</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{website.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Language</Typography>
                  <Chip label={LANGUAGE_OPTIONS.find(opt => opt.value === website.lang)?.label || website.lang} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                {/* Row 2: Display Order & Active */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Display Order</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Hash size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{website.displayOrder}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Active</Typography>
                  <Chip icon={website.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={website.isActive ? 'Yes' : 'No'} color={website.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                </Box>
                {/* Row 3: Logo URL (label, value below with copy icon) */}
                <Box sx={{ gridColumn: '1 / 3' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Logo URL</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <a href={getFullLogoUrl(website.logoUrl)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', wordBreak: 'break-all', fontWeight: 600 }}>
                      {getFullLogoUrl(website.logoUrl)}
                    </a>
                    <button
                      style={{ marginLeft: 4, padding: '2px 8px', fontSize: 12, cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc', background: '#f5f5f5' }}
                      onClick={() => navigator.clipboard.writeText(getFullLogoUrl(website.logoUrl))}
                      title="Copy Logo URL"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10 1.5A1.5 1.5 0 0 1 11.5 3v1h-1V3a.5.5 0 0 0-.5-.5H4A1.5 1.5 0 0 0 2.5 4v8A1.5 1.5 0 0 0 4 13.5h6A1.5 1.5 0 0 0 11.5 12v-1h1v1A2.5 2.5 0 0 1 10 14.5H4A2.5 2.5 0 0 1 1.5 12V4A2.5 2.5 0 0 1 4 1.5h6z"/><path d="M13.5 2.5A1.5 1.5 0 0 1 15 4v6a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 10V4A1.5 1.5 0 0 1 7 2.5h6zm-6 1A.5.5 0 0 0 7 4v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5h-6z"/></svg>
                    </button>
                  </Box>
                </Box>
                {/* Row 4: Tags (full row) */}
                {website.tags && (
                  <Box sx={{ gridColumn: '1 / 3' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Tags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {website.tags.split(',').map((tag) => {
                        const trimmedTag = tag.trim();
                        return (
                          <Chip key={trimmedTag} icon={<Tag size={14} />} label={trimmedTag} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                        );
                      })}
                    </Box>
                  </Box>
                )}
                {/* Tags Array */}
              </Box>
            </CardContent>
          </Card>

          {/* Metadata Card: Created/Updated At/By */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                Metadata
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                {/* Created At */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created At</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{website.createdAt ? website.createdAt : 'N/A'}</Typography>
                </Box>
                {/* Updated At */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated At</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{website.updatedAt ? website.updatedAt : 'N/A'}</Typography>
                </Box>
                {/* Created By */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Created By</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{website.createdBy ? website.createdBy : 'N/A'}</Typography>
                </Box>
                {/* Updated By */}
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Updated By</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{website.updatedBy ? website.updatedBy : 'N/A'}</Typography>
                </Box>
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
