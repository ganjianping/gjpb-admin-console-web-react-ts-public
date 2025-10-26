import { useMemo } from 'react';
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
  IconButton,
  Tooltip,
  Stack,
  
  Divider,
  ButtonGroup,
} from '@mui/material';
import { Eye, ExternalLink, Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import type { Article } from '../types/article.types';
import { getFullArticleCoverImageUrl } from '../utils/getFullArticleImageUrl';
import '../i18n/translations';
import { LANGUAGE_OPTIONS } from '../constants';

interface ArticleViewDialogProps {
  open: boolean;
  article: Article;
  onClose: () => void;
}

const ArticleViewDialog = ({ open, article, onClose }: ArticleViewDialogProps) => {
  const { t } = useTranslation();

  const coverImageUrl = useMemo(() => {
    if (article.coverImageOriginalUrl) {
      return getFullArticleCoverImageUrl(article.coverImageOriginalUrl);
    }
    if (article.coverImageFilename) {
      return getFullArticleCoverImageUrl(`/cover-images/${article.coverImageFilename}`);
    }
    return '';
  }, [article.coverImageFilename]);

  const sanitizedContent = useMemo(() => DOMPurify.sanitize(article.content || ''), [article.content]);

  const formatDate = (value?: string | null) => {
    if (!value) return '-';
    // Try to normalize common backend formats like "YYYY-MM-DD HH:mm:ss(.S)"
    const normalized = value.replace(' ', 'T').replace(/\.\d+$/, '');
    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  };

  const languageLabel = (code?: string | null) => {
    if (!code) return '-';
    const found = LANGUAGE_OPTIONS.find((o) => o.value === code.toUpperCase());
    return found ? `${found.label} (${code})` : code;
  };

  const copyToClipboard = async (text?: string | null) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
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
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6">{t('articles.view')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {coverImageUrl && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, mb: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={coverImageUrl}
                  alt={article.title}
                  style={{ width: '100%', maxHeight: 380, borderRadius: 12, objectFit: 'cover' }}
                />
              </CardContent>
              <Divider />
              <CardContent sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <ButtonGroup variant="text" size="small">
                  {article.originalUrl && (
                    <Button
                      href={article.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<ExternalLink size={14} />}
                    >
                      {t('articles.form.originalUrl')}
                    </Button>
                  )}
                  {coverImageUrl && (
                    <Button onClick={() => copyToClipboard(coverImageUrl)}>{t('articles.actions.copy')}</Button>
                  )}
                </ButtonGroup>
              </CardContent>
            </Card>
          )}

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {article.title}
            </Typography>
            {article.summary && (
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                {article.summary}
              </Typography>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {article.lang && (
                <Chip label={`${t('articles.form.lang')}: ${languageLabel(article.lang)}`} size="small" color="primary" />
              )}
              {article.displayOrder !== undefined && article.displayOrder !== null && (
                <Chip label={`${t('articles.form.displayOrder')}: ${article.displayOrder}`} size="small" />
              )}
              {article.isActive !== undefined && (
                <Chip
                  label={article.isActive ? t('articles.status.active') : t('articles.status.inactive')}
                  color={article.isActive ? 'success' : 'default'}
                  size="small"
                />
              )}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('articles.form.content')}
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                p: 2,
                '& img': { maxWidth: '100%', borderRadius: 1 },
                '& pre': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                  padding: 1.5,
                  borderRadius: 1,
                  overflowX: 'auto',
                },
              }}
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </Box>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {t('articles.viewDialog.details')}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {article.lang && (
                    <Chip label={languageLabel(article.lang)} size="small" color="primary" />
                  )}
                  {article.displayOrder !== undefined && article.displayOrder !== null && (
                    <Chip label={`${t('articles.form.displayOrder')}: ${article.displayOrder}`} size="small" />
                  )}
                  {article.isActive !== undefined && (
                    <Chip
                      label={article.isActive ? t('articles.status.active') : t('articles.status.inactive')}
                      color={article.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  )}
                </Box>

                <Divider />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('articles.viewDialog.id')}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'Monaco, "Courier New", monospace' }}>{article.id ?? '-'}</Typography>
                    <Tooltip title={t('articles.actions.copy') || 'Copy'}>
                      <IconButton size="small" onClick={() => copyToClipboard(article.id ?? '')}>
                        <Copy size={14} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('articles.form.createdBy')}
                  </Typography>
                  <Typography variant="body2">{article.createdBy ?? '-'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('articles.form.updatedBy')}
                  </Typography>
                  <Typography variant="body2">{article.updatedBy ?? '-'}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('articles.form.createdAt')}
                  </Typography>
                  <Typography variant="body2">{formatDate(article.createdAt)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('articles.form.updatedAt')}
                  </Typography>
                  <Typography variant="body2">{formatDate(article.updatedAt)}</Typography>
                </Box>

                {article.tags && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('articles.form.tags')}
                    </Typography>
                    <Box sx={{ mt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {article.tags
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                    </Box>
                  </Box>
                )}

                {article.sourceName && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('articles.form.sourceName')}
                    </Typography>
                    <Typography variant="body2">{article.sourceName}</Typography>
                  </Box>
                )}

                {article.originalUrl && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t('articles.form.originalUrl')}
                    </Typography>
                    <Link href={article.originalUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{article.originalUrl}</Typography>
                    </Link>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('articles.actions.cancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleViewDialog;
