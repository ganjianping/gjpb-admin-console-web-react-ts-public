# Dashboard Module

## Overview
The dashboard has been refactored into a component-based architecture for better maintainability, reusability, and scalability. It includes skeleton loading states for a better user experience.

## Structure

```
dashboard/
├── components/
│   ├── WelcomeCard.tsx          # Welcome message and current date
│   ├── BasicInfoCard.tsx        # User's basic information
│   ├── LoginActivityCard.tsx    # Login history and activity
│   ├── RolesCard.tsx            # User roles display
│   ├── UserPreferencesCard.tsx  # User preferences (language, theme, color)
│   ├── DashboardSkeleton.tsx    # Skeleton loading states
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

### DashboardSkeleton
**Props:** None

**Purpose:** Provides skeleton loading states for the entire dashboard. Individual skeleton components are also available:
- `WelcomeCardSkeleton` - Skeleton for welcome section
- `InfoCardSkeleton` - Skeleton for info cards (basic info & login activity)
- `RolesCardSkeleton` - Skeleton for roles card
- `UserPreferencesCardSkeleton` - Skeleton for preferences card

**Features:**
- Matches the exact layout of the actual dashboard
- Smooth loading animation
- Responsive design that matches actual cards
- Shows for 500ms on initial load for better UX

## Benefits of This Architecture

✅ **Maintainability** - Each card is isolated and easier to debug/update
✅ **Reusability** - Components can be used in other pages
✅ **Testability** - Individual components can be unit tested
✅ **Readability** - DashboardPage is now clean and easy to understand
✅ **Performance** - Components can be optimized with React.memo if needed
✅ **Scalability** - Adding new cards is straightforward
✅ **Better UX** - Skeleton loading states improve perceived performance

## Loading States

The dashboard implements a sophisticated loading strategy:

1. **Initial Load**: Shows `DashboardSkeleton` for 500ms
2. **User Sync**: Syncs user data from localStorage
3. **Content Display**: Renders actual dashboard cards
4. **Visibility Change**: Re-syncs data when page becomes visible
5. **Focus Events**: Re-syncs data when window gains focus

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
- **Loading State**: None

### After Refactoring
- **DashboardPage.tsx**: ~140 lines (67% reduction!)
- **Components**: 5 reusable components + 5 skeleton components
- **Complexity**: Low (much easier to understand and maintain)
- **Loading State**: Full skeleton loading support

## Notes

- All components use Material-UI for consistent styling
- Date formatting respects user's language preference (en/zh)
- User preferences are automatically loaded from localStorage
- Components handle edge cases (null values, missing data, etc.)
- Skeleton components use `memo` for optimal performance
- Loading state duration can be adjusted in DashboardPage (currently 500ms)
