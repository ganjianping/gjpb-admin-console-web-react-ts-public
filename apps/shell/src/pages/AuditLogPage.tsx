import { useState, useEffect, useRef } from 'react';
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
  Divider,
} from '@mui/material';
import {
  Search,
  Filter,
  Eye,
  Clock,
  User,
  Globe,
  Activity,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
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
  const dispatch = useAppDispatch();
  const theme = useTheme();

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Column helper for DataTable
  const columnHelper = createColumnHelper<AuditLogEntry>();

  // Map result status to UI status for display
  const resultStatusMap = {
    SUCCESS: { label: 'Success', color: 'success' as const, textColor: '#1b5e20' },
    ERROR: { label: 'Error', color: 'error' as const, textColor: undefined },
  };

  // Define table columns
  const columns = [
    columnHelper.accessor('timestamp', {
      header: 'Timestamp',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock size={16} />
          <span>{format(parseISO(info.getValue()), 'MMM dd, yyyy HH:mm:ss')}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('username', {
      header: 'Username',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={16} />
          <span>{info.getValue() || 'System'}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('httpMethod', {
      header: 'HTTP Method',
      cell: (info) => (
        <Chip 
          label={info.getValue()} 
          size="small" 
          variant="outlined"
          sx={{ minWidth: 60, fontSize: '0.75rem' }}
        />
      ),
    }),
    columnHelper.accessor('endpoint', {
      header: 'Endpoint',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Globe size={16} />
          <span>{info.getValue() || '-'}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('result', {
      header: 'Result',
      cell: (info) => {
        const result = info.getValue();
        const statusConfig = resultStatusMap[result];
        const customTextColor = result === 'SUCCESS' ? '#1b5e20' : undefined;
        return (
          <Chip 
            label={statusConfig?.label || result}
            size="small"
            color={statusConfig?.color || 'default'}
            sx={{ 
              fontWeight: 500,
              ...(customTextColor && {
                color: customTextColor,
                '& .MuiChip-label': {
                  color: customTextColor,
                }
              })
            }}
          />
        );
      },
    }),
    columnHelper.accessor('ipAddress', {
      header: 'IP Address',
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('durationMs', {
      header: 'Duration (ms)',
      cell: (info) => {
        const duration = info.getValue();
        return duration ? `${duration}ms` : '-';
      },
    }),
  ];

  // Fetch audit logs - similar pattern to Users page
  const fetchAuditLogsInternal = async (searchParams?: {
    username?: string;
    result?: string;
    httpMethod?: string;
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

      // Add search parameters if provided (only those supported by the API)
      if (searchParams?.username) {
        params.username = searchParams.username;
      }
      if (searchParams?.result) {
        // Only pass to API if it's a valid enum value
        if (searchParams.result === 'SUCCESS' || searchParams.result === 'ERROR') {
          params.result = searchParams.result;
        }
      }
      if (searchParams?.httpMethod) {
        params.httpMethod = searchParams.httpMethod;
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
        setAuditLogs(response.data);
        console.log('✅ Audit logs loaded successfully:', response.data);
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
      dispatch(setPageTitle('Audit Logs'));
      trackPageView('Audit Logs', 'Audit Logs');
      fetchAuditLogsInternal();
    }
  }, []); // NO dependencies - only run once on mount

  // Handle pagination change for DataTable - call API
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    
    // Call API to get data for the new page
    const searchParams = {
      username: searchQuery.trim() || undefined,
      result: resultFilter.trim() || undefined,
      httpMethod: httpMethodFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
    
    fetchAuditLogsInternal(cleanParams);
  };

  // Handle page size change for DataTable - refresh data from API
  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setPage(0);
    
    // Call API to refresh data with current filter values and new page size
    const searchParams = {
      username: searchQuery.trim() || undefined,
      result: resultFilter.trim() || undefined,
      httpMethod: httpMethodFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
    
    // Pass the new page size directly to the fetch function
    fetchAuditLogsInternal(cleanParams, newPageSize, 0);
  };

  // Handle search and filters - API search on button click
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    setPage(0); // Reset to first page when searching
    
    // Call API with current filter values (only those supported by API)
    const searchParams = {
      username: searchQuery.trim() || undefined,
      result: resultFilter.trim() || undefined,
      httpMethod: httpMethodFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
    
    fetchAuditLogsInternal(cleanParams);
  };

  const handleClearAll = () => {
    clearFilters();
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
    setHttpMethodFilter('');
    setStartDate('');
    setEndDate('');
    setPage(0);
    // Don't call API - just clear the form fields
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
            Audit Logs
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
              backgroundColor: searchPanelExpanded ? 'rgba(25, 118, 210, 0.08)' : 'rgba(255, 255, 255, 0.8)',
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
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                fontSize: '0.875rem',
              }}
            >
              {searchPanelExpanded ? 'Hide Filters' : 'Show Filters'}
            </Typography>
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'rgba(25, 118, 210, 0.1)',
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
                  Search Filters
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearAll}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Clear All
                </Button>
                
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
                  Search
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
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
              mt: 1,
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
                  Username
                </Typography>
                <TextField
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  size="small"
                  fullWidth
                  placeholder="Enter username..."
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
                  Endpoint
                </Typography>
                <TextField
                  value={endpointFilter}
                  onChange={(e) => handleEndpointFilterChange(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Enter endpoint..."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Globe size={16} style={{ opacity: 0.6 }} />
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
                  HTTP Method
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={httpMethodFilter}
                    onChange={(e) => handleHttpMethodFilterChange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All Methods</MenuItem>
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                    <MenuItem value="PUT">PUT</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
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
                  Result
                </Typography>
                <TextField
                  value={resultFilter}
                  onChange={(e) => handleResultFilterChange(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Enter result..."
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
                  IP Address
                </Typography>
                <TextField
                  value={ipAddressFilter}
                  onChange={(e) => handleIpAddressFilterChange(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="Enter IP address..."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Globe size={16} style={{ opacity: 0.6 }} />
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'rgba(25, 118, 210, 0.1)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
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
                  label: 'View Details', 
                  icon: <Eye size={16} />, 
                  action: (log: AuditLogEntry) => {
                    handleRowDoubleClick(log);
                  }
                },
              ]}
            />
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
                  Audit Log Details
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
                      ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.id}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      User ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.userId || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Username
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.username || 'System'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      HTTP Method
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
                      Endpoint
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.endpoint || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Request ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
                      {selectedLog.requestId || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Result
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.result || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Status Code
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.statusCode}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Error Message
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.errorMessage || 'null'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      IP Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.ipAddress || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Session ID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.sessionId || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Duration (ms)
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {selectedLog.durationMs || '-'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Timestamp
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {format(parseISO(selectedLog.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      User Agent
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