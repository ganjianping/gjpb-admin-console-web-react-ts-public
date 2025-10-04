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
import '../../i18n/i18n.config'; // Initialize app settings translations
import { Trash2, AlertTriangle } from 'lucide-react';
import type { AppSetting } from '../services/appSettingService';

interface DeleteAppSettingDialogProps {
  open: boolean;
  onClose: () => void;
  appSetting: AppSetting | null;
  onConfirm: () => void;
  loading: boolean;
}

export const DeleteAppSettingDialog = ({
  open,
  onClose,
  appSetting,
  onConfirm,
  loading,
}: DeleteAppSettingDialogProps) => {
  const { t } = useTranslation();

  if (!appSetting) return null;

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
          {t('appSettings.actions.delete')}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="warning" icon={<AlertTriangle size={20} />}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {t('appSettings.messages.deleteWarning')}
            </Typography>
          </Alert>

          <Typography variant="body1">
            {t('appSettings.messages.deleteConfirm')}
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
              Setting Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Name:</strong> {appSetting.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Language:</strong> {appSetting.lang}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>System:</strong> {appSetting.isSystem ? 'Yes' : 'No'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Public:</strong> {appSetting.isPublic ? 'Yes' : 'No'}
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
          {t('appSettings.actions.cancel')}
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
          {loading ? 'Deleting...' : t('appSettings.actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};