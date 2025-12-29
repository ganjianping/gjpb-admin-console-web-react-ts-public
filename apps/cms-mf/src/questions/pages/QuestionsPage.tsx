import React from 'react';
import '../i18n/translations';
import type { Question, QuestionSearchFormData } from '../types/question.types';
import type { QuestionQueryParams } from '../services/questionService';
import { Box, Collapse } from '@mui/material';
import QuestionPageHeader from '../components/QuestionPageHeader';
import QuestionSearchPanel from '../components/QuestionSearchPanel';
import QuestionTable from '../components/QuestionTable';
import DeleteQuestionDialog from '../components/DeleteQuestionDialog';
import QuestionCreateDialog from '../components/QuestionCreateDialog';
import QuestionEditDialog from '../components/QuestionEditDialog';
import QuestionViewDialog from '../components/QuestionViewDialog';
import QuestionTableSkeleton from '../components/QuestionTableSkeleton';
import { getEmptyQuestionFormData } from '../utils/getEmptyQuestionFormData';
import { useQuestions } from '../hooks/useQuestions';
import { useQuestionDialog } from '../hooks/useQuestionDialog';
import { useQuestionSearch } from '../hooks/useQuestionSearch';
import { questionService } from '../services/questionService';

const QuestionsPage: React.FC = () => {
  const { 
    allQuestions, 
    filteredQuestions, 
    setFilteredQuestions, 
    pagination,
    loading, 
    pageSize,
    loadQuestions,
    handlePageChange,
    handlePageSizeChange
  } = useQuestions();
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData } =
    useQuestionSearch(allQuestions);
  const dialog = useQuestionDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Question | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const questionToFormData = (question: Question) => ({
    question: question.question || '',
    answer: question.answer || '',
    tags: question.tags || '',
    lang: question.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: question.displayOrder ?? 0,
    isActive: Boolean(question.isActive),
  });

  const handleSearchFieldChange = (field: keyof QuestionSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredQuestions(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredQuestions(allQuestions);
  };

  const buildSearchParams = () => {
    const params: QuestionQueryParams = {};
    if (searchFormData.question?.trim()) {
      params.question = searchFormData.question.trim();
    }
    if (searchFormData.lang?.trim()) {
      params.lang = searchFormData.lang.trim();
    }
    if (searchFormData.tags?.trim()) {
      params.tags = searchFormData.tags.trim();
    }
    if (searchFormData.isActive === 'true') {
      params.isActive = true;
    } else if (searchFormData.isActive === 'false') {
      params.isActive = false;
    }
    return params;
  };

  const handleApiSearch = async () => {
    const params = buildSearchParams();
    await loadQuestions(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadQuestions(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadQuestions(params, 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyQuestionFormData());
    dialog.setSelectedQuestion(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <QuestionPageHeader
        onCreateQuestion={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <QuestionSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredQuestions.length ? (
        <QuestionTableSkeleton />
      ) : (
        <QuestionTable
          questions={filteredQuestions}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onQuestionAction={(question: Question, action: 'view' | 'edit' | 'delete') => {
            if (action === 'view') {
              dialog.setSelectedQuestion(question);
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedQuestion(question);
              dialog.setFormData(questionToFormData(question));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(question);
              return;
            }
          }}
        />
      )}

      <DeleteQuestionDialog
        open={!!deleteTarget}
        question={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await questionService.deleteQuestion(deleteTarget.id);
            await loadQuestions();
            setDeleting(false);
            setDeleteTarget(null);
          } catch (err) {
            setDeleting(false);
            console.error('Failed to delete question', err);
            setDeleteTarget(null);
          }
        }}
      />

      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <QuestionCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyQuestionFormData())}
          onCreated={async () => {
            await loadQuestions();
          }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedQuestion && (
        <QuestionViewDialog
          open={dialog.dialogOpen}
          question={dialog.selectedQuestion}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      {dialog.actionType === 'edit' && dialog.selectedQuestion && (
        <QuestionEditDialog
          open={dialog.dialogOpen}
          questionId={dialog.selectedQuestion.id}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async () => {
            if (!dialog.selectedQuestion) return;
            try {
              dialog.setLoading(true);
              await questionService.updateQuestion(dialog.selectedQuestion.id, dialog.formData);
              await loadQuestions();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              console.error('Failed to update question', err);
              throw err;
            }
          }}
          loading={dialog.loading}
        />
      )}
    </Box>
  );
};

export default QuestionsPage;
