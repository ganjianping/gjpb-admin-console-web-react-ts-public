import React, { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  FormLabel,
  OutlinedInput,
  Chip,
  LinearProgress,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Pencil } from "lucide-react";
import { ContentCopy as ContentCopyIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TiptapTextEditor } from "../../../../shared-lib/src/ui-components";
import type {
  MultipleChoiceQuestionRu,
  MultipleChoiceQuestionRuFormData,
  QuestionImageRu,
} from "../types/multipleChoiceQuestionRu.types";
import { LANGUAGES, MULTIPLE_CHOICE_QUESTION_TAG_SETTING_KEY, MULTIPLE_CHOICE_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY } from "../constants";
import { getEmptyMultipleChoiceQuestionRuFormData } from "../utils/getEmptyMultipleChoiceQuestionRuFormData";
import { multipleChoiceQuestionRuService } from "../services/multipleChoiceQuestionRuService";

interface MultipleChoiceQuestionRuEditDialogProps {
  open: boolean;
  multipleChoiceQuestionRu: MultipleChoiceQuestionRu | null;
  onClose: () => void;
  onConfirm: (formData: MultipleChoiceQuestionRuFormData) => Promise<void>;
}

const MultipleChoiceQuestionRuEditDialog: React.FC<
  MultipleChoiceQuestionRuEditDialogProps
> = ({ open, multipleChoiceQuestionRu, onClose, onConfirm }) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<MultipleChoiceQuestionRuFormData>(getEmptyMultipleChoiceQuestionRuFormData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localSaving, setLocalSaving] = useState(false);
  const [images, setImages] = useState<QuestionImageRu[]>([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileFilename, setUploadFileFilename] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const availableTags = useMemo(() => {
    try {
      const settings = localStorage.getItem("gjpb_app_settings");
      if (!settings) return [] as string[];
      const appSettings = JSON.parse(settings) as Array<{
        name: string;
        value: string;
        lang: string;
      }>;
      const currentLang = i18n.language.toUpperCase().startsWith("ZH") ? "ZH" : "EN";
      const tagSetting = appSettings.find(
        (s) => s.name === MULTIPLE_CHOICE_QUESTION_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value.split(",").map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error("[MultipleChoiceQuestionRuEditDialog] Error loading tags:", err);
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
      const currentLang = i18n.language.toUpperCase().startsWith("ZH") ? "ZH" : "EN";
      const difficultyLevelSetting = appSettings.find(
        (s) => s.name === MULTIPLE_CHOICE_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang,
      );
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value.split(",").map((v) => v.trim()).filter(Boolean);
    } catch (err) {
      console.error("[MultipleChoiceQuestionRuEditDialog] Error loading difficulty levels:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  // Initialize form data when dialog opens with selected question
  useEffect(() => {
    if (open && multipleChoiceQuestionRu) {
      setFormData({
        question: multipleChoiceQuestionRu.question || '',
        optionA: multipleChoiceQuestionRu.optionA || '',
        optionB: multipleChoiceQuestionRu.optionB || '',
        optionC: multipleChoiceQuestionRu.optionC || '',
        optionD: multipleChoiceQuestionRu.optionD || '',
        answer: multipleChoiceQuestionRu.answer || '',
        explanation: multipleChoiceQuestionRu.explanation || '',
        difficultyLevel: multipleChoiceQuestionRu.difficultyLevel || '',
        tags: multipleChoiceQuestionRu.tags || '',
        lang: multipleChoiceQuestionRu.lang || 'EN',
        term: multipleChoiceQuestionRu.term ?? undefined,
        week: multipleChoiceQuestionRu.week ?? undefined,
        displayOrder: multipleChoiceQuestionRu.displayOrder ?? 999,
        isActive: Boolean(multipleChoiceQuestionRu.isActive),
      });
      setError(null);
      loadImages();
    } else {
      setImages([]);
    }
  }, [open, multipleChoiceQuestionRu]);

  const loadImages = async () => {
    if (!multipleChoiceQuestionRu?.id) return;
    try {
      const res = await multipleChoiceQuestionRuService.getQuestionImages(multipleChoiceQuestionRu.id);
      if (res.data) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Failed to load images', err);
    }
  };

  const handleUploadByUrl = async () => {
    if (!multipleChoiceQuestionRu?.id || !uploadUrl || !uploadFilename) return;
    try {
      setLocalSaving(true);
      await multipleChoiceQuestionRuService.uploadQuestionImageByUrl({
        multipleChoiceQuestionId: multipleChoiceQuestionRu.id,
        originalUrl: uploadUrl,
        filename: uploadFilename,
        lang: formData.lang,
      });
      setUploadUrl('');
      setUploadFilename('');
      await loadImages();
    } catch (err) {
      console.error('Failed to upload image by url', err);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleUploadByFile = async () => {
    if (!multipleChoiceQuestionRu?.id || !uploadFile || !uploadFileFilename) return;
    try {
      setLocalSaving(true);
      await multipleChoiceQuestionRuService.uploadQuestionImageByFile({
        multipleChoiceQuestionId: multipleChoiceQuestionRu.id,
        file: uploadFile,
        filename: uploadFileFilename,
      });
      setUploadFile(null);
      setUploadFileFilename('');
      await loadImages();
    } catch (err) {
      console.error('Failed to upload image by file', err);
    } finally {
      setLocalSaving(false);
    }
  };

  const handleDeleteImageClick = (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteImage = async () => {
    if (!imageToDelete) return;
    try {
      setLocalSaving(true);
      await multipleChoiceQuestionRuService.deleteQuestionImage(imageToDelete);
      await loadImages();
    } catch (err) {
      console.error('Failed to delete image', err);
    } finally {
      setLocalSaving(false);
      setDeleteConfirmOpen(false);
      setImageToDelete(null);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    if (file) {
      setUploadFileFilename(file.name);
    }
  };

  const handleFormChange = (
    field: keyof MultipleChoiceQuestionRuFormData,
    value: MultipleChoiceQuestionRuFormData[keyof MultipleChoiceQuestionRuFormData],
  ) => {
    setFormData((prev: MultipleChoiceQuestionRuFormData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (e: any) => {
    const value = e.target.value as string[];
    handleFormChange("tags", value.join(","));
  };

  const validateForm = (): boolean => {
    // Only Question and Correct Answer are mandatory
    if (!formData.question?.trim()) return false;
    if (!formData.answer?.trim()) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update question');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData(getEmptyMultipleChoiceQuestionRuFormData());
      setError(null);
      onClose();
    }
  };

  if (!multipleChoiceQuestionRu) return null;

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        handleClose();
      }}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
    >
      {(loading || localSaving) && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1200 }}>
          <LinearProgress />
        </Box>
      )}
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
        <Pencil size={20} />
        <Typography variant="h6" component="span">
          {t("multipleChoiceQuestionRus.editDialog.title")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth error={!formData.question?.trim()}>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.question")} *</FormLabel>
            <TiptapTextEditor
              value={formData.question}
              onChange={(value) => handleFormChange("question", value)}
              placeholder={t("multipleChoiceQuestionRus.form.question")}
            />
            {!formData.question?.trim() && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {t("multipleChoiceQuestionRus.validation.questionRequired")}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.optionA")}</FormLabel>
            <TiptapTextEditor
              value={formData.optionA}
              onChange={(value) => handleFormChange("optionA", value)}
              placeholder={t("multipleChoiceQuestionRus.form.optionA")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.optionB")}</FormLabel>
            <TiptapTextEditor
              value={formData.optionB}
              onChange={(value) => handleFormChange("optionB", value)}
              placeholder={t("multipleChoiceQuestionRus.form.optionB")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.optionC")}</FormLabel>
            <TiptapTextEditor
              value={formData.optionC}
              onChange={(value) => handleFormChange("optionC", value)}
              placeholder={t("multipleChoiceQuestionRus.form.optionC")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.optionD")}</FormLabel>
            <TiptapTextEditor
              value={formData.optionD}
              onChange={(value) => handleFormChange("optionD", value)}
              placeholder={t("multipleChoiceQuestionRus.form.optionD")}
            />
          </FormControl>

          <FormControl fullWidth error={!formData.answer?.trim()}>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.answer")} *</FormLabel>
            <TextField
              fullWidth
              value={formData.answer}
              onChange={(e) => handleFormChange("answer", e.target.value)}
              placeholder={t("multipleChoiceQuestionRus.form.answerPlaceholder")}
              error={!formData.answer?.trim()}
            />
            <Typography variant="caption" color={formData.answer?.trim() ? "text.secondary" : "error"} sx={{ mt: 0.5 }}>
              {formData.answer?.trim()
                ? t("multipleChoiceQuestionRus.form.answerHelp")
                : t("multipleChoiceQuestionRus.validation.answerRequired")}
            </Typography>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.explanation")}</FormLabel>
            <TiptapTextEditor
              value={formData.explanation}
              onChange={(value) => handleFormChange("explanation", value)}
              placeholder={t("multipleChoiceQuestionRus.form.explanation")}
            />
          </FormControl>

          {multipleChoiceQuestionRu?.id && (
            <Box sx={{ border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Question Images
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                {images.map((img) => (
                  <Grid size={{ xs: 4, sm: 3, md: 2 }} key={img.id}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={img.fileUrl || img.originalUrl || ''}
                        alt={img.filename}
                      />
                      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                        <Typography variant="caption" noWrap display="block">
                          {img.filename}
                        </Typography>
                      </CardContent>
                      <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)', display: 'flex' }}>
                        {img.fileUrl && (
                          <Tooltip title="Copy URL">
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(img.fileUrl!);
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete Image">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteImageClick(img.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Upload by URL
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Original URL"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Filename"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleUploadByUrl}
                  disabled={!uploadUrl || !uploadFilename || localSaving}
                >
                  Upload
                </Button>
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Upload by File
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <input type="file" accept="image/*" onChange={handleImageFileChange} />
                <TextField
                  label="Filename"
                  value={uploadFileFilename}
                  onChange={(e) => setUploadFileFilename(e.target.value)}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleUploadByFile}
                  disabled={!uploadFile || !uploadFileFilename || localSaving}
                >
                  Upload
                </Button>
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.difficultyLevel")}</FormLabel>
              <Select
                value={formData.difficultyLevel}
                onChange={(e) => handleFormChange("difficultyLevel", e.target.value)}
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
              <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.lang")}</FormLabel>
              <Select
                value={formData.lang}
                onChange={(e) => handleFormChange("lang", e.target.value)}
                displayEmpty
              >
                {LANGUAGES.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.tags")}</FormLabel>
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

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.term")}</FormLabel>
              <Select
                value={formData.term?.toString() || ''}
                onChange={(e) => handleFormChange('term', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {[1, 2, 3, 4].map((term) => (
                  <MenuItem key={term} value={term.toString()}>{term}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.week")}</FormLabel>
              <Select
                value={formData.week?.toString() || ''}
                onChange={(e) => handleFormChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {Array.from({ length: 14 }, (_, i) => i + 1).map((week) => (
                  <MenuItem key={week} value={week.toString()}>{week}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("multipleChoiceQuestionRus.form.displayOrder")}</FormLabel>
              <TextField
                fullWidth
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  handleFormChange("displayOrder", Number.parseInt(e.target.value, 10) || 999)
                }
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </FormControl>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => handleFormChange("isActive", e.target.checked)}
              />
            }
            label={t("multipleChoiceQuestionRus.form.isActive")}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t("multipleChoiceQuestionRus.common.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !validateForm()}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? t("common.save", "Saving...") : t("common.save")}
        </Button>
      </DialogActions>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t("multipleChoiceQuestionRus.common.delete")}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t("multipleChoiceQuestionRus.common.cancel")}</Button>
          <Button onClick={handleConfirmDeleteImage} color="error" variant="contained">
            {t("multipleChoiceQuestionRus.common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default MultipleChoiceQuestionRuEditDialog;
