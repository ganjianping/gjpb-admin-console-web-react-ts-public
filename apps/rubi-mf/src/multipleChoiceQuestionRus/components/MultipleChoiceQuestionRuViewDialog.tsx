import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { Edit as EditIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import type { MultipleChoiceQuestionRu } from "../types/multipleChoiceQuestionRu.types";
import { DIFFICULTY_LEVELS, LANGUAGES } from "../constants";

interface MultipleChoiceQuestionRuViewDialogProps {
  open: boolean;
  multipleChoiceQuestionRu: MultipleChoiceQuestionRu;
  onClose: () => void;
  onEdit: (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => void;
}

const MultipleChoiceQuestionRuViewDialog: React.FC<
  MultipleChoiceQuestionRuViewDialogProps
> = ({ open, multipleChoiceQuestionRu, onClose, onEdit }) => {
  const { t } = useTranslation();

  const getDifficultyLevelLabel = (value: string) => {
    const level = DIFFICULTY_LEVELS.find(
      (l: { value: string; label: string }) => l.value === value,
    );
    return level
      ? t(`multipleChoiceQuestionRus.difficultyLevels.${level.value}`)
      : value;
  };

  const getLanguageLabel = (value: string) => {
    const lang = LANGUAGES.find(
      (l: { value: string; label: string }) => l.value === value,
    );
    return lang ? lang.label : value;
  };

  const renderCorrectAnswers = () => {
    const options = [
      { key: "A", value: multipleChoiceQuestionRu.optionA },
      { key: "B", value: multipleChoiceQuestionRu.optionB },
      { key: "C", value: multipleChoiceQuestionRu.optionC },
      { key: "D", value: multipleChoiceQuestionRu.optionD },
    ];

    const correctAnswers =
      multipleChoiceQuestionRu.correctAnswers
        ?.split(",")
        .map((a: string) => a.trim().toUpperCase()) || [];

    const correctOptions = options.filter((option) =>
      correctAnswers.includes(option.key),
    );

    if (correctOptions.length === 0) return null;

    const cleanHtml = (html: string) => {
      let cleaned = html;
      if (cleaned.startsWith('<p>')) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith('</p>')) {
        cleaned = cleaned.substring(0, cleaned.length - 4);
      }
      return cleaned;
    };

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          {t("multipleChoiceQuestionRus.viewDialog.correctAnswers")}
        </Typography>
        {correctOptions.map((option, index) => (
          <Typography
            key={option.key}
            variant="body1"
            sx={{
              fontWeight: "bold",
              color: "success.main",
              display: "inline",
            }}
            dangerouslySetInnerHTML={{
              __html: `${option.key}. ${cleanHtml(option.value)}${
                index < correctOptions.length - 1 ? "; " : ""
              }`,
            }}
          />
        ))}
      </Box>
    );
  };

  const renderOptions = () => {
    const options = [
      { key: "A", value: multipleChoiceQuestionRu.optionA },
      { key: "B", value: multipleChoiceQuestionRu.optionB },
      { key: "C", value: multipleChoiceQuestionRu.optionC },
      { key: "D", value: multipleChoiceQuestionRu.optionD },
    ];

    const correctAnswers =
      multipleChoiceQuestionRu.correctAnswers
        ?.split(",")
        .map((a: string) => a.trim().toUpperCase()) || [];

    const cleanHtml = (html: string) => {
      let cleaned = html;
      if (cleaned.startsWith('<p>')) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith('</p>')) {
        cleaned = cleaned.substring(0, cleaned.length - 4);
      }
      return cleaned;
    };

    return options.map((option) => (
      <Box key={option.key} sx={{ mb: 1, display: "flex", alignItems: "center" }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: correctAnswers.includes(option.key) ? "bold" : "normal",
            color: correctAnswers.includes(option.key)
              ? "success.main"
              : "text.primary",
          }}
          dangerouslySetInnerHTML={{ __html: `${option.key}. ${cleanHtml(option.value)}` }}
        />
        {correctAnswers.includes(option.key) && (
          <CheckCircleIcon
            sx={{
              ml: 1,
              color: "success.main",
              fontSize: "1.2rem"
            }}
          />
        )}
      </Box>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {t("multipleChoiceQuestionRus.viewDialog.title")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography
                variant="body1"
                sx={{ mb: 2 }}
                dangerouslySetInnerHTML={{
                  __html: multipleChoiceQuestionRu.question,
                }}
              />

              <Divider sx={{ my: 2 }} />

              {renderOptions()}

              {multipleChoiceQuestionRu.explanation && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t("multipleChoiceQuestionRus.form.explanation")}
                  </Typography>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{
                      __html: multipleChoiceQuestionRu.explanation,
                    }}
                  />
                </>
              )}
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("multipleChoiceQuestionRus.form.difficultyLevel")}
              </Typography>
              <Typography variant="body1">
                {getDifficultyLevelLabel(
                  multipleChoiceQuestionRu.difficultyLevel || "",
                )}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("multipleChoiceQuestionRus.form.lang")}
              </Typography>
              <Typography variant="body1">
                {getLanguageLabel(multipleChoiceQuestionRu.lang || "EN")}
              </Typography>
            </Box>

            {multipleChoiceQuestionRu.tags && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  {t("multipleChoiceQuestionRus.form.tags")}
                </Typography>
                <Typography variant="body1">
                  {multipleChoiceQuestionRu.tags}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("multipleChoiceQuestionRus.form.displayOrder")}
              </Typography>
              <Typography variant="body1">
                {multipleChoiceQuestionRu.displayOrder ?? 999}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                {t("multipleChoiceQuestionRus.form.isActive")}
              </Typography>
              <Chip
                label={
                  multipleChoiceQuestionRu.isActive
                    ? t("multipleChoiceQuestionRus.common.active")
                    : t("multipleChoiceQuestionRus.common.inactive")
                }
                color={
                  multipleChoiceQuestionRu.isActive ? "success" : "default"
                }
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t("multipleChoiceQuestionRus.common.close")}
        </Button>
        <Button
          onClick={() => onEdit(multipleChoiceQuestionRu)}
          startIcon={<EditIcon />}
          variant="contained"
        >
          {t("multipleChoiceQuestionRus.viewDialog.edit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MultipleChoiceQuestionRuViewDialog;
