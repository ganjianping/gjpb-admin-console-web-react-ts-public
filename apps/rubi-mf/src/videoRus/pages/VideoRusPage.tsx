import React from 'react';
// register feature translations early so they are available when dialogs mount
import '../i18n/translations';
import type { VideoRu, VideoRuSearchFormData } from '../types/videoRu.types';
import type { VideoRuQueryParams } from '../services/videoRuService';
import { Box, Collapse } from '@mui/material';
import VideoRuPageHeader from '../components/VideoRuPageHeader';
import VideoRuSearchPanel from '../components/VideoRuSearchPanel';
import VideoRuTable from '../components/VideoRuTable';
import VideoRuDeleteDialog from '../components/VideoRuDeleteDialog';

import VideoRuCreateDialog from '../components/VideoRuCreateDialog';
import VideoRuEditDialog from '../components/VideoRuEditDialog';
import { getEmptyVideoRuFormData } from '../utils/getEmptyVideoRuFormData';
import VideoRuTableSkeleton from '../components/VideoRuTableSkeleton';

import { useVideoRus } from '../hooks/useVideoRus';
import { useVideoRuDialog } from '../hooks/useVideoRuDialog';
import VideoRuViewDialog from '../components/VideoRuViewDialog';

import { useVideoRuSearch } from '../hooks/useVideoRuSearch';
import { videoRuService } from '../services/videoRuService';
const VideoRusPage: React.FC = () => {
  // Removed unused: const { t } = useTranslation();
  const {
    allVideoRus,
    filteredVideoRus,
    setFilteredVideoRus,
    pagination,
    loading,
    pageSize,
    loadVideoRus,
    handlePageChange,
    handlePageSizeChange,
  } = useVideoRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useVideoRuSearch(allVideoRus);
  const dialog = useVideoRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<VideoRu | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const videoRuToFormData = (videoRu: VideoRu) => ({
    name: videoRu.name || '',
    filename: videoRu.filename || '',
    coverImageFilename: videoRu.coverImageFilename || '',
    coverImageFile: null,
    description: videoRu.description || '',
    sourceName: videoRu.sourceName || '',
    originalUrl: videoRu.originalUrl || '',
    sizeBytes: videoRu.sizeBytes || 0,
    tags: videoRu.tags || '',
    lang: videoRu.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    term: videoRu.term || undefined,
    week: videoRu.week || undefined,
    displayOrder: videoRu.displayOrder || 0,
    isActive: !!videoRu.isActive,
    uploadMethod: 'file' as const,
    file: null,
  });

  // Removed unused: const [deleteTarget, setDeleteTarget] = useState<VideoRu | null>(null);
  // Removed unused: const handlers = useVideoRuHandlers({ ... });
  // action menu items are created where needed (useVideoRuActionMenu can be used by table if required)

  const handleSearchFieldChange = (field: keyof VideoRuSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredVideoRus(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredVideoRus(allVideoRus);
  };

  const buildSearchParams = () => {
    const params: VideoRuQueryParams = {};
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
    await loadVideoRus(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadVideoRus(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadVideoRus(params, 0, newPageSize);
  };

  const handleCreate = () => {
    // reset form data before opening create dialog
    dialog.setFormData(getEmptyVideoRuFormData());
    dialog.setSelectedVideoRu(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <VideoRuPageHeader
        onCreateVideoRu={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <VideoRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading && !filteredVideoRus.length ? (
        <VideoRuTableSkeleton />
      ) : (
        <VideoRuTable
          images={filteredVideoRus}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onImageAction={(videoRu: VideoRu, action: 'view' | 'edit' | 'delete') => {
            if (action === 'view') {
              dialog.setSelectedVideoRu(videoRu);
              dialog.setFormData(videoRuToFormData(videoRu));
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedVideoRu(videoRu);
              dialog.setFormData(videoRuToFormData(videoRu));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(videoRu);
              return;
            }
          }}
          onCopyFilename={(videoRu: VideoRu) => navigator.clipboard.writeText(videoRu.filename || '')}
          onCopyThumbnail={(videoRu: VideoRu) => navigator.clipboard.writeText(videoRu.coverImageFilename || '')}
        />
      )}

        {/* Delete confirmation dialog */}
        <VideoRuDeleteDialog
          open={!!deleteTarget}
          videoRu={deleteTarget}
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={async () => {
            if (!deleteTarget) return;
            try {
              setDeleting(true);
              await videoRuService.deleteVideoRu(deleteTarget.id);
              await loadVideoRus();
              setDeleting(false);
              setDeleteTarget(null);
            } catch (err) {
              setDeleting(false);
              // keep dialog open and show basic console error — for now, set form errors on dialog
              console.error('Failed to delete videoRu', err);
              setDeleteTarget(null);
            }
          }}
        />

      {/* Render the Create VideoRu dialog when actionType is 'create' */}
      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <VideoRuCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyVideoRuFormData())}
          onCreated={async () => { await loadVideoRus(); }}
          loading={dialog.loading}
        />
      )}
      {/* Render the View VideoRu dialog when actionType is 'view' */}
      {dialog.actionType === 'view' && dialog.selectedVideoRu && (
        <VideoRuViewDialog
          open={dialog.dialogOpen}
          videoRu={dialog.selectedVideoRu}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}
      {/* Render the Edit VideoRu dialog when actionType is 'edit' */}
      {dialog.actionType === 'edit' && dialog.selectedVideoRu && (
        <VideoRuEditDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async (useFormData?: boolean) => {
            if (!dialog.selectedVideoRu) return;
            try {
              dialog.setLoading(true);
              // If caller requests FormData (e.g., cover image present) use multipart update
              if (useFormData) {
                await videoRuService.updateVideoRuWithFiles(dialog.selectedVideoRu.id, dialog.formData as any);
              } else {
                await videoRuService.updateVideoRu(dialog.selectedVideoRu.id, dialog.formData as any);
              }
              // refresh list after update
              await loadVideoRus();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              // set basic form error
              dialog.setFormErrors({ general: (err as any)?.message || 'Failed to update videoRu' });
            }
          }}
          loading={dialog.loading}
          formErrors={dialog.formErrors}
        />
      )}
    </Box>
  );
};

export default VideoRusPage;
