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
import type { FreeTextQuestionRu, FreeTextQuestionRuFormData, QuestionImageRu } from "../types/freeTextQuestionRu.types";
import { getEmptyFreeTextQuestionRuFormData } from "../utils/getEmptyFreeTextQuestionRuFormData";
import {
  LANGUAGE_OPTIONS,
  FREE_TEXT_QUESTION_TAG_SETTING_KEY,
  FREE_TEXT_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY,
  TERM_OPTIONS,
  WEEK_OPTIONS,
} from "../constants";
import { freeTextQuestionRuService } from "../services/freeTextQuestionRuService";
import "../i18n/translations";

interface FreeTextQuestionRuEditDialogProps {
  open: boolean;
  freeTextQuestionRu: FreeTextQuestionRu | null;
  onClose: () => void;
  onConfirm: (data: FreeTextQuestionRuFormData) => Promise<void>;
}

const FreeTextQuestionRuEditDialog = ({
  open,
  freeTextQuestionRu,
  onClose,
  onConfirm,
}: FreeTextQuestionRuEditDialogProps) => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<FreeTextQuestionRuFormData>(
    getEmptyFreeTextQuestionRuFormData(),
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
        (s) => s.name === FREE_TEXT_QUESTION_TAG_SETTING_KEY && s.lang === currentLang,
      );
      if (!tagSetting) return [] as string[];
      return tagSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[FreeTextQuestionRuEditDialog] Error loading tags:", err);
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
        (s) => s.name === FREE_TEXT_QUESTION_DIFFICULTY_LEVEL_SETTING_KEY && s.lang === currentLang,
      );
      if (!difficultyLevelSetting) return [] as string[];
      return difficultyLevelSetting.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("[FreeTextQuestionRuEditDialog] Error loading difficulty levels:", err);
      return [] as string[];
    }
  }, [i18n.language]);

  useEffect(() => {
    if (open && freeTextQuestionRu) {
      setFormData({
        question: freeTextQuestionRu.question || "",
        answer: freeTextQuestionRu.answer || "",
        explanation: freeTextQuestionRu.explanation || "",
        description: freeTextQuestionRu.description || "",
        questiona: freeTextQuestionRu.questiona || "",
        answera: freeTextQuestionRu.answera || "",
        questionb: freeTextQuestionRu.questionb || "",
        answerb: freeTextQuestionRu.answerb || "",
        questionc: freeTextQuestionRu.questionc || "",
        answerc: freeTextQuestionRu.answerc || "",
        questiond: freeTextQuestionRu.questiond || "",
        answerd: freeTextQuestionRu.answerd || "",
        questione: freeTextQuestionRu.questione || "",
        answere: freeTextQuestionRu.answere || "",
        questionf: freeTextQuestionRu.questionf || "",
        answerf: freeTextQuestionRu.answerf || "",
        failCount: freeTextQuestionRu.failCount ?? undefined,
        successCount: freeTextQuestionRu.successCount ?? undefined,
        difficultyLevel: freeTextQuestionRu.difficultyLevel || "",
        tags: freeTextQuestionRu.tags || "",
        lang: freeTextQuestionRu.lang || (i18n.language.toUpperCase().startsWith("ZH") ? "ZH" : "EN"),
        displayOrder: freeTextQuestionRu.displayOrder ?? 999,
        isActive: freeTextQuestionRu.isActive ?? true,
      });
      setErrors({});
      setApiErrorMessage("");
      loadImages();
    } else {
      setImages([]);
    }
  }, [open, freeTextQuestionRu, i18n.language]);

  const handleChange = (field: keyof FreeTextQuestionRuFormData, value: any) => {
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
    // Question and Answer are optional now; only validate lang
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
    if (!freeTextQuestionRu?.id) return;
    try {
      const res = await freeTextQuestionRuService.getQuestionImages(freeTextQuestionRu.id);
      if (res.data) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Failed to load images', err);
    }
  };

  const handleUploadByUrl = async () => {
    if (!freeTextQuestionRu?.id || !uploadUrl || !uploadFilename) return;
    try {
      setLocalSaving(true);
      await freeTextQuestionRuService.uploadQuestionImageByUrl({
        freeTextQuestionId: freeTextQuestionRu.id,
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
    if (!freeTextQuestionRu?.id || !uploadFile || !uploadFileFilename) return;
    try {
      setLocalSaving(true);
      await freeTextQuestionRuService.uploadQuestionImageByFile({
        freeTextQuestionId: freeTextQuestionRu.id,
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
      await freeTextQuestionRuService.deleteQuestionImage(imageToDelete);
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
          {t("freeTextQuestionRus.edit")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {apiErrorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiErrorMessage}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth error={!!errors.question}>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.question")}</FormLabel>
            <TiptapTextEditor
              value={formData.question}
              onChange={(value) => handleChange("question", value)}
              placeholder={t("freeTextQuestionRus.form.question")}
            />
            {errors.question && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.question}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth error={!!errors.answer}>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answer")}</FormLabel>
            <TiptapTextEditor
              value={formData.answer}
              onChange={(value) => handleChange("answer", value)}
              placeholder={t("freeTextQuestionRus.form.answer")}
            />
            {errors.answer && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.answer}
              </Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.explanation")}</FormLabel>
            <TiptapTextEditor
              value={formData.explanation}
              onChange={(value) => handleChange("explanation", value)}
              placeholder={t("freeTextQuestionRus.form.explanation")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.description")}</FormLabel>
            <TiptapTextEditor
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
              placeholder={t("freeTextQuestionRus.form.description")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.questiona")}</FormLabel>
            <TiptapTextEditor
              value={formData.questiona}
              onChange={(value) => handleChange("questiona", value)}
              placeholder={t("freeTextQuestionRus.form.questiona")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answera")}</FormLabel>
            <TiptapTextEditor
              value={formData.answera}
              onChange={(value) => handleChange("answera", value)}
              placeholder={t("freeTextQuestionRus.form.answera")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.questionb")}</FormLabel>
            <TiptapTextEditor
              value={formData.questionb}
              onChange={(value) => handleChange("questionb", value)}
              placeholder={t("freeTextQuestionRus.form.questionb")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answerb")}</FormLabel>
            <TiptapTextEditor
              value={formData.answerb}
              onChange={(value) => handleChange("answerb", value)}
              placeholder={t("freeTextQuestionRus.form.answerb")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.questionc")}</FormLabel>
            <TiptapTextEditor
              value={formData.questionc}
              onChange={(value) => handleChange("questionc", value)}
              placeholder={t("freeTextQuestionRus.form.questionc")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answerc")}</FormLabel>
            <TiptapTextEditor
              value={formData.answerc}
              onChange={(value) => handleChange("answerc", value)}
              placeholder={t("freeTextQuestionRus.form.answerc")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.questiond")}</FormLabel>
            <TiptapTextEditor
              value={formData.questiond}
              onChange={(value) => handleChange("questiond", value)}
              placeholder={t("freeTextQuestionRus.form.questiond")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answerd")}</FormLabel>
            <TiptapTextEditor
              value={formData.answerd}
              onChange={(value) => handleChange("answerd", value)}
              placeholder={t("freeTextQuestionRus.form.answerd")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.questione")}</FormLabel>
            <TiptapTextEditor
              value={formData.questione}
              onChange={(value) => handleChange("questione", value)}
              placeholder={t("freeTextQuestionRus.form.questione")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answere")}</FormLabel>
            <TiptapTextEditor
              value={formData.answere}
              onChange={(value) => handleChange("answere", value)}
              placeholder={t("freeTextQuestionRus.form.answere")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.questionf")}</FormLabel>
            <TiptapTextEditor
              value={formData.questionf}
              onChange={(value) => handleChange("questionf", value)}
              placeholder={t("freeTextQuestionRus.form.questionf")}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.answerf")}</FormLabel>
            <TiptapTextEditor
              value={formData.answerf}
              onChange={(value) => handleChange("answerf", value)}
              placeholder={t("freeTextQuestionRus.form.answerf")}
            />
          </FormControl>

          {freeTextQuestionRu?.id && (
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
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.difficultyLevel")}</FormLabel>
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
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.tags")}</FormLabel>
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
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.lang")}</FormLabel>
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
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.term")}</FormLabel>
            <Select
              value={formData.term?.toString() || ''}
              onChange={(e) => handleChange('term', e.target.value ? parseInt(e.target.value) : undefined)}
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {TERM_OPTIONS.map((term) => (
                <MenuItem key={term.value} value={term.value.toString()}>
                  {term.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.week")}</FormLabel>
            <Select
              value={formData.week?.toString() || ''}
              onChange={(e) => handleChange('week', e.target.value ? parseInt(e.target.value) : undefined)}
              displayEmpty
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {WEEK_OPTIONS.map((week) => (
                <MenuItem key={week.value} value={week.value.toString()}>
                  {week.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <FormLabel sx={{ mb: 1 }}>{t("freeTextQuestionRus.form.displayOrder")}</FormLabel>
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
              label={t("freeTextQuestionRus.form.isActive")}
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
        <DialogTitle>{t("freeTextQuestionRus.common.delete")}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this image?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>{t("freeTextQuestionRus.common.cancel")}</Button>
          <Button onClick={handleConfirmDeleteImage} color="error" variant="contained">
            {t("freeTextQuestionRus.common.delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default FreeTextQuestionRuEditDialog;
