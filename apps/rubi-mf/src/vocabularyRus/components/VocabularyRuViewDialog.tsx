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
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Eye, Tag, CheckCircle2, XCircle, BookOpen, Mic, FileText, Globe } from 'lucide-react';
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

  const languageLabel = (code?: string | null) => {
    if (!code) return '-';
    const found = LANGUAGE_OPTIONS.find((o) => o.value === code.toUpperCase());
    return found ? `${found.label} (${code})` : code;
  };

  const difficultyLevelLabel = (level?: string | null) => {
    if (!level) return '-';
    return t(`vocabularyRus.difficultyLevels.${level.toLowerCase()}`, level);
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
        <Typography variant="h6" component="span">
          {t('vocabularyRus.view')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Main Content - Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Left Column - Primary Information */}
            <Box sx={{ flex: '1 1 400px', minWidth: '350px' }}>
              {/* Header Card - Word and Basic Info */}
              <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                      {vocabularyRu.name}
                    </Typography>
                    {vocabularyRu.translation && (
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, fontStyle: 'italic' }}>
                        {vocabularyRu.translation}
                      </Typography>
                    )}
                  </Box>

                  {/* Key Information Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 2, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Part of Speech
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {vocabularyRu.partOfSpeech || '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Phonetic
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                        {vocabularyRu.phonetic || '-'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Language
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {languageLabel(vocabularyRu.lang)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Difficulty
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {difficultyLevelLabel(vocabularyRu.difficultyLevel)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Status and Tags */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip
                      icon={vocabularyRu.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      label={vocabularyRu.isActive ? t('vocabularyRus.status.active') : t('vocabularyRus.status.inactive')}
                      color={vocabularyRu.isActive ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                    {vocabularyRu.tags?.split(',').filter(Boolean).slice(0, 3).map((tag) => (
                      <Chip key={tag.trim()} icon={<Tag size={12} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                    ))}
                  </Box>

                  {/* Definition */}
                  {vocabularyRu.definition && (
                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.4 }}>
                        <div dangerouslySetInnerHTML={{ __html: vocabularyRu.definition }} />
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Example Card */}
              {vocabularyRu.example && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <FileText size={16} color="#ed6c02" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Example
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                      <div dangerouslySetInnerHTML={{ __html: vocabularyRu.example }} />
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Grammar Card - Compact */}
              {(vocabularyRu.verbSimplePastTense || vocabularyRu.verbPastPerfectTense || vocabularyRu.verbPresentParticiple || vocabularyRu.nounPluralForm) && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <BookOpen size={16} color="#2e7d32" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Grammar Forms
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      {vocabularyRu.verbSimplePastTense && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Past</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vocabularyRu.verbSimplePastTense}</Typography>
                        </Box>
                      )}
                      {vocabularyRu.verbPastPerfectTense && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Past Perfect</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vocabularyRu.verbPastPerfectTense}</Typography>
                        </Box>
                      )}
                      {vocabularyRu.verbPresentParticiple && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Present Participle</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vocabularyRu.verbPresentParticiple}</Typography>
                        </Box>
                      )}
                      {vocabularyRu.nounPluralForm && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Plural</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vocabularyRu.nounPluralForm}</Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Right Column - Media and Additional Info */}
            <Box sx={{ flex: '1 1 300px', minWidth: '280px' }}>
              {/* Image */}
              {vocabularyRu.imageOriginalUrl && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Image</Typography>
                    <Avatar
                      src={vocabularyRu.imageOriginalUrl}
                      alt={vocabularyRu.name}
                      sx={{ width: 120, height: 120, mx: 'auto', border: '2px solid', borderColor: 'divider' }}
                      variant="rounded"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Audio */}
              {vocabularyRu.phoneticAudioOriginalUrl && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Mic size={16} color="#1976d2" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Pronunciation
                      </Typography>
                    </Box>
                    <audio controls style={{ width: '100%', height: '40px' }}>
                      <source src={vocabularyRu.phoneticAudioOriginalUrl} type="audio/mpeg" />
                      <source src={vocabularyRu.phoneticAudioOriginalUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </CardContent>
                </Card>
              )}

              {/* Additional Information */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Additional Info</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {vocabularyRu.synonyms && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Synonyms</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{vocabularyRu.synonyms}</Typography>
                      </Box>
                    )}
                    {vocabularyRu.displayOrder !== null && vocabularyRu.displayOrder !== undefined && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Display Order</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{vocabularyRu.displayOrder}</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Links */}
              {vocabularyRu.dictionaryUrl && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Globe size={16} color="#1976d2" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Dictionary
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'primary.main',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        wordBreak: 'break-all'
                      }}
                      onClick={() => window.open(vocabularyRu.dictionaryUrl!, '_blank')}
                    >
                      {vocabularyRu.dictionaryUrl}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              {/* Metadata - Compact */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Metadata</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Created: {vocabularyRu.createdAt ? format(parseISO(vocabularyRu.createdAt), 'MMM dd, yyyy') : '-'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Updated: {vocabularyRu.updatedAt ? format(parseISO(vocabularyRu.updatedAt), 'MMM dd, yyyy') : '-'}
                    </Typography>
                    {vocabularyRu.createdBy && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                        By: {vocabularyRu.createdBy}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
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
