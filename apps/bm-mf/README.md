# BM-MF (Business Management Microfrontend)

This microfrontend provides business management functionality with a complete CRUD implementation for managing application settings. It follows a feature-first architecture pattern and integrates seamlessly with the main shell application.

## Architecture

- ✅ **Feature-First Structure**: Self-contained feature modules with complete functionality
- ✅ **Microfrontend Pattern**: Independent deployment and development
- ✅ **Full CRUD Operations**: Create, Read, Update, Delete app settings
- ✅ **Server-side Pagination**: Efficient handling of large datasets
- ✅ **Advanced Search & Filtering**: Search by name, language, system/public flags
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Dark Mode Support**: Consistent with the application theme
- ✅ **TypeScript**: Fully typed for better development experience
- ✅ **i18n Ready**: Internationalization with feature-specific translations
- ✅ **Reusable Components**: Modular architecture

## API Endpoint

- **Base URL**: `/v1/app-settings`
- **Methods**: GET, POST, PUT, DELETE
- **Pagination**: Supported with `page`, `size`, `sort`, `direction` parameters
- **Search**: Supports filtering by `name`, `lang`, `isSystem`, `isPublic`

## Project Structure

```
apps/bm-mf/src/
├── public-api.ts                     # Microfrontend public exports
├── vite-env.d.ts                     # Vite type definitions
└── app-settings/                     # Complete feature module
    ├── components/
    │   ├── AppSettingDialog.tsx          # Create/Edit dialog
    │   ├── AppSettingTable.tsx           # Data table component
    │   ├── AppSettingSearchPanel.tsx     # Search and filter panel
    │   ├── AppSettingPageHeader.tsx      # Page header with actions
    │   ├── DeleteAppSettingDialog.tsx    # Delete confirmation dialog
    │   └── index.ts                      # Component exports
    ├── hooks/
    │   ├── useAppSettings.ts             # Data management hook
    │   ├── useAppSettingDialog.ts        # Dialog management hook
    │   └── index.ts                      # Hook exports
    ├── i18n/
    │   └── i18n.config.ts                # Feature-specific translations
    ├── pages/
    │   ├── AppSettingsPage.tsx           # Main page component
    │   └── index.ts                      # Page exports
    ├── services/
    │   └── appSettingService.ts          # API service layer
    ├── types/
    │   └── app-setting.types.ts          # TypeScript definitions
    └── index.ts                          # Feature module exports
```

## Data Model

```typescript
interface AppSetting {
  id: string;
  name: string;
  value: string;
  lang: string;
  isSystem: boolean;
  isPublic: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
}
```

## API Response Format

```json
{
  "status": {
    "code": 200,
    "message": "App settings retrieved successfully",
    "errors": null
  },
  "data": {
    "content": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "name": "app_company",
        "value": "GJP Technology",
        "lang": "EN",
        "isSystem": false,
        "isPublic": true,
        "createdAt": "2025-08-20T06:05:17",
        "createdBy": null,
        "updatedAt": "2025-08-20T06:05:17",
        "updatedBy": null
      }
    ],
    "totalElements": 8,
    "totalPages": 1,
    "size": 20,
    "number": 0
  }
}
```

## Usage Example

```typescript
import React from 'react';
import { AppSettingsPage } from './app-settings';

const App: React.FC = () => {
  return <AppSettingsPage />;
};

export default App;
```

## Key Components

### 1. AppSettingsPage
The main page component that orchestrates all functionality:
- Pagination management
- Search and filtering
- CRUD operations
- Error handling

### 2. AppSettingTable
- Displays app settings in a data table
- Supports sorting and pagination
- Action menu for each row (View, Edit, Delete)
- Responsive design

### 3. AppSettingSearchPanel
- Advanced search functionality
- Filters: name, language, system/public flags
- Real-time client-side filtering
- Clear filters option

### 4. Hooks

#### useAppSettings
- Manages app settings data loading
- Handles pagination state
- Server-side API integration

#### useAppSettingSearch
- Search form state management
- Client-side filtering logic
- Search panel toggle

#### useAppSettingDialog
- Dialog state management (Create/Edit/View/Delete)
- Form validation
- CRUD operations

## Features Implemented

### ✅ Completed Features
1. **Complete CRUD Operations**: Full Create, Read, Update, Delete functionality
2. **Data Table**: Server-side paginated table with sorting
3. **Dialog Management**: Create/Edit and Delete confirmation dialogs
4. **Search & Filter**: Advanced search panel with multiple filters
5. **Responsive Design**: Mobile-friendly layout
6. **TypeScript**: Fully typed components and services
7. **Service Layer**: API integration with error handling
8. **Hooks Architecture**: Reusable custom hooks
9. **i18n Integration**: Feature-specific internationalization
10. **Microfrontend Architecture**: Clean public API and modular structure

## Development Notes

This microfrontend follows the established architecture patterns:
- **Feature-first organization**: Complete features in self-contained modules
- **Consistent styling and theming**: Material-UI with application theme integration
- **Reusable component architecture**: Modular, testable components
- **Server-side pagination approach**: Efficient data handling
- **TypeScript best practices**: Full type safety across the application
- **i18n Integration**: Feature-specific translations that extend shared translations

## Dependencies

- React 19.1
- Material-UI 7.1.1
- TypeScript
- React i18next
- date-fns (for date formatting)
- lucide-react (for icons)

## Microfrontend Integration

This microfrontend is consumed by the shell application through the public API:

```typescript
// Shell application integration
import { AppSettingsPage } from 'bm-mf/public-api';

// Usage in shell routing
<Route path="/app-settings" component={AppSettingsPage} />
```

### Integration Requirements

1. **API Endpoint**: Ensure `/v1/app-settings` endpoint is available
2. **Shared Dependencies**: React, Material-UI, and shared-lib must be available
3. **i18n Setup**: Feature translations are automatically loaded when the module is imported
4. **Theme Integration**: Uses shared theme configuration from shell application
5. **Authentication**: Leverages shell application's authentication context

### Public API Exports

```typescript
// Available exports from public-api.ts
export * from './app-settings';  // All app-settings functionality
```
