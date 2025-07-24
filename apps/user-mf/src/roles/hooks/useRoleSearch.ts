import { useState, useCallback, useEffect, useRef } from 'react';
import type { Role, RoleSearchFormData } from '../types/role.types';
import { roleService, type Role as ApiRole } from '../services/roleService';

// Transform API role to UI role
const transformApiRoleToUIRole = (apiRole: ApiRole): Role => {
  return {
    id: apiRole.id,
    code: apiRole.code,
    name: apiRole.name,
    description: apiRole.description,
    sortOrder: apiRole.sortOrder,
    level: apiRole.level,
    parentRoleId: apiRole.parentRoleId,
    systemRole: apiRole.systemRole,
    status: apiRole.active ? 'active' : 'inactive',
    createdAt: apiRole.createdAt,
    updatedAt: apiRole.updatedAt,
    createdBy: apiRole.createdBy,
    updatedBy: apiRole.updatedBy,
    children: [],
    expanded: false,
    hasChildren: false,
  };
};

// Build hierarchical tree structure from flat role list
const buildRoleTree = (roles: Role[]): Role[] => {
  const roleMap = new Map<string, Role>();
  const rootRoles: Role[] = [];

  // Create a map of all roles and initialize children arrays
  roles.forEach(role => {
    role.children = [];
    role.hasChildren = false;
    roleMap.set(role.id, role);
  });

  // Build the tree structure
  roles.forEach(role => {
    if (role.parentRoleId && roleMap.has(role.parentRoleId)) {
      const parent = roleMap.get(role.parentRoleId)!;
      parent.children!.push(role);
      parent.hasChildren = true;
    } else {
      rootRoles.push(role);
    }
  });

  // Sort children by sortOrder
  const sortChildren = (role: Role) => {
    if (role.children && role.children.length > 0) {
      role.children.sort((a, b) => a.sortOrder - b.sortOrder);
      role.children.forEach(sortChildren);
    }
  };

  rootRoles.forEach(sortChildren);
  return rootRoles.sort((a, b) => a.sortOrder - b.sortOrder);
};

// Flatten tree structure for table display based on expanded state
const flattenRolesForDisplay = (roles: Role[], level: number = 0): Role[] => {
  const result: Role[] = [];
  
  roles.forEach(role => {
    // Set the display level for proper indentation
    const roleWithDisplayLevel = { ...role, displayLevel: level };
    result.push(roleWithDisplayLevel);
    
    // Add children if role is expanded and has children
    if (role.expanded && role.children && role.children.length > 0) {
      const childrenFlat = flattenRolesForDisplay(role.children, level + 1);
      result.push(...childrenFlat);
    }
  });
  
  return result;
};

// Mock data for development (fallback)
const mockRoles: Role[] = [
  {
    id: '1',
    code: 'ADMIN',
    name: 'System Administrator',
    description: 'Full system administrator with all permissions',
    sortOrder: 1,
    level: 1,
    parentRoleId: null,
    systemRole: true,
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    createdBy: null,
    updatedBy: null,
  },
  {
    id: '2',
    code: 'MANAGER',
    name: 'Team Manager',
    description: 'Team manager with user management permissions',
    sortOrder: 2,
    level: 2,
    parentRoleId: '1',
    systemRole: false,
    status: 'active',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
    createdBy: '1',
    updatedBy: '1',
  },
  {
    id: '3',
    code: 'EDITOR',
    name: 'Content Editor',
    description: 'Content editor with content management permissions',
    sortOrder: 3,
    level: 3,
    parentRoleId: '2',
    systemRole: false,
    status: 'active',
    createdAt: '2024-03-01T14:20:00Z',
    updatedAt: '2024-03-01T14:20:00Z',
    createdBy: '1',
    updatedBy: '2',
  },
  {
    id: '4',
    code: 'USER',
    name: 'Basic User',
    description: 'Basic user with read-only permissions',
    sortOrder: 4,
    level: 4,
    parentRoleId: '3',
    systemRole: false,
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    createdBy: '1',
    updatedBy: '1',
  },
  {
    id: '5',
    code: 'ANALYST',
    name: 'Data Analyst',
    description: 'Data analyst with reporting permissions',
    sortOrder: 5,
    level: 3,
    parentRoleId: '2',
    systemRole: false,
    status: 'inactive',
    createdAt: '2024-04-05T11:15:00Z',
    updatedAt: '2024-04-05T11:15:00Z',
    createdBy: '1',
    updatedBy: '2',
  },
];

export const useRoleSearch = () => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesTree, setRolesTree] = useState<Role[]>([]);
  const [displayRoles, setDisplayRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchFormData, setSearchFormData] = useState<RoleSearchFormData>({
    name: '',
    status: '',
  });

  // Use ref to track initialization and prevent duplicate calls
  const initRef = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearchPanelToggle = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  const handleSearchFormChange = (field: keyof RoleSearchFormData, value: any) => {
    setSearchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle expand/collapse for a role
  const toggleRoleExpand = useCallback((roleId: string) => {
    const updateExpanded = (rolesList: Role[]): Role[] => {
      return rolesList.map(role => {
        if (role.id === roleId) {
          return { ...role, expanded: !role.expanded };
        }
        if (role.children && role.children.length > 0) {
          return { ...role, children: updateExpanded(role.children) };
        }
        return role;
      });
    };

    const updatedTree = updateExpanded(rolesTree);
    setRolesTree(updatedTree);
    const flattenedDisplay = flattenRolesForDisplay(updatedTree);
    setDisplayRoles(flattenedDisplay);
    setRoles(flattenedDisplay); // Update the main roles state for the table
  }, [rolesTree]);

  // Load initial roles with pagination
  const loadRoles = useCallback(async (page: number = 0) => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    setLoading(true);
    try {
      const response = await roleService.getRoles({
        page,
        size: pageSize,
        sort: 'name',
        direction: 'asc'
      });
      if (response.status.code === 200) {
        const transformedRoles = response.data.map(transformApiRoleToUIRole);
        const tree = buildRoleTree(transformedRoles);
        setRolesTree(tree);
        const flattened = flattenRolesForDisplay(tree);
        setDisplayRoles(flattened);
        setRoles(flattened);
        setCurrentPage(page);
        // Note: Update with actual pagination info from API response if available
        setTotalElements(transformedRoles.length);
        setTotalPages(Math.ceil(transformedRoles.length / pageSize));
      }
    } catch (error) {
      console.error('Failed to load roles:', error);
      // Fallback to mock data for development with pagination
      const tree = buildRoleTree(mockRoles);
      setRolesTree(tree);
      const flattened = flattenRolesForDisplay(tree);
      setDisplayRoles(flattened);
      setRoles(flattened);
      setCurrentPage(page);
      setTotalElements(mockRoles.length);
      setTotalPages(Math.ceil(mockRoles.length / pageSize));
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // API search function with pagination
  const handleSearch = useCallback(async (page: number = currentPage) => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    setLoading(true);
    try {
      // Build search parameters with pagination
      const searchParams: any = {
        page,
        size: pageSize,
        sort: 'name',
        direction: 'asc'
      };
      
      if (searchFormData.name?.trim()) {
        searchParams.name = searchFormData.name.trim();
      }
      
      if (searchFormData.status) {
        searchParams.active = searchFormData.status === 'active';
      }

      if (searchFormData.systemRole !== undefined) {
        searchParams.systemRole = searchFormData.systemRole;
      }

      // Call API
      const response = await roleService.getRoles(searchParams);
      if (response.status.code === 200) {
        const transformedRoles = response.data.map(transformApiRoleToUIRole);
        const tree = buildRoleTree(transformedRoles);
        setRolesTree(tree);
        const flattened = flattenRolesForDisplay(tree);
        setDisplayRoles(flattened);
        setRoles(flattened);
        setCurrentPage(page);
        // Note: API might return pagination info, update accordingly
        setTotalElements(transformedRoles.length);
        setTotalPages(Math.ceil(transformedRoles.length / pageSize));
      }
    } catch (error) {
      console.error('Failed to search roles:', error);
      // Fallback to mock data filtered by search criteria
      let filteredMockRoles = [...mockRoles];
      
      if (searchFormData.name?.trim()) {
        filteredMockRoles = filteredMockRoles.filter(role => 
          role.name.toLowerCase().includes(searchFormData.name.toLowerCase()) ||
          role.code.toLowerCase().includes(searchFormData.name.toLowerCase())
        );
      }
      
      if (searchFormData.status) {
        filteredMockRoles = filteredMockRoles.filter(role => 
          role.status === searchFormData.status
        );
      }

      if (searchFormData.systemRole !== undefined) {
        filteredMockRoles = filteredMockRoles.filter(role => 
          role.systemRole === searchFormData.systemRole
        );
      }
      
      const tree = buildRoleTree(filteredMockRoles);
      setRolesTree(tree);
      const flattened = flattenRolesForDisplay(tree);
      setDisplayRoles(flattened);
      setRoles(flattened);
      setCurrentPage(page);
      setTotalElements(filteredMockRoles.length);
      setTotalPages(Math.ceil(filteredMockRoles.length / pageSize));
    } finally {
      setLoading(false);
    }
  }, [searchFormData, currentPage, pageSize]);

  // Clear search and reload all roles
  const handleClearSearch = useCallback(async () => {
    setSearchFormData({
      name: '',
      status: '',
    });
    
    setCurrentPage(0);
    await loadRoles(0);
  }, [loadRoles]);

  // Page change handlers
  const handlePageChange = useCallback(async (page: number) => {
    await loadRoles(page);
  }, [loadRoles]);

  const handlePageSizeChange = useCallback(async (newPageSize: number) => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    setPageSize(newPageSize);
    setCurrentPage(0);
    // Reload with new page size
    setLoading(true);
    try {
      const response = await roleService.getRoles({
        page: 0,
        size: newPageSize,
        sort: 'name',
        direction: 'asc'
      });
      if (response.status.code === 200) {
        const transformedRoles = response.data.map(transformApiRoleToUIRole);
        const tree = buildRoleTree(transformedRoles);
        setRolesTree(tree);
        const flattened = flattenRolesForDisplay(tree);
        setDisplayRoles(flattened);
        setRoles(flattened);
        setCurrentPage(0);
        setTotalElements(transformedRoles.length);
        setTotalPages(Math.ceil(transformedRoles.length / newPageSize));
      }
    } catch (error) {
      console.error('Failed to load roles with new page size:', error);
      // Fallback to mock data
      const tree = buildRoleTree(mockRoles);
      setRolesTree(tree);
      const flattened = flattenRolesForDisplay(tree);
      setDisplayRoles(flattened);
      setRoles(flattened);
      setCurrentPage(0);
      setTotalElements(mockRoles.length);
      setTotalPages(Math.ceil(mockRoles.length / newPageSize));
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize with API call on component mount
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      loadRoles(0);
    }
  }, []); // Only run once on mount

  return {
    roles,
    rolesTree,
    displayRoles,
    loading,
    searchPanelOpen,
    searchFormData,
    // Pagination state
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    // Handlers
    handleSearchPanelToggle,
    handleSearchFormChange,
    handleSearch,
    handleClearSearch,
    handlePageChange,
    handlePageSizeChange,
    loadRoles,
    // Hierarchical functionality
    toggleRoleExpand,
  };
};
