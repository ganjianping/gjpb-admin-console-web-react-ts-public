import React from 'react';
import '../i18n/translations';
import type { McqRu } from '../types/mcqRu.types';
import { Box, Collapse } from '@mui/material';
import McqRuPageHeader from '../components/McqRuPageHeader';
import McqRuSearchPanel from '../components/McqRuSearchPanel';
import McqRuTable from '../components/McqRuTable';
import DeleteMcqRuDialog from '../components/DeleteMcqRuDialog';
import McqRuCreateDialog from '../components/McqRuCreateDialog';
import McqRuEditDialog from '../components/McqRuEditDialog';
import McqRuViewDialog from '../components/McqRuViewDialog';
import McqRuTableSkeleton from '../components/McqRuTableSkeleton';
import { getEmptyMcqRuFormData } from '../utils/getEmptyMcqRuFormData';
import { useMcqRus } from '../hooks/useMcqRus';
import { useMcqRuDialog } from '../hooks/useMcqRuDialog';
import { useMcqRuSearch } from '../hooks/useMcqRuSearch';
import { mcqRuService } from '../services/mcqRuService';
import type { McqRuFormData, McqRuSearchFormData } from '../types/mcqRu.types';

const McqRusPage: React.FC = () => {
  const {
    allMcqRus,
    filteredMcqRus,
    setFilteredMcqRus,
    pagination,
    loading,
    loadMcqRus,
    handlePageChange,
    handlePageSizeChange
  } = useMcqRus();
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData } =
    useMcqRuSearch(allMcqRus);
  const dialog = useMcqRuDialog();

  const [deleteTarget, setDeleteTarget] = React.useState<McqRu | null>(null);

  const mcqRuToFormData = (mcqRu: McqRu): McqRuFormData => ({
    question: mcqRu.question || '',
    optionA: mcqRu.optionA || '',
    optionB: mcqRu.optionB || '',
    optionC: mcqRu.optionC || '',
    optionD: mcqRu.optionD || '',
    correctAnswers: mcqRu.correctAnswers || '',
    isMultipleCorrect: mcqRu.isMultipleCorrect || false,
    explanation: mcqRu.explanation || '',
    difficultyLevel: mcqRu.difficultyLevel || '',
    tags: mcqRu.tags || '',
    lang: mcqRu.lang || 'EN',
    displayOrder: mcqRu.displayOrder || 999,
    isActive: mcqRu.isActive ?? true,
  });

  const handleSearchFieldChange = (field: keyof McqRuSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredMcqRus(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleApiSearch = async () => {
    // For now, use client-side filtering
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredMcqRus(filtered);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyMcqRuFormData());
    dialog.setSelectedMcqRu(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredMcqRus(allMcqRus);
  };

  return (
    <Box sx={{ p: 3 }}>
      <McqRuPageHeader
        onCreateMcqRu={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      
      <Collapse in={searchPanelOpen}>
        <McqRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredMcqRus.length ? (
        <McqRuTableSkeleton />
      ) : (
        <McqRuTable
          mcqRus={filteredMcqRus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onMcqRuAction={(mcqRu: McqRu, action: 'view' | 'edit' | 'delete') => {
            if (action === 'view') {
              dialog.setSelectedMcqRu(mcqRu);
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedMcqRu(mcqRu);
              dialog.setFormData(mcqRuToFormData(mcqRu));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(mcqRu);
              return;
            }
          }}
        />
      )}

      <DeleteMcqRuDialog
        open={!!deleteTarget}
        mcqRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await mcqRuService.deleteMcqRu(deleteTarget.id);
            await loadMcqRus();
            setDeleteTarget(null);
          } catch (err) {
            console.error('Failed to delete MCQ:', err);
            setDeleteTarget(null);
          }
        }}
      />

      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <McqRuCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          setFormData={dialog.setFormData}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async () => {
            dialog.setLoading(true);
            try {
              await mcqRuService.createMcqRu(dialog.formData);
              await loadMcqRus();
              dialog.setDialogOpen(false);
            } catch (error) {
              console.error('Failed to create MCQ:', error);
            } finally {
              dialog.setLoading(false);
            }
          }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'edit' && dialog.dialogOpen && (
        <McqRuEditDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          setFormData={dialog.setFormData}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async () => {
            dialog.setLoading(true);
            try {
              if (dialog.selectedMcqRu) {
                await mcqRuService.updateMcqRu(dialog.selectedMcqRu.id, dialog.formData);
                await loadMcqRus();
                dialog.setDialogOpen(false);
              }
            } catch (error) {
              console.error('Failed to update MCQ:', error);
            } finally {
              dialog.setLoading(false);
            }
          }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'view' && dialog.dialogOpen && (
        <McqRuViewDialog
          open={dialog.dialogOpen}
          onClose={() => dialog.setDialogOpen(false)}
          mcqRu={dialog.selectedMcqRu}
        />
      )}
    </Box>
  );
};

export default McqRusPage;