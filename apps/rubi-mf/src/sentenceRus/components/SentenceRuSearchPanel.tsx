import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n/translations';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Search } from 'lucide-react';
import type { SentenceRuSearchFormData } from '../types/sentenceRu.types';
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS } from '../constants';

interface SentenceRuSearchPanelProps {
  searchFormData: SentenceRuSearchFormData;
  loading?: boolean;
  onFormChange: (field: keyof SentenceRuSearchFormData, value: any) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SentenceRuSearchPanel: React.FC<SentenceRuSearchPanelProps> = ({
  searchFormData,
  loading,
  onFormChange,
  onSearch,
  onClear,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        mb: 2,
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(25, 118, 210, 0.15)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant='h6' sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Search size={18} />
          {t('sentenceRus.search')}
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr 1fr' }, gap: 2, mb: 2.5 }}>
          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('sentenceRus.form.name')}</FormLabel>
            <TextField
              placeholder={t('sentenceRus.filters.searchByName')}
              value={searchFormData.name || ''}
              onChange={(e) => onFormChange('name', e.target.value)}
              variant='outlined'
              size='small'
            />
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('sentenceRus.form.lang')}</FormLabel>
            <Select
              value={searchFormData.lang || ''}
              onChange={(e) => onFormChange('lang', e.target.value)}
              displayEmpty
            >
              <MenuItem value=''>{t('sentenceRus.filters.all')}</MenuItem>
              {LANGUAGE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('sentenceRus.form.difficultyLevel')}</FormLabel>
            <Select
              value={searchFormData.difficultyLevel || ''}
              onChange={(e) => onFormChange('difficultyLevel', e.target.value)}
              displayEmpty
            >
              <MenuItem value=''>{t('sentenceRus.filters.all')}</MenuItem>
              {DIFFICULTY_LEVEL_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('sentenceRus.form.tags')}</FormLabel>
            <TextField
              placeholder="Tags"
              value={searchFormData.tags || ''}
              onChange={(e) => onFormChange('tags', e.target.value)}
              variant='outlined'
              size='small'
            />
          </FormControl>

          <FormControl variant='outlined' size='small' fullWidth>
            <FormLabel sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{t('sentenceRus.form.isActive')}</FormLabel>
            <Select
              value={searchFormData.isActive ?? ''}
              onChange={(e) => onFormChange('isActive', e.target.value)}
              displayEmpty
            >
              <MenuItem value=''>{t('sentenceRus.filters.all')}</MenuItem>
              <MenuItem value='true'>{t('sentenceRus.status.active')}</MenuItem>
              <MenuItem value='false'>{t('sentenceRus.status.inactive')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button onClick={onClear} variant='outlined' disabled={loading}>
            {t('sentenceRus.clearFilters')}
          </Button>
          <Button onClick={onSearch} variant='contained' disabled={loading} startIcon={<Search size={16} />}>
            {t('common.search')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SentenceRuSearchPanel;
