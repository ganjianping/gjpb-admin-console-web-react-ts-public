import React, { useState } from 'react';
import type { Image, ImageSearchFormData } from '../types/image.types';
import type { ImageQueryParams } from '../services/imageService';
import { Box, Snackbar, Alert, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImagePageHeader from '../components/ImagePageHeader';
import ImageSearchPanel from '../components/ImageSearchPanel';
import ImageTable from '../components/ImageTable';
import ImageDialog from '../components/ImageDialog';
import DeleteImageDialog from '../components/DeleteImageDialog';
import ImageTableSkeleton from '../components/ImageTableSkeleton';
import { useImages } from '../hooks/useImages';
import { useImageDialog } from '../hooks/useImageDialog';
import { getEmptyImageFormData } from '../utils/getEmptyImageFormData';
import { useImageHandlers } from '../hooks/useImageHandlers';
import { useImageSearch } from '../hooks/useImageSearch';
import { useImageActionMenu } from '../hooks/useImageActionMenu';

const ImagesPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    allImages,
    filteredImages,
    setFilteredImages,
    loading,
    error,
    loadImages,
  } = useImages();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useImageSearch(allImages);
  const dialog = useImageDialog();
  // helper to convert API Image -> ImageFormData
  const imageToFormData = (image: Image) => ({
    name: image.name || '',
    originalUrl: image.originalUrl || '',
    sourceName: image.sourceName || '',
    filename: image.filename || '',
    thumbnailFilename: image.thumbnailFilename || '',
    extension: image.extension || '',
    mimeType: image.mimeType || '',
    sizeBytes: image.sizeBytes || 0,
    width: image.width || 0,
    height: image.height || 0,
    altText: image.altText || '',
    tags: image.tags || '',
    lang: image.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: image.displayOrder || 0,
    isActive: !!image.isActive,
    uploadMethod: 'url' as const,
    file: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Image | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const handlers = useImageHandlers({
    onSuccess: (msg) => {
      setSnackbar({ open: true, message: msg, severity: 'success' });
      // reset form values to initial defaults so next create starts fresh
      dialog.setFormData(getEmptyImageFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
      dialog.setDialogOpen(false);
      setDeleteDialogOpen(false);
      loadImages();
    },
    onError: (msg) => {
      setSnackbar({ open: true, message: msg, severity: 'error' });
    },
    onRefresh: () => { loadImages(); },
  });
  const actionMenuItems = useImageActionMenu({
    onView: (image) => {
      dialog.setSelectedImage(image);
      // populate form data from the selected image so view shows consistent values
      dialog.setFormData(imageToFormData(image));
      dialog.setActionType('view');
      dialog.setDialogOpen(true);
    },
    onEdit: (image) => {
      dialog.setSelectedImage(image);
      // populate form data so edit dialog shows current values
      dialog.setFormData(imageToFormData(image));
      dialog.setActionType('edit');
      dialog.setDialogOpen(true);
    },
    onDelete: (image: Image) => {
      setDeleteTarget(image);
      setDeleteDialogOpen(true);
    },
    onCopyFilename: (image) => {
      navigator.clipboard.writeText(image.filename);
      setSnackbar({ open: true, message: t('images.messages.filenameCopied'), severity: 'info' });
    },
    onCopyThumbnail: (image) => {
      navigator.clipboard.writeText(image.thumbnailFilename || '');
      setSnackbar({ open: true, message: t('images.messages.thumbnailFilenameCopied'), severity: 'info' });
    },
  });

  // Listen for programmatic edit requests dispatched from the view dialog
  // (ImageDialog currently dispatches a CustomEvent('image-edit') after closing view)
  React.useEffect(() => {
    const handler = (ev: Event) => {
      try {
        const custom = ev as CustomEvent;
        const image = custom.detail as Image;
        if (image && image.id) {
          dialog.setSelectedImage(image);
          dialog.setFormData(imageToFormData(image));
          dialog.setActionType('edit');
          dialog.setDialogOpen(true);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('image-edit', handler as EventListener);
    return () => window.removeEventListener('image-edit', handler as EventListener);
  }, [dialog]);

  const handleSearchFieldChange = (field: keyof ImageSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredImages(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredImages(allImages);
  };

  const handleApiSearch = async () => {
    const params: ImageQueryParams = {};
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
    await loadImages(params);
  };

  const handleCreate = () => {
    dialog.setSelectedImage(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (deleteTarget?.id) {
      await handlers.deleteImage(deleteTarget.id);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <ImagePageHeader
        onCreateImage={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <ImageSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading ? (
        <ImageTableSkeleton rows={5} />
      ) : (
        <ImageTable
          images={filteredImages}
          loading={loading}
          onImageAction={(image, action) => {
            if (action === 'view') actionMenuItems[0].action(image);
            if (action === 'edit') actionMenuItems[1].action(image);
            if (action === 'delete') actionMenuItems[4].action(image);
          }}
          onCopyFilename={actionMenuItems[2].action}
          onCopyThumbnail={actionMenuItems[3].action}
        />
      )}
      <ImageDialog
        open={dialog.dialogOpen}
        onClose={() => {
          // reset form and related dialog state when user closes/cancels the dialog
          dialog.setFormData(getEmptyImageFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
          dialog.setFormErrors({});
          dialog.setSelectedImage(null);
          dialog.setActionType('view');
          dialog.setDialogOpen(false);
        }}
        actionType={dialog.actionType}
        formData={dialog.formData}
        selectedImage={dialog.selectedImage}
        onFormChange={(field, value) => dialog.setFormData({ ...dialog.formData, [field]: value })}
        onSubmit={async () => {
          try {
            dialog.setLoading(true);
            if (dialog.actionType === 'create') {
              await handlers.createImage(dialog.formData);
            } else if (dialog.actionType === 'edit' && dialog.selectedImage) {
              // Build a shallow diff: only include fields that changed compared to original image
              const original = imageToFormData(dialog.selectedImage);
              const updated = dialog.formData;
              const changed: Partial<typeof updated> = {};
              Object.keys(updated).forEach((key) => {
                const k = key as keyof typeof updated;
                const origVal = (original as any)[k];
                const updVal = (updated as any)[k];
                // treat arrays/strings normally; if tags are comma-separated strings, compare trimmed
                if (typeof origVal === 'string' && typeof updVal === 'string') {
                  if ((origVal || '').trim() !== (updVal || '').trim()) (changed as any)[k] = updVal;
                } else if (origVal !== updVal) {
                  (changed as any)[k] = updVal;
                }
              });
              // If nothing changed, still call update with empty body to keep behavior (or skip)
              if (Object.keys(changed).length === 0) {
                // nothing changed, close dialog silently
                dialog.setDialogOpen(false);
              } else {
                await handlers.updateImage(dialog.selectedImage.id, changed as any);
              }
            }
          } finally {
            dialog.setLoading(false);
          }
        }}
        loading={dialog.loading}
        formErrors={dialog.formErrors}
      />
      <DeleteImageDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        image={deleteTarget}
        loading={loading}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default ImagesPage;
