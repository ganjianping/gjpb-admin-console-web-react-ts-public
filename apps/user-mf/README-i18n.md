# User Management Micro Frontend - Internationalization (i18n)

This document describes the internationalization setup for the user-mf micro frontend, which supports both English and Chinese languages.

## Overview

The user-mf micro frontend uses react-i18next for internationalization, with translations for all user interface text supporting both English (`en`) and Chinese (`zh`) languages.

## Setup

### 1. i18n Configuration

The main i18n configuration is located in:
```
apps/user-mf/src/utils/i18n.ts
```

This file:
- Imports the shared i18n instance from `shared-lib`
- Defines user-management specific translations for both English and Chinese
- Registers the translations with the global i18n instance

### 2. Integration

The i18n configuration is imported in:
- `apps/user-mf/src/index.tsx` - Main entry point
- `apps/user-mf/src/pages/UsersPage.tsx` - Users page
- `apps/user-mf/src/pages/RolesPage.tsx` - Roles page

## Translation Structure

### English Translations (`en`)

```typescript
{
  users: {
    // Page titles
    pageTitle: 'User Management',
    viewUser: 'View User',
    editUser: 'Edit User',
    createUser: 'Create User',
    deleteUser: 'Delete User',
    
    // Table headers
    username: 'Username',
    nickname: 'Display Name',
    email: 'Email',
    status: 'Status',
    roles: 'Roles',
    lastLogin: 'Last Login',
    active: 'Active',
    
    // Form fields
    form: {
      username: 'Username',
      usernameRequired: 'Username is required',
      usernameHelper: 'Unique identifier for the user',
      password: 'Password',
      passwordRequired: 'Password is required',
      passwordHelper: 'Min. 8 characters',
      displayName: 'Display Name',
      displayNameHelper: 'Optional display name',
      emailAddress: 'Email Address',
      emailHelper: 'For notifications and recovery',
      countryCode: 'Country Code',
      countryCodeHelper: 'Mobile country code (e.g., 65 for Singapore, 1 for US)',
      mobileNumber: 'Mobile Number',
      mobileNumberHelper: 'Mobile phone number without country code'
    },
    
    // Messages
    userCreatedSuccess: 'User created successfully',
    userUpdatedSuccess: 'User updated successfully',
    userDeletedSuccess: 'User deleted successfully',
    
    // Error messages
    errors: {
      loadFailed: 'Failed to load users',
      createFailed: 'Failed to create user',
      updateFailed: 'Failed to update user',
      deleteFailed: 'Failed to delete user',
      validationError: 'Validation error'
    },
    
    // Loading states
    loading: {
      users: 'Loading users...',
      saving: 'Saving...',
      deleting: 'Deleting...'
    }
  },
  
  roles: {
    // Role management translations
    pageTitle: 'Role Management',
    addRole: 'Add Role',
    editRole: 'Edit Role',
    deleteRole: 'Delete Role'
  }
}
```

### Chinese Translations (`zh`)

All English keys have corresponding Chinese translations, for example:

```typescript
{
  users: {
    pageTitle: '用户管理',
    viewUser: '查看用户',
    editUser: '编辑用户',
    createUser: '创建用户',
    deleteUser: '删除用户',
    
    form: {
      username: '用户名',
      usernameRequired: '用户名是必填项',
      usernameHelper: '用户的唯一标识符',
      password: '密码',
      passwordRequired: '密码是必填项',
      passwordHelper: '最少8个字符',
      displayName: '显示名称',
      displayNameHelper: '可选的显示名称',
      emailAddress: '邮箱地址',
      emailHelper: '用于通知和恢复'
    }
    // ... more translations
  }
}
```

## Usage

### In React Components

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('users.pageTitle')}</h1>
      <button>{t('users.addUser')}</button>
    </div>
  );
};
```

### With Fallbacks

All translation calls include fallbacks to prevent blank UI if translations are missing:

```typescript
{t('users.username') || 'Username'}
```

### With Interpolation

For dynamic content like delete confirmations:

```typescript
{t('users.deleteConfirmation', { username: selectedUser?.username })}
```

## Language Switching

### Language Switcher Component

A `LanguageSwitcher` component is available at:
```
apps/user-mf/src/components/LanguageSwitcher.tsx
```

This component:
- Shows a dropdown with English/中文 options
- Updates the entire application language when changed
- Persists language preference in browser storage

### Usage

```typescript
import { LanguageSwitcher } from '../components/LanguageSwitcher';

// In your component
<LanguageSwitcher />
```

The language switcher is currently integrated into the UsersPage header for easy testing.

## Testing Translations

1. **Development Mode**: Start the application and use the language switcher in the header
2. **Manual Testing**: 
   - Switch between English and Chinese
   - Verify all text updates correctly
   - Test form validation messages
   - Test success/error notifications
   - Test dialog titles and content

## Supported Languages

- **English (en)**: Default language
- **Chinese (zh)**: Full translation coverage

## Adding New Translations

### For New Text

1. Add the English text to the `en` section in `i18n.ts`
2. Add the corresponding Chinese translation to the `zh` section
3. Use the translation key in your component: `{t('your.new.key')}`

### For New Languages

1. Add a new language object to `userMfResources` in `i18n.ts`
2. Translate all existing keys
3. Update the `LanguageSwitcher` component to include the new language option

## Features

### Covered Areas

- ✅ Page titles and navigation
- ✅ Table column headers
- ✅ Form field labels and placeholders
- ✅ Helper text and validation messages
- ✅ Button labels
- ✅ Success/error notifications
- ✅ Dialog titles and content
- ✅ Loading states
- ✅ Status values
- ✅ Action menu items

### Error Handling

- API error messages are displayed in the UI language
- Form validation errors support both languages
- Network error messages are translated
- Fallback text prevents blank UI elements

## Best Practices

1. **Always provide fallbacks**: `{t('key') || 'Fallback text'}`
2. **Use descriptive keys**: `users.form.usernameHelper` not `userHelp1`
3. **Group related translations**: Keep form fields under `form`, errors under `errors`
4. **Test both languages**: Ensure UI layouts work with different text lengths
5. **Keep translations consistent**: Use the same terminology throughout

## Files Structure

```
apps/user-mf/src/
├── utils/
│   └── i18n.ts                 # Main i18n configuration
├── components/
│   └── LanguageSwitcher.tsx    # Language switching component
├── pages/
│   ├── UsersPage.tsx          # Users management (i18n enabled)
│   └── RolesPage.tsx          # Roles management (i18n enabled)
└── index.tsx                   # Entry point (imports i18n)
```

## Dependencies

- `react-i18next`: React integration for i18next
- `i18next`: Core internationalization framework
- `i18next-browser-languagedetector`: Automatic language detection
- Shared i18n instance from `shared-lib`

The user-mf micro frontend is now fully internationalized and ready for both English and Chinese users!
