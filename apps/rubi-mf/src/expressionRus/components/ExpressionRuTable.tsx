import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import "../i18n/translations";
import {
  DataTable,
  createColumnHelper,
  createStatusChip,
} from "../../../../shared-lib/src/data-management/DataTable";
import type { ExpressionRu } from "../types/expressionRu.types";
import { useExpressionRuActionMenu } from "../hooks/useExpressionRuActionMenu";
import { STATUS_MAPS } from "../constants";

const columnHelper = createColumnHelper<ExpressionRu>();

const ExpressionRuTable = memo(
  ({
    expressionRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onExpressionRuAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useExpressionRuActionMenu({
      onView: (expressionRu: ExpressionRu) =>
        onExpressionRuAction(expressionRu, "view"),
      onEdit: (expressionRu: ExpressionRu) =>
        onExpressionRuAction(expressionRu, "edit"),
      onDelete: (expressionRu: ExpressionRu) =>
        onExpressionRuAction(expressionRu, "delete"),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor("name", {
          header: t("expressionRus.columns.name"),
          cell: (info) => (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {info.getValue()}
            </Typography>
          ),
          size: 200,
        }),
        columnHelper.accessor("phonetic", {
          header: t("expressionRus.columns.phonetic"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("lang", {
          header: t("expressionRus.columns.lang"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("tags", {
          header: t("expressionRus.columns.tags"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("displayOrder", {
          header: t("expressionRus.columns.displayOrder"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("isActive", {
          header: t("expressionRus.columns.isActive"),
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
          header: t("expressionRus.columns.updatedAt"),
          cell: (info) => {
            const value = info.getValue();
            if (!value) return <Typography variant="body2">-</Typography>;
            let dateStr = "-";
            if (typeof value === "string") {
              const match = value.match(/\d{4}-\d{2}-\d{2}/);
              dateStr = match ? match[0] : value;
            } else if (
              value &&
              typeof value === "object" &&
              "toISOString" in value
            ) {
              dateStr = (value as Date).toISOString().split("T")[0];
            }
            return <Typography variant="body2">{dateStr}</Typography>;
          },
        }),
      ],
      [t],
    );

    if (!expressionRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("expressionRus.noExpressionsFound")}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={expressionRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(expressionRu: ExpressionRu) =>
          onExpressionRuAction(expressionRu, "view")
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
  },
);

ExpressionRuTable.displayName = "ExpressionRuTable";

export default ExpressionRuTable;
