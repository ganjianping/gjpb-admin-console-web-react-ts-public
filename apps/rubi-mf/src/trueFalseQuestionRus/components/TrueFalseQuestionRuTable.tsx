import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import "../i18n/translations";
import {
  DataTable,
  createColumnHelper,
  createStatusChip,
} from "../../../../shared-lib/src/data-management/DataTable";
import type { TrueFalseQuestionRu } from "../types/trueFalseQuestionRu.types";
import { useTrueFalseQuestionRuActionMenu } from "../hooks/useTrueFalseQuestionRuActionMenu";
import { STATUS_MAPS } from "../constants";

const columnHelper = createColumnHelper<TrueFalseQuestionRu>();

// Utility function to strip HTML tags and truncate text
const stripHtmlAndTruncate = (html: string, maxLength: number = 60): string => {
  if (!html) return '-';
  
  // Strip HTML tags
  const stripped = html.replace(/<[^>]*>/g, '');
  
  // Truncate to maxLength characters
  if (stripped.length <= maxLength) return stripped;
  
  return stripped.substring(0, maxLength) + '...';
};

const TrueFalseQuestionRuTable = memo(
  ({
    trueFalseQuestionRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onTrueFalseQuestionRuAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useTrueFalseQuestionRuActionMenu({
      onView: (trueFalseQuestionRu: TrueFalseQuestionRu) =>
        onTrueFalseQuestionRuAction(trueFalseQuestionRu, "view"),
      onEdit: (trueFalseQuestionRu: TrueFalseQuestionRu) =>
        onTrueFalseQuestionRuAction(trueFalseQuestionRu, "edit"),
      onDelete: (trueFalseQuestionRu: TrueFalseQuestionRu) =>
        onTrueFalseQuestionRuAction(trueFalseQuestionRu, "delete"),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor("question", {
          header: t("trueFalseQuestionRus.columns.question"),
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
          header: t("trueFalseQuestionRus.columns.difficultyLevel"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("tags", {
          header: t("trueFalseQuestionRus.columns.tags"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("lang", {
          header: t("trueFalseQuestionRus.columns.lang"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("displayOrder", {
          header: t("trueFalseQuestionRus.columns.displayOrder"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("isActive", {
          header: t("trueFalseQuestionRus.columns.isActive"),
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
          header: t("trueFalseQuestionRus.columns.updatedAt"),
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

    if (!trueFalseQuestionRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("trueFalseQuestionRus.noFreeTextQuestionsFound")}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={trueFalseQuestionRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(trueFalseQuestionRu: TrueFalseQuestionRu) =>
          onTrueFalseQuestionRuAction(trueFalseQuestionRu, "view")
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

TrueFalseQuestionRuTable.displayName = "TrueFalseQuestionRuTable";

export default TrueFalseQuestionRuTable;
