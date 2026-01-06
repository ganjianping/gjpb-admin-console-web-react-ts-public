import { Box, Typography, Avatar } from '@mui/material';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { memo, useMemo } from 'react';
import '../i18n/translations';
import { DataTable, createColumnHelper, createStatusChip } from '../../../../shared-lib/src/data-management/DataTable';
import type { Vocabulary } from '../types/vocabulary.types';
import { useVocabularyActionMenu } from '../hooks/useVocabularyActionMenu';
import { STATUS_MAPS } from '../constants';

function WordCell({ info }: Readonly<{ info: any }>) {
  const vocabulary = info.row.original as Vocabulary;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {vocabulary.wordImageOriginalUrl && (
        <Avatar src={vocabulary.wordImageOriginalUrl} alt={vocabulary.word} sx={{ width: 40, height: 40 }} variant="rounded" />
      )}
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {info.getValue()}
        </Typography>
      </Box>
    </Box>
  );
}

const columnHelper = createColumnHelper<Vocabulary>();

const VocabularyTable = memo(
  ({
    vocabularies,
    pagination,
    onPageChange,
    onPageSizeChange,
    onVocabularyAction,
  }: any) => {
    const { t } = useTranslation();

    const actionMenuItems = useVocabularyActionMenu({
      onView: (vocabulary: Vocabulary) => onVocabularyAction(vocabulary, 'view'),
      onEdit: (vocabulary: Vocabulary) => onVocabularyAction(vocabulary, 'edit'),
      onDelete: (vocabulary: Vocabulary) => onVocabularyAction(vocabulary, 'delete'),
    });

    const columns = useMemo(
      () => [
        columnHelper.accessor('word', {
          header: t('vocabularies.columns.word'),
          cell: (info) => <WordCell info={info} />,
          size: 280,
        }),
        columnHelper.accessor('phonetic', {
          header: t('vocabularies.columns.phonetic'),
          cell: (info) => {
            const vocabulary = info.row.original as Vocabulary;
            const phonetic = info.getValue();
            const displayText = phonetic ? phonetic.substring(0, 50) + (phonetic.length > 50 ? '...' : '') : '-';
            
            const handlePlayAudio = () => {
              if (vocabulary.phoneticAudioOriginalUrl) {
                console.log('Playing audio:', vocabulary.phoneticAudioOriginalUrl);
                const audio = new Audio(vocabulary.phoneticAudioOriginalUrl);
                audio.play()
                  .then(() => console.log('Audio started playing'))
                  .catch(err => {
                    console.error('Failed to play audio:', err);
                    console.error('Audio URL:', vocabulary.phoneticAudioOriginalUrl);
                  });
              } else {
                console.log('No audio URL available');
              }
            };

            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    cursor: vocabulary.phoneticAudioOriginalUrl ? 'pointer' : 'default',
                    '&:hover': vocabulary.phoneticAudioOriginalUrl ? { textDecoration: 'underline' } : {}
                  }}
                  onClick={vocabulary.phoneticAudioOriginalUrl ? handlePlayAudio : undefined}
                >
                  {displayText}
                </Typography>
                {vocabulary.phoneticAudioOriginalUrl && (
                  <Box
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.7 },
                      display: 'flex',
                      alignItems: 'center'
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
        columnHelper.accessor('tags', {
          header: t('vocabularies.columns.tags'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('lang', {
          header: t('vocabularies.columns.lang'),
          cell: (info) => <Typography variant="body2">{info.getValue() || '-'}</Typography>,
        }),
        columnHelper.accessor('displayOrder', {
          header: t('vocabularies.columns.displayOrder'),
          cell: (info) => <Typography variant="body2">{info.getValue()}</Typography>,
        }),
        columnHelper.accessor('isActive', {
          header: t('vocabularies.columns.isActive'),
          cell: (info) => {
            const isActive = info.getValue();
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {createStatusChip(isActive?.toString?.() ?? String(!!isActive), STATUS_MAPS.active)}
              </Box>
            );
          },
        }),
        columnHelper.accessor('updatedAt', {
          header: t('vocabularies.columns.updatedAt'),
          cell: (info) => {
            const value = info.getValue();
            if (!value) return <Typography variant="body2">-</Typography>;
            let dateStr = '-';
            if (typeof value === 'string') {
              const match = value.match(/\d{4}-\d{2}-\d{2}/);
              dateStr = match ? match[0] : value;
            } else if (value && typeof value === 'object' && 'toISOString' in value) {
              dateStr = (value as Date).toISOString().split('T')[0];
            }
            return <Typography variant="body2">{dateStr}</Typography>;
          },
        }),
      ],
      [t],
    );

    if (!vocabularies?.length) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('vocabularies.noVocabulariesFound')}
          </Typography>
        </Box>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={vocabularies}
        actionMenuItems={actionMenuItems}
        showSearch={false}
        onRowDoubleClick={(vocabulary: Vocabulary) => onVocabularyAction(vocabulary, 'view')}
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

VocabularyTable.displayName = 'VocabularyTable';

export default VocabularyTable;
