# App Settings CRUD Module

This module provides a complete CRUD (Create, Read, Update, Delete) implementation for managing application settings, built using the UsersPage as a template.

## Features

- ✅ **Full CRUD Operations**: Create, Read, Update, Delete app settings
- ✅ **Server-side Pagination**: Efficient handling of large datasets
- ✅ **Advanced Search & Filtering**: Search by name, language, system/public flags
- ✅ **Responsive Design**: Works on all device sizes
- ✅ **Dark Mode Support**: Consistent with the application theme
- ✅ **TypeScript**: Fully typed for better development experience
- ✅ **i18n Ready**: Internationalization support
- ✅ **Reusable Components**: Modular architecture

## API Endpoint

- **Base URL**: `/v1/app-settings`
- **Methods**: GET, POST, PUT, DELETE
- **Pagination**: Supported with `page`, `size`, `sort`, `direction` parameters
- **Search**: Supports filtering by `name`, `lang`, `isSystem`, `isPublic`

## Project Structure

```
apps/bm-mf/src/app-settings/
├── components/
│   ├── AppSettingTable.tsx           # Data table component
│   ├── AppSettingSearchPanel.tsx     # Search and filter panel
│   ├── AppSettingPageHeader.tsx      # Page header with actions
│   └── index.ts                      # Component exports
├── hooks/
│   ├── useAppSettings.ts             # Data management hook
│   ├── useAppSettingSearch.ts        # Search functionality hook
│   ├── useAppSettingDialog.ts        # Dialog management hook
│   └── index.ts                      # Hook exports
├── pages/
│   ├── AppSettingsPage.tsx           # Main page component
│   └── index.ts                      # Page exports
├── services/
│   └── appSettingService.ts          # API service layer
├── types/
│   └── app-setting.types.ts          # TypeScript definitions
├── utils/
│   └── i18n.ts                       # Internationalization setup
└── index.ts                          # Module exports
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
1. **Data Table**: Server-side paginated table with sorting
2. **Search & Filter**: Advanced search panel with multiple filters
3. **Responsive Design**: Mobile-friendly layout
4. **TypeScript**: Fully typed components and services
5. **Service Layer**: API integration with error handling
6. **Hooks Architecture**: Reusable custom hooks
7. **i18n Setup**: Internationalization structure

### 🚧 TODO (Dialog Components)
1. **AppSettingDialog**: Create/Edit/View dialog
2. **DeleteAppSettingDialog**: Confirmation dialog for deletion
3. **NotificationSnackbar**: Success/error notifications

## Development Notes

This module was created following the established patterns from the UsersPage:
- Same project structure and naming conventions
- Consistent styling and theming
- Reusable component architecture
- Server-side pagination approach
- TypeScript best practices

## Dependencies

- React 19.1
- Material-UI 7.1.1
- TypeScript
- React i18next
- date-fns (for date formatting)
- lucide-react (for icons)

## Integration

To integrate this module into your application:

1. Import the page component: `import { AppSettingsPage } from './apps/bm-mf/src/app-settings'`
2. Add routing configuration
3. Ensure API endpoint `/v1/app-settings` is available
4. Include the module in your build process
