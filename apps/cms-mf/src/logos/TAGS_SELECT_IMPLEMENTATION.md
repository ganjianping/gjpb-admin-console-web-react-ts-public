# Tags Select Implementation

## Overview
Changed the Tags input field from a simple TextField to a multi-select dropdown that gets its values from `gjpb_app_settings` in local storage with the key `logo_tags` filtered by the current language.

## Implementation Details

### Changes Made to `LogoFormDialog.tsx`

#### 1. Added Required Imports
```typescript
import { useMemo } from 'react';
import {
  // ... existing imports
  OutlinedInput,
  Chip,
} from '@mui/material';
```

#### 2. Added `i18n` to useTranslation Hook
```typescript
const { t, i18n } = useTranslation();
```

#### 3. Added `availableTags` useMemo Hook
```typescript
const availableTags = useMemo(() => {
  try {
    const settings = localStorage.getItem('gjpb_app_settings');
    if (!settings) return [];

    const appSettings = JSON.parse(settings) as Array<{ name: string; value: string; lang: string }>;
    const currentLang = i18n.language.toUpperCase().startsWith('ZH') ? 'ZH' : 'EN';
    
    const logoTagsSetting = appSettings.find(
      (setting) => setting.name === 'logo_tags' && setting.lang === currentLang
    );

    if (!logoTagsSetting) return [];

    // Parse the comma-separated tags
    return logoTagsSetting.value.split(',').map((tag) => tag.trim()).filter(Boolean);
  } catch (error) {
    console.error('[LogoFormDialog] Error loading tags:', error);
    return [];
  }
}, [i18n.language]);
```

#### 4. Replaced TextField with Multi-Select
**Before:**
```typescript
<TextField
  label={t('logos.form.tags')}
  value={formData.tags}
  onChange={(e) => onFormChange('tags', e.target.value)}
  fullWidth
  error={!!getFieldError('tags')}
  helperText={getFieldError('tags')}
/>
```

**After:**
```typescript
<FormControl fullWidth error={!!getFieldError('tags')}>
  <FormLabel sx={{ mb: 1, color: 'text.primary', fontWeight: 500 }}>
    {t('logos.form.tags')}
  </FormLabel>
  <Select<string[]>
    multiple
    value={formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []}
    onChange={(e) => {
      const value = e.target.value;
      const tagsArray = typeof value === 'string' ? value.split(',') : value;
      onFormChange('tags', tagsArray.join(','));
    }}
    input={<OutlinedInput />}
    renderValue={(selected) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((value) => (
          <Chip key={value} label={value} size="small" />
        ))}
      </Box>
    )}
    sx={{
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
        borderWidth: '2px',
      },
    }}
  >
    {availableTags.length > 0 ? (
      availableTags.map((tag) => (
        <MenuItem key={tag} value={tag}>
          {tag}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>
        <Typography variant="body2" color="text.secondary">
          No tags available for current language
        </Typography>
      </MenuItem>
    )}
  </Select>
  {getFieldError('tags') && (
    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
      {getFieldError('tags')}
    </Typography>
  )}
</FormControl>
```

## Features

### 1. **Multi-Select Dropdown**
- Users can select multiple tags from a dropdown menu
- Selected tags are displayed as chips in the input field

### 2. **Language-Aware**
- Automatically filters tags based on the current UI language
- English users see tags from `logo_tags` with `lang: 'EN'`
- Chinese users see tags from `logo_tags` with `lang: 'ZH'`

### 3. **Dynamic Loading**
- Tags are loaded from localStorage (`gjpb_app_settings`)
- Updates automatically when language changes
- Falls back to empty array if settings are not available

### 4. **Data Format**
- **Storage Format**: Comma-separated string (e.g., "AI,Tech,News")
- **Display Format**: Array of chips
- **Backend Format**: Comma-separated string (maintained for compatibility)

### 5. **Error Handling**
- Gracefully handles missing localStorage data
- Shows "No tags available" message when no tags exist for current language
- Logs errors to console for debugging

### 6. **UI/UX Enhancements**
- Clean chip-based display for selected tags
- Consistent styling with other form fields
- Focused state with primary color border
- Disabled state when no tags are available

## Local Storage Structure

The component expects data in localStorage with this structure:

```json
{
  "gjpb_app_settings": [
    {
      "name": "logo_tags",
      "value": "AI,Technology,Business,Entertainment,Sports,News",
      "lang": "EN"
    },
    {
      "name": "logo_tags",
      "value": "人工智能,科技,商业,娱乐,体育,新闻",
      "lang": "ZH"
    }
  ]
}
```

## Compatibility

### With Existing Data
- The component maintains backward compatibility with the comma-separated string format
- When saving: Converts array back to comma-separated string
- When loading: Parses comma-separated string into array for display

### With Other Components
- Uses the same pattern as `WebsiteFormDialog.tsx` for consistency
- Uses the same pattern as `LogoSearchPanel.tsx` for tag loading

## User Flow

1. User opens Create/Edit Logo dialog
2. Component loads tags from localStorage based on current language
3. User clicks on Tags dropdown
4. Available tags are displayed as menu items
5. User selects one or more tags
6. Selected tags appear as chips in the input field
7. User can click X on chips to remove tags
8. On save, tags are converted to comma-separated string and sent to backend

## Testing Recommendations

1. **Test with English Language**
   - Switch UI to English
   - Open create logo dialog
   - Verify tags dropdown shows English tags

2. **Test with Chinese Language**
   - Switch UI to Chinese
   - Open create logo dialog
   - Verify tags dropdown shows Chinese tags

3. **Test with No Settings**
   - Clear localStorage
   - Open create logo dialog
   - Verify "No tags available" message is shown

4. **Test Multiple Selection**
   - Select multiple tags
   - Verify all selected tags appear as chips
   - Verify form data contains comma-separated string

5. **Test Error Handling**
   - Corrupt the localStorage data
   - Verify component doesn't crash
   - Verify error is logged to console

6. **Test Save Functionality**
   - Select tags and save
   - Verify data is sent to backend as comma-separated string
   - Verify format matches API requirements

## Files Modified

- `apps/cms-mf/src/logos/components/LogoFormDialog.tsx`

## Related Files (Same Pattern)

- `apps/cms-mf/src/logos/components/LogoSearchPanel.tsx` - Uses same tag loading pattern
- `apps/cms-mf/src/websites/components/WebsiteFormDialog.tsx` - Uses same Select component pattern
- `apps/cms-mf/src/websites/components/WebsiteSearchPanel.tsx` - Uses same tag loading pattern
