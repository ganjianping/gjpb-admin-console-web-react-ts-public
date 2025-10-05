# CMS Micro Frontend - Implementation Guide

## Overview
This document provides instructions for completing the cms-mf module implementation.

## Current Status
✅ Created directory structure
✅ Created types (website.types.ts)
✅ Created service (websiteService.ts)
✅ Created constants
✅ Created i18n translations (EN/ZH)
✅ Created utilities
✅ Created all hooks
✅ Created WebsitePageHeader component

## Remaining Tasks

### 1. Complete Components
Copy and adapt these components from `apps/bm-mf/src/app-settings/components/`:

1. **WebsiteSearchPanel.tsx** - Copy from AppSettingSearchPanel.tsx
   - Replace `appSettings` → `websites`
   - Replace `AppSetting` → `Website`
   - Update fields: name, lang, tags (instead of isSystem/isPublic), isActive

2. **WebsiteTable.tsx** - Copy from AppSettingTable.tsx
   - Replace types and translations
   - Update columns: name, url, logoUrl (show as image), tags (show as chips), lang, displayOrder, isActive, updatedAt

3. **WebsiteDialog.tsx** - Copy from AppSettingDialog.tsx
   - Update form fields: name, url, logoUrl, description (multiline), tags, lang, displayOrder (number), isActive (switch)

4. **DeleteWebsiteDialog.tsx** - Copy from DeleteAppSettingDialog.tsx
   - Simple find/replace `appSetting` → `website`

5. **WebsiteTableSkeleton.tsx** - Copy from AppSettingTableSkeleton.tsx
   - Simple find/replace

### 2. Create Pages

Create `apps/cms-mf/src/websites/pages/WebsitesPage.tsx` by copying from:
`apps/bm-mf/src/app-settings/pages/AppSettingsPage.tsx`

Find and replace:
- `appSettings` → `websites`  
- `AppSetting` → `Website`
- `useAppSettings` → `useWebsites`
- `useAppSettingDialog` → `useWebsiteDialog`
- `useAppSettingSearch` → `useWebsiteSearch`
- `useAppSettingHandlers` → `useWebsiteHandlers`

Create `apps/cms-mf/src/websites/pages/index.ts`:
```typescript
export * from './WebsitesPage';
```

### 3. Quick Copy Commands

Run these commands from the workspace root:

```bash
# Navigate to workspace
cd /Users/ganjianping/Code/gjp-blog-public/gjpb-admin-console-web-react-ts-public

# Copy and adapt SearchPanel
cp apps/bm-mf/src/app-settings/components/AppSettingSearchPanel.tsx apps/cms-mf/src/websites/components/WebsiteSearchPanel.tsx

# Copy and adapt Table
cp apps/bm-mf/src/app-settings/components/AppSettingTable.tsx apps/cms-mf/src/websites/components/WebsiteTable.tsx

# Copy and adapt Dialog
cp apps/bm-mf/src/app-settings/components/AppSettingDialog.tsx apps/cms-mf/src/websites/components/WebsiteDialog.tsx

# Copy and adapt Delete Dialog
cp apps/bm-mf/src/app-settings/components/DeleteAppSettingDialog.tsx apps/cms-mf/src/websites/components/DeleteWebsiteDialog.tsx

# Copy and adapt Table Skeleton
cp apps/bm-mf/src/app-settings/components/AppSettingTableSkeleton.tsx apps/cms-mf/src/websites/components/WebsiteTableSkeleton.tsx

# Create pages directory
mkdir -p apps/cms-mf/src/websites/pages

# Copy and adapt Page
cp apps/bm-mf/src/app-settings/pages/AppSettingsPage.tsx apps/cms-mf/src/websites/pages/WebsitesPage.tsx
```

### 4. Find and Replace in Copied Files

For each copied file, perform these replacements:

**WebsiteSearchPanel.tsx:**
- `appSettings` → `websites`
- `AppSetting` → `Website`
- Remove isSystem and isPublic fields
- Add tags field (TextField)
- Keep isActive field

**WebsiteTable.tsx:**
- `appSettings` → `websites`
- `AppSetting` → `Website`
- Update columns to match Website type
- Add logo column with image display
- Add tags column with chip display

**WebsiteDialog.tsx:**
- `appSettings` → `websites`
- `AppSetting` → `Website`
- Update all form fields to match WebsiteFormData
- Add URL validation indicators
- Add displayOrder number field

**WebsitesPage.tsx:**
- Replace all hooks with website equivalents
- Update all type imports
- Update translation keys

### 5. API Endpoint

The API endpoint is already configured in websiteService.ts:
- GET /v1/websites (with pagination)
- GET /v1/websites/{id}
- POST /v1/websites
- PUT /v1/websites/{id}
- DELETE /v1/websites/{id}

### 6. Integration

After completing the components and pages:

1. Import in shell or main app:
```typescript
import { WebsitesPage } from '@cms-mf/websites';
```

2. Add route:
```typescript
{
  path: '/cms/websites',
  element: <WebsitesPage />
}
```

## File Structure
```
cms-mf/
├── src/
│   ├── websites/
│   │   ├── components/
│   │   │   ├── index.ts
│   │   │   ├── WebsitePageHeader.tsx ✅
│   │   │   ├── WebsiteSearchPanel.tsx ⏳
│   │   │   ├── WebsiteTable.tsx ⏳
│   │   │   ├── WebsiteDialog.tsx ⏳
│   │   │   ├── DeleteWebsiteDialog.tsx ⏳
│   │   │   └── WebsiteTableSkeleton.tsx ⏳
│   │   ├── hooks/
│   │   │   ├── index.ts ✅
│   │   │   ├── useWebsites.ts ✅
│   │   │   ├── useWebsiteDialog.ts ✅
│   │   │   ├── useWebsiteHandlers.ts ✅
│   │   │   ├── useWebsiteSearch.ts ✅
│   │   │   └── useWebsiteActionMenu.tsx ✅
│   │   ├── i18n/
│   │   │   └── translations.ts ✅
│   │   ├── pages/
│   │   │   ├── index.ts ⏳
│   │   │   └── WebsitesPage.tsx ⏳
│   │   ├── services/
│   │   │   └── websiteService.ts ✅
│   │   ├── types/
│   │   │   └── website.types.ts ✅
│   │   ├── utils/
│   │   │   ├── index.ts ✅
│   │   │   └── error-handler.ts ✅
│   │   ├── constants/
│   │   │   └── index.ts ✅
│   │   └── index.ts ✅
│   ├── public-api.ts ✅
│   └── vite-env.d.ts ✅
├── tsconfig.json ✅
└── README.md ✅
```

## Notes

- All TypeScript/JSX errors will resolve once files are copied and adapted
- The pattern is exactly the same as app-settings, just with different fields
- Use the API response structure provided to ensure field mapping is correct
- Test with the actual API endpoint to verify data flow

