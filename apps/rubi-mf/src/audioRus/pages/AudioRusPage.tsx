import React from 'react';
// register feature translations early so they are available when dialogs mount
import '../i18n/translations';
import type { AudioRu, AudioRuSearchFormData } from '../types/audioRu.types';
import type { AudioRuQueryParams } from '../services/audioRuService';
import { Box, Collapse } from '@mui/material';
import AudioRuPageHeader from '../components/AudioRuPageHeader';
import AudioRuSearchPanel from '../components/AudioRuSearchPanel';
import AudioRuTable from '../components/AudioRuTable';
import DeleteAudioRuDialog from '../components/DeleteAudioRuDialog';

import AudioRuCreateDialog from '../components/AudioRuCreateDialog';
import AudioRuEditDialog from '../components/AudioRuEditDialog';
import { getEmptyAudioRuFormData } from '../utils/getEmptyAudioRuFormData';
import AudioRuTableSkeleton from '../components/AudioRuTableSkeleton';

import { useAudioRus } from '../hooks/useAudioRus';
import { useAudioRuDialog } from '../hooks/useAudioRuDialog';
import AudioRuViewDialog from '../components/AudioRuViewDialog';

import { useAudioRuSearch } from '../hooks/useAudioRuSearch';
import { audioRuService } from '../services/audioRuService';

const AudioRusPage: React.FC = () => {
  const {
    allAudioRus,
    filteredAudioRus,
    setFilteredAudioRus,
    pagination,
    loading,
    pageSize,
    loadAudioRus,
    handlePageChange,
    handlePageSizeChange,
  } = useAudioRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useAudioRuSearch(allAudioRus);
  const dialog = useAudioRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<AudioRu | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const audioRuToFormData = (audioRu: AudioRu) => ({
    name: audioRu.name || '',
    filename: audioRu.filename || '',
    coverImageFilename: audioRu.coverImageFilename || '',
    subtitle: audioRu.subtitle || '',
    coverImageFile: null,
    description: audioRu.description || '',
    sourceName: audioRu.sourceName || '',
    originalUrl: audioRu.originalUrl || '',
    artist: audioRu.artist || '',
    sizeBytes: audioRu.sizeBytes || 0,
    tags: audioRu.tags || '',
    lang: audioRu.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: audioRu.displayOrder || 0,
    isActive: !!audioRu.isActive,
    uploadMethod: 'file' as const,
    file: null,
  });

  const handleSearchFieldChange = (field: keyof AudioRuSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredAudioRus(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredAudioRus(allAudioRus);
  };

  const buildSearchParams = () => {
    const params: AudioRuQueryParams = {};
    if (searchFormData.name?.trim()) {
      params.name = searchFormData.name.trim();
    }
    if (searchFormData.lang?.trim()) {
      params.lang = searchFormData.lang.trim();
    }
    if (searchFormData.tags?.trim()) {
      params.tags = searchFormData.tags.trim();
    }
    if (searchFormData.isActive === 'true') {
      params.isActive = true;
    } else if (searchFormData.isActive === 'false') {
      params.isActive = false;
    }
    return params;
  };

  const handleApiSearch = async () => {
    const params = buildSearchParams();
    await loadAudioRus(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadAudioRus(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadAudioRus(params, 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyAudioRuFormData());
    dialog.setSelectedAudioRu(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AudioRuPageHeader
        onCreateAudioRu={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <AudioRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading && !filteredAudioRus.length ? (
        <AudioRuTableSkeleton />
      ) : (
        <AudioRuTable
          audioRus={filteredAudioRus}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onAudioRuAction={(audioRu: AudioRu, action: 'view' | 'edit' | 'delete') => {
            if (action === 'view') {
              dialog.setSelectedAudioRu(audioRu);
              dialog.setFormData(audioRuToFormData(audioRu));
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedAudioRu(audioRu);
              dialog.setFormData(audioRuToFormData(audioRu));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(audioRu);
              return;
            }
          }}
          onCopyFilename={(audioRu: AudioRu) => navigator.clipboard.writeText(audioRu.filename || '')}
          onCopyThumbnail={(audioRu: AudioRu) => navigator.clipboard.writeText(audioRu.coverImageFilename || '')}
        />
      )}

      <DeleteAudioRuDialog
        open={!!deleteTarget}
        audioRu={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await audioRuService.deleteAudioRu(deleteTarget.id);
            await loadAudioRus();
            setDeleting(false);
            setDeleteTarget(null);
          } catch (err) {
            setDeleting(false);
            console.error('Failed to delete audioRu', err);
            setDeleteTarget(null);
          }
        }}
      />

      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <AudioRuCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyAudioRuFormData())}
          onCreated={async () => { await loadAudioRus(); }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedAudioRu && (
        <AudioRuViewDialog
          open={dialog.dialogOpen}
          audioRu={dialog.selectedAudioRu}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      {dialog.actionType === 'edit' && dialog.selectedAudioRu && (
        <AudioRuEditDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async (useFormData?: boolean) => {
            if (!dialog.selectedAudioRu) return;
            try {
              dialog.setLoading(true);
              if (useFormData) {
                await audioRuService.updateAudioRuWithFiles(dialog.selectedAudioRu.id, dialog.formData as any);
              } else {
                await audioRuService.updateAudioRu(dialog.selectedAudioRu.id, dialog.formData as any);
              }
              await loadAudioRus();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              dialog.setFormErrors({ general: (err as any)?.message || 'Failed to update audioRu' });
            }
          }}
          loading={dialog.loading}
          formErrors={dialog.formErrors}
        />
      )}
    </Box>
  );
};

export default AudioRusPage;

