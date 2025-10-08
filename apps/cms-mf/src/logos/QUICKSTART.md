# Logos Module - Quick Start Guide

## 🚀 Quick Start

The Logos CRUD module has been successfully generated based on the `cms-mf/websites` template!

## 📁 What Was Created

A complete CRUD system for managing logos with the following structure:

```
apps/cms-mf/src/logos/
├── components/          # 7 UI components
├── hooks/              # 4 custom hooks
├── services/           # API service
├── types/              # TypeScript interfaces
├── i18n/               # EN & ZH translations
├── constants/          # Configuration
├── pages/              # Main page
└── README.md           # Documentation
```

## 🔌 Integration Steps

### 1. Add Route to Your Application

Add the logos route to your router configuration:

```typescript
import { LogosPage } from './apps/cms-mf/src/logos';

// In your routing configuration
<Route path="/admin/logos" element={<LogosPage />} />
```

### 2. Add Navigation Link (Optional)

Add a navigation link in your sidebar/menu:

```typescript
{
  label: 'Logos',
  path: '/admin/logos',
  icon: <ImageIcon />
}
```

### 3. Update Public API Export (Optional)

If you want to export the logos module from cms-mf:

```typescript
// apps/cms-mf/src/public-api.ts
export { LogosPage } from './logos';
export * from './logos/types/logo.types';
```

## 🎯 Features Included

✅ **Full CRUD Operations**
- Create new logos
- View logo details
- Edit existing logos  
- Delete logos with confirmation

✅ **Search & Filter**
- Search by name
- Filter by language (EN/ZH)
- Filter by tags
- Filter by active status

✅ **Rich UI Components**
- Material-UI design
- Responsive layout
- Loading states
- Error handling
- Success/error notifications

✅ **Internationalization**
- English translations
- Chinese translations
- Language-aware tag filtering

## 📡 API Integration

The module expects these API endpoints to be available:

```
GET    /v1/logos           # List all logos
GET    /v1/logos/:id       # Get logo details
POST   /v1/logos           # Create logo
PUT    /v1/logos/:id       # Update logo
DELETE /v1/logos/:id       # Delete logo
```

### Expected Response Format

```json
{
  "status": {
    "code": 200,
    "message": "Success"
  },
  "data": [
    {
      "id": "uuid",
      "name": "Logo Name",
      "originalUrl": "https://...",
      "filename": "logo.jpg",
      "extension": "jpg",
      "logoUrl": "/uploads/logos/logo.jpg",
      "tags": "AI,Tech",
      "lang": "EN",
      "displayOrder": 1,
      "isActive": true,
      "createdAt": "2025-10-07T21:42:55",
      "updatedAt": "2025-10-07T21:42:55",
      "createdBy": "uuid",
      "updatedBy": "uuid"
    }
  ]
}
```

## 🎨 Customization

### Change Default Language
Edit `apps/cms-mf/src/logos/constants/index.ts`:
```typescript
DEFAULT_LANGUAGE: 'ZH', // Change to 'ZH' for Chinese
```

### Modify Validation Rules
Edit `apps/cms-mf/src/logos/hooks/useLogoHandlers.ts`:
```typescript
const validateForm = (formData: LogoFormData) => {
  // Add your custom validation logic
}
```

### Add Custom Fields
1. Update `Logo` interface in `types/logo.types.ts`
2. Update form in `components/LogoFormDialog.tsx`
3. Update table in `components/LogoTable.tsx`
4. Add translations in `i18n/translations.ts`

## 🧪 Testing

Test the module by:

1. **Navigate to the logos page**
   ```
   http://localhost:3000/admin/logos
   ```

2. **Test Create**
   - Click "Create Logo" button
   - Fill in the form
   - Submit

3. **Test Search**
   - Click search button to expand search panel
   - Enter search criteria
   - Click "Search"

4. **Test Actions**
   - Click the action menu (⋮) on any logo row
   - Test View, Edit, and Delete actions

## 🐛 Troubleshooting

### Issue: API calls fail with 404
**Solution**: Verify your API base URL is correctly configured in `shared-lib/src/api/api-client.ts`

### Issue: Translations not showing
**Solution**: Check that i18n is properly initialized in your app and translations are loaded

### Issue: Table not displaying data
**Solution**: 
1. Check browser console for errors
2. Verify API response format matches expected structure
3. Check that `tagsArray` is being created from `tags` string

## 📚 Additional Resources

- Full documentation: `apps/cms-mf/src/logos/README.md`
- Type definitions: `apps/cms-mf/src/logos/types/logo.types.ts`
- API service: `apps/cms-mf/src/logos/services/logoService.ts`

## 🎉 You're All Set!

The Logos CRUD module is ready to use. Simply integrate it into your application using the steps above.

For questions or issues, refer to the detailed README.md in the logos directory.
