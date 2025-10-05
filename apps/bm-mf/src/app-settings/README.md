# App Settings Module

## Overview

The App Settings module provides a comprehensive interface for managing application configuration settings. It follows modern React patterns with clean separation of concerns, type safety, and internationalization support.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete app settings
- ✅ **Advanced Search**: Client-side and server-side filtering
- ✅ **Pagination**: Efficient data loading with customizable page sizes
- ✅ **Validation**: Client-side and server-side validation
- ✅ **Internationalization**: Full English/Chinese translation support
- ✅ **Type Safety**: Complete TypeScript coverage
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Performance Optimized**: Memoization and efficient re-rendering

## Architecture

### Directory Structure

```
app-settings/
├── components/          # UI components
│   ├── AppSettingDialog.tsx
│   ├── AppSettingPageHeader.tsx
│   ├── AppSettingSearchPanel.tsx
│   ├── AppSettingTable.tsx
│   ├── AppSettingTableSkeleton.tsx
│   ├── DeleteAppSettingDialog.tsx
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useAppSettings.ts              # Data fetching & pagination
│   ├── useAppSettingSearch.ts         # Search functionality
│   ├── useAppSettingDialog.ts         # Dialog UI state
│   ├── useAppSettingHandlers.ts       # Business logic (CRUD)
│   ├── useAppSettingActionMenu.tsx    # Action menu configuration
│   └── index.ts
├── pages/              # Page components
│   ├── AppSettingsPage.tsx
│   └── index.ts
├── services/           # API services
│   └── appSettingService.ts
├── types/              # TypeScript definitions
│   └── app-setting.types.ts
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
2. **UI State Hooks** (`useAppSettingDialog`) - Dialog state management
3. **Business Logic Hooks** (`useAppSettingHandlers`) - CRUD operations
4. **Data Hooks** (`useAppSettings`, `useAppSettingSearch`) - Data fetching
5. **Service Layer** (`services/`) - API communication

#### Hook Composition

```tsx
// In AppSettingsPage.tsx
const AppSettingsPage = () => {
  // Data management
  const {
    allAppSettings,
    filteredAppSettings,
    pagination,
    loading,
    loadAppSettings,
  } = useAppSettings();

  // Search functionality
  const {
    searchPanelOpen,
    searchFormData,
    handleSearchPanelToggle,
    handleSearch,
  } = useAppSettingSearch(allAppSettings);

  // Dialog UI state
  const {
    dialogOpen,
    formData,
    formErrors,
    handleCreate,
    handleEdit,
  } = useAppSettingDialog();

  // Business logic
  const { handleSave, handleDelete } = useAppSettingHandlers({
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg),
    onRefresh: () => loadAppSettings(),
  });

  // Component renders...
};
```

## Key Components

### 1. useAppSettings

Manages app settings data fetching and pagination.

**Features:**
- Server-side pagination
- Search parameter support
- Error handling
- Loading states

**Usage:**
```tsx
const {
  allAppSettings,
  filteredAppSettings,
  pagination,
  loading,
  error,
  loadAppSettings,
} = useAppSettings();
```

### 2. useAppSettingDialog

Manages dialog UI state without business logic.

**Features:**
- Dialog open/close state
- Form data management
- Form errors tracking
- Action type (view, edit, create, delete)

**Usage:**
```tsx
const {
  dialogOpen,
  formData,
  formErrors,
  setFormErrors,
  handleCreate,
  handleEdit,
  handleClose,
} = useAppSettingDialog();
```

### 3. useAppSettingHandlers

Handles all business logic for CRUD operations.

**Features:**
- Form validation
- Create/Update/Delete operations
- API error handling
- Success/Error callbacks

**Usage:**
```tsx
const { handleSave, handleDelete } = useAppSettingHandlers({
  onSuccess: (message) => showSuccess(message),
  onError: (message) => showError(message),
  onRefresh: () => loadAppSettings(),
});

// In dialog
await handleSave(actionType, formData, selectedAppSetting, setFormErrors);
```

### 4. useAppSettingActionMenu

Provides action menu configuration for table rows.

**Features:**
- Memoized menu items
- Icon integration
- Color coding
- Internationalization

**Usage:**
```tsx
const actionMenuItems = useAppSettingActionMenu({
  onView: (setting) => handleView(setting),
  onEdit: (setting) => handleEdit(setting),
  onDelete: (setting) => handleDelete(setting),
});
```

## API Integration

### Service Layer

The `appSettingService` handles all API communications:

```typescript
// Get all app settings with pagination
const response = await appSettingService.getAppSettings({ page: 0, size: 20 });

// Create new app setting
const response = await appSettingService.createAppSetting(createRequest);

// Update app setting
const response = await appSettingService.updateAppSetting(id, updateRequest);

// Delete app setting
const response = await appSettingService.deleteAppSetting(id);
```

### Response Format

All API responses follow this structure:

```typescript
{
  status: {
    code: number;      // HTTP status code
    message: string;   // Status message
  };
  data: T;            // Response data
}
```

## Validation

### Client-Side Validation

Validation constants are centralized in `constants/index.ts`:

```typescript
export const APP_SETTING_CONSTANTS = {
  VALIDATION: {
    NAME_MIN_LENGTH: 1,
    NAME_MAX_LENGTH: 100,
    VALUE_MAX_LENGTH: 5000,
  },
  // ...
};
```

### Validation Rules

- **Name**: Required, 1-100 characters
- **Value**: Required, max 5000 characters
- **Language**: Required
- **isSystem**: Boolean
- **isPublic**: Boolean

## Internationalization

The module supports English and Chinese languages.

### Adding New Translations

Edit `i18n/translations.ts`:

```typescript
const resources = {
  en: {
    translation: {
      appSettings: {
        title: 'App Settings',
        // Add new keys here
      },
    },
  },
  zh: {
    translation: {
      appSettings: {
        title: '应用设置',
        // Add Chinese translations
      },
    },
  },
};
```

## Error Handling

### Error Types

1. **Validation Errors**: Client-side form validation
2. **API Errors**: Server-side errors (400, 401, 404, 500)
3. **Network Errors**: Connection issues

### Error Messages

Error messages are internationalized and user-friendly:

```typescript
// In error-handler.ts
export const handleApiError = (error: any, t: any, defaultKey: string) => {
  if (error.response?.status === 401) {
    return t('appSettings.errors.unauthorized');
  }
  // ... more error handling
};
```

## Performance Optimizations

### Memoization

Components and hooks use `useMemo` and `useCallback` to prevent unnecessary re-renders:

```tsx
// Memoized columns
const columns = useMemo(() => [...], [t]);

// Memoized action menu
const actionMenuItems = useMemo(() => [...], [t, onView, onEdit, onDelete]);

// Memoized callbacks
const handleFormChange = useCallback((field, value) => {
  // ...
}, [formErrors]);
```

### Optimized Dependencies

Hook dependencies are carefully managed to avoid circular dependencies and unnecessary re-renders.

## Testing

### Unit Tests (Recommended)

```typescript
describe('useAppSettingHandlers', () => {
  it('should validate form data correctly', () => {
    const { result } = renderHook(() => useAppSettingHandlers({
      onSuccess: jest.fn(),
      onError: jest.fn(),
      onRefresh: jest.fn(),
    }));

    // Test validation logic
  });
});
```

## Best Practices

### 1. Use TypeScript Types

Always use proper types from `types/app-setting.types.ts`:

```typescript
import type { AppSetting, AppSettingFormData } from '../types/app-setting.types';
```

### 2. Separate UI and Business Logic

- Use `useAppSettingDialog` for UI state
- Use `useAppSettingHandlers` for business logic
- Keep components presentational

### 3. Handle Errors Gracefully

```typescript
try {
  const success = await handleSave(actionType, formData, selectedAppSetting, setFormErrors);
  if (success) {
    handleClose();
  }
} catch (error) {
  // Error is already handled by the hook
  console.error('Unexpected error:', error);
}
```

### 4. Use Constants

Never hardcode values. Use constants from `constants/index.ts`:

```typescript
import { APP_SETTING_CONSTANTS } from '../constants';

if (formData.name.length > APP_SETTING_CONSTANTS.VALIDATION.NAME_MAX_LENGTH) {
  // Show error
}
```

## Migration Guide

### From Other Modules

If you're implementing similar functionality in other modules, follow this pattern:

1. **Create hooks directory** with separate hooks for:
   - Data fetching (`useModuleName`)
   - Search (`useModuleNameSearch`)
   - Dialog state (`useModuleNameDialog`)
   - Business logic (`useModuleNameHandlers`)
   - Action menu (`useModuleNameActionMenu`)

2. **Separate concerns**:
   - UI state in dialog hook
   - Business logic in handlers hook
   - API calls in service layer

3. **Use shared utilities**:
   - `useNotification` from shared-lib
   - `DataTable` from shared-lib
   - Error handling utilities

## Troubleshooting

### Common Issues

**1. Validation errors not showing**
- Ensure `setFormErrors` is passed to `handleSave`
- Check that form field names match `AppSettingFormData` keys

**2. Data not refreshing after save**
- Verify `onRefresh` callback is calling `loadAppSettings()`
- Check network tab for API response

**3. Dialog not closing**
- Ensure `handleClose()` is called in `onSuccess` callback
- Check that `loading` state is properly managed

## Contributing

When adding new features:

1. Add TypeScript types in `types/`
2. Add constants in `constants/`
3. Add translations in `i18n/`
4. Follow existing patterns
5. Update this README
6. Add JSDoc comments

## License

Copyright © 2025 GJP Blog Admin Console

---

**Last Updated**: October 5, 2025
**Version**: 2.0.0
**Maintainer**: Development Team
