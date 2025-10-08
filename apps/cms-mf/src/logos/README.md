# Logos Module

This module provides complete CRUD (Create, Read, Update, Delete) functionality for managing logo images in the CMS application.

## Features

- ✅ View all logos with sorting and filtering
- ✅ Create new logos
- ✅ Edit existing logos
- ✅ Delete logos with confirmation
- ✅ Search and filter by name, language, tags, and status
- ✅ Client-side filtering for fast searches
- ✅ Responsive Material-UI design
- ✅ Internationalization (i18n) support (English & Chinese)
- ✅ Form validation
- ✅ Error handling
- ✅ Success/error notifications

## Structure

```
logos/
├── components/          # UI Components
│   ├── LogoPageHeader.tsx       # Page header with create button
│   ├── LogoSearchPanel.tsx      # Search and filter panel
│   ├── LogoTable.tsx            # Data table with actions
│   ├── LogoDialog.tsx           # Dialog router component
│   ├── LogoFormDialog.tsx       # Form for create/edit
│   ├── LogoViewDialog.tsx       # Read-only view dialog
│   ├── DeleteLogoDialog.tsx     # Delete confirmation dialog
│   └── index.ts                 # Component exports
├── hooks/               # Custom React hooks
│   ├── useLogos.ts             # Data fetching & state
│   ├── useLogoDialog.ts        # Dialog UI state
│   ├── useLogoHandlers.ts      # CRUD operations
│   ├── useLogoSearch.ts        # Search functionality
│   └── index.ts                # Hook exports
├── services/            # API services
│   └── logoService.ts          # Logo API client
├── types/               # TypeScript types
│   └── logo.types.ts           # Logo interfaces
├── i18n/                # Internationalization
│   └── translations.ts         # EN & ZH translations
├── constants/           # Constants
│   └── index.ts                # Logo constants
├── pages/               # Page components
│   └── LogosPage.tsx           # Main page component
└── index.ts             # Module exports
```

## API Endpoints

The module connects to the following API endpoints:

- `GET /v1/logos` - Get all logos
- `GET /v1/logos/:id` - Get a specific logo
- `POST /v1/logos` - Create a new logo
- `PUT /v1/logos/:id` - Update an existing logo
- `DELETE /v1/logos/:id` - Delete a logo

## Data Model

```typescript
interface Logo {
  id: string;
  name: string;
  originalUrl: string | null;
  filename: string;
  extension: string;
  logoUrl: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  tagsArray: string[];
}
```

## Usage

### Import the LogosPage

```typescript
import { LogosPage } from './apps/cms-mf/src/logos';

// In your router
<Route path="/logos" element={<LogosPage />} />
```

### Use the Logo Service

```typescript
import { logoService } from './apps/cms-mf/src/logos';

// Get all logos
const response = await logoService.getLogos();

// Create a logo
const newLogo = await logoService.createLogo({
  name: 'Google',
  filename: 'google.png',
  extension: 'png',
  logoUrl: '/uploads/logos/google.png',
  tags: 'search,tech',
  lang: 'EN',
  displayOrder: 1,
  isActive: true,
});
```

## Customization

### Adding New Fields

1. Update `Logo` interface in `types/logo.types.ts`
2. Update `LogoFormData` interface
3. Add field to `LogoFormDialog.tsx`
4. Add column to `LogoTable.tsx`
5. Update API service types if needed
6. Add translations in `i18n/translations.ts`

### Changing Validation Rules

Edit `useLogoHandlers.ts` and update the `validateForm` function.

### Styling

The module uses Material-UI (MUI) components. Customize styles by:
- Modifying the `sx` props in components
- Updating the theme in the main app
- Using MUI's styling solutions

## Dependencies

- React 18+
- Material-UI (MUI) v5+
- react-i18next (internationalization)
- lucide-react (icons)
- date-fns (date formatting)
- @tanstack/react-table (table functionality)

## Notes

- The API response does not include pagination metadata, so the table shows all logos at once
- Client-side filtering is used for searching
- Tags are stored as comma-separated strings and converted to arrays for display
- The module follows the same architecture pattern as the websites module for consistency
