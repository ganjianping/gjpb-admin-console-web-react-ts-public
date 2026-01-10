import React from "react";
import "../i18n/translations";
import type { VocabularyRu } from "../types/vocabularyRu.types";
import { Box, Collapse } from "@mui/material";
import VocabularyRuPageHeader from "../components/VocabularyRuPageHeader";
import VocabularyRuSearchPanel from "../components/VocabularyRuSearchPanel";
import VocabularyRuTable from "../components/VocabularyRuTable";
import DeleteVocabularyRuDialog from "../components/DeleteVocabularyRuDialog";
import VocabularyRuCreateDialog from "../components/VocabularyRuCreateDialog";
import VocabularyRuEditDialog from "../components/VocabularyRuEditDialog";
import VocabularyRuViewDialog from "../components/VocabularyRuViewDialog";
import VocabularyRuTableSkeleton from "../components/VocabularyRuTableSkeleton";
import { getEmptyVocabularyRuFormData } from "../utils/getEmptyVocabularyRuFormData";
import { useVocabularyRus } from "../hooks/useVocabularyRus";
import { useVocabularyRuDialog } from "../hooks/useVocabularyRuDialog";
import { useVocabularyRuSearch } from "../hooks/useVocabularyRuSearch";
import { vocabularyRuService } from "../services/vocabularyRuService";
import type { VocabularyRuFormData } from "../types/vocabularyRu.types";

const VocabularyRusPage: React.FC = () => {
  const {
    allVocabularyRus,
    filteredVocabularyRus,
    setFilteredVocabularyRus,
    pagination,
    loading,
    loadVocabularyRus,
    handlePageChange,
    handlePageSizeChange,
  } = useVocabularyRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useVocabularyRuSearch(allVocabularyRus);
  const dialog = useVocabularyRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<VocabularyRu | null>(
    null,
  );

  const vocabularyRuToFormData = (vocabularyRu: VocabularyRu) => ({
    word: vocabularyRu.word || "",
    wordImageFilename: vocabularyRu.wordImageFilename || "",
    wordImageOriginalUrl: vocabularyRu.wordImageOriginalUrl || "",
    simplePastTense: vocabularyRu.simplePastTense || "",
    pastPerfectTense: vocabularyRu.pastPerfectTense || "",
    translation: vocabularyRu.translation || "",
    synonyms: vocabularyRu.synonyms || "",
    pluralForm: vocabularyRu.pluralForm || "",
    phonetic: vocabularyRu.phonetic || "",
    phoneticAudioFilename: vocabularyRu.phoneticAudioFilename || "",
    phoneticAudioOriginalUrl: vocabularyRu.phoneticAudioOriginalUrl || "",
    partOfSpeech: vocabularyRu.partOfSpeech || "",
    definition: vocabularyRu.definition || "",
    example: vocabularyRu.example || "",
    tags: vocabularyRu.tags || "",
    lang:
      vocabularyRu.lang ||
      (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : "EN"),
    difficultyLevel: vocabularyRu.difficultyLevel || "easy",
    displayOrder: vocabularyRu.displayOrder ?? 0,
    isActive: Boolean(vocabularyRu.isActive),
    wordImageFile: null,
    phoneticAudioFile: null,
    dictionaryUrl: vocabularyRu.dictionaryUrl || "",
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredVocabularyRus(filtered);
  };

  const handleCreateVocabularyRu = () => {
    dialog.setFormData(getEmptyVocabularyRuFormData());
    dialog.setActionType("create");
    dialog.setSelectedVocabularyRu(null);
    dialog.setDialogOpen(true);
  };

  const handleVocabularyRuAction = (
    vocabularyRu: VocabularyRu,
    action: "view" | "edit" | "delete",
  ) => {
    dialog.setSelectedVocabularyRu(vocabularyRu);
    if (action === "delete") {
      setDeleteTarget(vocabularyRu);
    } else {
      dialog.setFormData(vocabularyRuToFormData(vocabularyRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async (formData: VocabularyRuFormData) => {
    dialog.setLoading(true);
    try {
      // Use form-data upload if files are present
      if (formData.wordImageFile || formData.phoneticAudioFile) {
        await vocabularyRuService.createVocabularyRuByUpload({
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
          dictionaryUrl: formData.dictionaryUrl,
          wordImageFile: formData.wordImageFile || undefined,
          phoneticAudioFile: formData.phoneticAudioFile || undefined,
        });
      } else {
        await vocabularyRuService.createVocabularyRu({
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
          dictionaryUrl: formData.dictionaryUrl,
        });
      }
      await loadVocabularyRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to create vocabularyRu", err);
      throw err; // Re-throw the error so the dialog can handle it
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async (formData: VocabularyRuFormData) => {
    if (!dialog.selectedVocabularyRu) return;
    dialog.setLoading(true);
    try {
      // Use form-data upload if files are present
      if (formData.wordImageFile || formData.phoneticAudioFile) {
        await vocabularyRuService.updateVocabularyRuWithFiles(
          dialog.selectedVocabularyRu.id,
          {
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
            dictionaryUrl: formData.dictionaryUrl,
            wordImageFile: formData.wordImageFile || undefined,
            phoneticAudioFile: formData.phoneticAudioFile || undefined,
          },
        );
      } else {
        await vocabularyRuService.updateVocabularyRu(
          dialog.selectedVocabularyRu.id,
          {
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
            dictionaryUrl: formData.dictionaryUrl,
          },
        );
      }
      await loadVocabularyRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update vocabularyRu", err);
      throw err; // Re-throw the error so the dialog can handle it
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDeleteConfirm = async (vocabularyRu: VocabularyRu) => {
    try {
      await vocabularyRuService.deleteVocabularyRu(vocabularyRu.id);
      await loadVocabularyRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete vocabularyRu", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <VocabularyRuPageHeader
        onCreateVocabularyRu={handleCreateVocabularyRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <VocabularyRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <VocabularyRuTableSkeleton />
      ) : (
        <VocabularyRuTable
          vocabularyRus={filteredVocabularyRus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onVocabularyRuAction={handleVocabularyRuAction}
        />
      )}

      <VocabularyRuCreateDialog
        open={dialog.dialogOpen && dialog.actionType === "create"}
        onClose={() => dialog.setDialogOpen(false)}
        onConfirm={handleCreateConfirm}
      />

      <VocabularyRuEditDialog
        open={dialog.dialogOpen && dialog.actionType === "edit"}
        vocabularyRu={dialog.selectedVocabularyRu}
        onClose={() => dialog.setDialogOpen(false)}
        onConfirm={handleEditConfirm}
      />

      <VocabularyRuViewDialog
        open={dialog.dialogOpen && dialog.actionType === "view"}
        vocabularyRu={dialog.selectedVocabularyRu || { id: "", word: "" }}
        onClose={() => dialog.setDialogOpen(false)}
        onEdit={(vocabularyRu) => {
          dialog.setSelectedVocabularyRu(vocabularyRu);
          dialog.setFormData(vocabularyRuToFormData(vocabularyRu));
          dialog.setActionType("edit");
        }}
      />

      <DeleteVocabularyRuDialog
        open={!!deleteTarget}
        vocabularyRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default VocabularyRusPage;
