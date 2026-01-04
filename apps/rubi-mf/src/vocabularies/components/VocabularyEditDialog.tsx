import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  OutlinedInput,
  Chip,
  RadioGroup,
  Radio,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Edit, Upload } from 'lucide-react';
import type { Vocabulary, VocabularyFormData } from '../types/vocabulary.types';
import { getEmptyVocabularyFormData } from '../utils/getEmptyVocabularyFormData';
import { LANGUAGE_OPTIONS, VOCABULARY_TAG_SETTING_KEY, VOCABULARY_PART_OF_SPEECH_SETTING_KEY } from '../constants';
import '../i18n/translations';

interface VocabularyEditDialogProps {
  open: boolean;
  vocabulary: Vocabulary | null;
  onClose: () => void;
  onConfirm: (data: VocabularyFormData) => Promise<void>;
}

const VocabularyEditDialog = ({ open, vocabulary, onClose, onConfirm }: VocabularyEditDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<VocabularyFormData>(getEmptyVocabularyFormData());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const tagSetting = appSettings.find((s) => s.name === VOCABULARY_TAG_SETTING_KEY && s.lang === currentLang);
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[VocabularyEditDialog] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availablePartOfSpeech = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const posSetting = appSettings.find((s) => s.name === VOCABULARY_PART_OF_SPEECH_SETTING_KEY && s.lang === currentLang);
      if (!posSetting) return [] as string[];
      return posSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[VocabularyEditDialog] Error loading part of speech options:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open && vocabulary) {
      setFormData({
        word: vocabulary.word || '',
        wordImageFilename: vocabulary.wordImageFilename || '',
        wordImageOriginalUrl: vocabulary.wordImageOriginalUrl || '',
        wordImageUploadMethod: vocabulary.wordImageOriginalUrl ? 'url' : 'file',
        simplePastTense: vocabulary.simplePastTense || '',
        pastPerfectTense: vocabulary.pastPerfectTense || '',
        translation: vocabulary.translation || '',
        synonyms: vocabulary.synonyms || '',
        pluralForm: vocabulary.pluralForm || '',
        phonetic: vocabulary.phonetic || '',
        phoneticAudioFilename: vocabulary.phoneticAudioFilename || '',
        phoneticAudioOriginalUrl: vocabulary.phoneticAudioOriginalUrl || '',
        partOfSpeech: vocabulary.partOfSpeech || '',
        definition: vocabulary.definition || '',
        example: vocabulary.example || '',
        tags: vocabulary.tags || '',
        lang: vocabulary.lang || 'EN',
        displayOrder: vocabulary.displayOrder ?? 0,
        isActive: vocabulary.isActive ?? true,
        wordImageFile: null,
        phoneticAudioFile: null,
        dictionaryUrl: vocabulary.dictionaryUrl || '',
      });
      setErrors({});
    }
  }, [open, vocabulary]);

  const handleChange = (field: keyof VocabularyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    handleChange('tags', value.join(','));
  };

  const handlePartOfSpeechChange = (e: any) => {
    const value = e.target.value as string[];
    handleChange('partOfSpeech', value.join(','));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.word.trim()) {
      newErrors.word = t('common.required');
    }
    if (!formData.lang) {
      newErrors.lang = t('common.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await onConfirm(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={(_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
        onClose();
      }}
      maxWidth="md" 
      fullWidth 
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Edit size={20} />
        <Typography variant="h6" component="span">
          {t('vocabularies.edit')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth error={!!errors.word}>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.word')}</FormLabel>
            <TextField
              value={formData.word}
              onChange={(e) => handleChange('word', e.target.value)}
              placeholder={t('vocabularies.form.word')}
              error={!!errors.word}
              helperText={errors.word}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.dictionaryUrl')}</FormLabel>
            <TextField
              value={formData.dictionaryUrl}
              onChange={(e) => handleChange('dictionaryUrl', e.target.value)}
              placeholder="https://dictionary.cambridge.org/dictionary/english/"
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.phonetic')}</FormLabel>
            <TextField
              value={formData.phonetic}
              onChange={(e) => handleChange('phonetic', e.target.value)}
              placeholder={t('vocabularies.form.phonetic')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.partOfSpeech')}</FormLabel>
            <Select
              multiple
              value={formData.partOfSpeech ? formData.partOfSpeech.split(',').filter(Boolean) : []}
              onChange={handlePartOfSpeechChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {Array.isArray(selected) && selected.map((v) => <Chip key={v} label={v} size="small" />)}
                </Box>
              )}
            >
              {availablePartOfSpeech.length > 0 ? (
                availablePartOfSpeech.map((pos) => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No part of speech options</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.definition')}</FormLabel>
            <TextField
              value={formData.definition}
              onChange={(e) => handleChange('definition', e.target.value)}
              multiline
              rows={3}
              placeholder={t('vocabularies.form.definition')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.synonyms')}</FormLabel>
            <TextField
              value={formData.synonyms}
              onChange={(e) => handleChange('synonyms', e.target.value)}
              placeholder={t('vocabularies.form.synonyms')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.translation')}</FormLabel>
            <TextField
              value={formData.translation}
              onChange={(e) => handleChange('translation', e.target.value)}
              placeholder={t('vocabularies.form.translation')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.example')}</FormLabel>
            <TextField
              value={formData.example}
              onChange={(e) => handleChange('example', e.target.value)}
              multiline
              rows={2}
              placeholder={t('vocabularies.form.example')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.simplePastTense')}</FormLabel>
            <TextField
              value={formData.simplePastTense}
              onChange={(e) => handleChange('simplePastTense', e.target.value)}
              placeholder={t('vocabularies.form.simplePastTense')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.pastPerfectTense')}</FormLabel>
            <TextField
              value={formData.pastPerfectTense}
              onChange={(e) => handleChange('pastPerfectTense', e.target.value)}
              placeholder={t('vocabularies.form.pastPerfectTense')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.pluralForm')}</FormLabel>
            <TextField
              value={formData.pluralForm}
              onChange={(e) => handleChange('pluralForm', e.target.value)}
              placeholder={t('vocabularies.form.pluralForm')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.tags')}</FormLabel>
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

          <FormControl component="fieldset">
            <FormLabel component="legend">{t('vocabularies.form.wordImageUploadMethod')}</FormLabel>
            <RadioGroup
              row
              value={formData.wordImageUploadMethod || 'url'}
              onChange={(e) => handleChange('wordImageUploadMethod', e.target.value as 'url' | 'file')}
            >
              <FormControlLabel value="url" control={<Radio />} label={t('vocabularies.form.byUrl')} />
              <FormControlLabel value="file" control={<Radio />} label={t('vocabularies.form.uploadFile')} />
            </RadioGroup>
          </FormControl>

          {formData.wordImageUploadMethod === 'file' && (
            <Box>
              <Button variant="outlined" component="label" startIcon={<Upload size={20} />} fullWidth sx={{ mb: 1 }}>
                {formData.wordImageFile ? formData.wordImageFile.name : t('vocabularies.form.chooseWordImageFile')}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleChange('wordImageFile', file);
                    }
                  }}
                />
              </Button>
              {formData.wordImageFile && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  {t('vocabularies.form.selectedFile')}: {formData.wordImageFile.name} ({(formData.wordImageFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {formData.wordImageUploadMethod === 'url' && (
            <TextField
              label={t('vocabularies.form.wordImageOriginalUrl')}
              value={formData.wordImageOriginalUrl}
              onChange={(e) => handleChange('wordImageOriginalUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/word-image.jpg"
            />
          )}

          <TextField
            label={t('vocabularies.form.wordImageFilename')}
            value={formData.wordImageFilename}
            onChange={(e) => handleChange('wordImageFilename', e.target.value)}
            fullWidth
            placeholder="word-image.jpg"
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">{t('vocabularies.form.phoneticAudioUploadMethod')}</FormLabel>
            <RadioGroup
              row
              value={formData.phoneticAudioUploadMethod || 'url'}
              onChange={(e) => handleChange('phoneticAudioUploadMethod', e.target.value as 'url' | 'file')}
            >
              <FormControlLabel value="url" control={<Radio />} label={t('vocabularies.form.byUrl')} />
              <FormControlLabel value="file" control={<Radio />} label={t('vocabularies.form.uploadFile')} />
            </RadioGroup>
          </FormControl>

          {formData.phoneticAudioUploadMethod === 'file' && (
            <Box>
              <Button variant="outlined" component="label" startIcon={<Upload size={20} />} fullWidth sx={{ mb: 1 }}>
                {formData.phoneticAudioFile ? formData.phoneticAudioFile.name : t('vocabularies.form.choosePhoneticAudioFile')}
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleChange('phoneticAudioFile', file);
                    }
                  }}
                />
              </Button>
              {formData.phoneticAudioFile && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  {t('vocabularies.form.selectedFile')}: {formData.phoneticAudioFile.name} ({(formData.phoneticAudioFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {formData.phoneticAudioUploadMethod === 'url' && (
            <TextField
              label={t('vocabularies.form.phoneticAudioOriginalUrl')}
              value={formData.phoneticAudioOriginalUrl}
              onChange={(e) => handleChange('phoneticAudioOriginalUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/phonetic-audio.mp3"
            />
          )}

          <TextField
            label={t('vocabularies.form.phoneticAudioFilename')}
            value={formData.phoneticAudioFilename}
            onChange={(e) => handleChange('phoneticAudioFilename', e.target.value)}
            fullWidth
            placeholder="phonetic-audio.mp3"
          />

          <FormControl fullWidth error={!!errors.lang}>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.lang')}</FormLabel>
            <Select value={formData.lang} onChange={(e) => handleChange('lang', e.target.value)}>
              {LANGUAGE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularies.form.displayOrder')}</FormLabel>
            <TextField
              type="number"
              value={formData.displayOrder}
              onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
              fullWidth
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} />}
            label={t('vocabularies.form.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VocabularyEditDialog;
