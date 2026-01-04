import React from 'react';
import '../i18n/translations';
import type { Vocabulary, VocabularySearchFormData } from '../types/vocabulary.types';
import type { VocabularyQueryParams } from '../services/vocabularyService';
import { Box, Collapse } from '@mui/material';
import VocabularyPageHeader from '../components/VocabularyPageHeader';
import VocabularySearchPanel from '../components/VocabularySearchPanel';
import VocabularyTable from '../components/VocabularyTable';
import DeleteVocabularyDialog from '../components/DeleteVocabularyDialog';
import VocabularyCreateDialog from '../components/VocabularyCreateDialog';
import VocabularyEditDialog from '../components/VocabularyEditDialog';
import VocabularyViewDialog from '../components/VocabularyViewDialog';
import VocabularyTableSkeleton from '../components/VocabularyTableSkeleton';
import { getEmptyVocabularyFormData } from '../utils/getEmptyVocabularyFormData';
import { useVocabularies } from '../hooks/useVocabularies';
import { useVocabularyDialog } from '../hooks/useVocabularyDialog';
import { useVocabularySearch } from '../hooks/useVocabularySearch';
import { vocabularyService } from '../services/vocabularyService';
import type { VocabularyFormData } from '../types/vocabulary.types';

const VocabulariesPage: React.FC = () => {
  const { 
    allVocabularies, 
    filteredVocabularies, 
    setFilteredVocabularies, 
    pagination,
    loading, 
    pageSize,
    loadVocabularies,
    handlePageChange,
    handlePageSizeChange
  } = useVocabularies();
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData } =
    useVocabularySearch(allVocabularies);
  const dialog = useVocabularyDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Vocabulary | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const vocabularyToFormData = (vocabulary: Vocabulary) => ({
    word: vocabulary.word || '',
    wordImageFilename: vocabulary.wordImageFilename || '',
    wordImageOriginalUrl: vocabulary.wordImageOriginalUrl || '',
    simplePastTense: vocabulary.simplePastTense || '',
    pastPerfectTense: vocabulary.pastPerfectTense || '',
    translation: vocabulary.translation || '',
    synonyms: vocabulary.synonyms || '',
    pluralForm: vocabulary.pluralForm || '',
    phonetic: vocabulary.phonetic || '',
    phoneticAudioFilename: vocabulary.phoneticAudioFilename || '',
    phoneticAudioOriginalUrl: vocabulary.phoneticAudioOriginalUrl || '',
    partOfSpeech: vocabulary.partOfSpeech || '',
    definition: vocabulary.definition || '',
    example: vocabulary.example || '',
    tags: vocabulary.tags || '',
    lang: vocabulary.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: vocabulary.displayOrder ?? 0,
    isActive: Boolean(vocabulary.isActive),
    wordImageFile: null,
    phoneticAudioFile: null,
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredVocabularies(filtered);
  };

  const handleCreateVocabulary = () => {
    dialog.setFormData(getEmptyVocabularyFormData());
    dialog.setActionType('create');
    dialog.setSelectedVocabulary(null);
    dialog.setDialogOpen(true);
  };

  const handleVocabularyAction = (vocabulary: Vocabulary, action: 'view' | 'edit' | 'delete') => {
    dialog.setSelectedVocabulary(vocabulary);
    if (action === 'delete') {
      setDeleteTarget(vocabulary);
    } else {
      dialog.setFormData(vocabularyToFormData(vocabulary));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async (formData: VocabularyFormData) => {
    dialog.setLoading(true);
    try {
      await vocabularyService.createVocabulary({
        word: formData.word,
        definition: formData.definition,
        translation: formData.translation,
        example: formData.example,
        synonyms: formData.synonyms,
        pluralForm: formData.pluralForm,
        phonetic: formData.phonetic,
        phoneticAudioFilename: formData.phoneticAudioFilename,
        phoneticAudioOriginalUrl: formData.phoneticAudioOriginalUrl,
        wordImageFilename: formData.wordImageFilename,
        wordImageOriginalUrl: formData.wordImageOriginalUrl,
        partOfSpeech: formData.partOfSpeech,
        simplePastTense: formData.simplePastTense,
        pastPerfectTense: formData.pastPerfectTense,
        tags: formData.tags,
        lang: formData.lang,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      });
      await loadVocabularies();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error('Failed to create vocabulary', err);
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async (formData: VocabularyFormData) => {
    if (!dialog.selectedVocabulary) return;
    dialog.setLoading(true);
    try {
      await vocabularyService.updateVocabulary(dialog.selectedVocabulary.id, {
        word: formData.word,
        definition: formData.definition,
        translation: formData.translation,
        example: formData.example,
        synonyms: formData.synonyms,
        pluralForm: formData.pluralForm,
        phonetic: formData.phonetic,
        phoneticAudioFilename: formData.phoneticAudioFilename,
        phoneticAudioOriginalUrl: formData.phoneticAudioOriginalUrl,
        wordImageFilename: formData.wordImageFilename,
        wordImageOriginalUrl: formData.wordImageOriginalUrl,
        partOfSpeech: formData.partOfSpeech,
        simplePastTense: formData.simplePastTense,
        pastPerfectTense: formData.pastPerfectTense,
        tags: formData.tags,
        lang: formData.lang,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      });
      await loadVocabularies();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error('Failed to update vocabulary', err);
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDeleteConfirm = async (vocabulary: Vocabulary) => {
    setDeleting(true);
    try {
      await vocabularyService.deleteVocabulary(vocabulary.id);
      await loadVocabularies();
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete vocabulary', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <VocabularyPageHeader
        onCreateVocabulary={handleCreateVocabulary}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <VocabularySearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <VocabularyTableSkeleton />
      ) : (
        <VocabularyTable
          vocabularies={filteredVocabularies}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onVocabularyAction={handleVocabularyAction}
        />
      )}

      <VocabularyCreateDialog
        open={dialog.dialogOpen && dialog.actionType === 'create'}
        onClose={() => dialog.setDialogOpen(false)}
        onConfirm={handleCreateConfirm}
      />

      <VocabularyEditDialog
        open={dialog.dialogOpen && dialog.actionType === 'edit'}
        vocabulary={dialog.selectedVocabulary}
        onClose={() => dialog.setDialogOpen(false)}
        onConfirm={handleEditConfirm}
      />

      <VocabularyViewDialog
        open={dialog.dialogOpen && dialog.actionType === 'view'}
        vocabulary={dialog.selectedVocabulary || { id: '', word: '' }}
        onClose={() => dialog.setDialogOpen(false)}
        onEdit={(vocabulary) => {
          dialog.setSelectedVocabulary(vocabulary);
          dialog.setFormData(vocabularyToFormData(vocabulary));
          dialog.setActionType('edit');
        }}
      />

      <DeleteVocabularyDialog
        open={!!deleteTarget}
        vocabulary={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default VocabulariesPage;
