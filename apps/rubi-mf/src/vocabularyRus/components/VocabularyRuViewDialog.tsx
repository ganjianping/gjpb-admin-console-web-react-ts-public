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
  Divider,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { Eye, Tag, CheckCircle2, XCircle, BookOpen, FileText, Globe, Type, MessageSquare, Volume2 } from 'lucide-react';
import { useState } from 'react';
import type { VocabularyRu } from '../types/vocabularyRu.types';
import '../i18n/translations';

interface VocabularyRuViewDialogProps {
  open: boolean;
  vocabularyRu: VocabularyRu;
  onClose: () => void;
  onEdit?: (vocabularyRu: VocabularyRu) => void;
}

const VocabularyRuViewDialog = ({ open, vocabularyRu, onClose, onEdit }: VocabularyRuViewDialogProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const difficultyLevelLabel = (level?: string | null) => {
    if (!level) return '-';
    return t(`vocabularyRus.difficultyLevels.${level.toLowerCase()}`, level);
  };

  const hasVerbFields = vocabularyRu.verbForm || vocabularyRu.verbMeaning || vocabularyRu.verbExample || vocabularyRu.verbSimplePastTense || vocabularyRu.verbPastPerfectTense || vocabularyRu.verbPresentParticiple;
  const hasAdjectiveFields = vocabularyRu.adjectiveForm || vocabularyRu.adjectiveMeaning || vocabularyRu.adjectiveExample || vocabularyRu.adjectiveComparativeForm || vocabularyRu.adjectiveSuperlativeForm;
  const hasAdverbFields = vocabularyRu.adverbForm || vocabularyRu.adverbMeaning || vocabularyRu.adverbExample;
  const hasNounFields = vocabularyRu.nounForm || vocabularyRu.nounMeaning || vocabularyRu.nounExample;
  const hasGrammarForms = vocabularyRu.nounPluralForm || hasVerbFields || hasAdjectiveFields || hasAdverbFields || hasNounFields;

  // Calculate adverb tab index
  const getAdverbTabIndex = () => {
    let index = 0;
    if (hasNounFields) index++;
    if (hasVerbFields) index++;
    if (hasAdjectiveFields) index++;
    return index; // Subtract 1 because we want the index of adverb tab
  };

  // Calculate noun tab index
  const getAdjectiveTabIndex = () => {
    let index = 0;
    if (hasNounFields) index++;
    if (hasVerbFields) index++;
    return index;
  };
  
  const getVerbTabIndex = () => {
    let index = 0;
    if (hasNounFields) index++;
    return index;
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Hero Section - Word Header */}
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                {/* Image Section */}
                {vocabularyRu.imageUrl && (
                  <Avatar
                    src={vocabularyRu.imageUrl}
                    alt={vocabularyRu.name}
                    sx={{ width: 140, height: 140, border: '3px solid', borderColor: 'divider', boxShadow: 3 }}
                    variant="rounded"
                  />
                )}
                
                {/* Main Word Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    {vocabularyRu.name}
                  </Typography>
                  
                  {vocabularyRu.phonetic && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Typography variant="h6" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                        /{vocabularyRu.phonetic}/
                      </Typography>
                      {vocabularyRu.phoneticAudioOriginalUrl && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            const audio = new Audio(vocabularyRu.phoneticAudioOriginalUrl!);
                            audio.play();
                          }}
                          sx={{ color: 'primary.main' }}
                        >
                          <Volume2 size={20} />
                        </IconButton>
                      )}
                    </Box>
                  )}

                  {vocabularyRu.translation && (
                    <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2, fontStyle: 'italic', fontWeight: 500 }}>
                      {vocabularyRu.translation}
                    </Typography>
                  )}

                  {/* Key Metadata Pills and Tags */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {vocabularyRu.partOfSpeech && (
                      <Chip icon={<Type size={14} />} label={vocabularyRu.partOfSpeech} color="primary" size="small" sx={{ fontWeight: 600 }} />
                    )}
                    <Chip label={difficultyLevelLabel(vocabularyRu.difficultyLevel)} size="small" variant="outlined" />
                    {vocabularyRu.term && (
                      <Chip label={`Term ${vocabularyRu.term}`} size="small" variant="outlined" color="secondary" />
                    )}
                    {vocabularyRu.week && (
                      <Chip label={`Week ${vocabularyRu.week}`} size="small" variant="outlined" color="info" />
                    )}
                    <Chip
                      icon={vocabularyRu.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      label={vocabularyRu.isActive ? t('vocabularyRus.status.active') : t('vocabularyRus.status.inactive')}
                      color={vocabularyRu.isActive ? 'success' : 'default'}
                      size="small"
                    />
                    {vocabularyRu.tags && (
                      <>
                        <Box sx={{ width: '1px', height: '24px', backgroundColor: 'divider', mx: 0.5 }} />
                        {vocabularyRu.tags.split(',').filter(Boolean).map((tag) => (
                          <Chip key={tag.trim()} icon={<Tag size={12} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontSize: '0.7rem', height: '24px' }} />
                        ))}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Definition Section */}
          {vocabularyRu.definition && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <BookOpen size={18} color="#2e7d32" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Definition
                  </Typography>
                </Box>
                <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                  <div dangerouslySetInnerHTML={{ __html: vocabularyRu.definition }} />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Example Section */}
          {vocabularyRu.example && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <FileText size={18} color="#ed6c02" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Example
                  </Typography>
                </Box>
                <Box sx={{ p: 2, backgroundColor: 'rgba(237, 108, 2, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'orange.200', borderLeft: '4px solid', borderLeftColor: 'warning.main' }}>
                  <div dangerouslySetInnerHTML={{ __html: vocabularyRu.example }} />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Grammar Forms Section with Tabs */}
          {hasGrammarForms && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <MessageSquare size={18} color="#1976d2" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Grammar Forms
                  </Typography>
                </Box>

                {/* Noun Plural Form */}
                {vocabularyRu.nounPluralForm && (
                  <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(25, 118, 210, 0.2)' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Noun Plural Form
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {vocabularyRu.nounPluralForm}
                    </Typography>
                  </Box>
                )}

                {/* Tabs for Verb/Adjective/Adverb Forms */}
                {(hasVerbFields || hasAdjectiveFields || hasAdverbFields) && (
                  <Box>
                    <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                      {hasNounFields && <Tab label="Noun" />}
                      {hasVerbFields && <Tab label="Verb" />}
                      {hasAdjectiveFields && <Tab label="Adjective" />}
                      {hasAdverbFields && <Tab label="Adverb" />}
                    </Tabs>

                    {/* Noun Tab Content */}
                    {hasNounFields && activeTab === 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {vocabularyRu.nounForm && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(76, 175, 80, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(76, 175, 80, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Noun Form
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {vocabularyRu.nounForm}
                            </Typography>
                          </Box>
                        )}
                        {vocabularyRu.nounMeaning && (
                          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Noun Meaning
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.nounMeaning }} />
                          </Box>
                        )}
                        {vocabularyRu.nounExample && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(237, 108, 2, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'orange.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Noun Example
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.nounExample }} />
                          </Box>
                        )}
                      </Box>
                    )}

                    {/* Verb Tab Content */}
                    {hasVerbFields && activeTab === getVerbTabIndex() && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {vocabularyRu.verbForm && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Verb Form
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {vocabularyRu.verbForm}
                            </Typography>
                          </Box>
                        )}
                        {vocabularyRu.verbMeaning && (
                          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Verb Meaning
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.verbMeaning }} />
                          </Box>
                        )}
                        {vocabularyRu.verbExample && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(237, 108, 2, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'orange.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Verb Example
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.verbExample }} />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {vocabularyRu.verbSimplePastTense && (
                            <Box sx={{ flex: '1 1 150px', p: 1.5, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1, border: '1px solid', borderColor: 'rgba(25, 118, 210, 0.2)' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Simple Past</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{vocabularyRu.verbSimplePastTense}</Typography>
                            </Box>
                          )}
                          {vocabularyRu.verbPastPerfectTense && (
                            <Box sx={{ flex: '1 1 150px', p: 1.5, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1, border: '1px solid', borderColor: 'rgba(25, 118, 210, 0.2)' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Past Perfect</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{vocabularyRu.verbPastPerfectTense}</Typography>
                            </Box>
                          )}
                          {vocabularyRu.verbPresentParticiple && (
                            <Box sx={{ flex: '1 1 150px', p: 1.5, backgroundColor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1, border: '1px solid', borderColor: 'rgba(25, 118, 210, 0.2)' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Present Participle</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{vocabularyRu.verbPresentParticiple}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Adjective Tab Content */}
                    {hasAdjectiveFields && activeTab === getAdjectiveTabIndex() && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {vocabularyRu.adjectiveForm && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(156, 39, 176, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(156, 39, 176, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Adjective Form
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {vocabularyRu.adjectiveForm}
                            </Typography>
                          </Box>
                        )}
                        {vocabularyRu.adjectiveMeaning && (
                          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Adjective Meaning
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.adjectiveMeaning }} />
                          </Box>
                        )}
                        {vocabularyRu.adjectiveExample && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(237, 108, 2, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'orange.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Adjective Example
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.adjectiveExample }} />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {vocabularyRu.adjectiveComparativeForm && (
                            <Box sx={{ flex: '1 1 150px', p: 1.5, backgroundColor: 'rgba(156, 39, 176, 0.05)', borderRadius: 1, border: '1px solid', borderColor: 'rgba(156, 39, 176, 0.2)' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Comparative</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{vocabularyRu.adjectiveComparativeForm}</Typography>
                            </Box>
                          )}
                          {vocabularyRu.adjectiveSuperlativeForm && (
                            <Box sx={{ flex: '1 1 150px', p: 1.5, backgroundColor: 'rgba(156, 39, 176, 0.05)', borderRadius: 1, border: '1px solid', borderColor: 'rgba(156, 39, 176, 0.2)' }}>
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>Superlative</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{vocabularyRu.adjectiveSuperlativeForm}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}

                    {/* Adverb Tab Content */}
                    {hasAdverbFields && activeTab === getAdverbTabIndex() && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {vocabularyRu.adverbForm && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(255, 152, 0, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'rgba(255, 152, 0, 0.2)' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 0.5 }}>
                              Adverb Form
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {vocabularyRu.adverbForm}
                            </Typography>
                          </Box>
                        )}
                        {vocabularyRu.adverbMeaning && (
                          <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Adverb Meaning
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.adverbMeaning }} />
                          </Box>
                        )}
                        {vocabularyRu.adverbExample && (
                          <Box sx={{ p: 2, backgroundColor: 'rgba(237, 108, 2, 0.05)', borderRadius: 1.5, border: '1px solid', borderColor: 'orange.200' }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, display: 'block', mb: 1 }}>
                              Adverb Example
                            </Typography>
                            <div dangerouslySetInnerHTML={{ __html: vocabularyRu.adverbExample }} />
                          </Box>
                        )}
                      </Box>
                    )}

                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Info Section */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Synonyms */}
            {vocabularyRu.synonyms && (
              <Card elevation={0} sx={{ flex: '1 1 300px', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                    Synonyms
                  </Typography>
                  <Typography variant="body2">{vocabularyRu.synonyms}</Typography>
                </CardContent>
              </Card>
            )}

            {/* Dictionary Link */}
            {vocabularyRu.dictionaryUrl && (
              <Card elevation={0} sx={{ flex: '1 1 300px', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Globe size={16} color="#1976d2" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      Dictionary
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      wordBreak: 'break-all',
                      '&:hover': { color: 'primary.dark' }
                    }}
                    onClick={() => window.open(vocabularyRu.dictionaryUrl!, '_blank')}
                  >
                    {vocabularyRu.dictionaryUrl}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Display Order */}
            {(vocabularyRu.displayOrder !== null && vocabularyRu.displayOrder !== undefined) && (
              <Card elevation={0} sx={{ flex: '1 1 150px', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    Display Order
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {vocabularyRu.displayOrder}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Metadata Footer */}
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', backgroundColor: 'rgba(0,0,0,0.02)' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.secondary' }}>
                Metadata
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Created At</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {vocabularyRu.createdAt ? format(parseISO(vocabularyRu.createdAt), 'PPpp') : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Updated At</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {vocabularyRu.updatedAt ? format(parseISO(vocabularyRu.updatedAt), 'PPpp') : '-'}
                  </Typography>
                </Box>
                {vocabularyRu.createdBy && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Created By</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                      {vocabularyRu.createdBy}
                    </Typography>
                  </Box>
                )}
                {vocabularyRu.updatedBy && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>Updated By</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 600 }}>
                      {vocabularyRu.updatedBy}
                    </Typography>
                  </Box>
                )}
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
