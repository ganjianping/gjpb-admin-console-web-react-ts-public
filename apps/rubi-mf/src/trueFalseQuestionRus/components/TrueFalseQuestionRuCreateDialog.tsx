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
  Alert,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { TiptapTextEditor } from "../../../../shared-lib/src/ui-components";
import type { TrueFalseQuestionRuFormData } from "../types/trueFalseQuestionRu.types";
import { getEmptyTrueFalseQuestionRuFormData } from "../utils/getEmptyTrueFalseQuestionRuFormData";
import {
  LANGUAGE_OPTIONS,
  TRUE_FALSE_QUESTION_TAG_SETTING_KEY,
  TRUE_FALSE_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY,
} from "../constants";
import "../i18n/translations";

interface TrueFalseQuestionRuCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: TrueFalseQuestionRuFormData) => Promise<void>;
}

const TrueFalseQuestionRuCreateDialog = ({
  open,
  onClose,
  onConfirm,
}: TrueFalseQuestionRuCreateDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<TrueFalseQuestionRuFormData>(
    getEmptyTrueFalseQuestionRuFormData(),
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrorMessage, setApiErrorMessage] = useState("");

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
        (s) => s.name === TRUE_FALSE_QUESTION_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[TrueFalseQuestionRuCreateDialog] Error loading tags:", err);
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
        (s) => s.name === TRUE_FALSE_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang,
      );
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[TrueFalseQuestionRuCreateDialog] Error loading difficulty levels:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open) {
      const defaultLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
      setFormData({ ...getEmptyTrueFalseQuestionRuFormData(), lang: defaultLang });
      setErrors({});
      setApiErrorMessage("");
    }
  }, [open, i18n.language]);

  const handleChange = (field: keyof TrueFalseQuestionRuFormData, value: any) => {
    setFormData((prev) => {
      if (errors[field]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
      }
      return { ...prev, [field]: value };
    });
  };

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    handleChange("tags", value.join(","));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.question.trim()) {
      newErrors.question = t("common.required");
    }
    if (!formData.answer.trim()) {
      newErrors.answer = t("common.required");
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
          {t("trueFalseQuestionRus.create")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {apiErrorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiErrorMessage}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth error={!!errors.question} required>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.question")}</FormLabel>
            <TiptapTextEditor
              value={formData.question}
              onChange={(value) => handleChange("question", value)}
              placeholder={t("trueFalseQuestionRus.form.question")}
            />
            {errors.question && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.question}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.answer} required>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.answer")}</FormLabel>
            <TiptapTextEditor
              value={formData.answer}
              onChange={(value) => handleChange("answer", value)}
              placeholder={t("trueFalseQuestionRus.form.answer")}
            />
            {errors.answer && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.answer}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.explanation")}</FormLabel>
            <TiptapTextEditor
              value={formData.explanation}
              onChange={(value) => handleChange("explanation", value)}
              placeholder={t("trueFalseQuestionRus.form.explanation")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.difficultyLevel")}</FormLabel>
            <Select
              value={formData.difficultyLevel}
              onChange={(e) => handleChange("difficultyLevel", e.target.value)}
              displayEmpty
            >
              {availableDifficultyLevels.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.tags")}</FormLabel>
            <Select
              multiple
              value={formData.tags ? formData.tags.split(",").map(t => t.trim()) : []}
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth error={!!errors.lang} required>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.lang")}</FormLabel>
            <Select
              value={formData.lang}
              onChange={(e) => handleChange("lang", e.target.value)}
              error={!!errors.lang}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.lang && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.lang}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.term")}</FormLabel>
            <Select
              value={formData.term?.toString() || ''}
              onChange={(e) => handleChange('term', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {[1, 2, 3, 4].map((term) => (
                <MenuItem key={term} value={term.toString()}>{term}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.week")}</FormLabel>
            <Select
              value={formData.week?.toString() || ''}
              onChange={(e) => handleChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
                <MenuItem key={week} value={week.toString()}>{week}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.displayOrder")}</FormLabel>
            <TextField
              type="number"
              value={formData.displayOrder}
              onChange={(e) => handleChange("displayOrder", parseInt(e.target.value, 10) || 0)}
              fullWidth
            />
          </FormControl>

          <FormControl fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              }
              label={t("trueFalseQuestionRus.form.isActive")}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? t("common.saving") : t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrueFalseQuestionRuCreateDialog;
