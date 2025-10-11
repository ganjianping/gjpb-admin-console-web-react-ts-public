import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations'; // Initialize websites translations
import { Trash2, AlertTriangle } from 'lucide-react';
import type { Website } from '../types/website.types';

interface DeleteWebsiteDialogProps {
  open: boolean;
  onClose: () => void;
  website: Website | null;
  onConfirm: () => void;
  loading: boolean;
}

export const DeleteWebsiteDialog = ({
  open,
  onClose,
  website,
  onConfirm,
  loading,
}: DeleteWebsiteDialogProps) => {
  const { t } = useTranslation();

  if (!website) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        <Trash2 size={20} color="#f44336" />
        <Typography variant="h6" component="span">
          {t('websites.actions.delete')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Alert severity="warning" icon={<AlertTriangle size={20} />}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('websites.messages.deleteWarning')}
            </Typography>
          </Alert>

          <Typography variant="body1">
            {t('websites.messages.deleteConfirm')}
          </Typography>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Website Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {website.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>URL:</strong> {website.url}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Language:</strong> {website.lang}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Active:</strong> {website.isActive ? 'Yes' : 'No'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          {t('websites.actions.cancel')}
        </Button>
        
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Trash2 size={16} />}
          sx={{
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 120,
          }}
        >
          {loading ? 'Deleting...' : t('websites.actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};