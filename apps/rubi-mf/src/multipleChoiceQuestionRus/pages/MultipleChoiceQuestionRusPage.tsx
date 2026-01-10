import React from 'react';
import '../i18n/translations';
import type { MultipleChoiceQuestionRu, MultipleChoiceQuestionRuFormData } from '../types/multipleChoiceQuestionRu.types';
import { Box, Collapse } from '@mui/material';
import MultipleChoiceQuestionRuPageHeader from '../components/MultipleChoiceQuestionRuPageHeader';
import MultipleChoiceQuestionRuSearchPanel from '../components/MultipleChoiceQuestionRuSearchPanel';
import MultipleChoiceQuestionRuTable from '../components/MultipleChoiceQuestionRuTable';
import DeleteMultipleChoiceQuestionRuDialog from '../components/DeleteMultipleChoiceQuestionRuDialog';
import MultipleChoiceQuestionRuCreateDialog from '../components/MultipleChoiceQuestionRuCreateDialog';
import MultipleChoiceQuestionRuEditDialog from '../components/MultipleChoiceQuestionRuEditDialog';
import MultipleChoiceQuestionRuViewDialog from '../components/MultipleChoiceQuestionRuViewDialog';
import MultipleChoiceQuestionRuTableSkeleton from '../components/MultipleChoiceQuestionRuTableSkeleton';
import { getEmptyMultipleChoiceQuestionRuFormData } from '../utils/getEmptyMultipleChoiceQuestionRuFormData';
import { useMultipleChoiceQuestionRus } from '../hooks/useMultipleChoiceQuestionRus';
import { useMultipleChoiceQuestionRuDialog } from '../hooks/useMultipleChoiceQuestionRuDialog';
import { useMultipleChoiceQuestionRuSearch } from '../hooks/useMultipleChoiceQuestionRuSearch';
import { multipleChoiceQuestionRuService } from '../services/multipleChoiceQuestionRuService';

const MultipleChoiceQuestionRusPage: React.FC = () => {
  const {
    allMultipleChoiceQuestionRus,
    filteredMultipleChoiceQuestionRus,
    setFilteredMultipleChoiceQuestionRus,
    pagination,
    loading,
    loadMultipleChoiceQuestionRus,
    handlePageChange,
    handlePageSizeChange
  } = useMultipleChoiceQuestionRus();
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData } =
    useMultipleChoiceQuestionRuSearch(allMultipleChoiceQuestionRus);
  const dialog = useMultipleChoiceQuestionRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<MultipleChoiceQuestionRu | null>(null);

  const multipleChoiceQuestionRuToFormData = (multipleChoiceQuestionRu: MultipleChoiceQuestionRu): MultipleChoiceQuestionRuFormData => ({
    question: multipleChoiceQuestionRu.question || '',
    optionA: multipleChoiceQuestionRu.optionA || '',
    optionB: multipleChoiceQuestionRu.optionB || '',
    optionC: multipleChoiceQuestionRu.optionC || '',
    optionD: multipleChoiceQuestionRu.optionD || '',
    correctAnswers: multipleChoiceQuestionRu.correctAnswers || '',
    explanation: multipleChoiceQuestionRu.explanation || '',
    difficultyLevel: multipleChoiceQuestionRu.difficultyLevel || '',
    tags: multipleChoiceQuestionRu.tags || '',
    lang: multipleChoiceQuestionRu.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: multipleChoiceQuestionRu.displayOrder ?? 999,
    isActive: Boolean(multipleChoiceQuestionRu.isActive),
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredMultipleChoiceQuestionRus(filtered);
  };

  const handleCreateMultipleChoiceQuestionRu = () => {
    dialog.setFormData(getEmptyMultipleChoiceQuestionRuFormData());
    dialog.setActionType('create');
    dialog.setSelectedMultipleChoiceQuestionRu(null);
    dialog.setDialogOpen(true);
  };

  const handleMultipleChoiceQuestionRuAction = (multipleChoiceQuestionRu: MultipleChoiceQuestionRu, action: 'view' | 'edit' | 'delete') => {
    dialog.setSelectedMultipleChoiceQuestionRu(multipleChoiceQuestionRu);
    if (action === 'delete') {
      setDeleteTarget(multipleChoiceQuestionRu);
    } else {
      dialog.setFormData(multipleChoiceQuestionRuToFormData(multipleChoiceQuestionRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async (formData: MultipleChoiceQuestionRuFormData) => {
    await multipleChoiceQuestionRuService.createMultipleChoiceQuestionRu({
      question: formData.question,
      optionA: formData.optionA,
      optionB: formData.optionB,
      optionC: formData.optionC,
      optionD: formData.optionD,
      correctAnswers: formData.correctAnswers,
      explanation: formData.explanation,
      difficultyLevel: formData.difficultyLevel,
      tags: formData.tags,
      lang: formData.lang,
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
    });
    await loadMultipleChoiceQuestionRus();
    dialog.setDialogOpen(false);
  };

  const handleEditConfirm = async (formData: MultipleChoiceQuestionRuFormData) => {
    if (!dialog.selectedMultipleChoiceQuestionRu) return;
    await multipleChoiceQuestionRuService.updateMultipleChoiceQuestionRu(dialog.selectedMultipleChoiceQuestionRu.id, {
      question: formData.question,
      optionA: formData.optionA,
      optionB: formData.optionB,
      optionC: formData.optionC,
      optionD: formData.optionD,
      correctAnswers: formData.correctAnswers,
      explanation: formData.explanation,
      difficultyLevel: formData.difficultyLevel,
      tags: formData.tags,
      lang: formData.lang,
      displayOrder: formData.displayOrder,
      isActive: formData.isActive,
    });
    await loadMultipleChoiceQuestionRus();
    dialog.setDialogOpen(false);
  };

  const handleDeleteConfirm = async (multipleChoiceQuestionRu: MultipleChoiceQuestionRu) => {
    try {
      await multipleChoiceQuestionRuService.deleteMultipleChoiceQuestionRu(multipleChoiceQuestionRu.id);
      await loadMultipleChoiceQuestionRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete multipleChoiceQuestionRu', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <MultipleChoiceQuestionRuPageHeader
        onCreateMultipleChoiceQuestionRu={handleCreateMultipleChoiceQuestionRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <MultipleChoiceQuestionRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <MultipleChoiceQuestionRuTableSkeleton />
      ) : (
        <MultipleChoiceQuestionRuTable
          multipleChoiceQuestionRus={filteredMultipleChoiceQuestionRus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onMultipleChoiceQuestionRuAction={handleMultipleChoiceQuestionRuAction}
        />
      )}

      <MultipleChoiceQuestionRuCreateDialog
        open={dialog.dialogOpen && dialog.actionType === 'create'}
        onClose={() => dialog.setDialogOpen(false)}
        onConfirm={handleCreateConfirm}
      />

      <MultipleChoiceQuestionRuEditDialog
        open={dialog.dialogOpen && dialog.actionType === 'edit'}
        multipleChoiceQuestionRu={dialog.selectedMultipleChoiceQuestionRu}
        onClose={() => dialog.setDialogOpen(false)}
        onConfirm={handleEditConfirm}
      />

      <MultipleChoiceQuestionRuViewDialog
        open={dialog.dialogOpen && dialog.actionType === 'view'}
        multipleChoiceQuestionRu={dialog.selectedMultipleChoiceQuestionRu || { id: '', question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswers: '', explanation: '', difficultyLevel: '', failCount: 0, successCount: 0, tags: '', lang: 'EN', displayOrder: 999, isActive: true, createdAt: '', updatedAt: '' }}
        onClose={() => dialog.setDialogOpen(false)}
        onEdit={(multipleChoiceQuestionRu) => {
          dialog.setSelectedMultipleChoiceQuestionRu(multipleChoiceQuestionRu);
          dialog.setFormData(multipleChoiceQuestionRuToFormData(multipleChoiceQuestionRu));
          dialog.setActionType('edit');
        }}
      />

      <DeleteMultipleChoiceQuestionRuDialog
        open={!!deleteTarget}
        multipleChoiceQuestionRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default MultipleChoiceQuestionRusPage;