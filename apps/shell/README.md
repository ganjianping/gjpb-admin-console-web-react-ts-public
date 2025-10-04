# Shell Application - Domain-Based Architecture

This document describes the domain-based organization of the shell application.

## 🏗️ Architecture Overview

The shell application follows a **domain-first** approach, where related components, services, and logic are co-located by domain rather than by technical layer. Each domain represents a distinct area of functionality within the shell.

## 📁 Directory Structure

```
apps/shell/src/
├── authentication/            # Authentication & authorization domain
│   ├── components/           # Auth-specific components
│   │   └── ProtectedRoute.tsx
│   ├── pages/               # Auth-related pages
│   │   └── UnauthorizedPage.tsx
│   ├── services/            # Auth services
│   │   └── shell-auth-service.ts
│   ├── store/               # Auth Redux slice
│   │   └── authSlice.ts
│   └── index.ts             # Domain exports
│
├── navigation/              # Navigation & routing domain
│   ├── components/          # Navigation components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── layouts/             # Layout components
│   │   └── MainLayout.tsx
│   ├── pages/               # Navigation-related pages
│   │   └── NotFoundPage.tsx
│   ├── routes/              # Route definitions
│   │   └── AppRoutes.tsx
│   └── index.ts             # Domain exports
│
├── dashboard/               # Dashboard functionality domain
│   ├── pages/               # Dashboard pages
│   │   └── DashboardPage.tsx
│   └── index.ts             # Domain exports
│
├── theme/                   # Theme management domain
│   ├── components/          # Theme-related components
│   │   ├── ThemeProvider.tsx
│   │   └── theme.ts
│   └── index.ts             # Domain exports
│
├── settings/                # User settings domain
│   ├── pages/               # Settings pages
│   │   └── SettingsPage.tsx
│   └── index.ts             # Domain exports
│
├── refresh-warning/         # Refresh warning system domain
│   ├── RefreshWarningDialog.tsx
│   ├── RefreshWarningProvider.tsx
│   ├── useCustomRefreshWarning.ts
│   ├── README.md
│   └── index.ts             # Domain exports
│
├── core/                    # Shell-specific shared utilities
│   ├── components/          # Shell shared components
│   │   └── AppLoading.tsx
│   ├── hooks/               # Shell shared hooks
│   │   └── useRedux.ts
│   ├── store/               # Global Redux store
│   │   ├── store.ts
│   │   └── uiSlice.ts
│   ├── config/              # Shell configuration
│   │   └── i18n.config.ts
│   └── index.ts             # Core exports
│
├── main.tsx                 # Application entry point
├── index.css                # Global styles
└── vite-env.d.ts           # Vite type definitions
```

## 🎯 Domains

### 1. Authentication (`/authentication/`)
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

### 2. Navigation (`/navigation/`)
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

### 3. Dashboard (`/dashboard/`)
**Purpose**: Main dashboard functionality and user landing page.

**Contains**:
- `DashboardPage.tsx` - Main dashboard page

**Key Responsibilities**:
- User dashboard display
- Quick stats and overview
- User profile synchronization

### 4. Theme (`/theme/`)
**Purpose**: Theme management and UI styling coordination.

**Contains**:
- `ThemeProvider.tsx` - Theme context provider
- `theme.ts` - Theme configuration

**Key Responsibilities**:
- Light/dark mode management
- Color theme switching
- Material-UI theme configuration

### 5. Settings (`/settings/`)
**Purpose**: User and application settings management.

**Contains**:
- `SettingsPage.tsx` - Settings configuration page

**Key Responsibilities**:
- User preference management
- Application configuration
- Settings persistence

### 6. Refresh Warning (`/refresh-warning/`)
**Purpose**: Prevents accidental logout during page refresh/navigation.

**Contains**:
- `RefreshWarningDialog.tsx` - Warning dialog component
- `RefreshWarningProvider.tsx` - Provider component
- `useCustomRefreshWarning.ts` - Custom hook for refresh detection

**Key Responsibilities**:
- Page refresh detection
- Navigation warning dialogs
- User session preservation

## 🔗 Core Layer (`/core/`)

The core layer contains shell-specific utilities and components used across multiple domains:

- **Components**: Shell-specific reusable UI components (AppLoading, etc.)
- **Hooks**: Shell-specific React hooks (useRedux, etc.)
- **Store**: Global Redux store and UI state management for the shell
- **Config**: Shell-specific configuration files (i18n, etc.)

*Note: This is distinct from `shared-lib` which contains cross-application shared code.*

## 📦 Import Patterns

### Domain Imports
```typescript
// Import from specific domains
import { ProtectedRoute } from './authentication';
import { Header, Sidebar, MainLayout } from './navigation';
import { DashboardPage } from './dashboard';

// Import from core utilities
import { useAppDispatch, useAppSelector } from './core/hooks/useRedux';
import { AppLoading } from './core/components/AppLoading';
```

### Cross-Domain Communication
```typescript
// Authentication domain using core store
import { useAppDispatch } from '../../core/hooks/useRedux';

// Navigation using authentication state
import { selectCurrentUser } from '../authentication/store/authSlice';
```

## 🚀 Benefits

1. **Better Organization**: Related code is co-located by domain
2. **Easier Maintenance**: Changes to a domain are contained within its directory
3. **Improved Discoverability**: Flat structure makes finding code intuitive
4. **Reduced Coupling**: Domains have clear boundaries and dependencies
5. **Scalability**: Easy to add new domains without deep nesting
6. **Team Collaboration**: Different domains can be worked on independently
7. **Clear Separation**: `core/` for shell utilities vs `shared-lib/` for cross-app code

## 🔄 Migration Notes

- Migrated from nested `features/` structure to flat domain organization
- Renamed `shared/` to `core/` to avoid confusion with `shared-lib`
- All import paths have been updated to reflect the new structure
- Each domain has its own `index.ts` for clean exports
- Core utilities are clearly separated from domain-specific code
- The architecture supports easy addition of new domains
- Maintains backward compatibility with existing microfrontend integrations

## 📝 Adding New Domains

To add a new domain:

1. Create a new directory directly under `/src/`
2. Organize by: `components/`, `pages/`, `services/`, `store/`, etc.
3. Create an `index.ts` file for exports
4. Update imports in files that use the new domain
5. Document the domain's purpose and responsibilities

This architecture provides a solid foundation for continued development and maintenance of the shell application.