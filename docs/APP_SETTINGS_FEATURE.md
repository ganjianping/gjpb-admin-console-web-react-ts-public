# App Settings Feature Implementation

## Overview
This feature fetches public app settings from the API after successful login and displays them on the dashboard, filtered by the current language.

## Implementation Details

### 1. App Settings Service (`apps/shared-lib/src/api/app-settings-service.ts`)
A new service that handles:
- **Fetching app settings**: Calls `/v1/open/app-settings` API endpoint
- **Local storage**: Saves settings to `gjpb_app_settings` in localStorage
- **Language filtering**: Filters settings by language (EN/ZH based on current i18n language)

**Key Methods:**
- `fetchAppSettings()`: Fetches settings from API and stores in localStorage
- `getAppSettings()`: Retrieves settings from localStorage
- `getAppSettingsByLanguage(language)`: Gets settings filtered by language and returns as key-value pairs

### 2. Authentication Service Update
Modified `apps/auth-mf/src/login/services/authentication.service.ts` to:
- Call `appSettingsService.fetchAppSettings()` after successful login
- Run the fetch in the background (non-blocking)
- Handle errors gracefully without failing the login

### 3. App Settings Card Component
Created `apps/shell/src/dashboard/components/AppSettingsCard.tsx`:
- Displays app settings in a card format
- Automatically filters by current language (EN/ZH)
- Shows each setting name and value as chips
- Updates when language changes
- Hides if no settings are available

### 4. Dashboard Integration
Updated `apps/shell/src/dashboard/pages/DashboardPage.tsx`:
- Added `AppSettingsCard` to the dashboard layout
- Positioned at the bottom of the page for easy visibility

### 5. Internationalization
Added translations in `apps/shared-lib/src/i18n/i18n.ts`:
- English translations for app settings labels
- Chinese translations for app settings labels
- Support for: app_name, app_version, app_company, app_description, website_tags

## API Integration

### Endpoint
```
GET /v1/open/app-settings
```

### Response Format
```json
{
  "status": {
    "code": 200,
    "message": "Public app settings retrieved successfully",
    "errors": null
  },
  "data": [
    {
      "name": "app_name",
      "value": "GJP Blog System",
      "lang": "EN"
    },
    {
      "name": "app_name",
      "value": "GJP博客系统",
      "lang": "ZH"
    }
    // ... more settings
  ],
  "meta": {
    "serverDateTime": "2025-10-05 22:13:45",
    "requestId": "...",
    "sessionId": "..."
  }
}
```

## Data Flow

1. **Login Success** → `authentication.service.ts` → calls `appSettingsService.fetchAppSettings()`
2. **API Call** → `/v1/open/app-settings` → returns all settings (EN & ZH)
3. **Storage** → Settings saved to `localStorage['gjpb_app_settings']`
4. **Dashboard Load** → `AppSettingsCard` component reads from localStorage
5. **Language Filter** → Filters settings by current language (i18n.language)
6. **Display** → Shows only relevant language settings (EN when language is 'en', ZH when 'zh')

## Language Handling

The component uses `i18n.language` to determine which language settings to display:
- When current language starts with 'zh' → Shows settings with `lang: "ZH"`
- When current language is 'en' or other → Shows settings with `lang: "EN"`

The filtering happens in `getAppSettingsByLanguage()` method which:
1. Normalizes the language (zh* → ZH, others → EN)
2. Filters settings array by the `lang` field
3. Returns a simple object with name-value pairs

## Files Modified

1. `apps/shared-lib/src/api/app-settings-service.ts` (NEW)
2. `apps/shared-lib/src/api/index.ts` (MODIFIED - export new service)
3. `apps/auth-mf/src/login/services/authentication.service.ts` (MODIFIED - fetch settings on login)
4. `apps/shell/src/dashboard/components/AppSettingsCard.tsx` (NEW)
5. `apps/shell/src/dashboard/components/index.ts` (MODIFIED - export new component)
6. `apps/shell/src/dashboard/pages/DashboardPage.tsx` (MODIFIED - add card to dashboard)
7. `apps/shared-lib/src/i18n/i18n.ts` (MODIFIED - add translations)

## Testing

To test the feature:
1. Login to the application
2. Check browser's localStorage for `gjpb_app_settings` key
3. Navigate to dashboard
4. Verify app settings card displays with EN values (if language is English)
5. Switch language to Chinese
6. Verify card updates to show ZH values
7. Check browser console for any errors

## Error Handling

- If API call fails, login still succeeds (non-blocking)
- If no settings in localStorage, card is hidden
- If language preference is invalid, defaults to EN
- Errors are logged to console for debugging

## Future Enhancements

Potential improvements:
- Add refresh button to manually update settings
- Add loading skeleton while fetching
- Add error state UI if settings fail to load
- Cache with expiration time
- Real-time updates when settings change on server
