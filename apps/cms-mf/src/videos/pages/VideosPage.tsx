import React from 'react';
// register feature translations early so they are available when dialogs mount
import '../i18n/translations';
import type { Video, VideoSearchFormData } from '../types/video.types';
import type { VideoQueryParams } from '../services/videoService';
import { Box, Collapse } from '@mui/material';
import VideoPageHeader from '../components/VideoPageHeader';
import VideoSearchPanel from '../components/VideoSearchPanel';
import VideoTable from '../components/VideoTable';

import VideoCreateDialog from '../components/VideoCreateDialog';
import VideoEditDialog from '../components/VideoEditDialog';
import { getEmptyVideoFormData } from '../utils/getEmptyVideoFormData';
import VideoTableSkeleton from '../components/VideoTableSkeleton';

import { useVideos } from '../hooks/useVideos';
import { useVideoDialog } from '../hooks/useVideoDialog';
import VideoViewDialog from '../components/VideoViewDialog';

import { useVideoSearch } from '../hooks/useVideoSearch';
import { videoService } from '../services/videoService';
const VideosPage: React.FC = () => {
  // Removed unused: const { t } = useTranslation();
  const {
    allVideos,
    filteredVideos,
    setFilteredVideos,
    loading,
    loadVideos,
  } = useVideos();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useVideoSearch(allVideos);
  const dialog = useVideoDialog();
  const videoToFormData = (video: Video) => ({
    name: video.name || '',
    filename: video.filename || '',
    coverImageFilename: video.coverImageFilename || '',
    coverImageFile: null,
    description: video.description || '',
    sizeBytes: video.sizeBytes || 0,
    tags: video.tags || '',
    lang: video.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: video.displayOrder || 0,
    isActive: !!video.isActive,
    uploadMethod: 'file' as const,
    file: null,
  });

  // Removed unused: const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);
  // Removed unused: const handlers = useVideoHandlers({ ... });
  // action menu items are created where needed (useVideoActionMenu can be used by table if required)

  const handleSearchFieldChange = (field: keyof VideoSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredVideos(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredVideos(allVideos);
  };

  const handleApiSearch = async () => {
    const params: VideoQueryParams = {};
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
    await loadVideos(params);
  };

  const handleCreate = () => {
    // reset form data before opening create dialog
    dialog.setFormData(getEmptyVideoFormData());
    dialog.setSelectedVideo(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <VideoPageHeader
        onCreateVideo={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <VideoSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading ? (
        <VideoTableSkeleton rows={5} />
      ) : (
        <VideoTable
          images={filteredVideos}
          loading={loading}
          onImageAction={(video: Video, action: string) => {
            if (action === 'view') {
              dialog.setSelectedVideo(video);
              dialog.setFormData(videoToFormData(video));
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedVideo(video);
              dialog.setFormData(videoToFormData(video));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              // placeholder for delete: you can wire a delete dialog or handler here
              return;
            }
          }}
          onCopyFilename={(video: Video) => navigator.clipboard.writeText(video.filename || '')}
          onCopyThumbnail={(video: Video) => navigator.clipboard.writeText(video.coverImageFilename || '')}
        />
      )}

      {/* Render the Create Video dialog when actionType is 'create' */}
      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <VideoCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyVideoFormData())}
          loading={dialog.loading}
        />
      )}
      {/* Render the View Video dialog when actionType is 'view' */}
      {dialog.actionType === 'view' && dialog.selectedVideo && (
        <VideoViewDialog
          open={dialog.dialogOpen}
          video={dialog.selectedVideo}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}
      {/* Render the Edit Video dialog when actionType is 'edit' */}
      {dialog.actionType === 'edit' && dialog.selectedVideo && (
        <VideoEditDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData(prev => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async (useFormData?: boolean) => {
            if (!dialog.selectedVideo) return;
            try {
              dialog.setLoading(true);
              // If caller requests FormData (e.g., cover image present) use multipart update
              if (useFormData) {
                await videoService.updateVideoWithFiles(dialog.selectedVideo.id, dialog.formData as any);
              } else {
                await videoService.updateVideo(dialog.selectedVideo.id, dialog.formData as any);
              }
              // refresh list after update
              await loadVideos();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              // set basic form error
              dialog.setFormErrors({ general: (err as any)?.message || 'Failed to update video' });
            }
          }}
          loading={dialog.loading}
          formErrors={dialog.formErrors}
        />
      )}
    </Box>
  );
};

export default VideosPage;
