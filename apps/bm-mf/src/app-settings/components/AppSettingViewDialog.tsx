import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import '../i18n/translations';
import { Eye, Edit, Copy, Calendar, User, Check } from 'lucide-react';
import type { AppSetting } from '../types/app-setting.types';

interface AppSettingViewDialogProps {
  open: boolean;
  onClose: () => void;
  appSetting: AppSetting | null;
  onEdit?: (s: AppSetting) => void;
}

export const AppSettingViewDialog = ({ open, onClose, appSetting, onEdit }: AppSettingViewDialogProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.debug('[AppSettingViewDialog] copy failed', err);
    }
  };

  if (!appSetting) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Eye size={18} />
        <Typography variant="h6">{t('appSettings.view')}</Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-all' }}>{appSetting.name}</Typography>
                <Tooltip title={copied === 'name' ? t('appSettings.messages.copied') : 'Copy'}>
                  <IconButton size="small" onClick={() => handleCopy(appSetting.name, 'name')}>
                    {copied === 'name' ? <Check size={14} /> : <Copy size={14} />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', flex: 1 }}>
                  {appSetting.value}
                </Typography>
                <Tooltip title={copied === 'value' ? t('appSettings.messages.copied') : 'Copy'}>
                  <IconButton size="small" onClick={() => handleCopy(appSetting.value, 'value')}>
                    {copied === 'value' ? <Check size={14} /> : <Copy size={14} />}
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t('appSettings.viewDialog.lang')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t(`appSettings.languages.${appSetting.lang}`) || appSetting.lang}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">{t('appSettings.viewDialog.flags')}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2">{appSetting.isSystem ? t('appSettings.flags.system') : '-'}</Typography>
                    <Typography variant="body2">{appSetting.isPublic ? t('appSettings.flags.public') : '-'}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">{t('appSettings.viewDialog.createdAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} />
                    <Typography variant="body2">{appSetting.createdAt ? format(parseISO(appSetting.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">{t('appSettings.viewDialog.updatedAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={14} />
                    <Typography variant="body2">{appSetting.updatedAt ? format(parseISO(appSetting.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" color="text.secondary">{t('appSettings.viewDialog.createdBy')}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <User size={14} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{appSetting.createdBy || '-'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" color="text.secondary">{t('appSettings.viewDialog.updatedBy')}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <User size={14} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>{appSetting.updatedBy || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        {onEdit && (
          <Button variant="contained" onClick={() => onEdit(appSetting)} startIcon={<Edit size={16} />}>
            {t('common.edit')}
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppSettingViewDialog;
