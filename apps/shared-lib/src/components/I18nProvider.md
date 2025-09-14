# I18nProvider

A reusable i18n provider component for microfrontends that provides consistent internationalization initialization and loading states.

## Features

- Generic i18n initialization handling
- Customizable loading states
- Supports custom i18n instances
- Flexible loading UI options
- TypeScript support

## Usage

### Basic Usage (Default)

```tsx
import { I18nProvider } from '../../shared-lib/src/components';

function App() {
  return (
    <I18nProvider>
      <YourAppContent />
    </I18nProvider>
  );
}
```

### Custom i18n Instance

```tsx
import { I18nProvider } from '../../shared-lib/src/components';
import customI18n from './utils/i18n';

function App() {
  return (
    <I18nProvider i18nInstance={customI18n}>
      <YourAppContent />
    </I18nProvider>
  );
}
```

### Custom Loading Component

```tsx
import { I18nProvider } from '../../shared-lib/src/components';
import { Skeleton } from '@mui/material';

function App() {
  return (
    <I18nProvider 
      loadingComponent={<Skeleton variant="rectangular" height="100vh" />}
    >
      <YourAppContent />
    </I18nProvider>
  );
}
```

### Custom Loading Text

```tsx
import { I18nProvider } from '../../shared-lib/src/components';

function App() {
  return (
    <I18nProvider 
      loadingText="正在加载翻译..."
      fullHeight={false}
    >
      <YourAppContent />
    </I18nProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render when i18n is ready |
| `i18nInstance` | `i18n` | `defaultI18n` | Custom i18n instance to use |
| `loadingComponent` | `React.ReactNode` | - | Custom loading component |
| `loadingText` | `string` | `"Loading translations..."` | Text to show in default loading state |
| `fullHeight` | `boolean` | `true` | Whether loading screen should be full height |

## Migration from TranslationProvider

If you're migrating from the auth-mf specific `TranslationProvider`:

```tsx
// Before
import TranslationProvider from './components/TranslationProvider';

// After
import { I18nProvider } from '../../shared-lib/src/components';
import i18n from './utils/i18n';

// Usage remains the same, but with more flexibility
<I18nProvider i18nInstance={i18n}>
  <App />
</I18nProvider>
```

## Examples in the Codebase

- **Auth MF**: Uses `I18nProvider` directly in `apps/auth-mf/src/index.tsx`
- **Shared Lib**: Base implementation in `apps/shared-lib/src/components/I18nProvider.tsx`

## Benefits of Direct Usage

- **Simpler**: No wrapper layer needed
- **Flexible**: Can customize props directly at usage point
- **Maintainable**: One less file to maintain
- **Consistent**: Same component used across all microfrontends
