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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { Eye, Tag, CheckCircle2, XCircle, Calendar } from "lucide-react";
import type { FreeTextQuestionRu } from "../types/freeTextQuestionRu.types";
import "../i18n/translations";
import { LANGUAGE_OPTIONS } from "../constants";

interface FreeTextQuestionRuViewDialogProps {
  open: boolean;
  freeTextQuestionRu: FreeTextQuestionRu;
  onClose: () => void;
  onEdit?: (freeTextQuestionRu: FreeTextQuestionRu) => void;
}

const FreeTextQuestionRuViewDialog = ({
  open,
  freeTextQuestionRu,
  onClose,
  onEdit,
}: FreeTextQuestionRuViewDialogProps) => {
  const { t } = useTranslation();

  const languageLabel = (code?: string | null) => {
    if (!code) return "-";
    const found = LANGUAGE_OPTIONS.find((o) => o.value === code.toUpperCase());
    return found ? `${found.label} (${code})` : code;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
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
        <Eye size={20} />
        <Typography variant="h6" component="span">
          {t("freeTextQuestionRus.view")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card
            elevation={0}
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
                  : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: freeTextQuestionRu.question,
                  }}
                />
              </Typography>
              <Typography
                variant="body1"
                sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
              >
                <strong>{t("freeTextQuestionRus.form.correctAnswer")}:</strong>{" "}
                <span
                  dangerouslySetInnerHTML={{
                    __html: freeTextQuestionRu.correctAnswer || "-",
                  }}
                />
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                {freeTextQuestionRu.tags
                  ?.split(",")
                  .filter(Boolean)
                  .map((tag) => (
                    <Chip
                      key={tag.trim()}
                      icon={<Tag size={14} />}
                      label={tag.trim()}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
              </Box>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
              >
                {t("freeTextQuestionRus.viewDialog.details")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
                  >
                    Language
                  </Typography>
                  <Chip
                    label={languageLabel(freeTextQuestionRu.lang)}
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
                  >
                    {t("freeTextQuestionRus.form.difficultyLevel")}
                  </Typography>
                  <Typography variant="body2">
                    {freeTextQuestionRu.difficultyLevel || "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
                  >
                    {t("freeTextQuestionRus.form.displayOrder")}
                  </Typography>
                  <Typography variant="body2">
                    {freeTextQuestionRu.displayOrder ?? "-"}
                  </Typography>
                </Box>
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
                  >
                    {t("freeTextQuestionRus.form.explanation")}
                  </Typography>
                  <Typography variant="body2">
                    {freeTextQuestionRu.explanation || "-"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
              >
                {t("freeTextQuestionRus.viewDialog.metadata")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Calendar size={12} />{" "}
                    {t("freeTextQuestionRus.form.createdAt")}
                  </Typography>
                  <Typography variant="body2">
                    {freeTextQuestionRu.createdAt
                      ? format(
                          parseISO(freeTextQuestionRu.createdAt),
                          "yyyy-MM-dd HH:mm",
                        )
                      : "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Calendar size={12} />{" "}
                    {t("freeTextQuestionRus.form.updatedAt")}
                  </Typography>
                  <Typography variant="body2">
                    {freeTextQuestionRu.updatedAt
                      ? format(
                          parseISO(freeTextQuestionRu.updatedAt),
                          "yyyy-MM-dd HH:mm",
                        )
                      : "-"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
                  >
                    {t("freeTextQuestionRus.form.status")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {freeTextQuestionRu.isActive ? (
                      <Chip
                        icon={<CheckCircle2 size={14} />}
                        label={t("freeTextQuestionRus.status.active")}
                        size="small"
                        color="success"
                        sx={{ fontWeight: 500 }}
                      />
                    ) : (
                      <Chip
                        icon={<XCircle size={14} />}
                        label={t("freeTextQuestionRus.status.inactive")}
                        size="small"
                        color="default"
                        sx={{ fontWeight: 500 }}
                      />
                    )}
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", mb: 0.5, display: "block" }}
                  >
                    ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      color: "text.secondary",
                    }}
                  >
                    {freeTextQuestionRu.id}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          {t("common.close")}
        </Button>
        {onEdit && (
          <Button
            onClick={() => onEdit(freeTextQuestionRu)}
            variant="contained"
          >
            {t("common.edit")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FreeTextQuestionRuViewDialog;
