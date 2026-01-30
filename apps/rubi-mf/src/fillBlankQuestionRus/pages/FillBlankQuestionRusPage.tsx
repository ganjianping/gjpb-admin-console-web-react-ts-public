import React from "react";
import "../i18n/translations";
import type { FillBlankQuestionRu, FillBlankQuestionRuFormData } from "../types/fillBlankQuestionRu.types";
import { Box, Collapse } from "@mui/material";
import FillBlankQuestionRuPageHeader from "../components/FillBlankQuestionRuPageHeader";
import FillBlankQuestionRuSearchPanel from "../components/FillBlankQuestionRuSearchPanel";
import FillBlankQuestionRuTable from "../components/FillBlankQuestionRuTable";
import DeleteFillBlankQuestionRuDialog from "../components/DeleteFillBlankQuestionRuDialog";
import FillBlankQuestionRuCreateDialog from "../components/FillBlankQuestionRuCreateDialog";
import FillBlankQuestionRuEditDialog from "../components/FillBlankQuestionRuEditDialog";
import FillBlankQuestionRuViewDialog from "../components/FillBlankQuestionRuViewDialog";
import FillBlankQuestionRuTableSkeleton from "../components/FillBlankQuestionRuTableSkeleton";
import { getEmptyFillBlankQuestionRuFormData } from "../utils/getEmptyFillBlankQuestionRuFormData";
import { useFillBlankQuestionRus } from "../hooks/useFillBlankQuestionRus";
import { useFillBlankQuestionRuDialog } from "../hooks/useFillBlankQuestionRuDialog";
import { useFillBlankQuestionRuSearch } from "../hooks/useFillBlankQuestionRuSearch";
import { fillBlankQuestionRuService } from "../services/fillBlankQuestionRuService";

const FillBlankQuestionRusPage: React.FC = () => {
  const {
    allFillBlankQuestionRus,
    filteredFillBlankQuestionRus,
    setFilteredFillBlankQuestionRus,
    pagination,
    loading,
    loadFillBlankQuestionRus,
    handlePageChange,
    handlePageSizeChange,
  } = useFillBlankQuestionRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useFillBlankQuestionRuSearch(allFillBlankQuestionRus);
  const dialog = useFillBlankQuestionRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<FillBlankQuestionRu | null>(
    null,
  );

  const fillBlankQuestionRuToFormData = (fillBlankQuestionRu: FillBlankQuestionRu) => ({
    question: fillBlankQuestionRu.question || "",
    answer: fillBlankQuestionRu.answer || "",
    explanation: fillBlankQuestionRu.explanation || "",
    difficultyLevel: fillBlankQuestionRu.difficultyLevel || "",
    tags: fillBlankQuestionRu.tags || "",
    grammarChapter: fillBlankQuestionRu.grammarChapter || "",
    scienceChapter: fillBlankQuestionRu.scienceChapter || "",
    lang:
      fillBlankQuestionRu.lang ||
      (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : "EN"),
    term: fillBlankQuestionRu.term ?? undefined,
    week: fillBlankQuestionRu.week ?? undefined,
    displayOrder: fillBlankQuestionRu.displayOrder ?? 999,
    isActive: Boolean(fillBlankQuestionRu.isActive),
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredFillBlankQuestionRus(filtered);
  };

  const handleCreateFillBlankQuestionRu = () => {
    dialog.setFormData(getEmptyFillBlankQuestionRuFormData());
    dialog.setActionType("create");
    dialog.setSelectedFillBlankQuestionRu(null);
    dialog.setDialogOpen(true);
  };

  const handleFillBlankQuestionRuAction = (
    fillBlankQuestionRu: FillBlankQuestionRu,
    action: "view" | "edit" | "delete",
  ) => {
    dialog.setSelectedFillBlankQuestionRu(fillBlankQuestionRu);
    if (action === "delete") {
      setDeleteTarget(fillBlankQuestionRu);
    } else {
      dialog.setFormData(fillBlankQuestionRuToFormData(fillBlankQuestionRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async (formData: FillBlankQuestionRuFormData) => {
    dialog.setLoading(true);
    try {
      await fillBlankQuestionRuService.createFillBlankQuestionRu({
        question: formData.question,
        answer: formData.answer,
        explanation: formData.explanation,
        difficultyLevel: formData.difficultyLevel,
        tags: formData.tags,
        grammarChapter: formData.grammarChapter,
        scienceChapter: formData.scienceChapter,
        lang: formData.lang,
        term: formData.term,
        week: formData.week,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      });
      await loadFillBlankQuestionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to create free text question", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async (formData: FillBlankQuestionRuFormData) => {
    if (!dialog.selectedFillBlankQuestionRu) return;
    dialog.setLoading(true);
    try {
      await fillBlankQuestionRuService.updateFillBlankQuestionRu(
        dialog.selectedFillBlankQuestionRu.id,
        {
          question: formData.question,
          answer: formData.answer,
          explanation: formData.explanation,
          difficultyLevel: formData.difficultyLevel,
          tags: formData.tags,
          grammarChapter: formData.grammarChapter,
          scienceChapter: formData.scienceChapter,
          lang: formData.lang,
          term: formData.term,
          week: formData.week,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        },
      );
      await loadFillBlankQuestionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update free text question", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDelete = async (fillBlankQuestionRu: FillBlankQuestionRu) => {
    try {
      await fillBlankQuestionRuService.deleteFillBlankQuestionRu(fillBlankQuestionRu.id);
      await loadFillBlankQuestionRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete free text question", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <FillBlankQuestionRuPageHeader
        onCreateFillBlankQuestionRu={handleCreateFillBlankQuestionRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <FillBlankQuestionRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <FillBlankQuestionRuTableSkeleton />
      ) : (
        <FillBlankQuestionRuTable
          fillBlankQuestionRus={filteredFillBlankQuestionRus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFillBlankQuestionRuAction={handleFillBlankQuestionRuAction}
        />
      )}

      {dialog.actionType === "create" && (
        <FillBlankQuestionRuCreateDialog
          open={dialog.dialogOpen}
          onClose={() => dialog.setDialogOpen(false)}
          onConfirm={handleCreateConfirm}
        />
      )}

      {dialog.actionType === "edit" && dialog.selectedFillBlankQuestionRu && (
        <FillBlankQuestionRuEditDialog
          open={dialog.dialogOpen}
          fillBlankQuestionRu={dialog.selectedFillBlankQuestionRu}
          onClose={() => dialog.setDialogOpen(false)}
          onConfirm={handleEditConfirm}
        />
      )}

      {dialog.actionType === "view" && dialog.selectedFillBlankQuestionRu && (
        <FillBlankQuestionRuViewDialog
          open={dialog.dialogOpen}
          fillBlankQuestionRu={dialog.selectedFillBlankQuestionRu}
          onClose={() => dialog.setDialogOpen(false)}
          onEdit={(fillBlankQuestionRu) => {
            dialog.setFormData(fillBlankQuestionRuToFormData(fillBlankQuestionRu));
            dialog.setActionType("edit");
          }}
        />
      )}

      <DeleteFillBlankQuestionRuDialog
        open={Boolean(deleteTarget)}
        fillBlankQuestionRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default FillBlankQuestionRusPage;
