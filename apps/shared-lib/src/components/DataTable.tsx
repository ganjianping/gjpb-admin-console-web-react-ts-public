import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
} from '@mui/material';
import { Search, MoreVertical } from 'lucide-react';

export type DataTableProps<T> = {
  data: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  showSearch?: boolean;
  showSelection?: boolean;
  showPagination?: boolean;
  rowsPerPageOptions?: number[];
  defaultSort?: SortingState;
  searchPlaceholder?: string;
  elevation?: number;
  actionMenuItems?: {
    label: string;
    icon?: React.ReactNode;
    action: (row: T) => void;
    divider?: boolean;
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  }[];
  // External pagination props
  manualPagination?: boolean;
  pageCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  onRowDoubleClick,
  showSearch = true,
  showSelection = false,
  showPagination = true,
  rowsPerPageOptions = [10, 20, 50, 100],
  defaultSort,
  searchPlaceholder = 'Search...',
  elevation = 0,
  actionMenuItems,
  // External pagination props
  manualPagination = false,
  pageCount,
  currentPage = 0,
  pageSize = 10,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: Readonly<DataTableProps<T>>) {
  // State
  const [sorting, setSorting] = useState<SortingState>(defaultSort || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  // Memoized columns with selection if needed
  const tableColumns = useMemo(() => {
    const finalColumns = [...columns];
    
    // Add selection column if needed
    if (showSelection) {
      finalColumns.unshift({
        id: 'selection',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 40,
      });
    }
    
    // Add actions column if needed
    if (actionMenuItems) {
      finalColumns.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row.original);
              setMenuAnchorEl(e.currentTarget);
            }}
            size="small"
          >
            <MoreVertical size={16} />
          </IconButton>
        ),
        size: 40,
      });
    }
    
    return finalColumns;
  }, [columns, showSelection, actionMenuItems]);

  // Create table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      ...(manualPagination && {
        pagination: {
          pageIndex: currentPage,
          pageSize: pageSize,
        },
      }),
    },
    enableRowSelection: showSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(manualPagination && {
      manualPagination: true,
      pageCount: pageCount ?? Math.ceil((totalRows ?? 0) / pageSize),
      onPaginationChange: (updater) => {
        if (typeof updater === 'function') {
          const newState = updater({ pageIndex: currentPage, pageSize });
          if (newState.pageIndex !== currentPage && onPageChange) {
            onPageChange(newState.pageIndex);
          }
          if (newState.pageSize !== pageSize && onPageSizeChange) {
            onPageSizeChange(newState.pageSize);
          }
        }
      },
    }),
  });

  // Handle menu close
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedRow(null);
  };

  // Handle action menu item click
  const handleActionClick = (action: (row: T) => void) => {
    if (selectedRow) {
      action(selectedRow);
    }
    handleMenuClose();
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Search bar */}
      {showSearch && (
        <Box sx={{ mb: 2, maxWidth: 500 }}>
          <TextField
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>
      )}

      {/* Actions menu */}
      {actionMenuItems && (
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {actionMenuItems.map((item, index) => (
            <div key={index}>
              {item.divider && <Divider sx={{ my: 1 }} />}
              <MenuItem onClick={() => handleActionClick(item.action)}>
                {item.icon && (
                  <ListItemIcon sx={{ color: item.color ? `${item.color}.main` : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    color: item.color ? `${item.color}.main` : 'inherit',
                  }}
                />
              </MenuItem>
            </div>
          ))}
        </Menu>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={elevation}
        sx={{
          borderRadius: 1,
          border: elevation === 0 ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        <Table sx={{ width: '100%' }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    sx={{
                      width: header.getSize(),
                      fontWeight: 600,
                      backgroundColor: 'background.neutral',
                      pl: header.id === 'selection' ? 1 : 2,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <TableSortLabel
                            active={!!header.column.getIsSorted()}
                            direction={header.column.getIsSorted() || 'asc'}
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick && onRowClick(row.original)}
                  onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                  sx={{
                    cursor: onRowClick || onRowDoubleClick ? 'pointer' : 'default',
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        pl: cell.column.id === 'selection' ? 1 : 2,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {showPagination && table.getRowModel().rows.length > 0 && (
        <TablePagination
          component="div"
          rowsPerPageOptions={rowsPerPageOptions}
          count={manualPagination ? (totalRows ?? 0) : table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            if (manualPagination && onPageChange) {
              onPageChange(page);
            } else {
              table.setPageIndex(page);
            }
          }}
          onRowsPerPageChange={(e) => {
            const newPageSize = Number(e.target.value);
            if (manualPagination && onPageSizeChange) {
              onPageSizeChange(newPageSize);
            } else {
              table.setPageSize(newPageSize);
            }
          }}
          sx={{
            borderTop: 0,
          }}
        />
      )}
    </Box>
  );
}

// Export table-related components
// eslint-disable-next-line react-refresh/only-export-components
export { createColumnHelper } from '@tanstack/react-table';

// Utility functions
// eslint-disable-next-line react-refresh/only-export-components
export const createStatusChip = (
  status: string,
  statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }>
) => {
  const statusConfig = statusMap[status] || { label: status, color: 'default' };
  return (
    <Chip
      label={statusConfig.label}
      color={statusConfig.color}
      size="small"
      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
    />
  );
};
