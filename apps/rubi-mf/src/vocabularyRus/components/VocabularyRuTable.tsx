import { Box, Typography, Avatar } from "@mui/material";
import { Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { memo, useMemo } from "react";
import "../i18n/translations";
import {
  DataTable,
  createColumnHelper,
  createStatusChip,
} from "../../../../shared-lib/src/data-management/DataTable";
import type { VocabularyRu } from "../types/vocabularyRu.types";
import { useVocabularyRuActionMenu } from "../hooks/useVocabularyRuActionMenu";
import { STATUS_MAPS } from "../constants";

function WordCell({ info }: Readonly<{ info: any }>) {
  const vocabularyRu = info.row.original as VocabularyRu;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {vocabularyRu.wordImageUrl && (
        <Avatar
          src={vocabularyRu.wordImageUrl}
          alt={vocabularyRu.word}
          sx={{ width: 40, height: 40 }}
          variant="rounded"
        />
      )}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {info.getValue()}
        </Typography>
      </Box>
    </Box>
  );
}

const columnHelper = createColumnHelper<VocabularyRu>();

const VocabularyRuTable = memo(
  ({
    vocabularyRus,
    pagination,
    onPageChange,
    onPageSizeChange,
    onVocabularyRuAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useVocabularyRuActionMenu({
      onView: (vocabularyRu: VocabularyRu) =>
        onVocabularyRuAction(vocabularyRu, "view"),
      onEdit: (vocabularyRu: VocabularyRu) =>
        onVocabularyRuAction(vocabularyRu, "edit"),
      onDelete: (vocabularyRu: VocabularyRu) =>
        onVocabularyRuAction(vocabularyRu, "delete"),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor("word", {
          header: t("vocabularyRus.columns.word"),
          cell: (info) => <WordCell info={info} />,
          size: 280,
        }),
        columnHelper.accessor("phonetic", {
          header: t("vocabularyRus.columns.phonetic"),
          cell: (info) => {
            const vocabularyRu = info.row.original as VocabularyRu;
            const phonetic = info.getValue();
            const displayText = phonetic
              ? phonetic.substring(0, 50) + (phonetic.length > 50 ? "..." : "")
              : "-";

            const handlePlayAudio = () => {
              if (vocabularyRu.phoneticAudioUrl) {
                console.log("Playing audio:", vocabularyRu.phoneticAudioUrl);
                const audio = new Audio(vocabularyRu.phoneticAudioUrl);
                audio
                  .play()
                  .then(() => console.log("Audio started playing"))
                  .catch((err) => {
                    console.error("Failed to play audio:", err);
                    console.error("Audio URL:", vocabularyRu.phoneticAudioUrl);
                  });
              } else {
                console.log("No audio URL available");
              }
            };

            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: vocabularyRu.phoneticAudioUrl
                      ? "pointer"
                      : "default",
                    "&:hover": vocabularyRu.phoneticAudioUrl
                      ? { textDecoration: "underline" }
                      : {},
                  }}
                  onClick={
                    vocabularyRu.phoneticAudioUrl ? handlePlayAudio : undefined
                  }
                >
                  {displayText}
                </Typography>
                {vocabularyRu.phoneticAudioUrl && (
                  <Box
                    sx={{
                      cursor: "pointer",
                      "&:hover": { opacity: 0.7 },
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={handlePlayAudio}
                  >
                    <Volume2 size={14} />
                  </Box>
                )}
              </Box>
            );
          },
        }),
        columnHelper.accessor("tags", {
          header: t("vocabularyRus.columns.tags"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("lang", {
          header: t("vocabularyRus.columns.lang"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue() || "-"}</Typography>
          ),
        }),
        columnHelper.accessor("displayOrder", {
          header: t("vocabularyRus.columns.displayOrder"),
          cell: (info) => (
            <Typography variant="body2">{info.getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("isActive", {
          header: t("vocabularyRus.columns.isActive"),
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
          header: t("vocabularyRus.columns.updatedAt"),
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

    if (!vocabularyRus?.length) {
      return (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("vocabularyRus.noVocabularysFound")}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={vocabularyRus}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(vocabularyRu: VocabularyRu) =>
          onVocabularyRuAction(vocabularyRu, "view")
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

VocabularyRuTable.displayName = "VocabularyRuTable";

export default VocabularyRuTable;
