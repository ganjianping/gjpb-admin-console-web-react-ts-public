import React from 'react';
import '../i18n/translations';
import type { McqRu } from '../types/mcqRu.types';
import { Box, Collapse } from '@mui/material';
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
import type { McqRuFormData } from '../types/mcqRu.types';

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
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleClearSearch, applyClientSideFiltersWithData } =
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

  const handleMcqRuAction = (mcqRu: McqRu, action: 'view' | 'edit' | 'create') => {
    dialog.setSelectedMcqRu(mcqRu);
    dialog.setActionType(action);
    if (action === 'edit') {
      dialog.setFormData(mcqRuToFormData(mcqRu));
    } else if (action === 'create') {
      dialog.setFormData(getEmptyMcqRuFormData());
    }
    dialog.setDialogOpen(true);
  };

  const handleCreate = () => {
    dialog.setSelectedMcqRu(null);
    dialog.setActionType('create');
    dialog.setFormData(getEmptyMcqRuFormData());
    dialog.setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await mcqRuService.deleteMcqRu(deleteTarget.id);
      await loadMcqRus();
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete MCQ:', error);
    }
  };

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredMcqRus(filtered);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredMcqRus(allMcqRus);
  };

  React.useEffect(() => {
    handleSearch();
  }, [searchFormData, allMcqRus]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <h1>MCQ Rus Management</h1>
      </Box>

      <Collapse in={searchPanelOpen}>
        <Box sx={{ mb: 2 }}>
          {/* Search Panel Component would go here */}
        </Box>
      </Collapse>

      <Box sx={{ mb: 2 }}>
        <button onClick={handleCreate}>Create MCQ</button>
        <button onClick={handleSearchPanelToggle}>
          {searchPanelOpen ? 'Hide Search' : 'Show Search'}
        </button>
        <button onClick={handleClearFilters}>Clear Filters</button>
      </Box>

      {loading ? (
        <McqRuTableSkeleton />
      ) : (
        <McqRuTable
          mcqRus={filteredMcqRus}
          onMcqRuAction={handleMcqRuAction}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <McqRuViewDialog
        open={dialog.dialogOpen && dialog.actionType === 'view'}
        onClose={() => dialog.setDialogOpen(false)}
        mcqRu={dialog.selectedMcqRu}
      />

      <McqRuCreateDialog
        open={dialog.dialogOpen && dialog.actionType === 'create'}
        onClose={() => dialog.setDialogOpen(false)}
        formData={dialog.formData}
        setFormData={dialog.setFormData}
        loading={dialog.loading}
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
      />

      <McqRuEditDialog
        open={dialog.dialogOpen && dialog.actionType === 'edit'}
        onClose={() => dialog.setDialogOpen(false)}
        formData={dialog.formData}
        setFormData={dialog.setFormData}
        loading={dialog.loading}
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
      />

      <DeleteMcqRuDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        mcqRu={deleteTarget}
      />
    </Box>
  );
};

export default McqRusPage;