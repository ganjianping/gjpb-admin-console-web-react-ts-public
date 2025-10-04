import { Box, Alert, Collapse, Card, CardContent, useTheme } from '@mui/material';

// Components
import {
  AuditLogPageHeader,
  AuditLogSearchPanel,
  AuditLogTable,
  AuditLogDetailModal,
} from '../components';

// Hooks
import {
  useAuditLogs,
  useAuditLogSearch,
  useAuditLogDetail,
} from '../hooks';

const AuditLogPage = () => {
  const theme = useTheme();
  
  // Initialize audit logs data management
  const {
    auditLogs,
    loading,
    error,
    currentPage,
    pageSize,
    loadAuditLogs,
    handlePageChange,
    handlePageSizeChange,
  } = useAuditLogs();

  // Initialize search functionality
  const {
    searchPanelExpanded,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleClearSearch,
    getActiveFiltersCount,
    buildSearchParams,
  } = useAuditLogSearch();

  // Initialize detail modal
  const {
    selectedLog,
    detailModalOpen,
    handleViewDetail,
    handleCloseDetail,
  } = useAuditLogDetail();

  // Handle search
  const handleSearch = () => {
    const searchParams = buildSearchParams();
    console.log('🔍 Applying search filters:', searchParams);
    loadAuditLogs(searchParams, 0, pageSize);
  };

  // Handle clear all filters
  const handleClearAll = () => {
    handleClearSearch();
    setTimeout(() => {
      loadAuditLogs(undefined, 0, pageSize);
    }, 100);
  };

  // Handle key press for search
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    const searchParams = buildSearchParams();
    loadAuditLogs(searchParams, currentPage, pageSize);
  };

  // Handle page change - call API with new page
  const handlePageChangeWithSearch = (newPage: number) => {
    handlePageChange(newPage);
    const searchParams = buildSearchParams();
    loadAuditLogs(searchParams, newPage, pageSize);
  };

  // Handle page size change - call API with new page size
  const handlePageSizeChangeWithSearch = (newPageSize: number) => {
    handlePageSizeChange(newPageSize);
    const searchParams = buildSearchParams();
    loadAuditLogs(searchParams, 0, newPageSize);
  };

  return (
    <Box sx={{ minHeight: '100vh', mt: 3 }}>
      {/* Header */}
      <AuditLogPageHeader
        searchPanelExpanded={searchPanelExpanded}
        activeFiltersCount={getActiveFiltersCount()}
        loading={loading}
        onToggleSearchPanel={handleSearchPanelToggle}
        onRefresh={handleRefresh}
      />

      {/* Search Panel */}
      <Collapse in={searchPanelExpanded}>
        <AuditLogSearchPanel
          searchFormData={searchFormData}
          loading={loading}
          activeFiltersCount={getActiveFiltersCount()}
          onFormChange={handleSearchFormChange}
          onSearch={handleSearch}
          onClear={handleClearAll}
          onKeyPress={handleKeyPress}
        />
      </Collapse>

      {/* Error handling */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Audit Logs Table */}
      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          border: '2px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.06)',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(18, 18, 18, 0.9) 0%, rgba(32, 32, 32, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <CardContent>
          <AuditLogTable
            data={auditLogs?.content || []}
            loading={loading}
            totalPages={auditLogs?.totalPages || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            totalRows={auditLogs?.totalElements || 0}
            onPageChange={handlePageChangeWithSearch}
            onPageSizeChange={handlePageSizeChangeWithSearch}
            onRowDoubleClick={handleViewDetail}
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <AuditLogDetailModal
        open={detailModalOpen}
        log={selectedLog}
        onClose={handleCloseDetail}
      />
    </Box>
  );
};

export default AuditLogPage;
