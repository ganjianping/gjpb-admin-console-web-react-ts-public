import React from "react";
import "../i18n/translations";
import type { TrueFalseQuestionRu, TrueFalseQuestionRuFormData } from "../types/trueFalseQuestionRu.types";
import { Box, Collapse } from "@mui/material";
import TrueFalseQuestionRuPageHeader from "../components/TrueFalseQuestionRuPageHeader";
import TrueFalseQuestionRuSearchPanel from "../components/TrueFalseQuestionRuSearchPanel";
import TrueFalseQuestionRuTable from "../components/TrueFalseQuestionRuTable";
import DeleteTrueFalseQuestionRuDialog from "../components/DeleteTrueFalseQuestionRuDialog";
import TrueFalseQuestionRuCreateDialog from "../components/TrueFalseQuestionRuCreateDialog";
import TrueFalseQuestionRuEditDialog from "../components/TrueFalseQuestionRuEditDialog";
import TrueFalseQuestionRuViewDialog from "../components/TrueFalseQuestionRuViewDialog";
import TrueFalseQuestionRuTableSkeleton from "../components/TrueFalseQuestionRuTableSkeleton";
import { getEmptyTrueFalseQuestionRuFormData } from "../utils/getEmptyTrueFalseQuestionRuFormData";
import { useTrueFalseQuestionRus } from "../hooks/useTrueFalseQuestionRus";
import { useTrueFalseQuestionRuDialog } from "../hooks/useTrueFalseQuestionRuDialog";
import { useTrueFalseQuestionRuSearch } from "../hooks/useTrueFalseQuestionRuSearch";
import { trueFalseQuestionRuService } from "../services/trueFalseQuestionRuService";

const TrueFalseQuestionRusPage: React.FC = () => {
  const {
    allTrueFalseQuestionRus,
    filteredTrueFalseQuestionRus,
    setFilteredTrueFalseQuestionRus,
    pagination,
    loading,
    loadTrueFalseQuestionRus,
    handlePageChange,
    handlePageSizeChange,
  } = useTrueFalseQuestionRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useTrueFalseQuestionRuSearch(allTrueFalseQuestionRus);
  const dialog = useTrueFalseQuestionRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<TrueFalseQuestionRu | null>(
    null,
  );

  const trueFalseQuestionRuToFormData = (trueFalseQuestionRu: TrueFalseQuestionRu) => ({
    question: trueFalseQuestionRu.question || "",
    answer: trueFalseQuestionRu.answer || "",
    explanation: trueFalseQuestionRu.explanation || "",
    difficultyLevel: trueFalseQuestionRu.difficultyLevel || "",
    tags: trueFalseQuestionRu.tags || "",
    lang:
      trueFalseQuestionRu.lang ||
      (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : "EN"),
    displayOrder: trueFalseQuestionRu.displayOrder ?? 999,
    isActive: Boolean(trueFalseQuestionRu.isActive),
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredTrueFalseQuestionRus(filtered);
  };

  const handleCreateTrueFalseQuestionRu = () => {
    dialog.setFormData(getEmptyTrueFalseQuestionRuFormData());
    dialog.setActionType("create");
    dialog.setSelectedTrueFalseQuestionRu(null);
    dialog.setDialogOpen(true);
  };

  const handleTrueFalseQuestionRuAction = (
    trueFalseQuestionRu: TrueFalseQuestionRu,
    action: "view" | "edit" | "delete",
  ) => {
    dialog.setSelectedTrueFalseQuestionRu(trueFalseQuestionRu);
    if (action === "delete") {
      setDeleteTarget(trueFalseQuestionRu);
    } else {
      dialog.setFormData(trueFalseQuestionRuToFormData(trueFalseQuestionRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async (formData: TrueFalseQuestionRuFormData) => {
    dialog.setLoading(true);
    try {
      await trueFalseQuestionRuService.createTrueFalseQuestionRu({
        question: formData.question,
        answer: formData.answer,
        explanation: formData.explanation,
        difficultyLevel: formData.difficultyLevel,
        tags: formData.tags,
        lang: formData.lang,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      });
      await loadTrueFalseQuestionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to create free text question", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async (formData: TrueFalseQuestionRuFormData) => {
    if (!dialog.selectedTrueFalseQuestionRu) return;
    dialog.setLoading(true);
    try {
      await trueFalseQuestionRuService.updateTrueFalseQuestionRu(
        dialog.selectedTrueFalseQuestionRu.id,
        {
          question: formData.question,
          answer: formData.answer,
          explanation: formData.explanation,
          difficultyLevel: formData.difficultyLevel,
          tags: formData.tags,
          lang: formData.lang,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        },
      );
      await loadTrueFalseQuestionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update free text question", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDelete = async (trueFalseQuestionRu: TrueFalseQuestionRu) => {
    try {
      await trueFalseQuestionRuService.deleteTrueFalseQuestionRu(trueFalseQuestionRu.id);
      await loadTrueFalseQuestionRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete free text question", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <TrueFalseQuestionRuPageHeader
        onCreateTrueFalseQuestionRu={handleCreateTrueFalseQuestionRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <TrueFalseQuestionRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <TrueFalseQuestionRuTableSkeleton />
      ) : (
        <TrueFalseQuestionRuTable
          trueFalseQuestionRus={filteredTrueFalseQuestionRus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onTrueFalseQuestionRuAction={handleTrueFalseQuestionRuAction}
        />
      )}

      {dialog.actionType === "create" && (
        <TrueFalseQuestionRuCreateDialog
          open={dialog.dialogOpen}
          onClose={() => dialog.setDialogOpen(false)}
          onConfirm={handleCreateConfirm}
        />
      )}

      {dialog.actionType === "edit" && dialog.selectedTrueFalseQuestionRu && (
        <TrueFalseQuestionRuEditDialog
          open={dialog.dialogOpen}
          trueFalseQuestionRu={dialog.selectedTrueFalseQuestionRu}
          onClose={() => dialog.setDialogOpen(false)}
          onConfirm={handleEditConfirm}
        />
      )}

      {dialog.actionType === "view" && dialog.selectedTrueFalseQuestionRu && (
        <TrueFalseQuestionRuViewDialog
          open={dialog.dialogOpen}
          trueFalseQuestionRu={dialog.selectedTrueFalseQuestionRu}
          onClose={() => dialog.setDialogOpen(false)}
          onEdit={(trueFalseQuestionRu) => {
            dialog.setFormData(trueFalseQuestionRuToFormData(trueFalseQuestionRu));
            dialog.setActionType("edit");
          }}
        />
      )}

      <DeleteTrueFalseQuestionRuDialog
        open={Boolean(deleteTarget)}
        trueFalseQuestionRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default TrueFalseQuestionRusPage;
