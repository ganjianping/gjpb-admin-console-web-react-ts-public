import React from 'react';
// register feature translations early so they are available when dialogs mount
import '../i18n/translations';
import type { Audio, AudioSearchFormData } from '../types/audio.types';
import type { AudioQueryParams } from '../services/audioService';
import { Box, Collapse } from '@mui/material';
import AudioPageHeader from '../components/AudioPageHeader';
import AudioSearchPanel from '../components/AudioSearchPanel';
import AudioTable from '../components/AudioTable';
import DeleteAudioDialog from '../components/DeleteAudioDialog';

import AudioCreateDialog from '../components/AudioCreateDialog';
import AudioEditDialog from '../components/AudioEditDialog';
import { getEmptyAudioFormData } from '../utils/getEmptyAudioFormData';
import AudioTableSkeleton from '../components/AudioTableSkeleton';

import { useAudios } from '../hooks/useAudios';
import { useAudioDialog } from '../hooks/useAudioDialog';
import AudioViewDialog from '../components/AudioViewDialog';

import { useAudioSearch } from '../hooks/useAudioSearch';
import { audioService } from '../services/audioService';

const AudiosPage: React.FC = () => {
  const {
    allAudios,
    filteredAudios,
    setFilteredAudios,
    loading,
    loadAudios,
  } = useAudios();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useAudioSearch(allAudios);
  const dialog = useAudioDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Audio | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const audioToFormData = (audio: Audio) => ({
    name: audio.name || '',
    filename: audio.filename || '',
    coverImageFilename: audio.coverImageFilename || '',
    coverImageFile: null,
    description: audio.description || '',
    sourceName: audio.sourceName || '',
    originalUrl: audio.originalUrl || '',
    sizeBytes: audio.sizeBytes || 0,
    tags: audio.tags || '',
    lang: audio.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: audio.displayOrder || 0,
    isActive: !!audio.isActive,
    uploadMethod: 'file' as const,
    file: null,
  });

  const handleSearchFieldChange = (field: keyof AudioSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredAudios(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredAudios(allAudios);
  };

  const handleApiSearch = async () => {
    const params: AudioQueryParams = {};
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
    await loadAudios(params);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyAudioFormData());
    dialog.setSelectedAudio(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <AudioPageHeader
        onCreateAudio={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <AudioSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading ? (
        <AudioTableSkeleton rows={5} />
      ) : (
        <AudioTable
          audios={filteredAudios}
          loading={loading}
          onAudioAction={(audio: Audio, action: string) => {
            if (action === 'view') {
              dialog.setSelectedAudio(audio);
              dialog.setFormData(audioToFormData(audio));
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedAudio(audio);
              dialog.setFormData(audioToFormData(audio));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(audio);
              return;
            }
          }}
          onCopyFilename={(audio: Audio) => navigator.clipboard.writeText(audio.filename || '')}
          onCopyThumbnail={(audio: Audio) => navigator.clipboard.writeText(audio.coverImageFilename || '')}
        />
      )}

      <DeleteAudioDialog
        open={!!deleteTarget}
        audio={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await audioService.deleteAudio(deleteTarget.id);
            await loadAudios();
            setDeleting(false);
            setDeleteTarget(null);
          } catch (err) {
            setDeleting(false);
            console.error('Failed to delete audio', err);
            setDeleteTarget(null);
          }
        }}
      />

      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <AudioCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyAudioFormData())}
          onCreated={async () => { await loadAudios(); }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedAudio && (
        <AudioViewDialog
          open={dialog.dialogOpen}
          audio={dialog.selectedAudio}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      {dialog.actionType === 'edit' && dialog.selectedAudio && (
        <AudioEditDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async (useFormData?: boolean) => {
            if (!dialog.selectedAudio) return;
            try {
              dialog.setLoading(true);
              if (useFormData) {
                await audioService.updateAudioWithFiles(dialog.selectedAudio.id, dialog.formData as any);
              } else {
                await audioService.updateAudio(dialog.selectedAudio.id, dialog.formData as any);
              }
              await loadAudios();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              dialog.setFormErrors({ general: (err as any)?.message || 'Failed to update audio' });
            }
          }}
          loading={dialog.loading}
          formErrors={dialog.formErrors}
        />
      )}
    </Box>
  );
};

export default AudiosPage;

