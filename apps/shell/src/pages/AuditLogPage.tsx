import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Button,
  Card,
  CardContent,
  Alert,
  IconButton,
  useTheme,
  CircularProgress,
  Modal,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Filter,
  Eye,
  User,
  Activity,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
  CheckCircle,
  XCircle,
  Info,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Redux
import { useAppDispatch } from '../hooks/useRedux';
import { setPageTitle } from '../redux/slices/uiSlice';

// Services
import auditLogService, { 
  type AuditLogEntry, 
  type AuditLogQueryParams,
  type AuditLogData 
} from '../services/auditLogService';

// Shared components
import { DataTable, createColumnHelper } from '../../../shared-lib/src/components/DataTable';

// Firebase Analytics
import { trackPageView } from '../utils/firebaseAnalytics';

const AuditLogPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  useEffect(() => {
    dispatch(setPageTitle(t('auditLogs.title')));
  }, [dispatch, t]);

  // State management
  const [auditLogs, setAuditLogs] = useState<AuditLogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPanelExpanded, setSearchPanelExpanded] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  
  // Use ref to track if data has been loaded initially (like Users page)
  const hasInitiallyLoaded = useRef(false);

  // Pagination and filtering state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [httpMethodFilter, setHttpMethodFilter] = useState('');
  const [endpointFilter, setEndpointFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [ipAddressFilter, setIpAddressFilter] = useState('');
  const [responseTimeFilter, setResponseTimeFilter] = useState(''); // Response time filter in ms
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Column helper for DataTable
  const columnHelper = createColumnHelper<AuditLogEntry>();

  // Since we're using server-side pagination, we don't need frontend filtering
  // The API handles all filtering and pagination

  // Reset to first page when filters change (but not page/rowsPerPage)
  useEffect(() => {
    setPage(0);
  }, [searchQuery, endpointFilter, httpMethodFilter, resultFilter, ipAddressFilter, responseTimeFilter, startDate, endDate]);

  // Map result status to UI status for display
  const resultStatusMap = {
    SUCCESS: { label: 'Success', color: 'success' as const, textColor: '#1b5e20' },
    ERROR: { label: 'Error', color: 'error' as const, textColor: undefined },
  };

  // Define table columns
  const columns = [
    columnHelper.accessor('timestamp', {
      header: t('auditLogs.columns.dateTime'),
      cell: (info) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
            {format(parseISO(info.getValue()), 'MMM dd, yyyy')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {format(parseISO(info.getValue()), 'HH:mm:ss')}
          </Typography>
        </Box>
      ),
    }),
    columnHelper.accessor('endpoint', {
      header: t('auditLogs.columns.request'),
      cell: (info) => {
        const row = info.row.original;
        const method = row.httpMethod;
        const endpoint = info.getValue();
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
            <Chip 
              label={method} 
              size="small" 
              variant="outlined"
              color={
                method === 'GET' ? 'primary' :
                method === 'POST' ? 'success' :
                method === 'PUT' ? 'warning' : 
                method === 'DELETE' ? 'error' : 'default'
              }
              sx={{ 
                minWidth: 42, 
                height: 20,
                fontSize: '0.625rem',
                fontWeight: 600,
                '& .MuiChip-label': {
                  px: 0.5,
                  py: 0
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                fontSize: '0.875rem',
                fontWeight: 500,
                maxWidth: '320px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                lineHeight: 1.4
              }}
              title={endpoint || '-'}
            >
              {endpoint || '-'}
            </Typography>
          </Box>
        );
      },
    }),
    columnHelper.accessor('durationMs', {
      header: t('auditLogs.columns.responseTime'),
      cell: (info) => {
        const duration = info.getValue();
        if (!duration) return '-';
        
        const durationNum = Number(duration);
        let color: string;
        
        // Color coding for response times
        if (durationNum > 2000) {
          color = '#d32f2f'; // Red for > 2s
        } else if (durationNum > 1000) {
          color = '#f57c00'; // Orange for > 1s
        } else if (durationNum > 500) {
          color = '#1976d2'; // Blue for > 500ms
        } else {
          color = '#2e7d32'; // Green for <= 500ms
        }
        
        return (
          <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
            {duration}ms
          </Typography>
        );
      },
    }),
    columnHelper.accessor('result', {
      header: t('auditLogs.columns.result'),
      cell: (info) => {
        const result = info.getValue();
        const resultStr = String(result || '').toLowerCase();
        
        // Check for success patterns
        const isSuccess = result === 'SUCCESS' || 
                         resultStr.includes('success') ||
                         resultStr.includes('successful');
        
        // Check for error/failure patterns
        const isError = result === 'ERROR' || 
                       resultStr.includes('error') ||
                       resultStr.includes('fail') ||
                       resultStr.includes('failed');
        
        if (isSuccess) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle size={16} style={{ color: '#2e7d32' }} />
              <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                Success
              </Typography>
            </Box>
          );
        } else if (isError) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <XCircle size={16} style={{ color: '#d32f2f' }} />
              <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                Failed
              </Typography>
            </Box>
          );
        } else {
          // For unknown status, show as chip with original logic
          const statusConfig = resultStatusMap[result as keyof typeof resultStatusMap];
          return (
            <Chip 
              label={statusConfig?.label || String(result)}
              size="small"
              color={statusConfig?.color || 'default'}
              sx={{ 
                fontWeight: 500,
              }}
            />
          );
        }
      },
    }),
    columnHelper.accessor('username', {
      header: t('auditLogs.columns.username'),
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={16} />
          <span>{info.getValue() || 'System'}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('ipAddress', {
      header: t('auditLogs.columns.ipAddress'),
      cell: (info) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'monospace',
            fontSize: '0.813rem'
          }}
        >
          {info.getValue() || '-'}
        </Typography>
      ),
    }),
  ];

  // Fetch audit logs - similar pattern to Users page
  const fetchAuditLogsInternal = async (searchParams?: {
    username?: string;
    endpoint?: string;
    httpMethod?: string;
    result?: string;
    ipAddress?: string;
    minDurationMs?: number;
    startDate?: string;
    endDate?: string;
  }, customPageSize?: number, customPage?: number) => {
    try {
      setLoading(true);
      setError(null);

      const params: AuditLogQueryParams = {
        page: customPage ?? page, // Use custom page if provided
        size: customPageSize ?? rowsPerPage, // Use custom page size if provided
        sort: 'timestamp,desc',
      };

      // Add search parameters if provided
      if (searchParams?.username) {
        params.username = searchParams.username;
      }
      if (searchParams?.endpoint) {
        params.endpoint = searchParams.endpoint;
      }
      if (searchParams?.httpMethod) {
        params.httpMethod = searchParams.httpMethod;
      }
      if (searchParams?.result) {
        params.result = searchParams.result;
      }
      if (searchParams?.ipAddress) {
        params.ipAddress = searchParams.ipAddress;
      }
      if (searchParams?.minDurationMs) {
        params.minDurationMs = searchParams.minDurationMs;
      }
      if (searchParams?.startDate) {
        params.startDate = searchParams.startDate;
      }
      if (searchParams?.endDate) {
        params.endDate = searchParams.endDate;
      }

      console.log('🔍 Fetching audit logs with params:', params);
      const response = await auditLogService.getAuditLogs(params);
      
      if (response.status.code === 200) {
        // Use the data directly from backend with correct totalElements and totalPages
        setAuditLogs(response.data);
        console.log('✅ Audit logs loaded successfully:', response.data);
        console.log('🔢 Backend pagination values:', {
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          size: response.data.size,
          number: response.data.number
        });
      } else {
        throw new Error(response.status.message || 'Failed to fetch audit logs');
      }
    } catch (err: any) {
      console.error('❌ Error fetching audit logs:', err);
      setError(err.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };



  // Load audit logs only once on initial mount (like Users page)
  useEffect(() => {
    if (!hasInitiallyLoaded.current) {
      hasInitiallyLoaded.current = true;
      dispatch(setPageTitle(t('auditLogs.title')));
      trackPageView(t('auditLogs.title'), t('auditLogs.title'));
      fetchAuditLogsInternal();
    }
  }, []); // NO dependencies - only run once on mount

  // Handle pagination change - call API with new page
  const handlePageChange = (newPage: number) => {
    console.log('📄 Page changed to:', newPage);
    setPage(newPage);
    
    // Call API with current filters and new page
    const currentFilters = {
      username: searchQuery.trim() || undefined,
      endpoint: endpointFilter.trim() || undefined,
      httpMethod: httpMethodFilter || undefined,
      result: resultFilter.trim() || undefined,
      ipAddress: ipAddressFilter.trim() || undefined,
      minDurationMs: responseTimeFilter.trim() ? parseInt(responseTimeFilter.trim()) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, value]) => value !== undefined)
    );
    
    fetchAuditLogsInternal(cleanParams, rowsPerPage, newPage);
  };

  // Handle page size change - call API with new page size
  const handlePageSizeChange = (newPageSize: number) => {
    console.log('📏 Page size changed to:', newPageSize);
    setRowsPerPage(newPageSize);
    setPage(0); // Reset to first page when changing page size
    
    // Call API with current filters and new page size
    const currentFilters = {
      username: searchQuery.trim() || undefined,
      endpoint: endpointFilter.trim() || undefined,
      httpMethod: httpMethodFilter || undefined,
      result: resultFilter.trim() || undefined,
      ipAddress: ipAddressFilter.trim() || undefined,
      minDurationMs: responseTimeFilter.trim() ? parseInt(responseTimeFilter.trim()) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(currentFilters).filter(([_, value]) => value !== undefined)
    );
    
    fetchAuditLogsInternal(cleanParams, newPageSize, 0); // Always start from first page
  };

  // Handle search and filters - API search on button click
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    
    // Call API with ALL current filter values
    const searchParams = {
      username: searchQuery.trim() || undefined,
      endpoint: endpointFilter.trim() || undefined,
      httpMethod: httpMethodFilter || undefined,
      result: resultFilter.trim() || undefined,
      ipAddress: ipAddressFilter.trim() || undefined,
      minDurationMs: responseTimeFilter.trim() ? parseInt(responseTimeFilter.trim()) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
    
    console.log('🔍 Applying search filters:', cleanParams);
    fetchAuditLogsInternal(cleanParams);
  };

  const handleClearAll = () => {
    clearFilters();
    // Automatically trigger search after clearing filters
    setTimeout(() => {
      fetchAuditLogsInternal();
    }, 100);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setEndpointFilter('');
    setResultFilter('');
    setIpAddressFilter('');
    setResponseTimeFilter('');
    setHttpMethodFilter('');
    setStartDate('');
    setEndDate('');
    setPage(0);
    // Since we're using server-side pagination, call API to get fresh data without filters
    fetchAuditLogsInternal();
  };

  // Filter handlers - update state only (no real-time API calls)
  const handleEndpointFilterChange = (value: string) => {
    setEndpointFilter(value);
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value);
  };

  const handleIpAddressFilterChange = (value: string) => {
    setIpAddressFilter(value);
  };

  const handleResponseTimeFilterChange = (value: string) => {
    setResponseTimeFilter(value);
  };

  const handleHttpMethodFilterChange = (value: string) => {
    setHttpMethodFilter(value);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
  };

  // Handle row double click to show details
  const handleRowDoubleClick = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setDetailModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedLog(null);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      mt: 3,
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 700,
            }}
          >
            {t('auditLogs.title')}
          </Typography>
          
          {/* Search Panel Toggle Button */}
          <Box
            onClick={() => setSearchPanelExpanded(!searchPanelExpanded)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              py: 1,
              px: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: searchPanelExpanded ? 'primary.main' : 'rgba(25, 118, 210, 0.3)',
              backgroundColor: searchPanelExpanded 
                ? 'rgba(25, 118, 210, 0.08)' 
                : theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                borderColor: 'primary.main',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
              },
            }}
          >
            <Search size={18} style={{ color: theme.palette.primary.main }} />
            {(() => {
              const activeFilters = [
                searchQuery,
                endpointFilter,
                resultFilter,
                ipAddressFilter,
                responseTimeFilter,
                httpMethodFilter,
                startDate,
                endDate
              ].filter(Boolean).length;
              
              return activeFilters > 0 ? (
                <Box
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    ml: 0.5
                  }}
                >
                  {activeFilters}
                </Box>
              ) : null;
            })()}
            {searchPanelExpanded ? (
              <ChevronUp size={18} style={{ color: theme.palette.primary.main }} />
            ) : (
              <ChevronDown size={18} style={{ color: theme.palette.primary.main }} />
            )}
          </Box>
        </Box>
      </Box>

      {/* Enhanced Search Panel */}
      {searchPanelExpanded && (
        <Card 
          sx={{ 
            mb: 3,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(25, 118, 210, 0.1)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Filter size={20} style={{ color: theme.palette.primary.main }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                  }}
                >
                  {t('common.searchFilters')}
                </Typography>
                <Tooltip 
                  title={t('auditLogs.smartFilteringTooltip')}
                  placement="top"
                  arrow
                >
                  <IconButton size="small" sx={{ ml: 0.5 }}>
                    <Info size={16} style={{ color: theme.palette.primary.main, opacity: 0.7 }} />
                  </IconButton>
                </Tooltip>
                {(() => {
                  const activeFilters = [
                    searchQuery,
                    endpointFilter,
                    resultFilter,
                    ipAddressFilter,
                    responseTimeFilter,
                    httpMethodFilter,
                    startDate,
                    endDate
                  ].filter(Boolean).length;
                  
                  return activeFilters > 0 ? (
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        ml: 1
                      }}
                    >
                      {activeFilters} {t('auditLogs.active')}
                    </Typography>
                  ) : null;
                })()}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {(() => {
                  const hasActiveFilters = [
                    searchQuery,
                    endpointFilter,
                    resultFilter,
                    ipAddressFilter,
                    responseTimeFilter,
                    httpMethodFilter,
                    startDate,
                    endDate
                  ].filter(Boolean).length > 0;
                  
                  return hasActiveFilters ? (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleClearAll}
                      startIcon={<X size={14} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: 'warning.main',
                        color: 'warning.main',
                        '&:hover': {
                          borderColor: 'warning.dark',
                          backgroundColor: 'warning.light',
                        },
                      }}
                    >
                      {t('common.clearAll')}
                    </Button>
                  ) : null;
                })()}
                
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSearch}
                  startIcon={<Search size={16} />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 3,
                    color: 'white',
                    '&:hover': {
                      color: 'white',
                    },
                  }}
                >
                  {t('common.search')}
                </Button>

                <IconButton
                  onClick={() => {
                    // Force reload by calling the fetch function directly
                    fetchAuditLogsInternal();
                  }}
                  disabled={loading}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                  }}
                >
                  <RefreshCw 
                    size={16} 
                    style={{ 
                      animation: loading ? 'spin 1s linear infinite' : undefined 
                    }} 
                  />
                </IconButton>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: 2, 
              mt: 2,
            }}>
              {/* Search by username */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  {t('auditLogs.columns.username')}
                </Typography>
                <TextField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  size="small"
                  fullWidth
                  placeholder={t('auditLogs.filters.searchByUsername')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={16} style={{ opacity: 0.6 }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>

              {/* Endpoint filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  {t('auditLogs.columns.endpoint')}
                </Typography>
                <TextField
                  value={endpointFilter}
                  onChange={(e) => handleEndpointFilterChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="small"
                  fullWidth
                  placeholder={t('auditLogs.filters.endpoint')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} style={{ opacity: 0.6 }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>

              {/* HTTP Method filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  {t('auditLogs.filters.httpMethod')}
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={httpMethodFilter}
                    onChange={(e) => handleHttpMethodFilterChange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">{t('auditLogs.methods.all', 'All Methods')}</MenuItem>
                    <MenuItem value="GET">{t('auditLogs.methods.get')}</MenuItem>
                    <MenuItem value="POST">{t('auditLogs.methods.post')}</MenuItem>
                    <MenuItem value="PUT">{t('auditLogs.methods.put')}</MenuItem>
                    <MenuItem value="DELETE">{t('auditLogs.methods.delete')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Result filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  {t('auditLogs.columns.result')}
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={resultFilter}
                    onChange={(e) => handleResultFilterChange(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <Activity size={16} style={{ opacity: 0.6 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">{t('auditLogs.status.all', 'All Results')}</MenuItem>
                    <MenuItem value="SUCCESS">{t('auditLogs.status.success')}</MenuItem>
                    <MenuItem value="FAILED">{t('auditLogs.status.failed')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* IP Address filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  {t('auditLogs.columns.ipAddress')}
                </Typography>
                <TextField
                  value={ipAddressFilter}
                  onChange={(e) => handleIpAddressFilterChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="small"
                  fullWidth
                  placeholder={t('auditLogs.filters.ipAddress')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={16} style={{ opacity: 0.6 }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>

              {/* Response Time filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  {t('auditLogs.filters.responseTime')}
                </Typography>
                <TextField
                  value={responseTimeFilter}
                  onChange={(e) => handleResponseTimeFilterChange(e.target.value)}
                  onKeyDown={handleKeyPress}
                  size="small"
                  fullWidth
                  type="number"
                  placeholder={t('auditLogs.filters.responseTime')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Activity size={16} style={{ opacity: 0.6 }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>

              {/* Start Date filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  Start Date
                </Typography>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size={16} style={{ opacity: 0.6 }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>

              {/* End Date filter */}
              <Box>
                <Typography 
                  component="label" 
                  sx={{ 
                    fontWeight: 500,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    mb: 0.8,
                    display: 'block',
                  }}
                >
                  End Date
                </Typography>
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size={16} style={{ opacity: 0.6 }} />
                        </InputAdornment>
                      ),
                    }
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Error handling */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Audit Logs Table with DataTable for Sorting */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card 
          sx={{ 
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(18, 18, 18, 0.9)' 
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.12)' 
              : 'rgba(25, 118, 210, 0.1)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                '& .MuiTableHead-root': {
                  backgroundColor: 'background.default',
                },
                '& .MuiTableHead-root .MuiTableCell-head': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                  borderBottom: `2px solid ${theme.palette.divider}`,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                },
                '& .MuiTableHead-root .MuiTableCell-head:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                },
              }}
            >
              <DataTable
                data={auditLogs?.content || []}
                columns={columns}
                showSearch={false}
                onRowDoubleClick={handleRowDoubleClick}
                manualPagination={true}
                pageCount={auditLogs?.totalPages || 0}
                currentPage={page}
                pageSize={rowsPerPage}
                totalRows={auditLogs?.totalElements || 0}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                rowsPerPageOptions={[10, 20, 50, 100]}
                actionMenuItems={[
                  { 
                    label: t('auditLogs.viewDetails'), 
                    icon: <Eye size={16} />, 
                    action: (log: AuditLogEntry) => {
                      handleRowDoubleClick(log);
                    }
                  },
                ]}
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Audit Log Details Modal */}
      <Modal
        open={detailModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="audit-log-details-title"
        aria-describedby="audit-log-details-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90vw', sm: '80vw', md: '70vw', lg: '60vw' },
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
          }}
        >
          {selectedLog && (
            <>
              {/* Modal Header */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  id="audit-log-details-title"
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 600 }}
                >
                  {t('auditLogs.details.title')}
                </Typography>
                <IconButton
                  onClick={handleCloseModal}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <X size={24} />
                </IconButton>
              </Box>

              {/* Modal Content */}
              <Box sx={{ p: 3 }}>
                {/* Audit Log Details - Only Specified Fields */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.id')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.id}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.userId')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.userId || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.username')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.username || 'System'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.httpMethod')}
                    </Typography>
                    <Chip 
                      label={selectedLog.httpMethod} 
                      size="small" 
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.endpoint')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.endpoint || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.requestId')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.requestId || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.result')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.result || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.statusCode')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.statusCode}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.errorMessage')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.errorMessage || 'null'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.ipAddress')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.ipAddress || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.sessionId')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.sessionId || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.duration')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.durationMs || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.timestamp')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {format(parseISO(selectedLog.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {t('auditLogs.details.userAgent')}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.userAgent || '-'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AuditLogPage;