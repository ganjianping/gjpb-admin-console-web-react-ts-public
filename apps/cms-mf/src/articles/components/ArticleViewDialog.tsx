import { useMemo, useState, useRef, useLayoutEffect } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Eye, Tag, CheckCircle2, XCircle, ExternalLink, Calendar, User, Copy, Check } from 'lucide-react';

import { getFullArticleCoverImageUrl } from '../utils/getFullArticleCoverImageUrl';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import type { Article } from '../types/article.types';
import '../i18n/translations';
import { LANGUAGE_OPTIONS } from '../constants';

interface ArticleViewDialogProps {
  open: boolean;
  article: Article;
  onClose: () => void;
  onEdit?: (article: Article) => void;
}

const ArticleViewDialog = ({ open, article, onClose, onEdit }: ArticleViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [contentExpanded, setContentExpanded] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const coverUrl = useMemo(() => (article.coverImageFilename ? getFullArticleCoverImageUrl(`/${article.coverImageFilename}`) : article.coverImageOriginalUrl || ''), [article.coverImageFilename, article.coverImageOriginalUrl]);

  const rawContent = (article as any).content as string | undefined;
  const { sanitizedHtml, plainText, shouldShowToggle } = useMemo(() => {
    const raw = rawContent || '';
    const sanitized = DOMPurify.sanitize(raw || '');

    // ensure links open in new tab
    let safe = sanitized;
    try {
      if (typeof document !== 'undefined') {
        const tmp = document.createElement('div');
        tmp.innerHTML = sanitized;
        tmp.querySelectorAll('a').forEach((a) => {
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
        });
        safe = tmp.innerHTML;
      }
    } catch (e) {
      safe = sanitized;
    }

    // derive plain text for truncation
    const tmpEl = (typeof document !== 'undefined' && document) ? document.createElement('div') : null;
    if (tmpEl) tmpEl.innerHTML = safe;
    const plain = tmpEl ? (tmpEl.textContent || tmpEl.innerText || '') : safe.replace(/<[^>]+>/g, '');
    const showToggle = plain.length > 240 || plain.split('\n').length > 4;

    return { sanitizedHtml: safe, plainText: plain, shouldShowToggle: showToggle };
  }, [rawContent]);

  // highlight code blocks when expanded
  useLayoutEffect(() => {
    if (!contentContainerRef.current) return;
    if (!contentExpanded) return;
    try {
      const root = contentContainerRef.current;
      const blocks = root.querySelectorAll('pre code');
      for (const b of Array.from(blocks)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (hljs as any).highlightElement(b as HTMLElement);
      }
    } catch (err) {
      // no-op
      // eslint-disable-next-line no-console
      console.warn('[ArticleViewDialog] highlight error', err);
    }
  }, [contentExpanded, sanitizedHtml]);

  // removed unused helper `sizeSafe` (was declared but never referenced)

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      // ignore
    }
  };

  const languageLabel = (code?: string | null) => {
    if (!code) return '-';
    const found = LANGUAGE_OPTIONS.find((o) => o.value === code.toUpperCase());
    return found ? `${found.label} (${code})` : code;
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
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6" component="span">{t('articles.view')}</Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>{article.title}</Typography>
              {article.summary && (
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5 }}>{article.summary}</Typography>
              )}
              {(() => {
                if (coverUrl) {
                  return (
                    <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        id="article-cover"
                        src={coverUrl}
                        alt={article.title}
                        style={{ width: '100%', maxWidth: 480, maxHeight: 360, borderRadius: 8, objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                      />
                    </Box>
                  );
                }
                return (
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }} variant="rounded">
                    <Eye size={32} />
                  </Avatar>
                );
              })()}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                {(article as any).originalUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('articles.form.originalUrl')}:</Typography>
                    <Link href={(article as any).originalUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{(article as any).originalUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'originalUrl' ? t('articles.messages.originalUrlCopied') : t('articles.actions.copy')}>
                      <IconButton size="small" onClick={() => handleCopy((article as any).originalUrl || '', 'originalUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'originalUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                
                {coverUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Cover URL:</Typography>
                    <Link href={coverUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{coverUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'coverUrl' ? t('articles.messages.coverImageCopied') : t('articles.actions.copy')}>
                      <IconButton size="small" onClick={() => handleCopy(coverUrl, 'coverUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'coverUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {article.coverImageOriginalUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t('articles.form.coverImageOriginalUrl')}:</Typography>
                    <Link href={article.coverImageOriginalUrl} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', color: 'primary.main', wordBreak: 'break-all', flex: 1, fontFamily: 'monospace', fontSize: '0.875rem', '&:hover': { textDecoration: 'underline' } }}>
                      <ExternalLink size={14} />
                      <Typography variant="body2" sx={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{article.coverImageOriginalUrl}</Typography>
                    </Link>
                    <Tooltip title={copiedField === 'coverImageOriginalUrl' ? t('articles.messages.coverImageCopied') : t('articles.actions.copy')}>
                      <IconButton size="small" onClick={() => handleCopy(article.coverImageOriginalUrl || '', 'coverImageOriginalUrl')} sx={{ ml: 0.5 }}>
                        {copiedField === 'coverImageOriginalUrl' ? <Check size={16} /> : <Copy size={16} />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                )

                }
                

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {article.tags?.split(',').filter(Boolean).map((tag) => (
                      <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {rawContent ? (
            <Box>
              {/* outer boxed panel for content */}
              <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2, backgroundColor: (theme) => theme.palette.background.paper }}>
                {contentExpanded ? (
                  <Box
                    ref={contentContainerRef}
                    sx={{
                      whiteSpace: 'normal',
                      '& pre': {
                        position: 'relative',
                        background: (theme) => theme.palette.mode === 'dark' ? '#0f172a' : '#f5f5f5',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderRadius: 1.5,
                        padding: 1.5,
                        overflow: 'auto',
                        boxShadow: '0 8px 20px rgba(15,23,42,0.06)',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Courier New", monospace',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        color: (theme) => theme.palette.text.primary,
                      },
                      '& pre code': { background: 'transparent', padding: 0, border: 'none', borderRadius: 0, display: 'block' },
                      '& p': { margin: 0, marginBottom: 1 },
                      '& ul, & ol': { margin: '0.5rem 0', paddingLeft: 2 },
                      '& a': { color: 'primary.main', textDecoration: 'underline' },
                      '& img': { maxWidth: '100%', height: 'auto', display: 'block', margin: '8px 0' },
                    }}
                    dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                  />
                ) : (
                  <Box sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'pre-wrap', '& p': { margin: 0 }, fontFamily: 'inherit' }}>
                    {plainText}
                  </Box>
                )}
              </Box>

              {shouldShowToggle && (
                <Button size="small" onClick={() => setContentExpanded((s) => !s)} sx={{ mt: 1, textTransform: 'none' }}>
                  {contentExpanded ? (t('articles.actions.less') || 'Less') : (t('articles.actions.more') || 'More...')}
                </Button>
              )}
            </Box>
          ) : (
            <Typography variant="body2">-</Typography>
          )}
                
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>{t('articles.viewDialog.details')}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.viewDialog.id')}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all', color: 'text.primary' }}>{article.id ?? '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.form.sourceName')}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{article.sourceName || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.form.coverImageFilename')}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{article.coverImageFilename || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Language</Typography>
                  <Chip label={languageLabel(article.lang)} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Display Order</Typography>
                  <Typography variant="body2">{article.displayOrder ?? '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>Active</Typography>
                  <Chip icon={article.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={article.isActive ? t('articles.status.active') : t('articles.status.inactive')} color={article.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>{t('articles.viewDialog.metadata') || 'Metadata'}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.form.createdAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{article.createdAt ? format(parseISO(article.createdAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.form.updatedAt')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{article.updatedAt ? format(parseISO(article.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.form.createdBy')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{article.createdBy || '-'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>{t('articles.form.updatedBy')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>{article.updatedBy || '-'}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(article)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.edit')}</Button>
        )}
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleViewDialog;
