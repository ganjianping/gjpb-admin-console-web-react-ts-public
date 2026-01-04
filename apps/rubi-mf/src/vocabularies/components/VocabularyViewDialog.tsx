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
import type { Vocabulary } from '../types/vocabulary.types';
import '../i18n/translations';
import { LANGUAGE_OPTIONS } from '../constants';

interface VocabularyViewDialogProps {
  open: boolean;
  vocabulary: Vocabulary;
  onClose: () => void;
  onEdit?: (vocabulary: Vocabulary) => void;
}

const VocabularyViewDialog = ({ open, vocabulary, onClose, onEdit }: VocabularyViewDialogProps) => {
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
          {t('vocabularies.view')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', alignItems: 'center', justifyContent: 'center' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {vocabulary.word}
              </Typography>
              {vocabulary.definition && (
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.5, textAlign: 'center' }}>
                  {vocabulary.definition}
                </Typography>
              )}
              {vocabulary.wordImageOriginalUrl && (
                <Box sx={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    id="vocabulary-word-image"
                    src={vocabulary.wordImageOriginalUrl}
                    alt={vocabulary.word}
                    style={{ width: '100%', maxWidth: 300, maxHeight: 300, borderRadius: 8, objectFit: 'cover', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                  />
                </Box>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
                {vocabulary.tags?.split(',').filter(Boolean).map((tag) => (
                  <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('vocabularies.viewDialog.details')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.word')}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {vocabulary.word}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Language
                  </Typography>
                  <Chip label={languageLabel(vocabulary.lang)} size="small" sx={{ fontWeight: 600 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.phonetic')}
                  </Typography>
                  <Typography variant="body2">{vocabulary.phonetic || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Phonetic Audio
                  </Typography>
                  {vocabulary.phoneticAudioOriginalUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <audio controls style={{ height: '32px' }}>
                        <source src={vocabulary.phoneticAudioOriginalUrl} type="audio/mpeg" />
                        <source src={vocabulary.phoneticAudioOriginalUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                      <Button
                        size="small"
                        onClick={() => handleCopy(vocabulary.phoneticAudioOriginalUrl!, 'phoneticAudio')}
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
                    {t('vocabularies.form.example')}
                  </Typography>
                  <Typography variant="body2">{vocabulary.example || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.simplePastTense')}
                  </Typography>
                  <Typography variant="body2">{vocabulary.simplePastTense || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.pastPerfectTense')}
                  </Typography>
                  <Typography variant="body2">{vocabulary.pastPerfectTense || '-'}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.dictionaryUrl')}
                  </Typography>
                  {vocabulary.dictionaryUrl ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                        {vocabulary.dictionaryUrl}
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => handleCopy(vocabulary.dictionaryUrl!, 'dictionaryUrl')}
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
                    {t('vocabularies.form.pluralForm')}
                  </Typography>
                  <Typography variant="body2">{vocabulary.pluralForm || '-'}</Typography>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.synonyms')}
                  </Typography>
                  <Typography variant="body2">{vocabulary.synonyms || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Display Order
                  </Typography>
                  <Typography variant="body2">{vocabulary.displayOrder ?? '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    Active
                  </Typography>
                  <Chip icon={vocabulary.isActive ? <CheckCircle2 size={16} /> : <XCircle size={16} />} label={vocabulary.isActive ? t('vocabularies.status.active') : t('vocabularies.status.inactive')} color={vocabulary.isActive ? 'success' : 'default'} sx={{ fontWeight: 600 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary' }}>
                {t('vocabularies.viewDialog.metadata')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.createdAt')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vocabulary.createdAt ? format(parseISO(vocabulary.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.updatedAt')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Calendar size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {vocabulary.updatedAt ? format(parseISO(vocabulary.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.createdBy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {vocabulary.createdBy || '-'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                    {t('vocabularies.form.updatedBy')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <User size={16} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {vocabulary.updatedBy || '-'}
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
          <Button onClick={() => onEdit(vocabulary)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
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

export default VocabularyViewDialog;
