# Users Module

## Overview

The Users module provides a comprehensive interface for managing user accounts in the application. It follows modern React patterns with clean separation of concerns, type safety, and internationalization support.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete users
- ✅ **Advanced Search**: Client-side and server-side filtering
- ✅ **Pagination**: Efficient data loading with customizable page sizes
- ✅ **Role Management**: Assign and manage user roles
- ✅ **Account Status**: Manage user account status (active, locked, suspended, pending)
- ✅ **Validation**: Comprehensive client-side and server-side validation
- ✅ **Internationalization**: Full English/Chinese translation support
- ✅ **Type Safety**: Complete TypeScript coverage
- ✅ **Error Handling**: Field-level and global error handling
- ✅ **Performance Optimized**: Memoization and efficient re-rendering
- ✅ **Notification System**: Integrated success/error notifications

## Architecture

### Directory Structure

```
users/
├── components/          # UI components
│   ├── UserDialog.tsx
│   ├── UserPageHeader.tsx
│   ├── UserSearchPanel.tsx
│   ├── UserTable.tsx
│   ├── UsersPageSkeleton.tsx
│   ├── DeleteUserDialog.tsx
│   ├── NotificationSnackbar.tsx
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useUsers.ts                    # Data fetching & pagination
│   ├── useUserSearch.ts               # Search functionality
│   ├── useUserDialog.ts               # Dialog UI state
│   ├── useUserHandlers.ts             # Business logic (CRUD)
│   ├── useUserActionMenu.tsx          # Action menu configuration
│   └── index.ts
├── pages/              # Page components
│   ├── UsersPage.tsx
│   └── index.ts
├── services/           # API services
│   └── userService.ts
├── types/              # TypeScript definitions
│   └── user.types.ts
├── constants/          # Constants & configuration
│   └── index.ts
├── i18n/               # Internationalization
│   └── translations.ts
├── utils/              # Utility functions
│   ├── error-handler.ts
│   └── index.ts
└── README.md           # This file
```

### Design Patterns

#### Separation of Concerns

The module follows a clean architecture pattern:

1. **UI Components** (`components/`) - Pure presentation logic
2. **UI State Hooks** (`useUserDialog`) - Dialog state management
3. **Business Logic Hooks** (`useUserHandlers`) - CRUD operations
4. **Data Hooks** (`useUsers`, `useUserSearch`) - Data fetching
5. **Service Layer** (`services/`) - API communication

#### Hook Composition

```tsx
// In UsersPage.tsx
const UsersPage = () => {
  // Data management
  const {
    allUsers,
    filteredUsers,
    pagination,
    loading,
    loadUsers,
  } = useUsers();

  // Search functionality
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearchFormChange,
  } = useUserSearch(allUsers);

  // Dialog UI state
  const {
    dialogOpen,
    formData,
    formErrors,
    handleCreate,
    handleEdit,
    handleSave,
  } = useUserDialog();

  // Business logic is handled internally by useUserDialog
  // which delegates to useUserHandlers
};
```

## Hooks Reference

### useUsers

Manages user data fetching, pagination, and state.

```tsx
const {
  allUsers,           // All loaded users
  filteredUsers,      // Filtered users based on search
  setFilteredUsers,   // Function to update filtered users
  pagination,         // Pagination metadata
  loading,            // Loading state
  error,              // Error message
  loadUsers,          // Load users with optional params
  setError,           // Set error state
  handlePageChange,   // Handle page change
  handlePageSizeChange, // Handle page size change
} = useUsers();
```

**Key Features:**
- Automatic initial data loading
- Optimized dependencies to prevent unnecessary re-renders
- Comprehensive error handling
- Support for search parameters

### useUserSearch

Manages search panel state and client-side filtering.

```tsx
const {
  searchPanelOpen,              // Search panel visibility
  searchFormData,               // Current search form values
  applyClientSideFiltersWithData, // Apply filters to user list
  handleSearchPanelToggle,      // Toggle search panel
  handleSearchFormChange,       // Update search field
  handleClearSearch,            // Clear all filters
} = useUserSearch(allUsers);
```

**Supported Filters:**
- Username (case-insensitive)
- Email (case-insensitive)
- Mobile number (case-insensitive)
- Account status
- Role code
- Active status

### useUserDialog

Manages dialog UI state (view, create, edit, delete).

```tsx
const {
  dialogOpen,           // Dialog open state
  selectedUser,         // Currently selected user
  actionType,           // 'view' | 'edit' | 'create' | 'delete'
  loading,              // Operation loading state
  formData,             // Form data
  formErrors,           // Form validation errors
  handleView,           // Open view dialog
  handleEdit,           // Open edit dialog
  handleCreate,         // Open create dialog
  handleDelete,         // Trigger delete action
  handleCloseDialog,    // Close dialog
  handleFormChange,     // Update form field
  handleSave,           // Save user (create/update)
  handleConfirmDelete,  // Confirm delete
  getFieldError,        // Get error for field
  hasFieldError,        // Check if field has error
  getDialogTitle,       // Get dialog title
} = useUserDialog();
```

**Key Features:**
- Simplified API (no callback parameters needed)
- Automatic notification handling via `useUserHandlers`
- Field-level error management
- Optimized with `useCallback` for performance

### useUserHandlers

Encapsulates business logic for CRUD operations.

```tsx
const {
  handleCreateUser,   // Create new user
  handleUpdateUser,   // Update existing user
  handleDeleteUser,   // Delete user
} = useUserHandlers();

// Example usage
const result = await handleCreateUser(formData);
if (result.success) {
  // Success - notification shown automatically
} else if (result.errors) {
  // Field-level errors to display
  setFormErrors(result.errors);
}
```

**Return Type:**
```typescript
{
  success: boolean;
  errors?: Record<string, string[] | string>;
}
```

**Key Features:**
- Integrated notification system (`useNotification`)
- Comprehensive error handling:
  - Field-level validation errors
  - API errors
  - Network errors
  - Generic errors
- Bilingual error messages (EN/ZH)

### useUserActionMenu

Provides memoized action menu configuration.

```tsx
const actionMenuItems = useUserActionMenu({
  user,
  onView: handleView,
  onEdit: handleEdit,
  onDelete: handleDelete,
  t,
});

// Returns:
// [
//   { label: 'View', onClick: () => onView(user) },
//   { label: 'Edit', onClick: () => onEdit(user) },
//   { label: 'Delete', onClick: () => onDelete(user) },
// ]
```

## Usage Examples

### Basic User Management

```tsx
import { useUsers, useUserDialog } from '../hooks';

const UsersPage = () => {
  const { allUsers, loading, loadUsers } = useUsers();
  const {
    dialogOpen,
    formData,
    handleCreate,
    handleEdit,
    handleSave,
  } = useUserDialog();

  return (
    <>
      <Button onClick={handleCreate}>Create User</Button>
      
      <UserTable
        users={allUsers}
        loading={loading}
        onEdit={handleEdit}
      />
      
      <UserDialog
        open={dialogOpen}
        formData={formData}
        onSubmit={handleSave}
      />
    </>
  );
};
```

### Advanced Search

```tsx
const UsersPage = () => {
  const { allUsers, loadUsers } = useUsers();
  const {
    searchFormData,
    handleSearchFormChange,
    applyClientSideFiltersWithData,
  } = useUserSearch(allUsers);

  // Real-time client-side filtering
  const handleFormChange = (field, value) => {
    handleSearchFormChange(field, value);
    const filtered = applyClientSideFiltersWithData({
      ...searchFormData,
      [field]: value,
    });
    setFilteredUsers(filtered);
  };

  // Server-side search
  const handleSearch = () => {
    loadUsers({
      username: searchFormData.username,
      email: searchFormData.email,
      accountStatus: searchFormData.accountStatus,
    });
  };
};
```

### Error Handling

```tsx
const UserDialog = () => {
  const {
    formData,
    formErrors,
    handleSave,
    getFieldError,
    hasFieldError,
  } = useUserDialog();

  return (
    <form onSubmit={handleSave}>
      <TextField
        label="Username"
        value={formData.username}
        error={hasFieldError('username')}
        helperText={getFieldError('username')}
      />
      
      <TextField
        label="Email"
        value={formData.email}
        error={hasFieldError('email')}
        helperText={getFieldError('email')}
      />
    </form>
  );
};
```

## Constants

### USER_CONSTANTS

```typescript
export const USER_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  SORT_FIELD: 'createdAt',
  SORT_DIRECTION: 'desc',
  
  // Validation rules (Phase 1 enhancement)
  VALIDATION: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    NICKNAME_MIN_LENGTH: 2,
    NICKNAME_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
    MOBILE_NUMBER_MIN_LENGTH: 10,
    MOBILE_NUMBER_MAX_LENGTH: 15,
  },
  
  // Page size options (Phase 1 enhancement)
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;
```

## API Service

### userService

The `userService` provides a clean interface to the user management API:

```typescript
// Get paginated users with filters
const response = await userService.getUsers({
  page: 0,
  size: 10,
  username: 'john',
  accountStatus: 'active',
});

// Create user
const response = await userService.createUser({
  username: 'john.doe',
  password: 'securePassword123',
  email: 'john@example.com',
  roleCodes: ['ROLE_USER'],
  accountStatus: 'active',
  active: true,
});

// Update user (partial)
const response = await userService.patchUser(userId, {
  email: 'newemail@example.com',
  accountStatus: 'locked',
});

// Delete user
const response = await userService.deleteUser(userId);
```

## Types Reference

### User

```typescript
interface User {
  id: string;
  username: string;
  nickname: string | null;
  email: string | null;
  mobileCountryCode: string | null;
  mobileNumber: string | null;
  accountStatus: AccountStatus;
  active: boolean;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  passwordChangedAt: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}
```

### UserFormData

```typescript
interface UserFormData {
  username: string;
  password: string;
  nickname: string;
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  accountStatus: AccountStatus;
  roleCodes: string[];
  active: boolean;
}
```

### AccountStatus

```typescript
type AccountStatus = 'active' | 'locked' | 'suspend' | 'pending_verification';
```

### UserActionType

```typescript
type UserActionType = 'view' | 'edit' | 'create' | 'delete' | null;
```

## Internationalization

### Translation Keys

```typescript
// Success messages
users.userCreatedSuccess
users.userUpdatedSuccess
users.userDeletedSuccess

// Error messages (Phase 1 enhancements)
users.errors.networkError
users.errors.unauthorized
users.errors.notFound
users.errors.duplicateUsername
users.errors.duplicateEmail
users.errors.invalidEmail
users.errors.invalidMobile
users.errors.usernameRequired
users.errors.passwordRequired
users.errors.roleRequired
users.errors.createFailed
users.errors.updateFailed
users.errors.deleteFailed
users.errors.loadFailed

// Action labels
users.actions.view
users.actions.edit
users.actions.delete
users.actions.createUser
users.actions.viewUser
users.actions.editUser
users.actions.deleteUser
```

### Usage

```tsx
import { useTranslation } from 'react-i18next';

const UserComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('users.actions.createUser')}</h1>
      <p>{t('users.errors.usernameRequired')}</p>
    </div>
  );
};
```

## Error Handling

### Field-Level Errors

The module supports field-level error display from the API:

```typescript
// API Response with field errors
{
  status: {
    code: 400,
    errors: {
      username: ["Username is required", "Username already exists"],
      email: ["Invalid email format"]
    }
  }
}

// Processed for display
formErrors = {
  username: ["Username is required", "Username already exists"],
  email: ["Invalid email format"]
}

// Helper functions
getFieldError('username') // Returns: "Username is required"
hasFieldError('username') // Returns: true
```

### Global Errors

Global errors are automatically displayed via the notification system:

```typescript
// Network error
showError(t('users.errors.networkError'));

// Unauthorized
showError(t('users.errors.unauthorized'));

// Generic error
showError(t('users.errors.createFailed'));
```

## Performance Optimization

### Memoization

All hooks use `useCallback` and `useMemo` where appropriate:

```typescript
// useUserDialog.ts
const handleFormChange = useCallback((field, value) => {
  // Optimized to prevent unnecessary re-renders
}, [formErrors]);

// useUserActionMenu.tsx
const actionMenuItems = useMemo(() => [
  // Memoized action menu configuration
], [user, onView, onEdit, onDelete, t]);
```

### Dependency Optimization

```typescript
// Before (Phase 1)
const loadUsers = useCallback(async () => {
  // ...
}, [currentPage, pageSize, t]); // Causes circular dependency

// After (Phase 1)
const loadUsers = useCallback(async (params, page, size) => {
  // ...
}, [t]); // Optimized dependencies
```

## Testing

### Unit Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useUserDialog } from '../hooks';

describe('useUserDialog', () => {
  it('should handle create user flow', () => {
    const { result } = renderHook(() => useUserDialog());
    
    act(() => {
      result.current.handleCreate();
    });
    
    expect(result.current.dialogOpen).toBe(true);
    expect(result.current.actionType).toBe('create');
  });
});
```

### Integration Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import UsersPage from '../pages/UsersPage';

describe('UsersPage', () => {
  it('should create new user', async () => {
    render(<UsersPage />);
    
    fireEvent.click(screen.getByText('Create User'));
    
    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'john.doe' },
    });
    
    fireEvent.click(screen.getByText('Save'));
    
    await screen.findByText('User created successfully');
  });
});
```

## Enhancement History

### Phase 1 - Core Improvements ✅
- Enhanced constants organization (VALIDATION, PAGE_SIZE_OPTIONS)
- Added 10 new error messages (EN/ZH)
- Optimized hook dependencies to prevent re-renders

### Phase 2 - Business Logic Extraction ✅
- Created `useUserHandlers` (247 lines) - Business logic
- Created `useUserActionMenu` (68 lines) - Action menu
- Refactored `useUserDialog` (303 → 254 lines, 16% reduction)
- Integrated notification system
- Simplified component integration

### Phase 3 - Documentation ✅
- Added comprehensive JSDoc comments
- Created detailed README.md (this file)
- Added usage examples and API reference

## Migration Guide

If you're upgrading from an older version of this module, here are the breaking changes:

### From Pre-Phase 2 to Phase 2+

**Before:**
```tsx
const { handleSave, handleConfirmDelete } = useUserDialog();

// Need to pass callback functions
<UserDialog
  onSubmit={() => handleSave(onSuccess, onError)}
/>
```

**After:**
```tsx
const { handleSave, handleConfirmDelete } = useUserDialog();

// No callbacks needed - notifications handled automatically
<UserDialog
  onSubmit={handleSave}
/>
```

## Best Practices

1. **Always use hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Leverage type safety** - Use TypeScript interfaces for all data structures
3. **Handle errors gracefully** - Use `getFieldError` and `hasFieldError` for form validation
4. **Optimize performance** - Use the provided memoized hooks and avoid unnecessary re-renders
5. **Follow i18n patterns** - Always use translation keys instead of hardcoded strings
6. **Separate concerns** - Keep UI components pure, delegate business logic to hooks

## Troubleshooting

### Common Issues

**Issue: Users not loading**
```tsx
// Check if loadUsers is being called
useEffect(() => {
  loadUsers();
}, []); // Empty dependency array for initial load
```

**Issue: Form errors not clearing**
```tsx
// Make sure to clear errors on field change
handleFormChange(field, value); // Automatically clears field error
```

**Issue: Notifications not showing**
```tsx
// Ensure useNotification is initialized
const { showSuccess, showError } = useNotification();
```

## Contributing

When contributing to this module:

1. Follow the established patterns (hooks, components, services)
2. Add TypeScript types for all new interfaces
3. Add translations for both EN and ZH
4. Update this README with any new features
5. Add JSDoc comments to all exported functions
6. Write unit tests for new hooks
7. Update the CHANGELOG.md

## License

Internal use only - Part of GJPB Admin Console

---

**Last Updated**: October 5, 2025  
**Version**: 2.0.0  
**Maintainer**: Development Team
