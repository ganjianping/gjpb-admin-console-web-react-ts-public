# Rubi MF Integration Guide

## Quick Start

### Step 1: Build the Module

If using npm workspaces, the module will be built with the root project:
```bash
npm run build
```

Or build individually:
```bash
cd apps/rubi-mf
npm run build
```

### Step 2: Add Route to Shell Application

In your shell router configuration (typically in `apps/shell/src/core/router.tsx` or similar):

```tsx
import { VocabulariesPage } from '@rubi-mf';

// Add to your route configuration
const routes = [
  {
    path: '/vocabularies',
    element: <VocabulariesPage />,
    name: 'Vocabularies'
  },
  // ... other routes
];
```

### Step 3: Add Navigation Menu Item

Add a menu item in your navigation component:

```tsx
<NavLink to="/vocabularies" icon={<BookOpen />}>
  Vocabularies
</NavLink>
```

### Step 4: Configure API Base URL

The module uses the shared `apiClient` from `shared-lib`. Make sure your API base URL is configured in your environment:

```tsx
// In your app initialization or env config
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
```

## Module Exports

The rubi-mf module exports:

```typescript
// Main Page Component
export { VocabulariesPage }

// Type Definitions
export type {
  Vocabulary,
  VocabularyFormData,
  VocabularyPaginatedResponse,
  VocabularySearchFormData,
  VocabularyActionType
}

// Service
export { vocabularyService }
```

## Usage Examples

### Import and Use in Components

```tsx
import { VocabulariesPage, vocabularyService, type Vocabulary } from '@rubi-mf';

// Use in routes
<Route path="/vocabularies" element={<VocabulariesPage />} />

// Use service directly
const { data } = await vocabularyService.getVocabularies({
  page: 0,
  size: 20,
  lang: 'EN'
});
```

### Direct Service Usage

```tsx
import { vocabularyService } from '@rubi-mf';

// Get vocabularies
const response = await vocabularyService.getVocabularies({
  page: 0,
  size: 20,
  sort: 'updatedAt',
  direction: 'desc'
});

// Create vocabulary
const newVocab = await vocabularyService.createVocabulary({
  word: 'hello',
  definition: 'a polite greeting',
  lang: 'EN',
  isActive: true
});

// Update vocabulary
await vocabularyService.updateVocabulary(id, {
  definition: 'updated definition'
});

// Delete vocabulary
await vocabularyService.deleteVocabulary(id);
```

## Features Overview

### 1. Vocabularies Page
Main page component that handles the complete CRUD workflow:
- Display paginated list of vocabularies
- Search and filter functionality
- Create new vocabularies
- Edit existing vocabularies
- View vocabulary details
- Delete vocabularies

### 2. Search & Filter
- **By Word**: Search by partial word match
- **By Language**: Filter by EN, ZH, etc.
- **By Tags**: Filter by comma-separated tags
- **By Status**: Filter by active/inactive

### 3. Vocabulary Fields
The module supports all vocabulary attributes:
- Word and definition
- Translation and example
- Part of speech and tenses
- Synonyms and plural forms
- Phonetic and audio files
- Word images
- Tags and language

### 4. Internationalization
Built-in support for:
- English (en)
- Chinese Simplified (zh)
- Easy to extend with more languages

## Architecture

### Folder Structure
```
vocabularies/
├── components/      # React UI components
├── hooks/          # Custom React hooks
├── services/       # API client service
├── types/          # TypeScript interfaces
├── constants/      # Configuration
├── utils/          # Helper functions
├── pages/          # Page component
└── i18n/           # Translations
```

### State Management
- Uses React hooks for state management
- Custom hooks: `useVocabularies`, `useVocabularyDialog`, `useVocabularySearch`
- Local component state for forms and dialogs

### Component Hierarchy
```
VocabulariesPage
├── VocabularyPageHeader
├── VocabularySearchPanel
├── VocabularyTable
│   ├── ActionMenu
│   └── Columns
├── VocabularyCreateDialog
├── VocabularyEditDialog
├── VocabularyViewDialog
└── DeleteVocabularyDialog
```

## Styling

The module uses Material-UI (MUI) components and follows the existing shell theme:
- Responsive design
- Dark mode support
- Consistent typography and spacing
- Icon integration with lucide-react

To customize styling, modify the `sx` props in component files.

## Error Handling

The module includes error handling for:
- API failures
- Network errors
- Form validation
- User actions (create, update, delete)

Errors are logged to console and can be displayed via toast notifications by integrating with your notification system.

## Performance

### Pagination
- Default page size: 20 items
- Configurable page size
- Lazy loading of data

### Memoization
- Components memoized with `React.memo`
- Hooks memoized with `useMemo` and `useCallback`
- Prevents unnecessary re-renders

## Testing

To test the module:

1. **Unit Tests**: Add tests in `__tests__` directories
2. **Integration Tests**: Test with actual API
3. **E2E Tests**: Test full workflows in shell application

Example service call testing:
```tsx
import { vocabularyService } from '@rubi-mf';

describe('vocabularyService', () => {
  it('should fetch vocabularies', async () => {
    const response = await vocabularyService.getVocabularies();
    expect(response.status.code).toBe(200);
    expect(response.data.content).toBeArray();
  });
});
```

## Troubleshooting

### Issue: Module not found
**Solution**: Ensure workspace configuration in root package.json and rubi-mf is properly linked

### Issue: API errors
**Solution**: Check API base URL configuration and ensure backend is running on correct port

### Issue: Translations not loading
**Solution**: Verify i18n.addResourceBundle calls in translations.ts

### Issue: Types not resolving
**Solution**: Ensure tsconfig paths are correct in `apps/rubi-mf/tsconfig.json`

## Browser Support

The module supports:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

### Core Dependencies
- React 18+
- @mui/material
- lucide-react
- react-i18next
- date-fns

### Shared Dependencies
- shared-lib (for API client)

All dependencies should be installed at the root workspace level.

## Future Enhancements

Potential improvements:
- [ ] Bulk import/export functionality
- [ ] Advanced search with regex support
- [ ] Pronunciation audio playback
- [ ] Image upload and validation
- [ ] Related vocabulary suggestions
- [ ] Quiz/practice mode
- [ ] Statistics dashboard
- [ ] API versioning support

## Support & Maintenance

For issues or feature requests:
1. Check existing documentation
2. Review component source code
3. Check API endpoint compatibility
4. Verify environment configuration

## Version History

- **v1.0.0** (2025-01-04) - Initial release with full CRUD functionality
