import { useMemo, useRef, useLayoutEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import '../i18n/translations';
import type { Question } from '../types/question.types';
import { createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import { STATUS_MAPS } from '../constants';

interface QuestionViewDialogProps {
  open: boolean;
  onClose: () => void;
  question: Question;
}

const QuestionViewDialog = ({ open, onClose, question }: QuestionViewDialogProps) => {
  const { t } = useTranslation();
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  const { sanitizedHtml } = useMemo(() => {
    const raw = question.answer || '';
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

    return { sanitizedHtml: safe };
  }, [question.answer]);

  // highlight code blocks
  useLayoutEffect(() => {
    if (!contentContainerRef.current) return;
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
      console.warn('[QuestionViewDialog] highlight error', err);
    }
  }, [sanitizedHtml]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{t('questions.view')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('questions.fields.question')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {question.question}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              {t('questions.fields.answer')}
            </Typography>
            {question.answer ? (
            <Box>
              {/* outer boxed panel for content */}
              <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2, backgroundColor: (theme) => theme.palette.background.paper }}>
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
              </Box>
            </Box>
          ) : (
            <Typography variant="body2">-</Typography>
          )}
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('questions.fields.language')}
              </Typography>
              <Typography variant="body2">{question.lang}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('questions.fields.status')}
              </Typography>
              {createStatusChip(String(question.isActive), STATUS_MAPS.active)}
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('questions.fields.displayOrder')}
              </Typography>
              <Typography variant="body2">{question.displayOrder}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              {t('questions.fields.tags')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {question.tags?.split(',').map((tag) => (
                <Chip key={tag} label={tag.trim()} size="small" />
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionViewDialog;
