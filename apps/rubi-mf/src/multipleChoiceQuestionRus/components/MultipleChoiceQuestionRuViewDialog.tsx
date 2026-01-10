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
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { format, parseISO } from 'date-fns';
import {
  Edit as EditIcon,
  BookOpen,
  BarChart3,
  Calendar,
  Tag as TagIcon,
} from "lucide-react";
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
      <Box
        key={option.key}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          border: '2px solid',
          borderColor: correctAnswers.includes(option.key) ? 'primary.main' : 'grey.300',
          backgroundColor: correctAnswers.includes(option.key) ? 'primary.50' : 'background.paper',
          display: "flex",
          alignItems: "center",
          gap: 2,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: 2,
          },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: correctAnswers.includes(option.key) ? 'primary.main' : 'grey.400',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          {option.key}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body1"
            sx={{ fontSize: '1rem', lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: cleanHtml(option.value) }}
          />
        </Box>
        {correctAnswers.includes(option.key) && (
          <CheckCircleIcon sx={{ color: "primary.main", fontSize: "1.75rem", flexShrink: 0 }} />
        )}
      </Box>
    ));
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
        <BookOpen size={20} />
        <Typography variant="h6">
          {t("multipleChoiceQuestionRus.viewDialog.title")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Main Content - Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Left Column - Question and Options */}
            <Box sx={{ flex: '1 1 600px', minWidth: '450px' }}>
              {/* Question Card */}
              <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'primary.main' }}>
                      Question
                    </Typography>
                  </Box>

                  {/* Question Text */}
                  <Box sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
                    <Typography variant="h6" sx={{ lineHeight: 1.8, textAlign: 'center', fontSize: '1.15rem' }}>
                      <div dangerouslySetInnerHTML={{ __html: multipleChoiceQuestionRu.question }} />
                    </Typography>
                  </Box>

                  {/* Key Information Grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2, mb: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Difficulty
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getDifficultyLevelLabel(multipleChoiceQuestionRu.difficultyLevel || '')}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Language
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getLanguageLabel(multipleChoiceQuestionRu.lang)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Order
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {multipleChoiceQuestionRu.displayOrder}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Status
                      </Typography>
                      <Chip
                        label={multipleChoiceQuestionRu.isActive ? t('multipleChoiceQuestionRus.status.active') : t('multipleChoiceQuestionRus.status.inactive')}
                        color={multipleChoiceQuestionRu.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Box>

                  {/* Tags */}
                  {multipleChoiceQuestionRu.tags && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {multipleChoiceQuestionRu.tags.split(',').filter(Boolean).slice(0, 4).map((tag) => (
                        <Chip key={tag.trim()} icon={<TagIcon />} label={tag.trim()} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Options Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <CheckCircleIcon sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {t('multipleChoiceQuestionRus.viewDialog.options')}
                    </Typography>
                  </Box>
                  {renderOptions()}
                </CardContent>
              </Card>

              {/* Explanation Card */}
              {multipleChoiceQuestionRu.explanation && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ color: 'secondary.main' }}>
                      <BookOpen size={24} />
                    </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {t('multipleChoiceQuestionRus.viewDialog.explanation')}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                      <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1rem' }}>
                        <div dangerouslySetInnerHTML={{ __html: multipleChoiceQuestionRu.explanation }} />
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* Right Column - Statistics and Metadata */}
            <Box sx={{ flex: '1 1 300px', minWidth: '280px' }}>
              {/* Statistics Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ color: 'info.main' }}>
                      <BarChart3 />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t('multipleChoiceQuestionRus.viewDialog.statistics')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t('multipleChoiceQuestionRus.viewDialog.successCount')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
                        {multipleChoiceQuestionRu.successCount || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t('multipleChoiceQuestionRus.viewDialog.failCount')}
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'error.main', fontWeight: 600 }}>
                        {multipleChoiceQuestionRu.failCount || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Total Attempts
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {(multipleChoiceQuestionRu.successCount || 0) + (multipleChoiceQuestionRu.failCount || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>Additional Info</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Question ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', fontWeight: 500 }}>
                        {multipleChoiceQuestionRu.id}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Correct Answers</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {multipleChoiceQuestionRu.correctAnswers || '-'}
                      </Typography>
                    </Box>
                    {multipleChoiceQuestionRu.tags && multipleChoiceQuestionRu.tags.split(',').length > 4 && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>All Tags</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {multipleChoiceQuestionRu.tags}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Metadata Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ color: 'text.secondary' }}>
                      <Calendar />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {t('multipleChoiceQuestionRus.viewDialog.metadata')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('multipleChoiceQuestionRus.viewDialog.createdAt')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {multipleChoiceQuestionRu.createdAt ? format(parseISO(multipleChoiceQuestionRu.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('multipleChoiceQuestionRus.viewDialog.updatedAt')}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {multipleChoiceQuestionRu.updatedAt ? format(parseISO(multipleChoiceQuestionRu.updatedAt), 'MMM dd, yyyy HH:mm') : '-'}
                      </Typography>
                    </Box>
                    {multipleChoiceQuestionRu.createdBy && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {t('multipleChoiceQuestionRus.viewDialog.createdBy')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', fontWeight: 500 }}>
                          {multipleChoiceQuestionRu.createdBy}
                        </Typography>
                      </Box>
                    )}
                    {multipleChoiceQuestionRu.updatedBy && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {t('multipleChoiceQuestionRus.viewDialog.updatedBy')}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', wordBreak: 'break-all', fontWeight: 500 }}>
                          {multipleChoiceQuestionRu.updatedBy}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
          {t("multipleChoiceQuestionRus.common.close")}
        </Button>
        <Button
          onClick={() => onEdit(multipleChoiceQuestionRu)}
          startIcon={<EditIcon />}
          variant="contained"
          sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}
        >
          {t("multipleChoiceQuestionRus.viewDialog.edit")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MultipleChoiceQuestionRuViewDialog;
