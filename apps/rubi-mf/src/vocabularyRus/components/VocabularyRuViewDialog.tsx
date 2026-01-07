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
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Eye, Tag, CheckCircle2, XCircle, Calendar, User, Copy, Check } from 'lucide-react';
import { useState as useStateHook } from 'react';
import type { VocabularyRu } from '../types/vocabularyRu.types';
import '../i18n/translations';
import { LANGUAGE_OPTIONS } from '../constants';

interface VocabularyRuViewDialogProps {
  open: boolean;
  vocabularyRu: VocabularyRu;
  onClose: () => void;
  onEdit?: (vocabularyRu: VocabularyRu) => void;
}

const VocabularyRuViewDialog = ({ open, vocabularyRu, onClose, onEdit }: VocabularyRuViewDialogProps) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useStateHook<string | null>(null);

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
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6" component="span">
          {t('vocabularyRus.view')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {vocabularyRu.word}
              </Typography>
              {vocabularyRu.definition && (
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5, textAlign: 'center' }}>
                  <div dangerouslySetInnerHTML={{ __html: vocabularyRu.definition }} />
                </Typography>
              )}
              {vocabularyRu.wordImageOriginalUrl && (
                <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    id="vocabularyRu-word-image"
                    src={vocabularyRu.wordImageOriginalUrl}
                    alt={vocabularyRu.word}
                    style={{ width: '100%', maxWidth: 300, maxHeight: 300, borderRadius: 8, objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                  />
                </Box>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
                {vocabularyRu.tags?.split(',').filter(Boolean).map((tag) => (
                  <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('vocabularyRus.viewDialog.details')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.word')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {vocabularyRu.word}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Language
                  </Typography>
                  <Chip label={languageLabel(vocabularyRu.lang)} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.phonetic')}
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.phonetic || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Phonetic Audio
                  </Typography>
                  {vocabularyRu.phoneticAudioOriginalUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <audio controls style={{ height: '32px' }}>
                        <source src={vocabularyRu.phoneticAudioOriginalUrl} type="audio/mpeg" />
                        <source src={vocabularyRu.phoneticAudioOriginalUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                      <Button
                        size="small"
                        onClick={() => handleCopy(vocabularyRu.phoneticAudioOriginalUrl!, 'phoneticAudio')}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        {copiedField === 'phoneticAudio' ? <Check size={14} /> : <Copy size={14} />}
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2">-</Typography>
                  )}
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.example')}
                  </Typography>
                  <Typography variant="body2">
                    {vocabularyRu.example ? (
                      <div dangerouslySetInnerHTML={{ __html: vocabularyRu.example }} />
                    ) : (
                      '-'
                    )}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.simplePastTense')}
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.simplePastTense || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.pastPerfectTense')}
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.pastPerfectTense || '-'}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.dictionaryUrl')}
                  </Typography>
                  {vocabularyRu.dictionaryUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {vocabularyRu.dictionaryUrl}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleCopy(vocabularyRu.dictionaryUrl!, 'dictionaryUrl')}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        {copiedField === 'dictionaryUrl' ? <Check size={14} /> : <Copy size={14} />}
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2">-</Typography>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.pluralForm')}
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.pluralForm || '-'}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.synonyms')}
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.synonyms || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Display Order
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.displayOrder ?? '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Active
                  </Typography>
                  <Chip icon={vocabularyRu.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={vocabularyRu.isActive ? t('vocabularyRus.status.active') : t('vocabularyRus.status.inactive')} color={vocabularyRu.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('vocabularyRus.viewDialog.metadata')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.createdAt')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vocabularyRu.createdAt ? format(parseISO(vocabularyRu.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.updatedAt')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vocabularyRu.updatedAt ? format(parseISO(vocabularyRu.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.createdBy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {vocabularyRu.createdBy || '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularyRus.form.updatedBy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {vocabularyRu.updatedBy || '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(vocabularyRu)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
            {t('common.edit')}
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VocabularyRuViewDialog;
