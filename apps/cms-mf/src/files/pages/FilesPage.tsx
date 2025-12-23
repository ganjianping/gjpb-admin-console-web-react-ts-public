import React, { useState } from 'react';
import type { CmsFile, FileSearchFormData } from '../types/file.types';
import type { FileQueryParams } from '../services/fileService';
import { Box, Snackbar, Alert, Collapse } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FilePageHeader from '../components/FilePageHeader';
import FileSearchPanel from '../components/FileSearchPanel';
import FileTable from '../components/FileTable';
import FileDialog from '../components/FileDialog';
import DeleteFileDialog from '../components/DeleteFileDialog';
import FileTableSkeleton from '../components/FileTableSkeleton';
import { useFiles } from '../hooks/useFiles';
import { useFileDialog } from '../hooks/useFileDialog';
import { getEmptyFileFormData } from '../utils/getEmptyFileFormData';
import { useFileHandlers } from '../hooks/useFileHandlers';
import { useFileSearch } from '../hooks/useFileSearch';
import { useFileActionMenu } from '../hooks/useFileActionMenu';

const FilesPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    allFiles,
    filteredFiles,
    setFilteredFiles,
    pagination,
    loading,
    error,
    loadFiles,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
  } = useFiles();
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    applyClientSideFiltersWithData,
  } = useFileSearch(allFiles);
  const dialog = useFileDialog();
  // helper to convert API File -> FileFormData
  const fileToFormData = (file: CmsFile) => ({
    name: file.name || '',
    originalUrl: file.originalUrl || '',
    sourceName: file.sourceName || '',
    filename: file.filename || '',
    extension: file.extension || '',
    mimeType: file.mimeType || '',
    sizeBytes: file.sizeBytes || 0,
    tags: file.tags || '',
    lang: file.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: file.displayOrder || 0,
    isActive: !!file.isActive,
    uploadMethod: 'url' as const,
    file: null,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CmsFile | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'success' });
  const handlers = useFileHandlers({
    onSuccess: (msg) => {
      setSnackbar({ open: true, message: msg, severity: 'success' });
      // reset form values to initial defaults so next create starts fresh
      dialog.setFormData(getEmptyFileFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
      dialog.setDialogOpen(false);
      setDeleteDialogOpen(false);
      loadFiles();
    },
    onError: (msg) => {
      setSnackbar({ open: true, message: msg, severity: 'error' });
    },
    onRefresh: () => { loadFiles(); },
  });
  const actionMenuItems = useFileActionMenu({
    onView: (file) => {
      dialog.setSelectedFile(file);
      dialog.setFormData(fileToFormData(file));
      dialog.setActionType('view');
      dialog.setDialogOpen(true);
    },
    onEdit: (file) => {
      dialog.setSelectedFile(file);
      dialog.setFormData(fileToFormData(file));
      dialog.setActionType('edit');
      dialog.setDialogOpen(true);
    },
    onDelete: (file: CmsFile) => {
      setDeleteTarget(file);
      setDeleteDialogOpen(true);
    },
    onCopyFilename: (file) => {
      navigator.clipboard.writeText(file.filename);
      setSnackbar({ open: true, message: t('files.messages.filenameCopied'), severity: 'info' });
    },
    onCopyUrl: (file) => {
      const urlToCopy = file.originalUrl || file.filename || '';
      if (urlToCopy) {
        navigator.clipboard.writeText(urlToCopy);
        setSnackbar({ open: true, message: t('files.messages.urlCopied'), severity: 'info' });
      }
    },
  });

  // Listen for programmatic edit requests dispatched from the view dialog
  React.useEffect(() => {
    const handler = (ev: Event) => {
      try {
        const custom = ev as CustomEvent;
        const file = custom.detail as CmsFile;
        if (file && file.id) {
          dialog.setSelectedFile(file);
          dialog.setFormData(fileToFormData(file));
          dialog.setActionType('edit');
          dialog.setDialogOpen(true);
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('file-edit', handler as EventListener);
    return () => window.removeEventListener('file-edit', handler as EventListener);
  }, [dialog]);

  const handleSearchFieldChange = (field: keyof FileSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredFiles(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredFiles(allFiles);
  };

  const buildSearchParams = () => {
    const params: FileQueryParams = {};
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
    await loadFiles(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadFiles(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadFiles(params, 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setSelectedFile(null);
    dialog.setFormData(getEmptyFileFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (deleteTarget?.id) {
      await handlers.deleteFile(deleteTarget.id);
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <FilePageHeader
        onCreateFile={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <FileSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>
      {loading && !filteredFiles.length ? (
        <FileTableSkeleton rows={5} />
      ) : (
        <FileTable
          files={filteredFiles}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onFileAction={(file, action) => {
            if (action === 'view') actionMenuItems[0].action(file);
            if (action === 'edit') actionMenuItems[1].action(file);
            if (action === 'delete') actionMenuItems[4].action(file);
          }}
          onCopyFilename={actionMenuItems[2].action}
          onCopyUrl={actionMenuItems[3].action}
        />
      )}
      <FileDialog
        open={dialog.dialogOpen}
        onClose={() => {
          // reset form and related dialog state when user closes/cancels the dialog
          dialog.setFormData(getEmptyFileFormData(dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'));
          dialog.setFormErrors({});
          dialog.setSelectedFile(null);
          dialog.setActionType('view');
          dialog.setDialogOpen(false);
        }}
        actionType={dialog.actionType}
        formData={dialog.formData}
        selectedFile={dialog.selectedFile}
        onFormChange={(field, value) => dialog.setFormData({ ...dialog.formData, [field]: value })}
        onSubmit={async () => {
          try {
            dialog.setLoading(true);
            if (dialog.actionType === 'create') {
              await handlers.createFile(dialog.formData);
            } else if (dialog.actionType === 'edit' && dialog.selectedFile) {
              // Build a shallow diff: only include fields that changed compared to original file
              const original = fileToFormData(dialog.selectedFile);
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
                delete (changed as any).uploadMethod;
                delete (changed as any).file;
                await handlers.updateFile(dialog.selectedFile.id, changed as any);
              }
            }
          } finally {
            dialog.setLoading(false);
          }
        }}
        loading={dialog.loading}
        formErrors={dialog.formErrors}
      />
      <DeleteFileDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        file={deleteTarget}
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

export default FilesPage;
