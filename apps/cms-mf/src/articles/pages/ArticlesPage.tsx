import React from 'react';
import '../i18n/translations';
import type { Article, ArticleSearchFormData } from '../types/article.types';
import type { ArticleQueryParams } from '../services/articleService';
import { Box, Collapse } from '@mui/material';
import ArticlePageHeader from '../components/ArticlePageHeader';
import ArticleSearchPanel from '../components/ArticleSearchPanel';
import ArticleTable from '../components/ArticleTable';
import DeleteArticleDialog from '../components/DeleteArticleDialog';
import ArticleCreateDialog from '../components/ArticleCreateDialog';
import ArticleEditDialog from '../components/ArticleEditDialog';
import ArticleViewDialog from '../components/ArticleViewDialog';
import ArticleTableSkeleton from '../components/ArticleTableSkeleton';
import { getEmptyArticleFormData } from '../utils/getEmptyArticleFormData';
import { useArticles } from '../hooks/useArticles';
import { useArticleDialog } from '../hooks/useArticleDialog';
import { useArticleSearch } from '../hooks/useArticleSearch';
import { articleService } from '../services/articleService';
import { getFullArticleCoverImageUrl } from '../utils/getFullArticleCoverImageUrl';

const ArticlesPage: React.FC = () => {
  const { 
    allArticles, 
    filteredArticles, 
    setFilteredArticles, 
    pagination,
    loading, 
    pageSize,
    loadArticles,
    handlePageChange,
    handlePageSizeChange
  } = useArticles();
  const { searchPanelOpen, searchFormData, handleSearchPanelToggle, handleSearchFormChange, handleClearSearch, applyClientSideFiltersWithData } =
    useArticleSearch(allArticles);
  const dialog = useArticleDialog();
  const [deleteTarget, setDeleteTarget] = React.useState<Article | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const articleToFormData = (article: Article) => ({
    title: article.title || '',
    summary: article.summary || '',
    content: article.content || '',
    sourceName: article.sourceName || '',
    originalUrl: article.originalUrl || '',
    coverImageFilename: article.coverImageFilename || '',
    coverImageOriginalUrl: article.coverImageOriginalUrl || '',
    tags: article.tags || '',
    lang: article.lang || (dialog.getCurrentLanguage ? dialog.getCurrentLanguage() : 'EN'),
    displayOrder: article.displayOrder ?? 0,
    isActive: Boolean(article.isActive),
    coverImageFile: null,
  });

  const handleSearchFieldChange = (field: keyof ArticleSearchFormData, value: any) => {
    const nextFormData = { ...searchFormData, [field]: value };
    setFilteredArticles(applyClientSideFiltersWithData(nextFormData));
    handleSearchFormChange(field, value);
  };

  const handleClearFilters = () => {
    handleClearSearch();
    setFilteredArticles(allArticles);
  };

  const buildSearchParams = () => {
    const params: ArticleQueryParams = {};
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
    await loadArticles(params, 0, pageSize);
  };

  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const params = buildSearchParams();
    loadArticles(params, newPage, pageSize);
  };

  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const params = buildSearchParams();
    loadArticles(params, 0, newPageSize);
  };

  const handleCreate = () => {
    dialog.setFormData(getEmptyArticleFormData());
    dialog.setSelectedArticle(null);
    dialog.setActionType('create');
    dialog.setDialogOpen(true);
  };

  const computeCoverImageUrl = (article: Article) => {
    if (article.coverImageOriginalUrl) {
      return getFullArticleCoverImageUrl(article.coverImageOriginalUrl);
    }
    if (article.coverImageFilename) {
      return getFullArticleCoverImageUrl(`/cover-images/${article.coverImageFilename}`);
    }
    return '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <ArticlePageHeader
        onCreateArticle={handleCreate}
        searchPanelOpen={searchPanelOpen}
        onToggleSearchPanel={handleSearchPanelToggle}
      />
      <Collapse in={searchPanelOpen}>
        <ArticleSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          onFormChange={handleSearchFieldChange}
          onSearch={handleApiSearch}
          onClear={handleClearFilters}
        />
      </Collapse>

      {loading && !filteredArticles.length ? (
        <ArticleTableSkeleton />
      ) : (
        <ArticleTable
          articles={filteredArticles}
          pagination={pagination}
          onPageChange={handlePageChangeWithSearch}
          onPageSizeChange={handlePageSizeChangeWithSearch}
          onArticleAction={(article: Article, action: 'view' | 'edit' | 'delete') => {
            if (action === 'view') {
              dialog.setSelectedArticle(article);
              dialog.setActionType('view');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'edit') {
              dialog.setSelectedArticle(article);
              dialog.setFormData(articleToFormData(article));
              dialog.setActionType('edit');
              dialog.setDialogOpen(true);
              return;
            }
            if (action === 'delete') {
              setDeleteTarget(article);
              return;
            }
          }}
          onCopyCoverImage={(article: Article) => {
            const url = computeCoverImageUrl(article);
            if (url) navigator.clipboard.writeText(url);
          }}
          onCopyOriginalUrl={(article: Article) => {
            if (article.originalUrl) navigator.clipboard.writeText(article.originalUrl);
          }}
        />
      )}

      <DeleteArticleDialog
        open={!!deleteTarget}
        article={deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            setDeleting(true);
            await articleService.deleteArticle(deleteTarget.id);
            await loadArticles();
            setDeleting(false);
            setDeleteTarget(null);
          } catch (err) {
            setDeleting(false);
            console.error('Failed to delete article', err);
            setDeleteTarget(null);
          }
        }}
      />

      {dialog.actionType === 'create' && dialog.dialogOpen && (
        <ArticleCreateDialog
          open={dialog.dialogOpen}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onReset={() => dialog.setFormData(getEmptyArticleFormData())}
          onCreated={async () => {
            await loadArticles();
          }}
          loading={dialog.loading}
        />
      )}

      {dialog.actionType === 'view' && dialog.selectedArticle && (
        <ArticleViewDialog
          open={dialog.dialogOpen}
          article={dialog.selectedArticle}
          onClose={() => dialog.setDialogOpen(false)}
        />
      )}

      {dialog.actionType === 'edit' && dialog.selectedArticle && (
        <ArticleEditDialog
          open={dialog.dialogOpen}
          articleId={dialog.selectedArticle.id}
          formData={dialog.formData}
          onFormChange={(field, value) => dialog.setFormData((prev) => ({ ...prev, [field]: value }))}
          onClose={() => dialog.setDialogOpen(false)}
          onSubmit={async (useFormData?: boolean) => {
            if (!dialog.selectedArticle) return;
            try {
              dialog.setLoading(true);
              if (useFormData) {
                await articleService.updateArticleWithFiles(dialog.selectedArticle.id, dialog.formData as any);
              } else {
                await articleService.updateArticle(dialog.selectedArticle.id, dialog.formData as any);
              }
              await loadArticles();
              dialog.setLoading(false);
              dialog.setDialogOpen(false);
            } catch (err) {
              dialog.setLoading(false);
              console.error('Failed to update article', err);
              throw err;
            }
          }}
          loading={dialog.loading}
        />
      )}
    </Box>
  );
};

export default ArticlesPage;
