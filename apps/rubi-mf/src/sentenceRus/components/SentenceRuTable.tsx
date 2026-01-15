import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import "../i18n/translations";
import {
  DataTable,
  createColumnHelper,
  createStatusChip,
} from "../../../../shared-lib/src/data-management/DataTable";
import type { SentenceRu } from "../types/sentenceRu.types";
import { useSentenceRuActionMenu } from "../hooks/useSentenceRuActionMenu";
import { STATUS_MAPS } from "../constants";

const columnHelper = createColumnHelper<SentenceRu>();

const SentenceRuTable = memo(
  ({
    sentenceRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSentenceRuAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useSentenceRuActionMenu({
      onView: (sentenceRu: SentenceRu) =>
        onSentenceRuAction(sentenceRu, "view"),
      onEdit: (sentenceRu: SentenceRu) =>
        onSentenceRuAction(sentenceRu, "edit"),
      onDelete: (sentenceRu: SentenceRu) =>
        onSentenceRuAction(sentenceRu, "delete"),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor("name", {
          header: t("sentenceRus.columns.name"),
          cell: (info) => (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {info.getValue()}
            </Typography>
          ),
          size: 200,
        }),
        columnHelper.accessor("phonetic", {
          header: t("sentenceRus.columns.phonetic"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("translation", {
          header: t("sentenceRus.columns.translation"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("lang", {
          header: t("sentenceRus.columns.lang"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("tags", {
          header: t("sentenceRus.columns.tags"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("displayOrder", {
          header: t("sentenceRus.columns.displayOrder"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("isActive", {
          header: t("sentenceRus.columns.isActive"),
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
          header: t("sentenceRus.columns.updatedAt"),
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

    if (!sentenceRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("sentenceRus.noSentencesFound")}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={sentenceRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(sentenceRu: SentenceRu) =>
          onSentenceRuAction(sentenceRu, "view")
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

SentenceRuTable.displayName = "SentenceRuTable";

export default SentenceRuTable;
