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
  LinearProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Edit } from "lucide-react";
import { TiptapTextEditor } from "../../../../shared-lib/src/ui-components";
import { ContentCopy as ContentCopyIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { FillBlankQuestionRu, FillBlankQuestionRuFormData, QuestionImageRu } from "../types/fillBlankQuestionRu.types";
import { getEmptyFillBlankQuestionRuFormData } from "../utils/getEmptyFillBlankQuestionRuFormData";
import {
  LANGUAGE_OPTIONS,
  FILL_BLANK_QUESTION_TAG_SETTING_KEY,
  FILL_BLANK_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY,
  TERM_OPTIONS,
  WEEK_OPTIONS,
} from "../constants";
import { fillBlankQuestionRuService } from "../services/fillBlankQuestionRuService";
import "../i18n/translations";

interface FillBlankQuestionRuEditDialogProps {
  open: boolean;
  fillBlankQuestionRu: FillBlankQuestionRu | null;
  onClose: () => void;
  onConfirm: (data: FillBlankQuestionRuFormData) => Promise<void>;
}

const FillBlankQuestionRuEditDialog = ({
  open,
  fillBlankQuestionRu,
  onClose,
  onConfirm,
}: FillBlankQuestionRuEditDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<FillBlankQuestionRuFormData>(
    getEmptyFillBlankQuestionRuFormData(),
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiErrorMessage, setApiErrorMessage] = useState("");
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
      const currentLang = i18n.language.toUpperCase().startsWith("ZH")
        ? "ZH"
        : "EN";
      const tagSetting = appSettings.find(
        (s) => s.name === FILL_BLANK_QUESTION_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[FillBlankQuestionRuEditDialog] Error loading tags:", err);
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
        (s) => s.name === FILL_BLANK_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang,
      );
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[FillBlankQuestionRuEditDialog] Error loading difficulty levels:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableGrammarChapters = useMemo(() => {
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
      const grammarChapterSetting = appSettings.find(
        (s) => s.name === "grammar_chapters" && s.lang === currentLang,
      );
      if (!grammarChapterSetting) return [] as string[];
      return grammarChapterSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[FillBlankQuestionRuEditDialog] Error loading grammar chapters:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  const availableScienceChapters = useMemo(() => {
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
      const scienceChapterSetting = appSettings.find(
        (s) => s.name === "science_chapters" && s.lang === currentLang,
      );
      if (!scienceChapterSetting) return [] as string[];
      return scienceChapterSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[FillBlankQuestionRuEditDialog] Error loading science chapters:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open && fillBlankQuestionRu) {
      setFormData({
        question: fillBlankQuestionRu.question || "",
        answer: fillBlankQuestionRu.answer || "",
        explanation: fillBlankQuestionRu.explanation || "",
        difficultyLevel: fillBlankQuestionRu.difficultyLevel || "",
        tags: fillBlankQuestionRu.tags || "",
        grammarChapter: fillBlankQuestionRu.grammarChapter || "",
        scienceChapter: fillBlankQuestionRu.scienceChapter || "",
        lang: fillBlankQuestionRu.lang || (i18n.language.toUpperCase().startsWith("ZH") ? "ZH" : "EN"),
        term: fillBlankQuestionRu.term ?? undefined,
        week: fillBlankQuestionRu.week ?? undefined,
        displayOrder: fillBlankQuestionRu.displayOrder ?? 999,
        isActive: fillBlankQuestionRu.isActive ?? true,
      });
      setErrors({});
      setApiErrorMessage("");
      loadImages();
    } else {
      setImages([]);
    }
  }, [open, fillBlankQuestionRu, i18n.language]);

  const handleChange = (field: keyof FillBlankQuestionRuFormData, value: any) => {
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

  const loadImages = async () => {
    if (!fillBlankQuestionRu?.id) return;
    try {
      const res = await fillBlankQuestionRuService.getQuestionImages(fillBlankQuestionRu.id);
      if (res.data) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Failed to load images', err);
    }
  };

  const handleUploadByUrl = async () => {
    if (!fillBlankQuestionRu?.id || !uploadUrl || !uploadFilename) return;
    try {
      setLocalSaving(true);
      await fillBlankQuestionRuService.uploadQuestionImageByUrl({
        fillBlankQuestionId: fillBlankQuestionRu.id,
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
    if (!fillBlankQuestionRu?.id || !uploadFile || !uploadFileFilename) return;
    try {
      setLocalSaving(true);
      await fillBlankQuestionRuService.uploadQuestionImageByFile({
        fillBlankQuestionId: fillBlankQuestionRu.id,
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
      await fillBlankQuestionRuService.deleteQuestionImage(imageToDelete);
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
        <Edit size={20} />
        <Typography variant="h6" component="span">
          {t("fillBlankQuestionRus.edit")}
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
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.question")}</FormLabel>
            <TiptapTextEditor
              value={formData.question}
              onChange={(value) => handleChange("question", value)}
              placeholder={t("fillBlankQuestionRus.form.question")}
            />
            {errors.question && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.question}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.answer} required>
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.answer")}</FormLabel>
            <TextField
              value={formData.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              placeholder={t("fillBlankQuestionRus.form.answer")}
              multiline
              minRows={2}
              maxRows={8}
              fullWidth
            />
            {errors.answer && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.answer}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.explanation")}</FormLabel>
            <TiptapTextEditor
              value={formData.explanation}
              onChange={(value) => handleChange("explanation", value)}
              placeholder={t("fillBlankQuestionRus.form.explanation")}
            />
          </FormControl>

          {fillBlankQuestionRu?.id && (
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

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.difficultyLevel")}</FormLabel>
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
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.tags")}</FormLabel>
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

          {/* Show grammarChapter if Tags contains 'Grammar' */}
          {formData.tags && formData.tags.split(',').map(t => t.trim()).includes('Grammar') && (
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.grammarChapter")}</FormLabel>
              <Select
                value={formData.grammarChapter}
                onChange={(e) => handleChange("grammarChapter", e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {availableGrammarChapters.map((chapter) => (
                  <MenuItem key={chapter} value={chapter}>
                    {chapter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Show scienceChapter if Tags contains 'Science' */}
          {formData.tags && formData.tags.split(',').map(t => t.trim()).includes('Science') && (
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.scienceChapter")}</FormLabel>
              <Select
                value={formData.scienceChapter}
                onChange={(e) => handleChange("scienceChapter", e.target.value)}
                displayEmpty
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {availableScienceChapters.map((chapter) => (
                  <MenuItem key={chapter} value={chapter}>
                    {chapter}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth error={!!errors.lang} required>
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.lang")}</FormLabel>
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
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.term")}</FormLabel>
            <Select
              value={formData.term || ""}
              onChange={(e) => handleChange("term", e.target.value ? Number(e.target.value) : undefined)}
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {TERM_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.week")}</FormLabel>
            <Select
              value={formData.week || ""}
              onChange={(e) => handleChange("week", e.target.value ? Number(e.target.value) : undefined)}
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {WEEK_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("fillBlankQuestionRus.form.displayOrder")}</FormLabel>
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
              label={t("fillBlankQuestionRus.form.isActive")}
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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t("fillBlankQuestionRus.common.delete")}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t("fillBlankQuestionRus.common.cancel")}</Button>
          <Button onClick={handleConfirmDeleteImage} color="error" variant="contained">
            {t("fillBlankQuestionRus.common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default FillBlankQuestionRuEditDialog;
