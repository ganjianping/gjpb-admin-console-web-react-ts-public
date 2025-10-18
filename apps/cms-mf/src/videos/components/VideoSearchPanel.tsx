import { Box, TextField, Grid, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import type { VideoSearchFormData } from '../types/video.types';

interface VideoSearchPanelProps {
  searchFormData: VideoSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof VideoSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const VideoSearchPanel: React.FC<VideoSearchPanelProps> = ({ searchFormData, loading, onFormChange, onSearch, onClear }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField fullWidth label={t('videos.filters.searchByName')} value={searchFormData.name || ''} onChange={(e) => onFormChange('name', e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField fullWidth label={t('videos.form.lang')} value={searchFormData.lang || ''} onChange={(e) => onFormChange('lang', e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField fullWidth label={t('videos.form.tags')} value={searchFormData.tags || ''} onChange={(e) => onFormChange('tags', e.target.value)} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={onClear}>{t('videos.clearFilters')}</Button>
        <Button variant="contained" onClick={onSearch}>{t('common.search')}</Button>
      </Box>
    </Box>
  );
};

export default VideoSearchPanel;
