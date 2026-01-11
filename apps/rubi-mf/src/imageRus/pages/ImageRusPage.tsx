import React, { useState } from 'react';
import type { ImageRu, ImageRuSearchFormData } from '../types/imageRu.types';
import type { ImageRuQueryParams } from '../services/imageRuService';
import { Box, Snackbar, Alert, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ImageRuPageHeader from '../components/ImageRuPageHeader';
import ImageRuSearchPanel from '../components/ImageRuSearchPanel';
import ImageRuTable from '../components/ImageRuTable';
import ImageRuDialog from '../components/ImageRuDialog';
import DeleteImageRuDialog from '../components/DeleteImageRuDialog';
import ImageRuTableSkeleton from '../components/ImageRuTableSkeleton';
import { useImageRus } from '../hooks/useImageRus';
import { useImageRuDialog } from '../hooks/useImageRuDialog';
import { getEmptyImageRuFormData } from '../utils/getEmptyImageRuFormData';
import { useImageRuHandlers } from '../hooks/useImageRuHandlers';
import { useImageRuSearch } from '../hooks/useImageRuSearch';
import { useImageRuActionMenu } from '../hooks/useImageRuActionMenu';

const ImageRusPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    allImageRus,
    filteredImageRus,
    setFilteredImageRus,
    pagination,
    loading,
    error,
    loadImageRus,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
  } = useImageRus();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useImageRuSearch(allImageRus);
  const dialog = useImageRuDialog();
  // helper to convert API ImageRu -> ImageRuFormData
  const imageRuToFormData = (imageRu: ImageRu) => ({
    name: imageRu.name || '',
    originalUrl: imageRu.originalUrl || '',
    sourceName: imageRu.sourceName || '',
    filename: imageRu.filename || '',
    thumbnailFilename: imageRu.thumbnailFilename || '',
    extension: imageRu.extension || '',
    mimeType: imageRu.mimeType || '',
    sizeBytes: imageRu.sizeBytes || 0,
    width: imageRu.width || 0,
    height: imageRu.height || 0,
    altText: imageRu.altText || '',
    tags: imageRu.tags || '',
    lang: imageRu.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: imageRu.displayOrder || 0,
    isActive: !!imageRu.isActive,
    uploadMethod: 'url' as const,
    file: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ImageRu | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const handlers = useImageRuHandlers({
    onSuccess: (msg) => {
      setSnackbar({ open: true, message: msg, severity: 'success' });
      // reset form values to initial defaults so next create starts fresh
      dialog.setFormData(getEmptyImageRuFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
      dialog.setDialogOpen(false);
      setDeleteDialogOpen(false);
      loadImageRus();
    },
    onError: (msg) => {
      setSnackbar({ open: true, message: msg, severity: 'error' });
    },
    onRefresh: () => { loadImageRus(); },
  });
  const actionMenuItems = useImageRuActionMenu({
    onView: (imageRu) => {
      dialog.setSelectedImageRu(imageRu);
      // populate form data from the selected imageRu so view shows consistent values
      dialog.setFormData(imageRuToFormData(imageRu));
      dialog.setActionType('view');
      dialog.setDialogOpen(true);
    },
    onEdit: (imageRu) => {
      dialog.setSelectedImageRu(imageRu);
      // populate form data so edit dialog shows current values
      dialog.setFormData(imageRuToFormData(imageRu));
      dialog.setActionType('edit');
      dialog.setDialogOpen(true);
    },
    onDelete: (imageRu: ImageRu) => {
      setDeleteTarget(imageRu);
      setDeleteDialogOpen(true);
    },
    onCopyFilename: (imageRu) => {
      navigator.clipboard.writeText(imageRu.filename);
      setSnackbar({ open: true, message: t('imageRus.messages.filenameCopied'), severity: 'info' });
    },
    onCopyThumbnail: (imageRu) => {
      navigator.clipboard.writeText(imageRu.thumbnailFilename || '');
      setSnackbar({ open: true, message: t('imageRus.messages.thumbnailFilenameCopied'), severity: 'info' });
    },
  });

  // Listen for programmatic edit requests dispatched from the view dialog
  // (ImageRuDialog currently dispatches a CustomEvent('imageRu-edit') after closing view)
  React.useEffect(() => {
    const handler = (ev: Event) => {
      try {
        const custom = ev as CustomEvent;
        const imageRu = custom.detail as ImageRu;
        if (imageRu && imageRu.id) {
          dialog.setSelectedImageRu(imageRu);
          dialog.setFormData(imageRuToFormData(imageRu));
          dialog.setActionType('edit');
          dialog.setDialogOpen(true);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('imageRu-edit', handler as EventListener);
    return () => window.removeEventListener('imageRu-edit', handler as EventListener);
  }, [dialog]);

  const handleSearchFieldChange = (field: keyof ImageRuSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredImageRus(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredImageRus(allImageRus);
  };

  const buildSearchParams = () => {
    const params: ImageRuQueryParams = {};
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
    await loadImageRus(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadImageRus(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadImageRus(params, 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setSelectedImageRu(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (deleteTarget?.id) {
      await handlers.deleteImageRu(deleteTarget.id);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <ImageRuPageHeader
        onCreateImageRu={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <ImageRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading && !filteredImageRus.length ? (
        <ImageRuTableSkeleton rows={5} />
      ) : (
        <ImageRuTable
          imageRus={filteredImageRus}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onImageRuAction={(imageRu, action) => {
            if (action === 'view') actionMenuItems[0].action(imageRu);
            if (action === 'edit') actionMenuItems[1].action(imageRu);
            if (action === 'delete') actionMenuItems[4].action(imageRu);
          }}
          onCopyFilename={actionMenuItems[2].action}
          onCopyThumbnail={actionMenuItems[3].action}
        />
      )}
      <ImageRuDialog
        open={dialog.dialogOpen}
        onClose={() => {
          // reset form and related dialog state when user closes/cancels the dialog
          dialog.setFormData(getEmptyImageRuFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
          dialog.setFormErrors({});
          dialog.setSelectedImageRu(null);
          dialog.setActionType('view');
          dialog.setDialogOpen(false);
        }}
        actionType={dialog.actionType}
        formData={dialog.formData}
        selectedImageRu={dialog.selectedImageRu}
        onFormChange={(field, value) => dialog.setFormData({ ...dialog.formData, [field]: value })}
        onSubmit={async () => {
          try {
            dialog.setLoading(true);
            if (dialog.actionType === 'create') {
              await handlers.createImageRu(dialog.formData);
            } else if (dialog.actionType === 'edit' && dialog.selectedImageRu) {
              // Build a shallow diff: only include fields that changed compared to original image
              const original = imageRuToFormData(dialog.selectedImageRu);
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
                await handlers.updateImageRu(dialog.selectedImageRu.id, changed as any);
              }
            }
          } finally {
            dialog.setLoading(false);
          }
        }}
        loading={dialog.loading}
        formErrors={dialog.formErrors}
      />
      <DeleteImageRuDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        imageRu={deleteTarget}
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

export default ImageRusPage;
