import React from "react";
import "../i18n/translations";
import type { ExpressionRu, ExpressionRuFormData } from "../types/expressionRu.types";
import { Box, Collapse } from "@mui/material";
import ExpressionRuPageHeader from "../components/ExpressionRuPageHeader";
import ExpressionRuSearchPanel from "../components/ExpressionRuSearchPanel";
import ExpressionRuTable from "../components/ExpressionRuTable";
import DeleteExpressionRuDialog from "../components/DeleteExpressionRuDialog";
import ExpressionRuCreateDialog from "../components/ExpressionRuCreateDialog";
import ExpressionRuEditDialog from "../components/ExpressionRuEditDialog";
import ExpressionRuViewDialog from "../components/ExpressionRuViewDialog";
import ExpressionRuTableSkeleton from "../components/ExpressionRuTableSkeleton";
import { getEmptyExpressionRuFormData } from "../utils/getEmptyExpressionRuFormData";
import { useExpressionRus } from "../hooks/useExpressionRus";
import { useExpressionRuDialog } from "../hooks/useExpressionRuDialog";
import { useExpressionRuSearch } from "../hooks/useExpressionRuSearch";
import { expressionRuService } from "../services/expressionRuService";

const ExpressionRusPage: React.FC = () => {
  const {
    allExpressionRus,
    filteredExpressionRus,
    setFilteredExpressionRus,
    loading,
    loadExpressionRus,
  } = useExpressionRus();
  
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useExpressionRuSearch(allExpressionRus);
  
  const dialog = useExpressionRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<ExpressionRu | null>(null);

  const expressionRuToFormData = (expressionRu: ExpressionRu): ExpressionRuFormData => ({
    name: expressionRu.name || "",
    phonetic: expressionRu.phonetic || "",
    translation: expressionRu.translation || "",
    explanation: expressionRu.explanation || "",
    example: expressionRu.example || "",
    tags: expressionRu.tags || "",
    lang: expressionRu.lang || "EN",
    difficultyLevel: expressionRu.difficultyLevel || "Beginner",
    displayOrder: expressionRu.displayOrder ?? 999,
    isActive: Boolean(expressionRu.isActive),
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredExpressionRus(filtered);
  };

  const handleCreateExpressionRu = () => {
    dialog.setFormData(getEmptyExpressionRuFormData());
    dialog.setActionType("create");
    dialog.setSelectedExpressionRu(null);
    dialog.setDialogOpen(true);
  };

  const handleExpressionRuAction = (
    expressionRu: ExpressionRu,
    action: "view" | "edit" | "delete",
  ) => {
    dialog.setSelectedExpressionRu(expressionRu);
    if (action === "delete") {
      setDeleteTarget(expressionRu);
    } else {
      dialog.setFormData(expressionRuToFormData(expressionRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async () => {
    dialog.setLoading(true);
    try {
      await expressionRuService.createExpressionRu({
        name: dialog.formData.name,
        phonetic: dialog.formData.phonetic,
        translation: dialog.formData.translation,
        explanation: dialog.formData.explanation,
        example: dialog.formData.example,
        tags: dialog.formData.tags,
        lang: dialog.formData.lang,
        difficultyLevel: dialog.formData.difficultyLevel,
        displayOrder: dialog.formData.displayOrder,
        isActive: dialog.formData.isActive,
      });
      await loadExpressionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to create expression", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async () => {
    if (!dialog.selectedExpressionRu) return;
    dialog.setLoading(true);
    try {
      await expressionRuService.updateExpressionRu(
        dialog.selectedExpressionRu.id,
        {
          name: dialog.formData.name,
          phonetic: dialog.formData.phonetic,
          translation: dialog.formData.translation,
          explanation: dialog.formData.explanation,
          example: dialog.formData.example,
          tags: dialog.formData.tags,
          lang: dialog.formData.lang,
          difficultyLevel: dialog.formData.difficultyLevel,
          displayOrder: dialog.formData.displayOrder,
          isActive: dialog.formData.isActive,
        },
      );
      await loadExpressionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update expression", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDeleteConfirm = async (expressionRu: ExpressionRu) => {
    try {
      await expressionRuService.deleteExpressionRu(expressionRu.id);
      await loadExpressionRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete expression", err);
      throw err;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ExpressionRuPageHeader
        onCreateExpressionRu={handleCreateExpressionRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <ExpressionRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <ExpressionRuTableSkeleton />
      ) : (
        <ExpressionRuTable
          expressionRus={filteredExpressionRus}
          pagination={null}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onExpressionRuAction={handleExpressionRuAction}
        />
      )}

      <ExpressionRuCreateDialog
        open={dialog.dialogOpen && dialog.actionType === "create"}
        formData={dialog.formData}
        loading={dialog.loading}
        onFormChange={(field, value) =>
          dialog.setFormData({ ...dialog.formData, [field]: value })
        }
        onSubmit={handleCreateConfirm}
        onClose={() => dialog.setDialogOpen(false)}
      />

      <ExpressionRuEditDialog
        open={dialog.dialogOpen && dialog.actionType === "edit"}
        formData={dialog.formData}
        loading={dialog.loading}
        onFormChange={(field, value) =>
          dialog.setFormData({ ...dialog.formData, [field]: value })
        }
        onSubmit={handleEditConfirm}
        onClose={() => dialog.setDialogOpen(false)}
      />

      <ExpressionRuViewDialog
        open={dialog.dialogOpen && dialog.actionType === "view"}
        expressionRu={dialog.selectedExpressionRu}
        onClose={() => dialog.setDialogOpen(false)}
      />

      <DeleteExpressionRuDialog
        open={Boolean(deleteTarget)}
        expressionRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default ExpressionRusPage;
