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
import type { TrueFalseQuestionRu, TrueFalseQuestionRuFormData, QuestionImageRu } from "../types/trueFalseQuestionRu.types";
import { getEmptyTrueFalseQuestionRuFormData } from "../utils/getEmptyTrueFalseQuestionRuFormData";
import {
  LANGUAGE_OPTIONS,
  TRUE_FALSE_QUESTION_TAG_SETTING_KEY,
  TRUE_FALSE_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY,
} from "../constants";
import { trueFalseQuestionRuService } from "../services/trueFalseQuestionRuService";
import "../i18n/translations";

interface TrueFalseQuestionRuEditDialogProps {
  open: boolean;
  trueFalseQuestionRu: TrueFalseQuestionRu | null;
  onClose: () => void;
  onConfirm: (data: TrueFalseQuestionRuFormData) => Promise<void>;
}

const TrueFalseQuestionRuEditDialog = ({
  open,
  trueFalseQuestionRu,
  onClose,
  onConfirm,
}: TrueFalseQuestionRuEditDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<TrueFalseQuestionRuFormData>(
    getEmptyTrueFalseQuestionRuFormData(),
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
        (s) => s.name === TRUE_FALSE_QUESTION_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[TrueFalseQuestionRuEditDialog] Error loading tags:", err);
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
      console.error("[TrueFalseQuestionRuEditDialog] Error loading difficulty levels:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open && trueFalseQuestionRu) {
      setFormData({
        question: trueFalseQuestionRu.question || "",
        answer: trueFalseQuestionRu.answer || "",
        explanation: trueFalseQuestionRu.explanation || "",
        difficultyLevel: trueFalseQuestionRu.difficultyLevel || "",
        tags: trueFalseQuestionRu.tags || "",
        grammarChapter: trueFalseQuestionRu.grammarChapter || "",
        scienceChapter: trueFalseQuestionRu.scienceChapter || "",
        lang: trueFalseQuestionRu.lang || (i18n.language.toUpperCase().startsWith("ZH") ? "ZH" : "EN"),
        term: trueFalseQuestionRu.term ?? undefined,
        week: trueFalseQuestionRu.week ?? undefined,
        displayOrder: trueFalseQuestionRu.displayOrder ?? 999,
        isActive: trueFalseQuestionRu.isActive ?? true,
      });
      setErrors({});
      setApiErrorMessage("");
      loadImages();
    } else {
      setImages([]);
    }
  }, [open, trueFalseQuestionRu, i18n.language]);

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

  const loadImages = async () => {
    if (!trueFalseQuestionRu?.id) return;
    try {
      const res = await trueFalseQuestionRuService.getQuestionImages(trueFalseQuestionRu.id);
      if (res.data) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Failed to load images', err);
    }
  };

  const handleUploadByUrl = async () => {
    if (!trueFalseQuestionRu?.id || !uploadUrl || !uploadFilename) return;
    try {
      setLocalSaving(true);
      await trueFalseQuestionRuService.uploadQuestionImageByUrl({
        trueFalseQuestionId: trueFalseQuestionRu.id,
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
    if (!trueFalseQuestionRu?.id || !uploadFile || !uploadFileFilename) return;
    try {
      setLocalSaving(true);
      await trueFalseQuestionRuService.uploadQuestionImageByFile({
        trueFalseQuestionId: trueFalseQuestionRu.id,
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
      await trueFalseQuestionRuService.deleteQuestionImage(imageToDelete);
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
          {t("trueFalseQuestionRus.edit")}
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
            <Select
              value={formData.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              error={!!errors.answer}
            >
              <MenuItem value="TRUE">TRUE</MenuItem>
              <MenuItem value="FALSE">FALSE</MenuItem>
            </Select>
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

          {trueFalseQuestionRu?.id && (
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

          {/* Show grammarChapter if Tags contains 'Grammar' */}
          {formData.tags && formData.tags.split(',').map(t => t.trim()).includes('Grammar') && (
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.grammarChapter")}</FormLabel>
              <TextField
                value={formData.grammarChapter}
                onChange={(e) => handleChange("grammarChapter", e.target.value)}
                placeholder="Enter grammar chapter"
                fullWidth
              />
            </FormControl>
          )}

          {/* Show scienceChapter if Tags contains 'Science' */}
          {formData.tags && formData.tags.split(',').map(t => t.trim()).includes('Science') && (
            <FormControl fullWidth>
              <FormLabel sx={{ mb: 1 }}>{t("trueFalseQuestionRus.form.scienceChapter")}</FormLabel>
              <TextField
                value={formData.scienceChapter}
                onChange={(e) => handleChange("scienceChapter", e.target.value)}
                placeholder="Enter science chapter"
                fullWidth
              />
            </FormControl>
          )}

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

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>{t("trueFalseQuestionRus.common.delete")}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t("trueFalseQuestionRus.common.cancel")}</Button>
          <Button onClick={handleConfirmDeleteImage} color="error" variant="contained">
            {t("trueFalseQuestionRus.common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default TrueFalseQuestionRuEditDialog;
