import React, { useMemo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Typography,
  TextareaAutosize,
  LinearProgress,
  Backdrop,
  CircularProgress,
  FormHelperText,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { ContentCopy as ContentCopyIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TiptapTextEditor from '../../../../shared-lib/src/ui-components/rich-text/tiptap/tiptapTextEditor';
import '../i18n/translations';
import type { ArticleFormData, ArticleImage } from '../types/article.types';
import { ARTICLE_TAG_SETTING_KEY, LANGUAGE_OPTIONS, ARTICLE_LANG_SETTING_KEY } from '../constants';
import { articleService } from '../services/articleService';
import { getFullArticleCoverImageUrl } from '../utils/getFullArticleCoverImageUrl';

interface ArticleEditDialogProps {
  open: boolean;
  articleId?: string;
  formData: ArticleFormData;
  onFormChange: (field: keyof ArticleFormData, value: any) => void;
  onSubmit: (useFormData?: boolean) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  formErrors?: Record<string, string[] | string>;
}

const ArticleEditDialog: React.FC<ArticleEditDialogProps> = ({
  open,
  articleId,
  formData,
  onFormChange,
  onSubmit,
  onClose,
  loading,
  formErrors = {},
}) => {
  const { i18n, t } = useTranslation();
  const [localSaving, setLocalSaving] = useState(false);
  const [images, setImages] = useState<ArticleImage[]>([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileFilename, setUploadFileFilename] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open && articleId) {
      loadImages();
    } else {
      setImages([]);
    }
    setErrorMessage(null);
  }, [open, articleId]);

  const coverImagePreviewUrl = useMemo(() => {
    if (formData.coverImageFile) {
      return URL.createObjectURL(formData.coverImageFile);
    }
    if (formData.coverImageFilename) {
      return getFullArticleCoverImageUrl(`/${formData.coverImageFilename}`);
    }
    if (formData.coverImageOriginalUrl) {
      return formData.coverImageOriginalUrl;
    }
    return '';
  }, [formData.coverImageFile, formData.coverImageOriginalUrl, formData.coverImageFilename]);

  useEffect(() => {
    return () => {
      if (formData.coverImageFile && coverImagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(coverImagePreviewUrl);
      }
    };
  }, [coverImagePreviewUrl, formData.coverImageFile]);

  const loadImages = async () => {
    if (!articleId) return;
    try {
      const res = await articleService.getArticleImages(articleId);
      if (res.data) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Failed to load images', err);
    }
  };

  const handleUploadByUrl = async () => {
    if (!articleId || !uploadUrl || !uploadFilename) return;
    try {
      setLocalSaving(true);
      await articleService.uploadArticleImageByUrl({
        articleId,
        articleTitle: formData.title,
        originalUrl: uploadUrl,
        filename: uploadFilename,
        lang: formData.lang,
      });
      setUploadUrl('');
      setUploadFilename('');
      await loadImages();
    } catch (err) {
      console.error('Failed to upload image by url', err);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleUploadByFile = async () => {
    if (!articleId || !uploadFile || !uploadFileFilename) return;
    try {
      setLocalSaving(true);
      await articleService.uploadArticleImageByFile({
        articleId,
        articleTitle: formData.title,
        file: uploadFile,
        filename: uploadFileFilename,
      });
      setUploadFile(null);
      setUploadFileFilename('');
      await loadImages();
    } catch (err) {
      console.error('Failed to upload image by file', err);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleDeleteImageClick = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;
    try {
      setLocalSaving(true);
      await articleService.deleteArticleImage(imageToDelete);
      await loadImages();
    } catch (err) {
      console.error('Failed to delete image', err);
    } finally {
      setLocalSaving(false);
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    if (file) {
      setUploadFileFilename(file.name);
    }
  };

  const getFieldError = (field: string) => {
    const err = formErrors[field];
    if (Array.isArray(err)) return err.join(', ');
    return typeof err === 'string' ? err : '';
  };

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const tagSetting = appSettings.find(
        (s) => s.name === ARTICLE_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[ArticleEditDialog] Error loading tags:', err);
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
      console.error('[ArticleEditDialog] Error loading lang options:', err);
      return LANGUAGE_OPTIONS;
    }
  }, [i18n.language]);

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
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1200 }}>
          <LinearProgress />
        </Box>
      )}
      <DialogTitle>{t('articles.edit')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <TextField
            label={t('articles.form.title')}
            value={formData.title}
            onChange={(e) => onFormChange('title', e.target.value)}
            fullWidth
            error={!!getFieldError('title')}
            helperText={getFieldError('title')}
          />

          <Box>
            <Typography variant="subtitle2">{t('articles.form.summary')}</Typography>
            <TextareaAutosize
              minRows={2}
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

          <Box>
            <Typography variant="subtitle2">{t('articles.form.content')}</Typography>
            <TiptapTextEditor
              value={formData.content || ''}
              onChange={(html: string) => onFormChange('content', html)}
              placeholder={t('articles.form.content')}
            />
            {getFieldError('content') && <FormHelperText error>{getFieldError('content')}</FormHelperText>}
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

          <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t('articles.form.coverImageFile')}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                {coverImagePreviewUrl ? (
                  <Card sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={coverImagePreviewUrl}
                      alt="Cover Image"
                    />
                    {formData.coverImageFile && (
                      <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}>
                        <Tooltip title="Clear Selection">
                          <IconButton
                            size="small"
                            onClick={() => onFormChange('coverImageFile', null)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Card>
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed #ccc',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      No Cover Image
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
              <Button variant="outlined" component="label">
                Upload File
                <input type="file" hidden accept="image/*" onChange={handleCoverFileChange} />
              </Button>
              <Typography variant="body2" sx={{ ml: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                {formData.coverImageFile
                  ? formData.coverImageFile.name
                  : formData.coverImageFilename || t('articles.messages.noFileSelected', 'No file selected')}
              </Typography>
            </Box>

            <TextField
              label={t('articles.form.coverImageFilename')}
              value={formData.coverImageFilename || ''}
              onChange={(e) => onFormChange('coverImageFilename', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label={t('articles.form.coverImageOriginalUrl')}
              value={formData.coverImageOriginalUrl || ''}
              onChange={(e) => onFormChange('coverImageOriginalUrl', e.target.value)}
              fullWidth
            />
          </Box>

          {articleId && (
            <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Article Images
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                {images.map((img) => (
                  <Grid size={{ xs: 4, sm: 3, md: 2 }} key={img.id}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={img.fileUrl || img.originalUrl || ''}
                        alt={img.filename}
                      />
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="caption" noWrap display="block">
                          {img.filename}
                        </Typography>
                      </CardContent>
                      <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)', display: 'flex' }}>
                        {img.fileUrl && (
                          <Tooltip title="Copy URL">
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(img.fileUrl!);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Image">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImageClick(img.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Upload by URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Original URL"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Filename"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleUploadByUrl}
                  disabled={!uploadUrl || !uploadFilename || localSaving}
                >
                  Upload
                </Button>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Upload by File
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input type="file" accept="image/*" onChange={handleImageFileChange} />
                <TextField
                  label="Filename"
                  value={uploadFileFilename}
                  onChange={(e) => setUploadFileFilename(e.target.value)}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleUploadByFile}
                  disabled={!uploadFile || !uploadFileFilename || localSaving}
                >
                  Upload
                </Button>
              </Box>
            </Box>
          )}

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
            control={<Checkbox checked={formData.isActive} onChange={(e) => onFormChange('isActive', e.target.checked)} />}
            label={t('articles.form.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading || localSaving}>
          {t('articles.actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            setLocalSaving(true);
            setErrorMessage(null);
            try {
              await onSubmit(Boolean(formData.coverImageFile));
            } catch (err: any) {
              setErrorMessage(err.message || 'An error occurred');
            } finally {
              setLocalSaving(false);
            }
          }}
          disabled={loading || localSaving}
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t('articles.actions.delete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('articles.messages.confirmDeleteImage')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t('articles.actions.cancel')}</Button>
          <Button onClick={handleConfirmDeleteImage} color="error" variant="contained">
            {t('articles.actions.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ArticleEditDialog;
