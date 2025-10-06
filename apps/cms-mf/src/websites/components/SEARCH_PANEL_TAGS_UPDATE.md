# Search Panel Tags Multi-Select Update

## Overview
Updated the WebsiteSearchPanel to use a multi-select dropdown for filtering by tags, matching the same functionality added to WebsiteFormDialog. The tags are loaded from local storage and filtered by current language.

## Changes Made

### `WebsiteSearchPanel.tsx`

#### 1. **Added New Imports**
```typescript
import React, { useMemo } from 'react';
import { Chip, OutlinedInput } from '@mui/material';
```

#### 2. **Added Dynamic Tags Loading**
```typescript
const { t, i18n } = useTranslation(); // Added i18n for language detection

// Get website tags from local storage filtered by current language
const availableTags = useMemo(() => {
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (!settings) return [];

    const appSettings = JSON.parse(settings) as Array<{ 
      name: string; 
      value: string; 
      lang: string 
    }>;
    
    const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
    
    const websiteTagsSetting = appSettings.find(
      (setting) => setting.name === 'website_tags' && setting.lang === currentLang
    );

    if (!websiteTagsSetting) return [];

    return websiteTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
  } catch (error) {
    console.error('[WebsiteSearchPanel] Error loading tags:', error);
    return [];
  }
}, [i18n.language]);
```

#### 3. **Replaced "System Setting" Field with Tags Multi-Select**

**Before:**
```typescript
{/* System Setting */}
<Select
  value={searchFormData.tags}
  onChange={(e) => onFormChange('tags', e.target.value)}
>
  <MenuItem value="">All</MenuItem>
  <MenuItem value="true">System Only</MenuItem>
  <MenuItem value="false">Non-System</MenuItem>
</Select>
```

**After:**
```typescript
{/* Tags */}
<FormLabel>Tags</FormLabel>
<Select<string[]>
  multiple
  value={searchFormData.tags ? searchFormData.tags.split(',').map(t => t.trim()).filter(Boolean) : []}
  onChange={(e) => {
    const value = e.target.value;
    const tagsArray = typeof value === 'string' ? value.split(',') : value;
    onFormChange('tags', tagsArray.join(','));
  }}
  input={<OutlinedInput />}
  renderValue={(selected) => {
    if (selected.length === 0) {
      return <Typography color="text.disabled">All</Typography>;
    }
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => (
          <Chip key={value} label={value} size="small" />
        ))}
      </Box>
    );
  }}
>
  {availableTags.length > 0 ? (
    availableTags.map((tag) => (
      <MenuItem key={tag} value={tag}>{tag}</MenuItem>
    ))
  ) : (
    <MenuItem disabled>No tags available</MenuItem>
  )}
</Select>
```

#### 4. **Renamed "Public Setting" to "Status"**
- Changed field label from "Public Settings" to "Status"
- Updated menu items to use "Active" and "Inactive" instead of "Public Only" and "Private"
- More semantically correct labeling

**Before:**
```typescript
<FormLabel>Public Settings</FormLabel>
<Select value={searchFormData.isActive}>
  <MenuItem value="">All</MenuItem>
  <MenuItem value="true">Public Only</MenuItem>
  <MenuItem value="false">Private</MenuItem>
</Select>
```

**After:**
```typescript
<FormLabel>Status</FormLabel>
<Select value={searchFormData.isActive}>
  <MenuItem value="">All</MenuItem>
  <MenuItem value="true">Active</MenuItem>
  <MenuItem value="false">Inactive</MenuItem>
</Select>
```

## Search Panel Layout

The search panel now has 4 filter fields in a responsive grid:

1. **Name** (TextField) - Search by website name
2. **Language** (Select) - Filter by language (All, EN, ZH)
3. **Tags** (Multi-Select) - Filter by one or more tags
4. **Status** (Select) - Filter by active status (All, Active, Inactive)

## Features

### ✅ **Multi-Select Tags Filter**
- Select multiple tags to filter websites
- Shows chip-based display of selected tags
- Empty state shows "All" placeholder
- Language-aware tag options

### ✅ **Dynamic Loading**
- Tags loaded from `localStorage['gjpb_app_settings']`
- Filtered by current UI language (EN/ZH)
- Automatic refresh when language changes

### ✅ **Consistent UX**
- Same tag selection experience in both search and form
- Consistent styling with other search fields
- Proper theme support (dark/light mode)

### ✅ **Better Semantics**
- "Tags" field properly labeled and used for tag filtering
- "Status" field properly labeled (was "Public Settings")
- More intuitive field names

## Data Flow

### Search with Tags:
```typescript
// User selects: ["Technology", "AI"]
searchFormData.tags = "Technology,AI"

// API request includes:
{ tags: "Technology,AI" }

// Backend filters websites that have any of these tags
```

### Clear Filters:
```typescript
// User clicks "Clear Filters"
searchFormData.tags = ""

// Shows all websites (no tag filter applied)
```

## Local Storage Structure

Same structure as the form dialog:

```json
[
  {
    "name": "website_tags",
    "value": "Technology,Programming,AI,Web Development",
    "lang": "EN"
  },
  {
    "name": "website_tags",
    "value": "技术,编程,人工智能,网页开发",
    "lang": "ZH"
  }
]
```

## User Experience

### Searching with Tags:
1. User opens the search panel
2. Clicks on the Tags dropdown
3. Sees available tags for current language
4. Selects one or more tags
5. Selected tags appear as chips
6. Clicks "Search" to filter websites

### Language Switching:
1. User switches UI language
2. Tags dropdown updates to show tags in new language
3. Previously selected tags remain (if they exist in new language)
4. User can adjust selection and search

## Benefits

✅ **Consistent Experience** - Same tag selection in search and form  
✅ **Better Filtering** - Can filter by multiple tags at once  
✅ **Language-Aware** - Shows relevant tags for current language  
✅ **Visual Feedback** - Chip display makes selection clear  
✅ **Improved Semantics** - Field names match their actual purpose  
✅ **No Manual Typing** - Select from predefined options  

## Migration Notes

### Breaking Changes:
⚠️ The `tags` field in search was previously used for a boolean "System Setting" filter (true/false). This has been **changed** to actually filter by website tags (comma-separated string).

### If Backend Expects Different Behavior:
If the backend previously used the `tags` field for system/non-system filtering, you'll need to:
1. Add a new `isSystem` field to `WebsiteSearchFormData`
2. Add a new "System Setting" dropdown back to the search panel
3. Update the API to use the new field

### Recommended Backend Update:
The search endpoint should now interpret `tags` as:
```
GET /websites?tags=Technology,AI
→ Returns websites where tags contain "Technology" OR "AI"
```

## Testing Recommendations

1. **Multi-select**: Select multiple tags and verify filtering works
2. **Clear filters**: Verify clearing filters resets tags field
3. **Language switching**: Change language and verify tags update
4. **Empty state**: Test when no tags available in localStorage
5. **Backend integration**: Verify API receives correct comma-separated tags
6. **Status filter**: Verify active/inactive filtering still works correctly

## Code Quality

⚠️ **Note**: There's a cognitive complexity warning (18 > 15) on the component. This is a code smell but doesn't affect functionality. Consider extracting the card styling into a separate component in future refactoring.
