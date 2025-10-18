import React from 'react';
import type { Video, VideoSearchFormData } from '../types/video.types';
import type { VideoQueryParams } from '../services/videoService';
import { Box, Collapse } from '@mui/material';
import VideoPageHeader from '../components/VideoPageHeader';
import VideoSearchPanel from '../components/VideoSearchPanel';
import VideoTable from '../components/VideoTable';
import VideoTableSkeleton from '../components/VideoTableSkeleton';

import { useVideos } from '../hooks/useVideos';
import { useVideoDialog } from '../hooks/useVideoDialog';
import VideoViewDialog from '../components/VideoViewDialog';

import { useVideoSearch } from '../hooks/useVideoSearch';
import { useVideoActionMenu } from '../hooks/useVideoActionMenu';
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
  const actionMenuItems = useVideoActionMenu({
    onView: (video) => {
      dialog.setSelectedVideo(video);
      dialog.setFormData(videoToFormData(video));
      dialog.setActionType('view');
      dialog.setDialogOpen(true);
    },
    onEdit: (video) => {
      dialog.setSelectedVideo(video);
      dialog.setFormData(videoToFormData(video));
      dialog.setActionType('edit');
      dialog.setDialogOpen(true);
    },
    onDelete: () => {
      // implement delete logic here if needed
    },
    onCopyFilename: (video) => {
      navigator.clipboard.writeText(video.filename || '');
    },
    onCopyThumbnail: (video) => {
      navigator.clipboard.writeText(video.coverImageFilename || '');
    },
  });

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
            if (action === 'view') actionMenuItems[0].action(video);
            if (action === 'edit') actionMenuItems[1].action(video);
            if (action === 'delete') actionMenuItems[4].action(video);
          }}
          onCopyFilename={actionMenuItems[2].action}
          onCopyThumbnail={actionMenuItems[3].action}
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
    </Box>
  );
};

export default VideosPage;
