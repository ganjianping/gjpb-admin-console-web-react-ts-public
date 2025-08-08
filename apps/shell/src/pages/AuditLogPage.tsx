import { useState, useEffect, useMemo, useRef } from 'react';
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
  
  // Use ref to track if data has been loaded initially (like Users page)
  const hasInitiallyLoaded = useRef(false);

  // Pagination and filtering state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState('');
  const [httpMethodFilter, setHttpMethodFilter] = useState('');

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
      header: 'User',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <User size={16} />
          <span>{info.getValue() || 'System'}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Activity size={16} />
          <span>{info.getValue()}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('resourceType', {
      header: 'Resource',
      cell: (info) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Globe size={16} />
          <span>{info.getValue()}</span>
        </Box>
      ),
    }),
    columnHelper.accessor('httpMethod', {
      header: 'Method',
      cell: (info) => (
        <Chip 
          label={info.getValue()} 
          size="small" 
          variant="outlined"
          sx={{ minWidth: 60, fontSize: '0.75rem' }}
        />
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
  ];

  // Client-side filtering logic - real-time filtering as user types/selects
  const filteredLogs = useMemo(() => {
    if (!auditLogs?.content) return [];

    return auditLogs.content.filter((log) => {
      const username = log.username || '';
      
      // Filter by username (search query)
      if (searchQuery.trim()) {
        const searchLower = searchQuery.toLowerCase();
        if (!username.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filter by action
      if (actionFilter && log.action !== actionFilter) {
        return false;
      }

      // Filter by result
      if (resultFilter && log.result !== resultFilter) {
        return false;
      }

      // Filter by resource type
      if (resourceTypeFilter && log.resourceType !== resourceTypeFilter) {
        return false;
      }

      // Filter by HTTP method
      if (httpMethodFilter && log.httpMethod !== httpMethodFilter) {
        return false;
      }

      return true;
    });
  }, [auditLogs?.content, searchQuery, actionFilter, resultFilter, resourceTypeFilter, httpMethodFilter]);

  // Fetch audit logs - similar pattern to Users page
  const fetchAuditLogsInternal = async (searchParams?: {
    username?: string;
    action?: string;
    result?: 'SUCCESS' | 'ERROR';
    resourceType?: string;
    httpMethod?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const params: AuditLogQueryParams = {
        page: 0,
        size: 1000,
        sort: 'timestamp,desc',
      };

      // Add search parameters if provided
      if (searchParams?.username) {
        params.username = searchParams.username;
      }
      if (searchParams?.action) {
        params.action = searchParams.action;
      }
      if (searchParams?.result) {
        params.result = searchParams.result;
      }
      if (searchParams?.resourceType) {
        params.resourceType = searchParams.resourceType;
      }
      if (searchParams?.httpMethod) {
        params.httpMethod = searchParams.httpMethod;
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

  // Handle pagination change for DataTable (client-side)
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle page size change for DataTable (client-side)
  const handlePageSizeChange = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setPage(0);
  };

  // Handle search and filters - real-time client-side filtering + API search on button click
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page when filtering
  };

  const handleSearch = () => {
    // Call API with current filter values
    const searchParams = {
      username: searchQuery.trim() || undefined,
      action: actionFilter || undefined,
      result: (resultFilter as 'SUCCESS' | 'ERROR') || undefined,
      resourceType: resourceTypeFilter || undefined,
      httpMethod: httpMethodFilter || undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value !== undefined)
    );
    
    fetchAuditLogsInternal(cleanParams);
    setPage(0);
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
    setActionFilter('');
    setResultFilter('');
    setResourceTypeFilter('');
    setHttpMethodFilter('');
    setPage(0);
    // Don't call API - just clear the form fields
  };

  // Filter handlers - real-time client-side filtering + API search on button click
  const handleActionFilterChange = (value: string) => {
    setActionFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleResultFilterChange = (value: string) => {
    setResultFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleResourceTypeFilterChange = (value: string) => {
    setResourceTypeFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleHttpMethodFilterChange = (value: string) => {
    setHttpMethodFilter(value);
    setPage(0); // Reset to first page when filtering
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

              {/* Action filter */}
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
                  Action
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={actionFilter}
                    onChange={(e) => handleActionFilterChange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All Actions</MenuItem>
                    <MenuItem value="CREATE">CREATE</MenuItem>
                    <MenuItem value="UPDATE">UPDATE</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
                    <MenuItem value="READ">READ</MenuItem>
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
                <FormControl size="small" fullWidth>
                  <Select
                    value={resultFilter}
                    onChange={(e) => handleResultFilterChange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All Results</MenuItem>
                    <MenuItem value="SUCCESS">Success</MenuItem>
                    <MenuItem value="ERROR">Error</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Resource Type filter */}
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
                  Resource Type
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={resourceTypeFilter}
                    onChange={(e) => handleResourceTypeFilterChange(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All Resources</MenuItem>
                    <MenuItem value="Authentication">Authentication</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                    <MenuItem value="Role">Role</MenuItem>
                    <MenuItem value="System">System</MenuItem>
                  </Select>
                </FormControl>
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
              data={filteredLogs}
              columns={columns}
              showSearch={false}
              onRowDoubleClick={(log: AuditLogEntry) => {
                console.log('Row double clicked:', log);
              }}
              manualPagination={false}
              pageCount={Math.ceil(filteredLogs.length / rowsPerPage)}
              currentPage={page}
              pageSize={rowsPerPage}
              totalRows={filteredLogs.length}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              actionMenuItems={[
                { 
                  label: 'View Details', 
                  icon: <Eye size={16} />, 
                  action: (log: AuditLogEntry) => {
                    console.log('View details for log:', log);
                  }
                },
              ]}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AuditLogPage;