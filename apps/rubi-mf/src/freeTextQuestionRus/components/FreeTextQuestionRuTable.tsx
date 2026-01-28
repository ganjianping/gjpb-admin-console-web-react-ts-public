import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import "../i18n/translations";
import {
  DataTable,
  createColumnHelper,
  createStatusChip,
} from "../../../../shared-lib/src/data-management/DataTable";
import type { FreeTextQuestionRu } from "../types/freeTextQuestionRu.types";
import { useFreeTextQuestionRuActionMenu } from "../hooks/useFreeTextQuestionRuActionMenu";
import { STATUS_MAPS } from "../constants";

const columnHelper = createColumnHelper<FreeTextQuestionRu>();

// Utility function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 60): string => {
  if (!html) return '-';
  
  // Strip HTML tags
  const stripped = html.replace(/<[^>]*>/g, '');
  
  // Truncate to maxLength characters
  if (stripped.length <= maxLength) return stripped;
  
  return stripped.substring(0, maxLength) + '...';
};

const FreeTextQuestionRuTable = memo(
  ({
    freeTextQuestionRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onFreeTextQuestionRuAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useFreeTextQuestionRuActionMenu({
      onView: (freeTextQuestionRu: FreeTextQuestionRu) =>
        onFreeTextQuestionRuAction(freeTextQuestionRu, "view"),
      onEdit: (freeTextQuestionRu: FreeTextQuestionRu) =>
        onFreeTextQuestionRuAction(freeTextQuestionRu, "edit"),
      onDelete: (freeTextQuestionRu: FreeTextQuestionRu) =>
        onFreeTextQuestionRuAction(freeTextQuestionRu, "delete"),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor("question", {
          header: t("freeTextQuestionRus.columns.question"),
          cell: (info) => {
            const question = info.getValue();
            const rowData = info.row.original;
            
            // If question is empty, use description instead
            const displayValue = question || rowData.description || "";
            const displayText = stripHtmlAndTruncate(displayValue);
            
            return (
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {displayText}
              </Typography>
            );
          },
          size: 350,
        }),
        columnHelper.accessor("difficultyLevel", {
          header: t("freeTextQuestionRus.columns.difficultyLevel"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("tags", {
          header: t("freeTextQuestionRus.columns.tags"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("lang", {
          header: t("freeTextQuestionRus.columns.lang"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("displayOrder", {
          header: t("freeTextQuestionRus.columns.displayOrder"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("isActive", {
          header: t("freeTextQuestionRus.columns.isActive"),
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
          header: t("freeTextQuestionRus.columns.updatedAt"),
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

    if (!freeTextQuestionRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("freeTextQuestionRus.noFreeTextQuestionsFound")}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={freeTextQuestionRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(freeTextQuestionRu: FreeTextQuestionRu) =>
          onFreeTextQuestionRuAction(freeTextQuestionRu, "view")
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

FreeTextQuestionRuTable.displayName = "FreeTextQuestionRuTable";

export default FreeTextQuestionRuTable;
