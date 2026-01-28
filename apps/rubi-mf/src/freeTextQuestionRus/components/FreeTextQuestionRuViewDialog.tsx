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
import { Eye, Tag, CheckCircle2, XCircle, FileText, Calendar, Hash, MessageSquare, HelpCircle } from "lucide-react";
import type { FreeTextQuestionRu } from "../types/freeTextQuestionRu.types";
import "../i18n/translations";
import { LANGUAGE_OPTIONS, DIFFICULTY_LEVEL_OPTIONS, TERM_OPTIONS, WEEK_OPTIONS } from "../constants";

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

  const difficultyLevelLabel = (level?: string | null) => {
    if (!level) return "-";
    const found = DIFFICULTY_LEVEL_OPTIONS.find((l) => l.value === level);
    return found ? t(`freeTextQuestionRus.difficultyLevels.${found.value}`) : level;
  };

  const hasValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== "";
  };

  const renderField = (label: string, value: any, icon?: React.ReactNode, isHtml: boolean = false) => {
    if (!hasValue(value)) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {icon}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
            {label}
          </Typography>
        </Box>
        <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
          {isHtml ? (
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              <div dangerouslySetInnerHTML={{ __html: value }} />
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {value}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const renderQuestionAnswerPair = (questionValue: any, answerValue: any, label: string) => {
    if (!hasValue(questionValue) && !hasValue(answerValue)) return null;

    return (
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <HelpCircle size={20} color="#1976d2" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
          </Box>

          {hasValue(questionValue) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Question
              </Typography>
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  <div dangerouslySetInnerHTML={{ __html: questionValue }} />
                </Typography>
              </Box>
            </Box>
          )}

          {hasValue(answerValue) && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Answer
              </Typography>
              <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  <div dangerouslySetInnerHTML={{ __html: answerValue }} />
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Eye size={20} />
        <Typography variant="h6" component="span">
          {t("freeTextQuestionRus.view")}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, mt: 2, maxHeight: '80vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Main Question and Answer */}
          <Card elevation={0} sx={{ background: (theme) => theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              {/* Main Question */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{ p: 4, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ lineHeight: 1.8, fontSize: '1.15rem' }}>
                    <div dangerouslySetInnerHTML={{ __html: freeTextQuestionRu.question }} />
                  </Typography>
                </Box>
              </Box>

              {/* Main Answer */}
              {hasValue(freeTextQuestionRu.answer) && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 2, border: '2px solid', borderColor: 'primary.main' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1rem', lineHeight: 1.8 }}>
                      <div dangerouslySetInnerHTML={{ __html: freeTextQuestionRu.answer! }} />
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Tags */}
              {hasValue(freeTextQuestionRu.tags) && (
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {freeTextQuestionRu.tags!.split(',').filter(Boolean).map((tag) => (
                      <Chip key={tag.trim()} icon={<Tag size={14} />} label={tag.trim()} size="small" variant="outlined" sx={{ fontWeight: 500, borderRadius: 2 }} />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* All Fields with Values */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {/* Left Column - Content Fields */}
            <Box sx={{ flex: '1 1 600px', minWidth: '500px' }}>
              {/* Description */}
              {renderField("Description", freeTextQuestionRu.description, <FileText size={18} color="#ed6c02" />, true)}

              {/* Explanation */}
              {renderField("Explanation", freeTextQuestionRu.explanation, <MessageSquare size={18} color="#2e7d32" />, true)}

              {/* Question/Answer Pairs */}
              {renderQuestionAnswerPair(freeTextQuestionRu.questiona, freeTextQuestionRu.answera, "Question A")}
              {renderQuestionAnswerPair(freeTextQuestionRu.questionb, freeTextQuestionRu.answerb, "Question B")}
              {renderQuestionAnswerPair(freeTextQuestionRu.questionc, freeTextQuestionRu.answerc, "Question C")}
              {renderQuestionAnswerPair(freeTextQuestionRu.questiond, freeTextQuestionRu.answerd, "Question D")}
              {renderQuestionAnswerPair(freeTextQuestionRu.questione, freeTextQuestionRu.answere, "Question E")}
              {renderQuestionAnswerPair(freeTextQuestionRu.questionf, freeTextQuestionRu.answerf, "Question F")}
            </Box>

            {/* Right Column - Metadata and Stats */}
            <Box sx={{ flex: '1 1 300px', minWidth: '280px' }}>
              {/* Key Information Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Hash size={20} />
                    Key Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Language
                      </Typography>
                      <Chip
                        label={languageLabel(freeTextQuestionRu.lang)}
                        size="small"
                        sx={{ fontWeight: 600, backgroundColor: 'primary.main', color: 'primary.contrastText' }}
                      />
                    </Box>

                    {hasValue(freeTextQuestionRu.difficultyLevel) && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Difficulty Level
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {difficultyLevelLabel(freeTextQuestionRu.difficultyLevel)}
                        </Typography>
                      </Box>
                    )}

                    {hasValue(freeTextQuestionRu.term) && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          {t("freeTextQuestionRus.form.term")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {TERM_OPTIONS.find(t => t.value === freeTextQuestionRu.term)?.label}
                        </Typography>
                      </Box>
                    )}

                    {hasValue(freeTextQuestionRu.week) && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          {t("freeTextQuestionRus.form.week")}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {WEEK_OPTIONS.find(w => w.value === freeTextQuestionRu.week)?.label}
                        </Typography>
                      </Box>
                    )}

                    {hasValue(freeTextQuestionRu.displayOrder) && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Display Order
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {freeTextQuestionRu.displayOrder}
                        </Typography>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Status
                      </Typography>
                      <Chip
                        icon={freeTextQuestionRu.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        label={freeTextQuestionRu.isActive ? t('freeTextQuestionRus.status.active') : t('freeTextQuestionRus.status.inactive')}
                        color={freeTextQuestionRu.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Statistics Card */}
              {(hasValue(freeTextQuestionRu.failCount) || hasValue(freeTextQuestionRu.successCount)) && (
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Statistics
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {hasValue(freeTextQuestionRu.successCount) && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                            Success Count
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            {freeTextQuestionRu.successCount}
                          </Typography>
                        </Box>
                      )}

                      {hasValue(freeTextQuestionRu.failCount) && (
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                            Fail Count
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>
                            {freeTextQuestionRu.failCount}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Metadata Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Calendar size={20} />
                    Metadata
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                        Created
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {freeTextQuestionRu.createdAt ? format(parseISO(freeTextQuestionRu.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
                      </Typography>
                      {freeTextQuestionRu.createdBy && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                          by {freeTextQuestionRu.createdBy}
                        </Typography>
                      )}
                    </Box>

                    {freeTextQuestionRu.updatedAt && (
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Updated
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {format(parseISO(freeTextQuestionRu.updatedAt), 'MMM dd, yyyy HH:mm')}
                        </Typography>
                        {freeTextQuestionRu.updatedBy && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                            by {freeTextQuestionRu.updatedBy}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* System ID Card */}
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    System ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: 'text.secondary',
                      wordBreak: 'break-all'
                    }}
                  >
                    {freeTextQuestionRu.id}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        {onEdit && (
          <Button onClick={() => onEdit(freeTextQuestionRu)} variant="contained" color="primary" sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
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

export default FreeTextQuestionRuViewDialog;
