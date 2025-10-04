# Shared Library Feature-Based Architecture

## Overview

The shared library has been restructured using a **feature-based architecture** to improve organization, maintainability, and discoverability of shared functionality across all microfrontends.

## Feature Structure

```
apps/shared-lib/src/
├── features/
│   ├── api/                    # API clients and authentication
│   ├── core/                   # Core utilities and configuration
│   ├── data-management/        # Data tables, pagination, search
│   ├── firebase/               # Firebase integration
│   ├── i18n/                   # Internationalization
│   ├── theme/                  # Theme management
│   └── ui-components/          # Shared UI components (reserved)
└── index.ts                    # Main exports
```

## Features

### 🔗 API Feature (`/api`)
- **Purpose**: API client services, authentication, and mock API functionality
- **Exports**: `api-client`, `auth-service`, `mock-api-service`, `api.types`
- **Usage**: `import { apiClient, authService } from 'shared-lib/features/api'`

### ⚙️ Core Feature (`/core`)
- **Purpose**: Core utilities including cache, configuration, cookies, and microfrontend communication
- **Exports**: `cache-manager`, `config`, `cookie`, `cache-registry.service`, `microfrontend-communication.service`
- **Usage**: `import { APP_CONFIG, getCookie } from 'shared-lib/features/core'`

### 📊 Data Management Feature (`/data-management`)
- **Purpose**: Data tables, pagination, search, notifications, and dialog management
- **Exports**: `DataTable`, `usePagination`, `useSearch`, `useNotification`, `useDialog`, `useDataManagement`
- **Usage**: `import { DataTable, usePagination } from 'shared-lib/features/data-management'`

### 🔥 Firebase Feature (`/firebase`)
- **Purpose**: Firebase integration including configuration, analytics, and performance monitoring
- **Exports**: `firebase-config.service`, `firebase-analytics.service`, `firebase-performance.service`, `useFirebasePerformance`
- **Usage**: `import { initializeFirebaseServices } from 'shared-lib/features/firebase'`

### 🌐 I18n Feature (`/i18n`)
- **Purpose**: Internationalization utilities and components
- **Exports**: `i18n`, `I18nProvider`
- **Usage**: `import { I18nProvider } from 'shared-lib/features/i18n'`

### 🎨 Theme Feature (`/theme`)
- **Purpose**: Theme management components, hooks, and utilities
- **Exports**: `ThemeControls`, `useTheme`, `theme.types`, `theme.utils`
- **Usage**: `import { useTheme, ThemeControls } from 'shared-lib/features/theme'`

### 🧩 UI Components Feature (`/ui-components`)
- **Purpose**: Reserved for future shared UI components that don't belong to specific domains
- **Status**: Currently empty, available for future expansion

## Usage Examples

### Importing from Specific Features (Recommended)
```typescript
// Import from specific features for better tree-shaking and clarity
import { DataTable, usePagination } from 'shared-lib/features/data-management';
import { useTheme, ThemeControls } from 'shared-lib/features/theme';
import { apiClient } from 'shared-lib/features/api';
```

### Importing from Main Index (All Features)
```typescript
// Import from main index (includes all features)
import { DataTable, useTheme, apiClient } from 'shared-lib';
```

## Migration from Legacy Structure

If you're migrating from the old layer-based structure, update your imports as follows:

### Legacy → Feature-based Migration
```typescript
// OLD (No longer supported)
import { DataTable } from 'shared-lib/src/components/DataTable';
import { usePagination } from 'shared-lib/src/hooks';
import { apiClient } from 'shared-lib/src/services/api-client';

// NEW (Current structure)
import { DataTable, usePagination } from 'shared-lib/features/data-management';
import { apiClient } from 'shared-lib/features/api';
```

## Benefits

✅ **Better Organization**: Related functionality is grouped together  
✅ **Improved Discoverability**: Features clearly define their purpose  
✅ **Better Tree-shaking**: Import only what you need from specific features  
✅ **Scalability**: Easy to add new features without cluttering  
✅ **Maintainability**: Clear boundaries between different concerns  
✅ **Documentation**: Each feature has a clear purpose and scope

## Adding New Features

1. Create a new directory under `features/`
2. Add an `index.ts` file with proper exports and documentation
3. Update the main `features/index.ts` to include the new feature
4. Update this README with the new feature information

## Feature Guidelines

- Each feature should have a single, clear responsibility
- Features should be as independent as possible
- Shared types and utilities should go in the `core` feature
- UI components that don't belong to a specific domain go in `ui-components`
- Each feature should have comprehensive exports in its `index.ts`