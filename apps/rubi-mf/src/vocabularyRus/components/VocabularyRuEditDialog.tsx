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
  IconButton,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Edit, Upload, Link } from 'lucide-react';
import { TiptapTextEditor } from '../../../../shared-lib/src/ui-components';
import type { VocabularyRu, VocabularyRuFormData } from '../types/vocabularyRu.types';
import { getEmptyVocabularyRuFormData } from '../utils/getEmptyVocabularyRuFormData';
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS, VOCABULARY_TAG_SETTING_KEY, VOCABULARY_PART_OF_SPEECH_SETTING_KEY, VOCABULARY_DIFFICULTY_LEVEL_SETTING_KEY } from '../constants';
import '../i18n/translations';

interface VocabularyRuEditDialogProps {
  open: boolean;
  vocabularyRu: VocabularyRu | null;
  onClose: () => void;
  onConfirm: (data: VocabularyRuFormData) => Promise<void>;
}

const VocabularyRuEditDialog = ({ open, vocabularyRu, onClose, onConfirm }: VocabularyRuEditDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<VocabularyRuFormData>(getEmptyVocabularyRuFormData());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrorMessage, setApiErrorMessage] = useState('');

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
      console.error('[VocabularyRuEditDialog] Error loading tags:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableDifficultyLevels = useMemo(() => {
    try {
      const settings = localStorage.getItem('gjpb_app_settings');
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
      const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      const difficultyLevelSetting = appSettings.find((s) => s.name === VOCABULARY_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang);
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value.split(',').map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error('[VocabularyRuEditDialog] Error loading difficulty levels:', err);
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
      console.error('[VocabularyRuEditDialog] Error loading part of speech options:', err);
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open && vocabularyRu) {
      setFormData({
        word: vocabularyRu.word || '',
        wordImageFilename: vocabularyRu.wordImageFilename || '',
        wordImageOriginalUrl: vocabularyRu.wordImageOriginalUrl || '',
        wordImageUploadMethod: vocabularyRu.wordImageOriginalUrl ? 'url' : 'file',
        simplePastTense: vocabularyRu.simplePastTense || '',
        pastPerfectTense: vocabularyRu.pastPerfectTense || '',
        translation: vocabularyRu.translation || '',
        synonyms: vocabularyRu.synonyms || '',
        pluralForm: vocabularyRu.pluralForm || '',
        phonetic: vocabularyRu.phonetic || '',
        phoneticAudioFilename: vocabularyRu.phoneticAudioFilename || '',
        phoneticAudioOriginalUrl: vocabularyRu.phoneticAudioOriginalUrl || '',
        partOfSpeech: vocabularyRu.partOfSpeech || '',
        definition: vocabularyRu.definition || '',
        example: vocabularyRu.example || '',
        tags: vocabularyRu.tags || '',
        lang: vocabularyRu.lang || (i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN'),
        difficultyLevel: vocabularyRu.difficultyLevel || 'easy',
        displayOrder: vocabularyRu.displayOrder ?? 0,
        isActive: vocabularyRu.isActive ?? true,
        wordImageFile: null,
        phoneticAudioFile: null,
        dictionaryUrl: vocabularyRu.dictionaryUrl || '',
      });
      setErrors({});
      setApiErrorMessage('');
    }
  }, [open, vocabularyRu, i18n.language]);

  const handleChange = (field: keyof VocabularyRuFormData, value: any) => {
    setFormData((prev) => {
      const oldValue = prev[field];
      const hasChanged = oldValue !== value;
      if (hasChanged && errors[field]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
      }
      const newFormData = { ...prev, [field]: value };
      
      // Auto-update dictionary URL when word changes
      if (field === 'word' && hasChanged && value.trim()) {
        const currentLang = newFormData.lang || 'EN';
        if (currentLang === 'ZH') {
          newFormData.dictionaryUrl = `https://zd.hwxnet.com/search.do?keyword=${value.trim()}`;
        } else {
          newFormData.dictionaryUrl = `https://dictionary.cambridge.org/dictionary/english/${value.trim()}`;
        }
      }
      
      // Auto-update dictionary URL when language changes and word exists
      if (field === 'lang' && hasChanged && newFormData.word.trim()) {
        if (value === 'ZH') {
          newFormData.dictionaryUrl = `https://zd.hwxnet.com/search.do?keyword=${newFormData.word.trim()}`;
        } else {
          newFormData.dictionaryUrl = `https://dictionary.cambridge.org/dictionary/english/${newFormData.word.trim()}`;
        }
      }
      
      return newFormData;
    });
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
    setApiErrorMessage('');
    try {
      await onConfirm(formData);
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.status) {
        const { message, errors: apiErrors } = error.response.data.status;
        setApiErrorMessage(message || 'An error occurred');
        if (apiErrors) {
          setErrors(apiErrors);
        }
      } else {
        setApiErrorMessage('An unexpected error occurred.');
      }
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
          {t('vocabularyRus.edit')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {apiErrorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiErrorMessage}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth error={!!errors.word}>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.word')}</FormLabel>
            <TextField
              value={formData.word}
              onChange={(e) => handleChange('word', e.target.value)}
              placeholder={t('vocabularyRus.form.word')}
              error={!!errors.word}
              helperText={errors.word}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormLabel sx={{ flex: 1 }}>
                {t('vocabularyRus.form.dictionaryUrl')}
              </FormLabel>
              <IconButton
                size="small"
                onClick={() => {
                  if (formData.dictionaryUrl) {
                    window.open(formData.dictionaryUrl, '_blank');
                  }
                }}
                disabled={!formData.dictionaryUrl}
                sx={{ ml: 1 }}
              >
                <Link size={16} />
              </IconButton>
            </Box>
            <TextField
              value={formData.dictionaryUrl}
              onChange={(e) => handleChange('dictionaryUrl', e.target.value)}
              placeholder="https://dictionary.cambridge.org/dictionary/english/"
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.phonetic')}</FormLabel>
            <TextField
              value={formData.phonetic}
              onChange={(e) => handleChange('phonetic', e.target.value)}
              placeholder={t('vocabularyRus.form.phonetic')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.partOfSpeech')}</FormLabel>
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

          <FormControl fullWidth error={!!errors.definition}>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.definition')}</FormLabel>
            <TiptapTextEditor
              value={formData.definition}
              onChange={(value) => handleChange('definition', value)}
              placeholder={t('vocabularyRus.form.definition')}
            />
            {errors.definition && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.definition}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.synonyms')}</FormLabel>
            <TextField
              value={formData.synonyms}
              onChange={(e) => handleChange('synonyms', e.target.value)}
              placeholder={t('vocabularyRus.form.synonyms')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.translation')}</FormLabel>
            <TextField
              value={formData.translation}
              onChange={(e) => handleChange('translation', e.target.value)}
              placeholder={t('vocabularyRus.form.translation')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth error={!!errors.example}>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.example')}</FormLabel>
            <TiptapTextEditor
              value={formData.example}
              onChange={(value) => handleChange('example', value)}
              placeholder={t('vocabularyRus.form.example')}
            />
            {errors.example && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.example}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.simplePastTense')}</FormLabel>
            <TextField
              value={formData.simplePastTense}
              onChange={(e) => handleChange('simplePastTense', e.target.value)}
              placeholder={t('vocabularyRus.form.simplePastTense')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.pastPerfectTense')}</FormLabel>
            <TextField
              value={formData.pastPerfectTense}
              onChange={(e) => handleChange('pastPerfectTense', e.target.value)}
              placeholder={t('vocabularyRus.form.pastPerfectTense')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.pluralForm')}</FormLabel>
            <TextField
              value={formData.pluralForm}
              onChange={(e) => handleChange('pluralForm', e.target.value)}
              placeholder={t('vocabularyRus.form.pluralForm')}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.difficultyLevel')}</FormLabel>
            <Select value={formData.difficultyLevel} onChange={(e) => handleChange('difficultyLevel', e.target.value)}>
              {(availableDifficultyLevels.length > 0 ? availableDifficultyLevels : DIFFICULTY_LEVEL_OPTIONS.map(opt => opt.value)).map((level) => (
                <MenuItem key={level} value={level}>
                  {availableDifficultyLevels.length > 0 ? level : t(`vocabularyRus.difficultyLevels.${level}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.tags')}</FormLabel>
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
            <FormLabel component="legend">{t('vocabularyRus.form.wordImageUploadMethod')}</FormLabel>
            <RadioGroup
              row
              value={formData.wordImageUploadMethod || 'url'}
              onChange={(e) => handleChange('wordImageUploadMethod', e.target.value as 'url' | 'file')}
            >
              <FormControlLabel value="url" control={<Radio />} label={t('vocabularyRus.form.byUrl')} />
              <FormControlLabel value="file" control={<Radio />} label={t('vocabularyRus.form.uploadFile')} />
            </RadioGroup>
          </FormControl>

          {formData.wordImageUploadMethod === 'file' && (
            <Box>
              <Button variant="outlined" component="label" startIcon={<Upload size={20} />} fullWidth sx={{ mb: 1 }}>
                {formData.wordImageFile ? formData.wordImageFile.name : t('vocabularyRus.form.chooseWordImageFile')}
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
                  {t('vocabularyRus.form.selectedFile')}: {formData.wordImageFile.name} ({(formData.wordImageFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {formData.wordImageUploadMethod === 'url' && (
            <TextField
              label={t('vocabularyRus.form.wordImageOriginalUrl')}
              value={formData.wordImageOriginalUrl}
              onChange={(e) => handleChange('wordImageOriginalUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/word-image.jpg"
            />
          )}

          <TextField
            label={t('vocabularyRus.form.wordImageFilename')}
            value={formData.wordImageFilename}
            onChange={(e) => handleChange('wordImageFilename', e.target.value)}
            fullWidth
            placeholder="word-image.jpg"
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">{t('vocabularyRus.form.phoneticAudioUploadMethod')}</FormLabel>
            <RadioGroup
              row
              value={formData.phoneticAudioUploadMethod || 'url'}
              onChange={(e) => handleChange('phoneticAudioUploadMethod', e.target.value as 'url' | 'file')}
            >
              <FormControlLabel value="url" control={<Radio />} label={t('vocabularyRus.form.byUrl')} />
              <FormControlLabel value="file" control={<Radio />} label={t('vocabularyRus.form.uploadFile')} />
            </RadioGroup>
          </FormControl>

          {formData.phoneticAudioUploadMethod === 'file' && (
            <Box>
              <Button variant="outlined" component="label" startIcon={<Upload size={20} />} fullWidth sx={{ mb: 1 }}>
                {formData.phoneticAudioFile ? formData.phoneticAudioFile.name : t('vocabularyRus.form.choosePhoneticAudioFile')}
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
                  {t('vocabularyRus.form.selectedFile')}: {formData.phoneticAudioFile.name} ({(formData.phoneticAudioFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {formData.phoneticAudioUploadMethod === 'url' && (
            <TextField
              label={t('vocabularyRus.form.phoneticAudioOriginalUrl')}
              value={formData.phoneticAudioOriginalUrl}
              onChange={(e) => handleChange('phoneticAudioOriginalUrl', e.target.value)}
              fullWidth
              placeholder="https://example.com/phonetic-audio.mp3"
            />
          )}

          <TextField
            label={t('vocabularyRus.form.phoneticAudioFilename')}
            value={formData.phoneticAudioFilename}
            onChange={(e) => handleChange('phoneticAudioFilename', e.target.value)}
            fullWidth
            placeholder="phonetic-audio.mp3"
          />

          <FormControl fullWidth error={!!errors.lang}>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.lang')}</FormLabel>
            <Select value={formData.lang} onChange={(e) => handleChange('lang', e.target.value)}>
              {LANGUAGE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.displayOrder')}</FormLabel>
            <TextField
              type="number"
              value={formData.displayOrder}
              onChange={(e) => handleChange('displayOrder', parseInt(e.target.value) || 0)}
              fullWidth
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} />}
            label={t('vocabularyRus.form.isActive')}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? t('common.saving', 'Saving...') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VocabularyRuEditDialog;
