import { useState, useEffect, useMemo } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Plus, Upload, Link } from "lucide-react";
import { TiptapTextEditor } from "../../../../shared-lib/src/ui-components";
import type { VocabularyRuFormData } from "../types/vocabularyRu.types";
import { getEmptyVocabularyRuFormData } from "../utils/getEmptyVocabularyRuFormData";
import {
  LANGUAGE_OPTIONS,
  DIFFICULTY_LEVEL_OPTIONS,
  VOCABULARY_RU_TAG_SETTING_KEY,
  VOCABULARY_RU_PART_OF_SPEECH_SETTING_KEY,
  VOCABULARY_DIFFICULTY_LEVEL_SETTING_KEY,
} from "../constants";
import "../i18n/translations";

interface VocabularyRuCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: VocabularyRuFormData) => Promise<void>;
}

const VocabularyRuCreateDialog = ({
  open,
  onClose,
  onConfirm,
}: VocabularyRuCreateDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<VocabularyRuFormData>(
    getEmptyVocabularyRuFormData(),
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem("gjpb_app_settings");
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{
        name: string;
        value: string;
        lang: string;
      }>;
      const currentLang = i18n.language.toUpperCase().startsWith("ZH")
        ? "ZH"
        : "EN";
      const tagSetting = appSettings.find(
        (s) => s.name === VOCABULARY_RU_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[VocabularyRuCreateDialog] Error loading tags:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableDifficultyLevels = useMemo(() => {
    try {
      const settings = localStorage.getItem("gjpb_app_settings");
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{
        name: string;
        value: string;
        lang: string;
      }>;
      const currentLang = i18n.language.toUpperCase().startsWith("ZH")
        ? "ZH"
        : "EN";
      const difficultyLevelSetting = appSettings.find(
        (s) => s.name === VOCABULARY_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang,
      );
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[VocabularyRuCreateDialog] Error loading difficulty levels:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availablePartOfSpeech = useMemo(() => {
    try {
      const settings = localStorage.getItem("gjpb_app_settings");
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{
        name: string;
        value: string;
        lang: string;
      }>;
      const currentLang = i18n.language.toUpperCase().startsWith("ZH")
        ? "ZH"
        : "EN";
      const posSetting = appSettings.find(
        (s) =>
          s.name === VOCABULARY_RU_PART_OF_SPEECH_SETTING_KEY &&
          s.lang === currentLang,
      );
      if (!posSetting) return [] as string[];
      return posSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error(
        "[VocabularyRuCreateDialog] Error loading part of speech options:",
        err,
      );
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open) {
      const defaultLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      setFormData({ ...getEmptyVocabularyRuFormData(), lang: defaultLang });
      setErrors({});
      setApiErrorMessage("");
    }
  }, [open, i18n.language]);

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
      
      // Auto-update dictionary URL when name changes
      if (field === 'name' && hasChanged && value.trim()) {
        const currentLang = newFormData.lang || 'EN';
        if (currentLang === 'ZH') {
          newFormData.dictionaryUrl = `https://zd.hwxnet.com/search.do?keyword=${value.trim()}`;
        } else {
          newFormData.dictionaryUrl = `https://dictionary.cambridge.org/dictionary/english/${value.trim()}`;
        }
      }
      
      // Auto-update dictionary URL when language changes and name exists
      if (field === 'lang' && hasChanged && newFormData.name.trim()) {
        if (value === 'ZH') {
          newFormData.dictionaryUrl = `https://zd.hwxnet.com/search.do?keyword=${newFormData.name.trim()}`;
        } else {
          newFormData.dictionaryUrl = `https://dictionary.cambridge.org/dictionary/english/${newFormData.name.trim()}`;
        }
      }
      
      return newFormData;
    });
  };

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    handleChange("tags", value.join(","));
  };

  const handlePartOfSpeechChange = (e: any) => {
    const value = e.target.value as string[];
    handleChange("partOfSpeech", value.join(","));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t("common.required");
    }
    if (!formData.lang) {
      newErrors.lang = t("common.required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setApiErrorMessage("");
    try {
      await onConfirm(formData);
      onClose();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.status) {
        const { message, errors: apiErrors } = error.response.data.status;
        setApiErrorMessage(message || "An error occurred");
        if (apiErrors) {
          setErrors(apiErrors);
        }
      } else {
        setApiErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle
        sx={{
          pb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Plus size={20} />
        <Typography variant="h6" component="span">
          {t("vocabularyRus.create")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {apiErrorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiErrorMessage}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth error={!!errors.name}>
            <FormLabel sx={{ mb: 1 }}>{t("vocabularyRus.form.name")}</FormLabel>
            <TextField
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("vocabularyRus.form.name")}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FormLabel sx={{ flex: 1 }}>
                {t("vocabularyRus.form.dictionaryUrl")}
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
              onChange={(e) => handleChange("dictionaryUrl", e.target.value)}
              placeholder="https://dictionary.example.com/word"
              fullWidth
            />
          </FormControl>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.phonetic")}
              </FormLabel>
              <TextField
                value={formData.phonetic}
                onChange={(e) => handleChange("phonetic", e.target.value)}
                placeholder={t("vocabularyRus.form.phonetic")}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.partOfSpeech")}
              </FormLabel>
              <Select
                multiple
                value={
                  formData.partOfSpeech
                    ? formData.partOfSpeech.split(",").filter(Boolean)
                    : []
                }
                onChange={handlePartOfSpeechChange}
                input={<OutlinedInput />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {Array.isArray(selected) &&
                      selected.map((v) => (
                        <Chip key={v} label={v} size="small" />
                      ))}
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
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.synonyms")}
              </FormLabel>
              <TextField
                value={formData.synonyms}
                onChange={(e) => handleChange("synonyms", e.target.value)}
                placeholder={t("vocabularyRus.form.synonyms")}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.translation")}
              </FormLabel>
              <TextField
                value={formData.translation}
                onChange={(e) => handleChange("translation", e.target.value)}
                placeholder={t("vocabularyRus.form.translation")}
                fullWidth
              />
            </FormControl>
          </Box>  

          {formData.partOfSpeech?.toLowerCase().includes('verb') && (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>
                    {t("vocabularyRus.form.verbSimplePastTense")}
                  </FormLabel>
                  <TextField
                    value={formData.verbSimplePastTense}
                    onChange={(e) => handleChange("verbSimplePastTense", e.target.value)}
                    placeholder={t("vocabularyRus.form.verbSimplePastTense")}
                    fullWidth
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>
                    {t("vocabularyRus.form.verbPastPerfectTense")}
                  </FormLabel>
                  <TextField
                    value={formData.verbPastPerfectTense}
                    onChange={(e) => handleChange("verbPastPerfectTense", e.target.value)}
                    placeholder={t("vocabularyRus.form.verbPastPerfectTense")}
                    fullWidth
                  />
                </FormControl>
              </Box>

              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>
                  {t("vocabularyRus.form.verbPresentParticiple")}
                </FormLabel>
                <TextField
                  value={formData.verbPresentParticiple}
                  onChange={(e) => handleChange("verbPresentParticiple", e.target.value)}
                  placeholder={t("vocabularyRus.form.verbPresentParticiple")}
                  fullWidth
                />
              </FormControl>
            </>
          )}

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>
              {t("vocabularyRus.form.difficultyLevel")}
            </FormLabel>
            <Select
              value={formData.difficultyLevel}
              onChange={(e) => handleChange("difficultyLevel", e.target.value)}
            >
              {(availableDifficultyLevels.length > 0 ? availableDifficultyLevels : DIFFICULTY_LEVEL_OPTIONS.map(opt => opt.value)).map((level) => (
                <MenuItem key={level} value={level}>
                  {availableDifficultyLevels.length > 0 ? level : t(`vocabularyRus.difficultyLevels.${level}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.term")}
              </FormLabel>
              <Select
                value={formData.term}
                onChange={(e) => handleChange("term", Number(e.target.value))}
              >
                {[1, 2, 3, 4].map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.week")}
              </FormLabel>
              <Select
                value={formData.week}
                onChange={(e) => handleChange("week", Number(e.target.value))}
              >
                {Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
                  <MenuItem key={week} value={week}>
                    {week}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {formData.partOfSpeech?.toLowerCase().includes('noun') && (
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>
                {t("vocabularyRus.form.nounPluralForm")}
              </FormLabel>
              <TextField
                value={formData.nounPluralForm}
                onChange={(e) => handleChange("nounPluralForm", e.target.value)}
                placeholder={t("vocabularyRus.form.nounPluralForm")}
                fullWidth
              />
            </FormControl>
          )}

          {formData.partOfSpeech?.toLowerCase().includes('adjective') && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>
                  {t("vocabularyRus.form.adjectiveComparativeForm")}
                </FormLabel>
                <TextField
                  value={formData.adjectiveComparativeForm}
                  onChange={(e) => handleChange("adjectiveComparativeForm", e.target.value)}
                  placeholder={t("vocabularyRus.form.adjectiveComparativeForm")}
                  fullWidth
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>
                  {t("vocabularyRus.form.adjectiveSuperlativeForm")}
                </FormLabel>
                <TextField
                  value={formData.adjectiveSuperlativeForm}
                  onChange={(e) => handleChange("adjectiveSuperlativeForm", e.target.value)}
                  placeholder={t("vocabularyRus.form.adjectiveSuperlativeForm")}
                  fullWidth
                />
              </FormControl>
            </Box>
          )}

          <FormControl fullWidth error={!!errors.definition}>
            <FormLabel sx={{ mb: 1 }}>
              {t("vocabularyRus.form.definition")}
            </FormLabel>
            <TiptapTextEditor
              value={formData.definition}
              onChange={(value) => handleChange("definition", value)}
              placeholder={t("vocabularyRus.form.definition")}
            />
            {errors.definition && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.definition}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.example}>
            <FormLabel sx={{ mb: 1 }}>
              {t("vocabularyRus.form.example")}
            </FormLabel>
            <TiptapTextEditor
              value={formData.example}
              onChange={(value) => handleChange("example", value)}
              placeholder={t("vocabularyRus.form.example")}
            />
            {errors.example && (
              <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                {errors.example}
              </Typography>
            )}
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label={t('vocabularyRus.tabs.noun', 'Noun')} />
              <Tab label={t('vocabularyRus.tabs.verb', 'Verb')} />
              <Tab label={t('vocabularyRus.tabs.adjective', 'Adjective')} />
              <Tab label={t('vocabularyRus.tabs.adverb', 'Adverb')} />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.nounForm')}</FormLabel>
                  <TextField
                    value={formData.nounForm}
                    onChange={(e) => handleChange('nounForm', e.target.value)}
                    placeholder={t('vocabularyRus.form.nounForm')}
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.nounMeaning')}</FormLabel>
                  <TiptapTextEditor
                    value={formData.nounMeaning}
                    onChange={(value) => handleChange('nounMeaning', value)}
                    placeholder={t('vocabularyRus.form.nounMeaning')}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.nounExample')}</FormLabel>
                  <TiptapTextEditor
                    value={formData.nounExample}
                    onChange={(value) => handleChange('nounExample', value)}
                    placeholder={t('vocabularyRus.form.nounExample')}
                  />
                </FormControl>
              </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.verbForm')}</FormLabel>
                    <TextField
                      value={formData.verbForm}
                      onChange={(e) => handleChange('verbForm', e.target.value)}
                      placeholder={t('vocabularyRus.form.verbForm')}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.verbMeaning')}</FormLabel>
                    <TiptapTextEditor
                      value={formData.verbMeaning}
                      onChange={(value) => handleChange('verbMeaning', value)}
                      placeholder={t('vocabularyRus.form.verbMeaning')}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.verbExample')}</FormLabel>
                    <TiptapTextEditor
                      value={formData.verbExample}
                      onChange={(value) => handleChange('verbExample', value)}
                      placeholder={t('vocabularyRus.form.verbExample')}
                    />
                  </FormControl>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.adjectiveForm')}</FormLabel>
                    <TextField
                      value={formData.adjectiveForm}
                      onChange={(e) => handleChange('adjectiveForm', e.target.value)}
                      placeholder={t('vocabularyRus.form.adjectiveForm')}
                      fullWidth
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.adjectiveMeaning')}</FormLabel>
                    <TiptapTextEditor
                      value={formData.adjectiveMeaning}
                      onChange={(value) => handleChange('adjectiveMeaning', value)}
                      placeholder={t('vocabularyRus.form.adjectiveMeaning')}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.adjectiveExample')}</FormLabel>
                    <TiptapTextEditor
                      value={formData.adjectiveExample}
                      onChange={(value) => handleChange('adjectiveExample', value)}
                      placeholder={t('vocabularyRus.form.adjectiveExample')}
                    />
                  </FormControl>
                </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.adverbForm')}</FormLabel>
                  <TextField
                    value={formData.adverbForm}
                    onChange={(e) => handleChange('adverbForm', e.target.value)}
                    placeholder={t('vocabularyRus.form.adverbForm')}
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.adverbMeaning')}</FormLabel>
                  <TiptapTextEditor
                    value={formData.adverbMeaning}
                    onChange={(value) => handleChange('adverbMeaning', value)}
                    placeholder={t('vocabularyRus.form.adverbMeaning')}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>{t('vocabularyRus.form.adverbExample')}</FormLabel>
                  <TiptapTextEditor
                    value={formData.adverbExample}
                    onChange={(value) => handleChange('adverbExample', value)}
                    placeholder={t('vocabularyRus.form.adverbExample')}
                  />
                </FormControl>
              </Box>
            )}
          </Box>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("vocabularyRus.form.tags")}</FormLabel>
            <Select
              multiple
              value={
                formData.tags ? formData.tags.split(",").filter(Boolean) : []
              }
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {Array.isArray(selected) &&
                    selected.map((v) => (
                      <Chip key={v} label={v} size="small" />
                    ))}
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
            <FormLabel component="legend">
              {t("vocabularyRus.form.imageUploadMethod")}
            </FormLabel>
            <RadioGroup
              row
              value={formData.imageUploadMethod || "url"}
              onChange={(e) =>
                handleChange(
                  "imageUploadMethod",
                  e.target.value as "url" | "file",
                )
              }
            >
              <FormControlLabel
                value="url"
                control={<Radio />}
                label={t("vocabularyRus.form.byUrl")}
              />
              <FormControlLabel
                value="file"
                control={<Radio />}
                label={t("vocabularyRus.form.uploadFile")}
              />
            </RadioGroup>
          </FormControl>

          {formData.imageUploadMethod === "file" && (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload size={20} />}
                fullWidth
                sx={{ mb: 1 }}
              >
                {formData.imageFile
                  ? formData.imageFile.name
                  : t("vocabularyRus.form.chooseImageFile")}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleChange("imageFile", file);
                    }
                  }}
                />
              </Button>
              {formData.imageFile && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  {t("vocabularyRus.form.selectedFile")}:{" "}
                  {formData.imageFile.name} (
                  {(formData.imageFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {formData.imageUploadMethod === "url" && (
            <TextField
              label={t("vocabularyRus.form.imageOriginalUrl")}
              value={formData.imageOriginalUrl}
              onChange={(e) =>
                handleChange("imageOriginalUrl", e.target.value)
              }
              fullWidth
              placeholder="https://example.com/image.jpg"
            />
          )}

          <TextField
            label={t("vocabularyRus.form.imageFilename")}
            value={formData.imageFilename}
            onChange={(e) => handleChange("imageFilename", e.target.value)}
            fullWidth
            placeholder="image.jpg"
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">
              {t("vocabularyRus.form.phoneticAudioUploadMethod")}
            </FormLabel>
            <RadioGroup
              row
              value={formData.phoneticAudioUploadMethod || "url"}
              onChange={(e) =>
                handleChange(
                  "phoneticAudioUploadMethod",
                  e.target.value as "url" | "file",
                )
              }
            >
              <FormControlLabel
                value="url"
                control={<Radio />}
                label={t("vocabularyRus.form.byUrl")}
              />
              <FormControlLabel
                value="file"
                control={<Radio />}
                label={t("vocabularyRus.form.uploadFile")}
              />
            </RadioGroup>
          </FormControl>

          {formData.phoneticAudioUploadMethod === "file" && (
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Upload size={20} />}
                fullWidth
                sx={{ mb: 1 }}
              >
                {formData.phoneticAudioFile
                  ? formData.phoneticAudioFile.name
                  : t("vocabularyRus.form.choosePhoneticAudioFile")}
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleChange("phoneticAudioFile", file);
                    }
                  }}
                />
              </Button>
              {formData.phoneticAudioFile && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  {t("vocabularyRus.form.selectedFile")}:{" "}
                  {formData.phoneticAudioFile.name} (
                  {(formData.phoneticAudioFile.size / 1024).toFixed(2)} KB)
                </Alert>
              )}
            </Box>
          )}

          {formData.phoneticAudioUploadMethod === "url" && (
            <TextField
              label={t("vocabularyRus.form.phoneticAudioOriginalUrl")}
              value={formData.phoneticAudioOriginalUrl}
              onChange={(e) =>
                handleChange("phoneticAudioOriginalUrl", e.target.value)
              }
              fullWidth
              placeholder="https://example.com/phonetic-audio.mp3"
            />
          )}

          <TextField
            label={t("vocabularyRus.form.phoneticAudioFilename")}
            value={formData.phoneticAudioFilename}
            onChange={(e) =>
              handleChange("phoneticAudioFilename", e.target.value)
            }
            fullWidth
            placeholder="phonetic-audio.mp3"
          />

          <FormControl fullWidth error={!!errors.lang}>
            <FormLabel sx={{ mb: 1 }}>{t("vocabularyRus.form.lang")}</FormLabel>
            <Select
              value={formData.lang}
              onChange={(e) => handleChange("lang", e.target.value)}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>
              {t("vocabularyRus.form.displayOrder")}
            </FormLabel>
            <TextField
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                handleChange("displayOrder", parseInt(e.target.value) || 0)
              }
              fullWidth
            />
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
              />
            }
            label={t("vocabularyRus.form.isActive")}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          {t("common.cancel")}
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? t("common.creating", "Creating...") : t("common.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VocabularyRuCreateDialog;
