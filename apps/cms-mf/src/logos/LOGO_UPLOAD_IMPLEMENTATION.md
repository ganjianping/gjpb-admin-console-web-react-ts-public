# Logo Upload Implementation - Two Methods

## Overview
Implemented support for creating logo images using two methods:
1. **Create by URL** - Provide an `originalUrl` to create the logo
2. **Upload File** - Upload an image file directly

## API Endpoints

### 1. Create Logo by URL
**Endpoint:** `POST /v1/logos`

**Request Body:**
```json
{
  "name": "百度",
  "originalUrl": "https://static.vecteezy.com/system/resources/previews/009/251/158/non_2x/color-game-avatar-round-bright-frame-template-for-game-ui-vector.jpg",
  "tags": "AI",
  "displayOrder": 2,
  "lang": "EN",
  "isActive": true
}
```

### 2. Create Logo by File Upload
**Endpoint:** `POST /v1/logos/upload`

**Request Type:** `multipart/form-data`

**Form Fields:**
- `file` - The image file (required)
- `name` - Logo name (required)
- `tags` - Tags (required)
- `displayOrder` - Display order (optional)
- `lang` - Language code (required)
- `isActive` - Active status (optional)

## Implementation Details

### 1. Updated Service Layer (`logoService.ts`)

#### Modified Types:
```typescript
// Create logo request by originalUrl
export interface CreateLogoRequest {
  name: string;
  originalUrl: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}

// Create logo request by file upload
export interface CreateLogoByUploadRequest {
  file: File;
  name: string;
  tags: string;
  lang: string;
  displayOrder?: number;
  isActive?: boolean;
}
```

#### New Methods:
- `createLogo()` - Creates logo using originalUrl
- `createLogoByUpload()` - Creates logo by uploading a file

### 2. Updated Form Types (`logo.types.ts`)

```typescript
export interface LogoFormData {
  name: string;
  originalUrl: string;
  filename: string;
  extension: string;
  logoUrl: string;
  tags: string;
  lang: string;
  displayOrder: number;
  isActive: boolean;
  // New fields for file upload
  uploadMethod: 'url' | 'file';
  file?: File | null;
}
```

### 3. Updated Form Dialog (`LogoFormDialog.tsx`)

**Key Features:**
- Radio buttons to select upload method (URL or File) - only shown in create mode
- File upload button with file selector - shown when uploadMethod is 'file'
- Shows selected file name and size
- Original URL field - shown when uploadMethod is 'url' or in edit mode
- Simplified form for create mode (only shows essential fields)
- Full form for edit mode (shows all fields including filename, extension, logoUrl)

### 4. Updated Handlers (`useLogoHandlers.ts`)

**Enhanced `createLogo()` function:**
- Checks `uploadMethod` to determine which API to call
- For 'file' method: validates file presence and calls `createLogoByUpload()`
- For 'url' method: validates originalUrl and calls `createLogo()`

**Enhanced `validateForm()` function:**
- Different validation rules for create vs edit mode
- In create mode:
  - If uploadMethod is 'file': validates file is selected
  - If uploadMethod is 'url': validates originalUrl
- In edit mode: validates all fields (filename, extension, logoUrl, etc.)

### 5. Updated Dialog Hook (`useLogoDialog.ts`)

**Changes:**
- Added `uploadMethod: 'url'` and `file: null` to initial form state
- Updated `handleFormChange` to accept any type of value (to support File objects)

### 6. Added Translations

**English:**
- `logos.errors.fileRequired`: "Please select a file to upload"
- `logos.errors.originalUrlRequired`: "Original URL is required"

**Chinese:**
- `logos.errors.fileRequired`: "请选择要上传的文件"
- `logos.errors.originalUrlRequired`: "原始URL为必填项"

## User Flow

### Create Logo by URL:
1. Click "Create Logo" button
2. Select "By URL" radio button (default)
3. Fill in:
   - Name (required)
   - Original URL (required)
   - Tags (required)
   - Language (required)
   - Display Order (optional)
   - Active Status (optional)
4. Click "Save"
5. POST request sent to `/v1/logos` with JSON payload

### Create Logo by File Upload:
1. Click "Create Logo" button
2. Select "Upload File" radio button
3. Click "Choose File" button and select an image
4. Fill in:
   - Name (required)
   - Tags (required)
   - Language (required)
   - Display Order (optional)
   - Active Status (optional)
5. Click "Save"
6. POST request sent to `/v1/logos/upload` with multipart/form-data

### Edit Logo:
1. Click "Edit" on an existing logo
2. Form shows all fields (no upload method selection)
3. Can modify:
   - Name
   - Original URL (optional)
   - Logo URL
   - Filename
   - Extension
   - Tags
   - Language
   - Display Order
   - Active Status
4. Click "Save"
5. PUT request sent to `/v1/logos/{id}`

## Technical Notes

1. **FormData**: The file upload uses native FormData API to send multipart/form-data
2. **Content-Type**: FormData automatically sets the correct Content-Type header with boundary
3. **Validation**: Client-side validation ensures required fields are filled before submission
4. **Error Handling**: Comprehensive error messages for both upload methods
5. **Type Safety**: Full TypeScript type definitions for all new interfaces

## Files Modified

1. `apps/cms-mf/src/logos/services/logoService.ts` - Added upload service method
2. `apps/cms-mf/src/logos/types/logo.types.ts` - Added uploadMethod and file fields
3. `apps/cms-mf/src/logos/components/LogoFormDialog.tsx` - Added UI for both methods
4. `apps/cms-mf/src/logos/hooks/useLogoDialog.ts` - Updated form state
5. `apps/cms-mf/src/logos/hooks/useLogoHandlers.ts` - Added dual-method create logic
6. `apps/cms-mf/src/logos/i18n/translations.ts` - Added new translation keys

## Testing Recommendations

1. Test creating logo with valid URL
2. Test creating logo with file upload
3. Test validation errors for missing fields
4. Test file size limits (if any)
5. Test supported file types (image formats)
6. Test editing existing logos
7. Test switching between URL and File upload methods in create mode
