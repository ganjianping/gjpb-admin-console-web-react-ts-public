import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Switch,
  OutlinedInput,
  Chip,
  LinearProgress,
  Backdrop,
  CircularProgress,
  TextareaAutosize,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptap/tiptapTextEditor';
import '../i18n/translations';
import type { ArticleFormData } from '../types/article.types';
import { ARTICLE_TAG_SETTING_KEY, LANGUAGE_OPTIONS, ARTICLE_LANG_SETTING_KEY } from '../constants';
import { articleService } from '../services/articleService';

interface ArticleCreateDialogProps {
  open: boolean;
  onClose: () => void;
  formData: ArticleFormData;
  onFormChange: (field: keyof ArticleFormData, value: any) => void;
  loading?: boolean;
  formErrors?: Record<string, string[] | string>;
  onReset?: () => void;
  onCreated?: () => Promise<void> | void;
}

const ArticleCreateDialog = ({
  open,
  onClose,
  formData,
  onFormChange,
  loading,
  formErrors = {},
  onReset,
  onCreated,
}: ArticleCreateDialogProps) => {
  const { t, i18n } = useTranslation();
  const [localSaving, setLocalSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const tagSetting = appSettings.find((s) => s.name === ARTICLE_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[ArticleCreateDialog] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableLangOptions = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return LANGUAGE_OPTIONS;
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const langSetting =
        appSettings.find((s) => s.name === ARTICLE_LANG_SETTING_KEY && s.lang === currentLang) ||
        appSettings.find((s) => s.name === ARTICLE_LANG_SETTING_KEY);
      if (!langSetting) return LANGUAGE_OPTIONS;
      return langSetting.value.split(',').map((item) => {
        const [code, label] = item.split(':').map((s) => s.trim());
        if (label) return { value: code, label };
        const fallback = LANGUAGE_OPTIONS.find((o) => o.value === code);
        return { value: code, label: fallback ? fallback.label : code };
      });
    } catch (err) {
      console.error('[ArticleCreateDialog] Error loading lang options:', err);
      return LANGUAGE_OPTIONS;
    }
  }, [i18n.language]);

  const getFieldError = (field: string) => {
    const err = formErrors[field];
    if (Array.isArray(err)) return err.join(', ');
    return typeof err === 'string' ? err : '';
  };

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    onFormChange('tags', value.join(','));
  };

  const handleLangChange = (e: any) => {
    onFormChange('lang', e.target.value);
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFormChange('coverImageFile', file);
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    setLocalSaving(true);
    try {
      if (formData.coverImageFile) {
        await articleService.createArticleByUpload({
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
          coverImageFile: formData.coverImageFile,
          coverImageFilename: formData.coverImageFilename,
          coverImageOriginalUrl: formData.coverImageOriginalUrl,
          originalUrl: formData.originalUrl,
          sourceName: formData.sourceName,
        });
      } else {
        await articleService.createArticle({
          title: formData.title,
          summary: formData.summary,
          content: formData.content,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
          coverImageFilename: formData.coverImageFilename,
          coverImageOriginalUrl: formData.coverImageOriginalUrl,
          originalUrl: formData.originalUrl,
          sourceName: formData.sourceName,
        });
      }

      if (onReset) onReset();
      if (onCreated) {
        try {
          await onCreated();
        } catch (err) {
          console.error('[ArticleCreateDialog] onCreated callback failed', err);
        }
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create article');
    } finally {
      setLocalSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      disableEscapeKeyDown
      maxWidth="lg"
      fullWidth
    >
      {(loading || localSaving) && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
          <LinearProgress />
        </Box>
      )}
      <DialogTitle sx={{ pt: loading ? 3 : 2 }}>
        <Typography variant="h6" component="div">
          {t('articles.create')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {errorMsg && (
            <FormHelperText error sx={{ fontSize: 14 }}>
              {errorMsg}
            </FormHelperText>
          )}
          <TextField
            label={t('articles.form.title')}
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            fullWidth
            error={!!getFieldError('title')}
            helperText={getFieldError('title')}
          />
          <Box>
            <Typography variant="subtitle2">{t('articles.form.content')}</Typography>
            <TiptapTextEditor
              value={formData.content || ''}
              onChange={(html: string) => onFormChange('content', html)}
              placeholder={t('articles.form.content')}
            />
            {getFieldError('content') && <FormHelperText error>{getFieldError('content')}</FormHelperText>}
          </Box>

          <Box>
            <Typography variant="subtitle2">{t('articles.form.coverImageFile')}</Typography>
            <input type="file" accept="image/*" onChange={handleCoverFileChange} />
          </Box>
          <TextField
            label={t('articles.form.coverImageFilename')}
            value={formData.coverImageFilename || ''}
            onChange={(e) => onFormChange('coverImageFilename', e.target.value)}
            fullWidth
          />
          <TextField
            label={t('articles.form.coverImageOriginalUrl')}
            value={formData.coverImageOriginalUrl || ''}
            onChange={(e) => onFormChange('coverImageOriginalUrl', e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <Select
              multiple
              value={formData.tags ? formData.tags.split(',').filter(Boolean) : []}
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}
            >
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No tags</MenuItem>
              )}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2">{t('articles.form.summary')}</Typography>
            <TextareaAutosize
              minRows={3}
              style={{
                width: '100%',
                padding: '8.5px 14px',
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.23)',
                fontFamily: 'inherit',
              }}
              value={formData.summary || ''}
              onChange={(e) => onFormChange('summary', e.target.value)}
              aria-label={t('articles.form.summary')}
            />
            {getFieldError('summary') && <FormHelperText error>{getFieldError('summary')}</FormHelperText>}
          </Box>
          
          <TextField
            label={t('articles.form.sourceName')}
            value={formData.sourceName || ''}
            onChange={(e) => onFormChange('sourceName', e.target.value)}
            fullWidth
          />
          <TextField
            label={t('articles.form.originalUrl')}
            value={formData.originalUrl || ''}
            onChange={(e) => onFormChange('originalUrl', e.target.value)}
            fullWidth
          />
          

  <FormControl fullWidth>
            <Select value={formData.lang || ''} onChange={handleLangChange}>
              {availableLangOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t('articles.form.displayOrder')}
            type="number"
            value={String(formData.displayOrder)}
            onChange={(e) => onFormChange('displayOrder', Number(e.target.value) || 0)}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />}
            label={t('articles.form.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (onReset) {
              onReset();
            }
            onClose();
          }}
          disabled={loading || localSaving}
        >
          {t('articles.actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || localSaving}
          startIcon={loading || localSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {t('articles.actions.save')}
        </Button>
      </DialogActions>
      <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }} open={loading || localSaving}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography>{t('articles.messages.pleaseWait')}</Typography>
        </Box>
      </Backdrop>
    </Dialog>
  );
};

export default ArticleCreateDialog;
