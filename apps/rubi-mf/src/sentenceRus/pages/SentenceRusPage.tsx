import React from "react";
import "../i18n/translations";
import type { SentenceRu, SentenceRuFormData } from "../types/sentenceRu.types";
import { Box, Collapse } from "@mui/material";
import SentenceRuPageHeader from "../components/SentenceRuPageHeader";
import SentenceRuSearchPanel from "../components/SentenceRuSearchPanel";
import SentenceRuTable from "../components/SentenceRuTable";
import DeleteSentenceRuDialog from "../components/DeleteSentenceRuDialog";
import SentenceRuCreateDialog from "../components/SentenceRuCreateDialog";
import SentenceRuEditDialog from "../components/SentenceRuEditDialog";
import SentenceRuViewDialog from "../components/SentenceRuViewDialog";
import SentenceRuTableSkeleton from "../components/SentenceRuTableSkeleton";
import { getEmptySentenceRuFormData } from "../utils/getEmptySentenceRuFormData";
import { useSentenceRus } from "../hooks/useSentenceRus";
import { useSentenceRuDialog } from "../hooks/useSentenceRuDialog";
import { useSentenceRuSearch } from "../hooks/useSentenceRuSearch";
import { sentenceRuService } from "../services/sentenceRuService";

const SentenceRusPage: React.FC = () => {
  const {
    allSentenceRus,
    filteredSentenceRus,
    setFilteredSentenceRus,
    loading,
    loadSentenceRus,
  } = useSentenceRus();
  
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useSentenceRuSearch(allSentenceRus);
  
  const dialog = useSentenceRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<SentenceRu | null>(null);

  const sentenceRuToFormData = (sentenceRu: SentenceRu): SentenceRuFormData => ({
    name: sentenceRu.name || "",
    phonetic: sentenceRu.phonetic || "",
    translation: sentenceRu.translation || "",
    explanation: sentenceRu.explanation || "",
    tags: sentenceRu.tags || "",
    lang: sentenceRu.lang || "EN",
    difficultyLevel: sentenceRu.difficultyLevel || "Beginner",
    displayOrder: sentenceRu.displayOrder ?? 999,
    isActive: Boolean(sentenceRu.isActive),
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredSentenceRus(filtered);
  };

  const handleCreateSentenceRu = () => {
    dialog.setFormData(getEmptySentenceRuFormData());
    dialog.setActionType("create");
    dialog.setSelectedSentenceRu(null);
    dialog.setDialogOpen(true);
  };

  const handleSentenceRuAction = (
    sentenceRu: SentenceRu,
    action: "view" | "edit" | "delete",
  ) => {
    dialog.setSelectedSentenceRu(sentenceRu);
    if (action === "delete") {
      setDeleteTarget(sentenceRu);
    } else {
      dialog.setFormData(sentenceRuToFormData(sentenceRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async () => {
    dialog.setLoading(true);
    try {
      await sentenceRuService.createSentenceRu({
        name: dialog.formData.name,
        phonetic: dialog.formData.phonetic,
        translation: dialog.formData.translation,
        explanation: dialog.formData.explanation,
        tags: dialog.formData.tags,
        lang: dialog.formData.lang,
        difficultyLevel: dialog.formData.difficultyLevel,
        displayOrder: dialog.formData.displayOrder,
        isActive: dialog.formData.isActive,
      });
      await loadSentenceRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to create sentence", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async () => {
    if (!dialog.selectedSentenceRu) return;
    dialog.setLoading(true);
    try {
      await sentenceRuService.updateSentenceRu(
        dialog.selectedSentenceRu.id,
        {
          name: dialog.formData.name,
          phonetic: dialog.formData.phonetic,
          translation: dialog.formData.translation,
          explanation: dialog.formData.explanation,
          tags: dialog.formData.tags,
          lang: dialog.formData.lang,
          difficultyLevel: dialog.formData.difficultyLevel,
          displayOrder: dialog.formData.displayOrder,
          isActive: dialog.formData.isActive,
        },
      );
      await loadSentenceRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update sentence", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDeleteConfirm = async (sentenceRu: SentenceRu) => {
    try {
      await sentenceRuService.deleteSentenceRu(sentenceRu.id);
      await loadSentenceRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete sentence", err);
      throw err;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <SentenceRuPageHeader
        onCreateSentenceRu={handleCreateSentenceRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <SentenceRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <SentenceRuTableSkeleton />
      ) : (
        <SentenceRuTable
          sentences={filteredSentenceRus}
          loading={loading}
          onAction={handleSentenceRuAction}
        />
      )}

      <SentenceRuCreateDialog
        open={dialog.dialogOpen && dialog.actionType === "create"}
        formData={dialog.formData}
        loading={dialog.loading}
        onFormChange={(field, value) =>
          dialog.setFormData({ ...dialog.formData, [field]: value })
        }
        onSubmit={handleCreateConfirm}
        onClose={() => dialog.setDialogOpen(false)}
      />

      <SentenceRuEditDialog
        open={dialog.dialogOpen && dialog.actionType === "edit"}
        formData={dialog.formData}
        loading={dialog.loading}
        onFormChange={(field, value) =>
          dialog.setFormData({ ...dialog.formData, [field]: value })
        }
        onSubmit={handleEditConfirm}
        onClose={() => dialog.setDialogOpen(false)}
      />

      <SentenceRuViewDialog
        open={dialog.dialogOpen && dialog.actionType === "view"}
        sentenceRu={dialog.selectedSentenceRu}
        onClose={() => dialog.setDialogOpen(false)}
      />

      <DeleteSentenceRuDialog
        open={Boolean(deleteTarget)}
        sentenceRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default SentenceRusPage;
