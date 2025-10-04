# Shell Application - Feature-Based Architecture

This document describes the new feature-based organization of the shell application.

## 🏗️ Architecture Overview

The shell application has been restructured to follow a **feature-first** approach, where related components, services, and logic are co-located by feature rather than by technical layer.

## 📁 Directory Structure

```
apps/shell/src/
├── features/                    # Feature-based organization
│   ├── authentication/         # Authentication & authorization
│   │   ├── components/         # Auth-specific components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/             # Auth-related pages
│   │   │   └── UnauthorizedPage.tsx
│   │   ├── services/          # Auth services
│   │   │   └── shell-auth-service.ts
│   │   ├── store/             # Auth Redux slice
│   │   │   └── authSlice.ts
│   │   └── index.ts           # Feature exports
│   │
│   ├── navigation/            # Navigation & routing
│   │   ├── components/        # Navigation components
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── layouts/           # Layout components
│   │   │   └── MainLayout.tsx
│   │   ├── pages/             # Navigation-related pages
│   │   │   └── NotFoundPage.tsx
│   │   ├── routes/            # Route definitions
│   │   │   └── AppRoutes.tsx
│   │   └── index.ts           # Feature exports
│   │
│   ├── dashboard/             # Dashboard functionality
│   │   ├── pages/             # Dashboard pages
│   │   │   └── DashboardPage.tsx
│   │   └── index.ts           # Feature exports
│   │
│   ├── theme/                 # Theme management
│   │   ├── components/        # Theme-related components
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── theme.ts
│   │   └── index.ts           # Feature exports
│   │
│   ├── settings/              # User settings
│   │   ├── pages/             # Settings pages
│   │   │   └── SettingsPage.tsx
│   │   └── index.ts           # Feature exports
│   │
│   └── refresh-warning/       # Refresh warning system
│       ├── RefreshWarningDialog.tsx
│       ├── RefreshWarningProvider.tsx
│       ├── useCustomRefreshWarning.ts
│       ├── README.md
│       └── index.ts           # Feature exports
│
├── shared/                    # Shared utilities across features
│   ├── components/            # Shared components
│   │   └── AppLoading.tsx
│   ├── hooks/                 # Shared hooks
│   │   └── useRedux.ts
│   ├── store/                 # Global Redux store
│   │   ├── store.ts
│   │   └── uiSlice.ts
│   ├── config/                # Shared configuration
│   │   └── i18n.config.ts
│   └── index.ts               # Shared exports
│
├── __tests__/                 # Test files
├── main.tsx                   # Application entry point
├── index.css                  # Global styles
└── vite-env.d.ts             # Vite type definitions
```

## 🎯 Features

### 1. Authentication (`/features/authentication/`)
**Purpose**: Handles user authentication, authorization, and session management.

**Contains**:
- `ProtectedRoute.tsx` - Route protection component
- `UnauthorizedPage.tsx` - 401/403 error page
- `shell-auth-service.ts` - Authentication service
- `authSlice.ts` - Authentication Redux state

**Key Responsibilities**:
- JWT token management
- User session validation
- Route-level access control
- Login/logout coordination with auth-mf

### 2. Navigation (`/features/navigation/`)
**Purpose**: Manages application routing, navigation UI, and layout structure.

**Contains**:
- `Header.tsx` - Top navigation bar
- `Sidebar.tsx` - Side navigation menu
- `MainLayout.tsx` - Main application layout
- `AppRoutes.tsx` - Route definitions
- `NotFoundPage.tsx` - 404 error page

**Key Responsibilities**:
- Application routing
- Navigation UI components
- Layout management
- Microfrontend route coordination

### 3. Dashboard (`/features/dashboard/`)
**Purpose**: Main dashboard functionality and user landing page.

**Contains**:
- `DashboardPage.tsx` - Main dashboard page

**Key Responsibilities**:
- User dashboard display
- Quick stats and overview
- User profile synchronization

### 4. Theme (`/features/theme/`)
**Purpose**: Theme management and UI styling coordination.

**Contains**:
- `ThemeProvider.tsx` - Theme context provider
- `theme.ts` - Theme configuration

**Key Responsibilities**:
- Light/dark mode management
- Color theme switching
- Material-UI theme configuration

### 5. Settings (`/features/settings/`)
**Purpose**: User and application settings management.

**Contains**:
- `SettingsPage.tsx` - Settings configuration page

**Key Responsibilities**:
- User preference management
- Application configuration
- Settings persistence

### 6. Refresh Warning (`/features/refresh-warning/`)
**Purpose**: Prevents accidental logout during page refresh/navigation.

**Contains**:
- `RefreshWarningDialog.tsx` - Warning dialog component
- `RefreshWarningProvider.tsx` - Provider component
- `useCustomRefreshWarning.ts` - Custom hook for refresh detection

**Key Responsibilities**:
- Page refresh detection
- Navigation warning dialogs
- User session preservation

## 🔗 Shared Layer (`/shared/`)

The shared layer contains utilities and components used across multiple features:

- **Components**: Reusable UI components (AppLoading, etc.)
- **Hooks**: Shared React hooks (useRedux, etc.)
- **Store**: Global Redux store and UI state management
- **Config**: Shared configuration files (i18n, etc.)

## 📦 Import Patterns

### Feature Imports
```typescript
// Import from specific features
import { ProtectedRoute } from './features/authentication';
import { Header, Sidebar, MainLayout } from './features/navigation';
import { DashboardPage } from './features/dashboard';

// Import from shared utilities
import { useAppDispatch, useAppSelector } from './shared/hooks/useRedux';
import { AppLoading } from './shared/components/AppLoading';
```

### Cross-Feature Communication
```typescript
// Authentication feature using shared store
import { useAppDispatch } from '../../shared/hooks/useRedux';

// Navigation using authentication state
import { selectCurrentUser } from '../authentication/store/authSlice';
```

## 🚀 Benefits

1. **Better Organization**: Related code is co-located by feature
2. **Easier Maintenance**: Changes to a feature are contained within its directory
3. **Improved Discoverability**: Clear structure makes finding code intuitive
4. **Reduced Coupling**: Features have clear boundaries and dependencies
5. **Scalability**: Easy to add new features without cluttering existing structure
6. **Team Collaboration**: Different features can be worked on independently

## 🔄 Migration Notes

- All import paths have been updated to reflect the new structure
- Each feature has its own `index.ts` for clean exports
- Shared utilities are clearly separated from feature-specific code
- The architecture supports easy addition of new features
- Maintains backward compatibility with existing microfrontend integrations

## 📝 Adding New Features

To add a new feature:

1. Create a new directory under `/features/`
2. Organize by: `components/`, `pages/`, `services/`, `store/`, etc.
3. Create an `index.ts` file for exports
4. Update imports in files that use the new feature
5. Document the feature's purpose and responsibilities

This architecture provides a solid foundation for continued development and maintenance of the shell application.