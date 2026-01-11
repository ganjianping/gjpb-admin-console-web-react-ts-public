import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import "../i18n/translations";
import {
  DataTable,
  createColumnHelper,
  createStatusChip,
} from "../../../../shared-lib/src/data-management/DataTable";
import type { FillBlankQuestionRu } from "../types/fillBlankQuestionRu.types";
import { useFillBlankQuestionRuActionMenu } from "../hooks/useFillBlankQuestionRuActionMenu";
import { STATUS_MAPS } from "../constants";

const columnHelper = createColumnHelper<FillBlankQuestionRu>();

// Utility function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 60): string => {
  if (!html) return '-';
  
  // Strip HTML tags
  const stripped = html.replace(/<[^>]*>/g, '');
  
  // Truncate to maxLength characters
  if (stripped.length <= maxLength) return stripped;
  
  return stripped.substring(0, maxLength) + '...';
};

const FillBlankQuestionRuTable = memo(
  ({
    fillBlankQuestionRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onFillBlankQuestionRuAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useFillBlankQuestionRuActionMenu({
      onView: (fillBlankQuestionRu: FillBlankQuestionRu) =>
        onFillBlankQuestionRuAction(fillBlankQuestionRu, "view"),
      onEdit: (fillBlankQuestionRu: FillBlankQuestionRu) =>
        onFillBlankQuestionRuAction(fillBlankQuestionRu, "edit"),
      onDelete: (fillBlankQuestionRu: FillBlankQuestionRu) =>
        onFillBlankQuestionRuAction(fillBlankQuestionRu, "delete"),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor("question", {
          header: t("fillBlankQuestionRus.columns.question"),
          cell: (info) => {
            const question = info.getValue();
            const displayText = stripHtmlAndTruncate(question);
            return (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {displayText}
              </Typography>
            );
          },
          size: 350,
        }),
        columnHelper.accessor("difficultyLevel", {
          header: t("fillBlankQuestionRus.columns.difficultyLevel"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("tags", {
          header: t("fillBlankQuestionRus.columns.tags"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("lang", {
          header: t("fillBlankQuestionRus.columns.lang"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("displayOrder", {
          header: t("fillBlankQuestionRus.columns.displayOrder"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("isActive", {
          header: t("fillBlankQuestionRus.columns.isActive"),
          cell: (info) => {
            const isActive = info.getValue();
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {createStatusChip(
                  isActive?.toString?.() ?? String(!!isActive),
                  STATUS_MAPS.active,
                )}
              </Box>
            );
          },
        }),
        columnHelper.accessor("updatedAt", {
          header: t("fillBlankQuestionRus.columns.updatedAt"),
          cell: (info) => {
            const date = info.getValue();
            if (!date) return <Typography variant="body2">-</Typography>;
            return (
              <Typography variant="body2">
                {new Date(date).toLocaleString()}
              </Typography>
            );
          },
        }),
      ],
      [t]
    );

    if (!fillBlankQuestionRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("fillBlankQuestionRus.noFreeTextQuestionsFound")}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={fillBlankQuestionRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(fillBlankQuestionRu: FillBlankQuestionRu) =>
          onFillBlankQuestionRuAction(fillBlankQuestionRu, "view")
        }
        manualPagination={!!pagination}
        pageCount={pagination?.totalPages || 0}
        currentPage={pagination?.page || 0}
        pageSize={pagination?.size || 20}
        totalRows={pagination?.totalElements || 0}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }
);

FillBlankQuestionRuTable.displayName = "FillBlankQuestionRuTable";

export default FillBlankQuestionRuTable;
