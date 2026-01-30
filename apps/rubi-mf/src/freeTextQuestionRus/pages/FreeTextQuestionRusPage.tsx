import React from "react";
import "../i18n/translations";
import type { FreeTextQuestionRu, FreeTextQuestionRuFormData } from "../types/freeTextQuestionRu.types";
import { Box, Collapse } from "@mui/material";
import FreeTextQuestionRuPageHeader from "../components/FreeTextQuestionRuPageHeader";
import FreeTextQuestionRuSearchPanel from "../components/FreeTextQuestionRuSearchPanel";
import FreeTextQuestionRuTable from "../components/FreeTextQuestionRuTable";
import DeleteFreeTextQuestionRuDialog from "../components/DeleteFreeTextQuestionRuDialog";
import FreeTextQuestionRuCreateDialog from "../components/FreeTextQuestionRuCreateDialog";
import FreeTextQuestionRuEditDialog from "../components/FreeTextQuestionRuEditDialog";
import FreeTextQuestionRuViewDialog from "../components/FreeTextQuestionRuViewDialog";
import FreeTextQuestionRuTableSkeleton from "../components/FreeTextQuestionRuTableSkeleton";
import { getEmptyFreeTextQuestionRuFormData } from "../utils/getEmptyFreeTextQuestionRuFormData";
import { useFreeTextQuestionRus } from "../hooks/useFreeTextQuestionRus";
import { useFreeTextQuestionRuDialog } from "../hooks/useFreeTextQuestionRuDialog";
import { useFreeTextQuestionRuSearch } from "../hooks/useFreeTextQuestionRuSearch";
import { freeTextQuestionRuService } from "../services/freeTextQuestionRuService";

const FreeTextQuestionRusPage: React.FC = () => {
  const {
    allFreeTextQuestionRus,
    filteredFreeTextQuestionRus,
    setFilteredFreeTextQuestionRus,
    pagination,
    loading,
    loadFreeTextQuestionRus,
    handlePageChange,
    handlePageSizeChange,
  } = useFreeTextQuestionRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useFreeTextQuestionRuSearch(allFreeTextQuestionRus);
  const dialog = useFreeTextQuestionRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<FreeTextQuestionRu | null>(
    null,
  );

  const freeTextQuestionRuToFormData = (freeTextQuestionRu: FreeTextQuestionRu) => ({
    question: freeTextQuestionRu.question || "",
    answer: freeTextQuestionRu.answer || "",
    explanation: freeTextQuestionRu.explanation || "",
    description: freeTextQuestionRu.description || "",
    questiona: freeTextQuestionRu.questiona || "",
    answera: freeTextQuestionRu.answera || "",
    questionb: freeTextQuestionRu.questionb || "",
    answerb: freeTextQuestionRu.answerb || "",
    questionc: freeTextQuestionRu.questionc || "",
    answerc: freeTextQuestionRu.answerc || "",
    questiond: freeTextQuestionRu.questiond || "",
    answerd: freeTextQuestionRu.answerd || "",
    questione: freeTextQuestionRu.questione || "",
    answere: freeTextQuestionRu.answere || "",
    questionf: freeTextQuestionRu.questionf || "",
    answerf: freeTextQuestionRu.answerf || "",
    failCount: freeTextQuestionRu.failCount ?? undefined,
    successCount: freeTextQuestionRu.successCount ?? undefined,
    difficultyLevel: freeTextQuestionRu.difficultyLevel || "",
    tags: freeTextQuestionRu.tags || "",
    grammarChapter: freeTextQuestionRu.grammarChapter || "",
    scienceChapter: freeTextQuestionRu.scienceChapter || "",
    lang:
      freeTextQuestionRu.lang ||
      (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : "EN"),
    term: freeTextQuestionRu.term ?? undefined,
    week: freeTextQuestionRu.week ?? undefined,
    displayOrder: freeTextQuestionRu.displayOrder ?? 999,
    isActive: Boolean(freeTextQuestionRu.isActive),
  });

  const handleSearch = () => {
    const filtered = applyClientSideFiltersWithData(searchFormData);
    setFilteredFreeTextQuestionRus(filtered);
  };

  const handleCreateFreeTextQuestionRu = () => {
    dialog.setFormData(getEmptyFreeTextQuestionRuFormData());
    dialog.setActionType("create");
    dialog.setSelectedFreeTextQuestionRu(null);
    dialog.setDialogOpen(true);
  };

  const handleFreeTextQuestionRuAction = (
    freeTextQuestionRu: FreeTextQuestionRu,
    action: "view" | "edit" | "delete",
  ) => {
    dialog.setSelectedFreeTextQuestionRu(freeTextQuestionRu);
    if (action === "delete") {
      setDeleteTarget(freeTextQuestionRu);
    } else {
      dialog.setFormData(freeTextQuestionRuToFormData(freeTextQuestionRu));
      dialog.setActionType(action);
      dialog.setDialogOpen(true);
    }
  };

  const handleCreateConfirm = async (formData: FreeTextQuestionRuFormData) => {
    dialog.setLoading(true);
    try {
      await freeTextQuestionRuService.createFreeTextQuestionRu({
        question: formData.question,
        answer: formData.answer,
        explanation: formData.explanation,
        description: formData.description,
        questiona: formData.questiona,
        answera: formData.answera,
        questionb: formData.questionb,
        answerb: formData.answerb,
        questionc: formData.questionc,
        answerc: formData.answerc,
        questiond: formData.questiond,
        answerd: formData.answerd,
        questione: formData.questione,
        answere: formData.answere,
        questionf: formData.questionf,
        answerf: formData.answerf,
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
      await loadFreeTextQuestionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to create free text question", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleEditConfirm = async (formData: FreeTextQuestionRuFormData) => {
    if (!dialog.selectedFreeTextQuestionRu) return;
    dialog.setLoading(true);
    try {
      await freeTextQuestionRuService.updateFreeTextQuestionRu(
        dialog.selectedFreeTextQuestionRu.id,
        {
          question: formData.question,
          answer: formData.answer,
          explanation: formData.explanation,
          description: formData.description,
          questiona: formData.questiona,
          answera: formData.answera,
          questionb: formData.questionb,
          answerb: formData.answerb,
          questionc: formData.questionc,
          answerc: formData.answerc,
          questiond: formData.questiond,
          answerd: formData.answerd,
          questione: formData.questione,
          answere: formData.answere,
          questionf: formData.questionf,
          answerf: formData.answerf,
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
      await loadFreeTextQuestionRus();
      dialog.setDialogOpen(false);
    } catch (err) {
      console.error("Failed to update free text question", err);
      throw err;
    } finally {
      dialog.setLoading(false);
    }
  };

  const handleDelete = async (freeTextQuestionRu: FreeTextQuestionRu) => {
    try {
      await freeTextQuestionRuService.deleteFreeTextQuestionRu(freeTextQuestionRu.id);
      await loadFreeTextQuestionRus();
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete free text question", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <FreeTextQuestionRuPageHeader
        onCreateFreeTextQuestionRu={handleCreateFreeTextQuestionRu}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />

      <Collapse in={searchPanelOpen}>
        <FreeTextQuestionRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />
      </Collapse>

      {loading ? (
        <FreeTextQuestionRuTableSkeleton />
      ) : (
        <FreeTextQuestionRuTable
          freeTextQuestionRus={filteredFreeTextQuestionRus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFreeTextQuestionRuAction={handleFreeTextQuestionRuAction}
        />
      )}

      {dialog.actionType === "create" && (
        <FreeTextQuestionRuCreateDialog
          open={dialog.dialogOpen}
          onClose={() => dialog.setDialogOpen(false)}
          onConfirm={handleCreateConfirm}
        />
      )}

      {dialog.actionType === "edit" && dialog.selectedFreeTextQuestionRu && (
        <FreeTextQuestionRuEditDialog
          open={dialog.dialogOpen}
          freeTextQuestionRu={dialog.selectedFreeTextQuestionRu}
          onClose={() => dialog.setDialogOpen(false)}
          onConfirm={handleEditConfirm}
        />
      )}

      {dialog.actionType === "view" && dialog.selectedFreeTextQuestionRu && (
        <FreeTextQuestionRuViewDialog
          open={dialog.dialogOpen}
          freeTextQuestionRu={dialog.selectedFreeTextQuestionRu}
          onClose={() => dialog.setDialogOpen(false)}
          onEdit={(freeTextQuestionRu) => {
            dialog.setFormData(freeTextQuestionRuToFormData(freeTextQuestionRu));
            dialog.setActionType("edit");
          }}
        />
      )}

      <DeleteFreeTextQuestionRuDialog
        open={Boolean(deleteTarget)}
        freeTextQuestionRu={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default FreeTextQuestionRusPage;
