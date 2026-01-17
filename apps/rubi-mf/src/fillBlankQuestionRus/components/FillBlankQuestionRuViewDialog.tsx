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
import { Eye, Tag, CheckCircle2, XCircle, FileText, Calendar } from "lucide-react";
import type { FillBlankQuestionRu } from "../types/fillBlankQuestionRu.types";
import "../i18n/translations";
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS, TERM_OPTIONS, WEEK_OPTIONS } from "../constants";

interface FillBlankQuestionRuViewDialogProps {
  open: boolean;
  fillBlankQuestionRu: FillBlankQuestionRu;
  onClose: () => void;
  onEdit?: (fillBlankQuestionRu: FillBlankQuestionRu) => void;
}

const FillBlankQuestionRuViewDialog = ({
  open,
  fillBlankQuestionRu,
  onClose,
  onEdit,
}: FillBlankQuestionRuViewDialogProps) => {
  const { t } = useTranslation();

  const languageLabel = (code?: string | null) => {
    if (!code) return "-";
    const found = LANGUAGE_OPTIONS.find((o) => o.value === code.toUpperCase());
    return found ? `${found.label} (${code})` : code;
  };

  const difficultyLevelLabel = (level?: string | null) => {
    if (!level) return "-";
    const found = DIFFICULTY_LEVEL_OPTIONS.find((l) => l.value === level);
    return found ? t(`fillBlankQuestionRus.difficultyLevels.${found.value}`) : level;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6" component="span">
          {t("fillBlankQuestionRus.view")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Main Content - Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Left Column - Primary Information */}
            <Box sx={{ flex: '1 1 600px', minWidth: '850px' }}>
              {/* Header Card - Question and Answer */}
              <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="h6" sx={{ lineHeight: 1.8, fontSize: '1.15rem' }}>
                        <div dangerouslySetInnerHTML={{ __html: fillBlankQuestionRu.question }} />
                      </Typography>
                    </Box>
                  </Box>

                  {/* Answer */}
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 2, border: '2px solid', borderColor: 'primary.main' }}>
                      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1rem', lineHeight: 1.8 }}>
                        {fillBlankQuestionRu.answer ? (
                          <div dangerouslySetInnerHTML={{ __html: fillBlankQuestionRu.answer }} />
                        ) : (
                          <em>No correct answer provided</em>
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Tags */}
                  {fillBlankQuestionRu.tags && (
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                        {fillBlankQuestionRu.tags.split(',').filter(Boolean).map((tag) => (
                          <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500, borderRadius: 2 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Explanation Card */}
              {fillBlankQuestionRu.explanation && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <FileText size={24} color="#ed6c02" />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Explanation
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1rem' }}>
                        <div dangerouslySetInnerHTML={{ __html: fillBlankQuestionRu.explanation }} />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Right Column - Additional Info and Metadata */}
            <Box sx={{ flex: '1 1 300px', minWidth: '280px' }}>
              {/* Key Information Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Key Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Language
                      </Typography>
                      <Chip
                        label={languageLabel(fillBlankQuestionRu.lang)}
                        size="small"
                        sx={{ fontWeight: 600, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Difficulty Level
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {difficultyLevelLabel(fillBlankQuestionRu.difficultyLevel)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        {t("fillBlankQuestionRus.form.term")}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {fillBlankQuestionRu.term ? TERM_OPTIONS.find(t => t.value === fillBlankQuestionRu.term)?.label : '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        {t("fillBlankQuestionRus.form.week")}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {fillBlankQuestionRu.week ? WEEK_OPTIONS.find(w => w.value === fillBlankQuestionRu.week)?.label : '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Display Order
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {fillBlankQuestionRu.displayOrder ?? '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Status
                      </Typography>
                      <Chip
                        icon={fillBlankQuestionRu.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        label={fillBlankQuestionRu.isActive ? t('fillBlankQuestionRus.status.active') : t('fillBlankQuestionRus.status.inactive')}
                        color={fillBlankQuestionRu.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Metadata Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Metadata</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Calendar size={12} /> Created
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fillBlankQuestionRu.createdAt ? format(parseISO(fillBlankQuestionRu.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                      </Typography>
                      {fillBlankQuestionRu.createdBy && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                          by {fillBlankQuestionRu.createdBy}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <Calendar size={12} /> Updated
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fillBlankQuestionRu.updatedAt ? format(parseISO(fillBlankQuestionRu.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}
                      </Typography>
                      {fillBlankQuestionRu.updatedBy && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                          by {fillBlankQuestionRu.updatedBy}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* ID Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>System ID</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      wordBreak: 'break-all'
                    }}
                  >
                    {fillBlankQuestionRu.id}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(fillBlankQuestionRu)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
            {t('common.edit')}
          </Button>
        )}
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
          {t('common.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FillBlankQuestionRuViewDialog;
