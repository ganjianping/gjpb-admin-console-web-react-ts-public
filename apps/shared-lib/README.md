# Shared Library Domain-Based Architecture

## Overview

The shared library has been restructured using a **domain-based architecture** to improve organization, maintainability, and discoverability of shared functionality across all microfrontends. Each domain represents a distinct area of cross-application functionality.

## Domain Structure

```
apps/shared-lib/src/
├── api/                        # API clients and authentication
├── core/                       # Core utilities and configuration
├── data-management/            # Data tables, pagination, search
├── firebase/                   # Firebase integration
├── i18n/                       # Internationalization
├── theme/                      # Theme management
├── ui-components/              # Shared UI components (reserved)
└── index.ts                    # Main exports
```

## Domains

### 🔗 API Domain (`/api`)
- **Purpose**: API client services, authentication, and mock API functionality
- **Exports**: `api-client`, `auth-service`, `mock-api-service`, `api.types`
- **Usage**: `import { apiClient, authService } from 'shared-lib/api'`

### ⚙️ Core Domain (`/core`)
- **Purpose**: Core utilities including cache, configuration, cookies, and microfrontend communication
- **Exports**: `cache-manager`, `config`, `cookie`, `cache-registry.service`, `microfrontend-communication.service`
- **Usage**: `import { APP_CONFIG, getCookie } from 'shared-lib/core'`

### 📊 Data Management Domain (`/data-management`)
- **Purpose**: Data tables, pagination, search, notifications, and dialog management
- **Exports**: `DataTable`, `usePagination`, `useSearch`, `useNotification`, `useDialog`, `useDataManagement`
- **Usage**: `import { DataTable, usePagination } from 'shared-lib/data-management'`

### 🔥 Firebase Domain (`/firebase`)
- **Purpose**: Firebase integration including configuration, analytics, and performance monitoring
- **Exports**: `firebase-config.service`, `firebase-analytics.service`, `firebase-performance.service`, `useFirebasePerformance`
- **Usage**: `import { initializeFirebaseServices } from 'shared-lib/firebase'`

### 🌐 I18n Domain (`/i18n`)
- **Purpose**: Internationalization utilities and components
- **Exports**: `i18n`, `I18nProvider`
- **Usage**: `import { I18nProvider } from 'shared-lib/i18n'`

### 🎨 Theme Domain (`/theme`)
- **Purpose**: Theme management components, hooks, and utilities
- **Exports**: `ThemeControls`, `useTheme`, `theme.types`, `theme.utils`
- **Usage**: `import { useTheme, ThemeControls } from 'shared-lib/theme'`

### 🧩 UI Components Domain (`/ui-components`)
- **Purpose**: Reserved for future shared UI components that don't belong to specific domains
- **Status**: Currently empty, available for future expansion

## Usage Examples

### Importing from Specific Domains (Recommended)
```typescript
// Import from specific domains for better tree-shaking and clarity
import { DataTable, usePagination } from 'shared-lib/data-management';
import { useTheme, ThemeControls } from 'shared-lib/theme';
import { apiClient } from 'shared-lib/api';
```

### Importing from Main Index (All Domains)
```typescript
// Import from main index (includes all domains)
import { DataTable, useTheme, apiClient } from 'shared-lib';
```

## Migration from Previous Structures

If you're migrating from previous structures, update your imports as follows:

### Legacy Layer-based → Domain-based Migration
```typescript
// OLD (Legacy layer-based structure)
import { DataTable } from 'shared-lib/src/components/DataTable';
import { usePagination } from 'shared-lib/src/hooks';
import { apiClient } from 'shared-lib/src/services/api-client';

// NEW (Current flat domain structure)
import { DataTable, usePagination } from 'shared-lib/data-management';
import { apiClient } from 'shared-lib/api';
```

### Previous Features-based → Domain-based Migration
```typescript
// OLD (Previous features/ nested structure)
import { DataTable, usePagination } from 'shared-lib/features/data-management';
import { apiClient } from 'shared-lib/features/api';

// NEW (Current flat domain structure)
import { DataTable, usePagination } from 'shared-lib/data-management';
import { apiClient } from 'shared-lib/api';
```

## Benefits

✅ **Better Organization**: Related functionality is grouped together by domain  
✅ **Improved Discoverability**: Domains clearly define their purpose  
✅ **Better Tree-shaking**: Import only what you need from specific domains  
✅ **Scalability**: Easy to add new domains without deep nesting  
✅ **Maintainability**: Clear boundaries between different concerns  
✅ **Documentation**: Each domain has a clear purpose and scope  
✅ **Flat Structure**: Simplified import paths without intermediate folders

## Adding New Domains

1. Create a new directory directly under `src/`
2. Add an `index.ts` file with proper exports and documentation
3. Update the main `src/index.ts` to include the new domain
4. Update this README with the new domain information

## Domain Guidelines

- Each domain should have a single, clear responsibility
- Domains should be as independent as possible
- Shared types and utilities should go in the `core` domain
- UI components that don't belong to a specific domain go in `ui-components`
- Each domain should have comprehensive exports in its `index.ts`
- Domains represent cross-application functionality (distinct from app-specific code)