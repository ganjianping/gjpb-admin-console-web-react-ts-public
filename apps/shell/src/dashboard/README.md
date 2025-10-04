# Dashboard Module

## Overview
The dashboard has been refactored into a component-based architecture for better maintainability, reusability, and scalability.

## Structure

```
dashboard/
├── components/
│   ├── WelcomeCard.tsx          # Welcome message and current date
│   ├── BasicInfoCard.tsx        # User's basic information
│   ├── LoginActivityCard.tsx    # Login history and activity
│   ├── RolesCard.tsx            # User roles display
│   ├── UserPreferencesCard.tsx  # User preferences (language, theme, color)
│   └── index.ts                 # Component exports
├── pages/
│   └── DashboardPage.tsx        # Main dashboard page (orchestrator)
├── index.ts
└── README.md
```

## Components

### WelcomeCard
**Props:**
- `displayName: string` - The user's display name

**Purpose:** Displays a personalized welcome message with the current date in the user's preferred language.

### BasicInfoCard
**Props:**
- `user: User` - User object containing basic information

**Purpose:** Shows user's display name, username, email, mobile, and account status.

### LoginActivityCard
**Props:**
- `user: User` - User object containing login activity data

**Purpose:** Displays login history including last login time, IP address, failed attempts, and last failed login.

### RolesCard
**Props:**
- `roleCodes: string[]` - Array of user role codes

**Purpose:** Shows all roles assigned to the user with styled chips. Renders nothing if user has no roles.

### UserPreferencesCard
**Props:** None (reads from localStorage)

**Purpose:** Displays user's preferences including:
- Language (English, 中文)
- Color Theme (Blue, Green, Purple, Orange, Red)
- Theme Mode (Light, Dark, System Default)

## Benefits of This Architecture

✅ **Maintainability** - Each card is isolated and easier to debug/update
✅ **Reusability** - Components can be used in other pages
✅ **Testability** - Individual components can be unit tested
✅ **Readability** - DashboardPage is now clean and easy to understand
✅ **Performance** - Components can be optimized with React.memo if needed
✅ **Scalability** - Adding new cards is straightforward

## Adding New Cards

To add a new dashboard card:

1. Create a new component in `components/` folder
2. Export it from `components/index.ts`
3. Import and use it in `DashboardPage.tsx`

Example:
```tsx
// components/NewCard.tsx
const NewCard = ({ data }) => {
  return (
    <Card>
      {/* Your content */}
    </Card>
  );
};

export default NewCard;
```

```tsx
// components/index.ts
export { default as NewCard } from './NewCard';
```

```tsx
// pages/DashboardPage.tsx
import { NewCard } from '../components';

// In the component
<NewCard data={someData} />
```

## Code Metrics

### Before Refactoring
- **DashboardPage.tsx**: ~420 lines
- **Components**: 0
- **Complexity**: High (Cognitive Complexity: 30)

### After Refactoring
- **DashboardPage.tsx**: ~120 lines (71% reduction!)
- **Components**: 5 reusable components
- **Complexity**: Low (much easier to understand and maintain)

## Notes

- All components use Material-UI for consistent styling
- Date formatting respects user's language preference (en/zh)
- User preferences are automatically loaded from localStorage
- Components handle edge cases (null values, missing data, etc.)
