import React from 'react';
import '../i18n/translations';
import type { ArticleRu, ArticleRuSearchFormData } from '../types/articleRu.types';
import type { ArticleRuQueryParams } from '../services/articleRuService';
import { Box, Collapse } from '@mui/material';
import ArticleRuPageHeader from '../components/ArticleRuPageHeader';
import ArticleRuSearchPanel from '../components/ArticleRuSearchPanel';
import ArticleRuTable from '../components/ArticleRuTable';
import DeleteArticleRuDialog from '../components/DeleteArticleRuDialog';
import ArticleRuCreateDialog from '../components/ArticleRuCreateDialog';
import ArticleRuEditDialog from '../components/ArticleRuEditDialog';
import ArticleRuViewDialog from '../components/ArticleRuViewDialog';
import ArticleRuTableSkeleton from '../components/ArticleRuTableSkeleton';
import { getEmptyArticleRuFormData } from '../utils/getEmptyArticleRuFormData';
import { useArticleRus } from '../hooks/useArticleRus';
import { useArticleRuDialog } from '../hooks/useArticleRuDialog';
import { useArticleRuSearch } from '../hooks/useArticleRuSearch';
import { articleRuService } from '../services/articleRuService';
import { getFullArticleRuCoverImageUrl } from '../utils/getFullArticleRuCoverImageUrl';

const ArticleRusPage: React.FC = () => {
  const { 
    allArticleRus, 
    filteredArticleRus, 
    setFilteredArticleRus, 
    pagination,
    loading, 
    pageSize,
    loadArticleRus,
    handlePageChange,
    handlePageSizeChange
  } = useArticleRus();
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData } =
    useArticleRuSearch(allArticleRus);
  const dialog = useArticleRuDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<ArticleRu | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const articleRuToFormData = (articleRu: ArticleRu) => ({
    title: articleRu.title || '',
    summary: articleRu.summary || '',
    content: articleRu.content || '',
    sourceName: articleRu.sourceName || '',
    originalUrl: articleRu.originalUrl || '',
    coverImageFilename: articleRu.coverImageFilename || '',
    coverImageOriginalUrl: articleRu.coverImageOriginalUrl || '',
    tags: articleRu.tags || '',
    lang: articleRu.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: articleRu.displayOrder ?? 0,
    isActive: Boolean(articleRu.isActive),
    coverImageFile: null,
  });

  const handleSearchFieldChange = (field: keyof ArticleRuSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredArticleRus(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredArticleRus(allArticleRus);
  };

  const buildSearchParams = () => {
    const params: ArticleRuQueryParams = {};
    if (searchFormData.title?.trim()) {
      params.title = searchFormData.title.trim();
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
    await loadArticleRus(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadArticleRus(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadArticleRus(params, 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyArticleRuFormData());
    dialog.setSelectedArticleRu(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  const computeCoverImageUrl = (articleRu: ArticleRu) => {
    if (articleRu.coverImageOriginalUrl) {
      return getFullArticleRuCoverImageUrl(articleRu.coverImageOriginalUrl);
    }
    if (articleRu.coverImageFilename) {
      return getFullArticleRuCoverImageUrl(`/cover-images/${articleRu.coverImageFilename}`);
    }
    return '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <ArticleRuPageHeader
        onCreateArticleRu={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <ArticleRuSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredArticleRus.length ? (
        <ArticleRuTableSkeleton />
      ) : (
        <ArticleRuTable
          articleRus={filteredArticleRus}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onArticleRuAction={(articleRu: ArticleRu, action: 'view' | 'edit' | 'delete') => {
            if (action === 'view') {
              dialog.setSelectedArticleRu(articleRu);
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedArticleRu(articleRu);
              dialog.setFormData(articleRuToFormData(articleRu));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(articleRu);
              return;
            }
          }}
          onCopyCoverImage={(articleRu: ArticleRu) => {
            const url = computeCoverImageUrl(articleRu);
            if (url) navigator.clipboard.writeText(url);
          }}
          onCopyOriginalUrl={(articleRu: ArticleRu) => {
            if (articleRu.originalUrl) navigator.clipboard.writeText(articleRu.originalUrl);
          }}
        />
      )}

      <DeleteArticleRuDialog
        open={!!deleteTarget}
        articleRu={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await articleRuService.deleteArticleRu(deleteTarget.id);
            await loadArticleRus();
            setDeleting(false);
            setDeleteTarget(null);
          } catch (err) {
            setDeleting(false);
            console.error('Failed to delete articleRu', err);
            setDeleteTarget(null);
          }
        }}
      />

      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <ArticleRuCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyArticleRuFormData())}
          onCreated={async () => {
            await loadArticleRus();
          }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedArticleRu && (
        <ArticleRuViewDialog
          open={dialog.dialogOpen}
          articleRu={dialog.selectedArticleRu}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      {dialog.actionType === 'edit' && dialog.selectedArticleRu && (
        <ArticleRuEditDialog
          open={dialog.dialogOpen}
          articleRuId={dialog.selectedArticleRu.id}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async (useFormData?: boolean) => {
            if (!dialog.selectedArticleRu) return;
            try {
              dialog.setLoading(true);
              if (useFormData) {
                await articleRuService.updateArticleRuWithFiles(dialog.selectedArticleRu.id, dialog.formData as any);
              } else {
                await articleRuService.updateArticleRu(dialog.selectedArticleRu.id, dialog.formData as any);
              }
              await loadArticleRus();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              console.error('Failed to update articleRu', err);
              throw err;
            }
          }}
          loading={dialog.loading}
        />
      )}
    </Box>
  );
};

export default ArticleRusPage;
