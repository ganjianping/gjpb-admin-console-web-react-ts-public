# GJPB Admin Console

A modern, secure, and responsive admin console for GJPB, built with React.js 19.1, TypeScript, and Vite 6.3.5.

## 🚀 Features

- **Micro-frontend architecture** with independent, modular applications
- **Responsive design** with mobile-first approach and Material-UI 7.1.0
- **Light and dark mode** support with system preference detection
- **Internationalization** (English and Chinese) with i18next
- **Role-based access control** with fine-grained permissions
- **Secure authentication** with HTTP-only cookies and CSRF protection
- **Type-safe development** with strict TypeScript configuration
- **Modern UI components** with accessibility (WCAG 2.1 AA compliance)
- **Performance optimized** with code splitting and lazy loading
- **Code quality assurance** with ESLint, strict TypeScript, and comprehensive testing
- **Production-ready** with zero linting errors and comprehensive error handling

## Tech Stack

- **Core**: React.js 19.1, TypeScript, Vite 6.3.5
- **UI**: Material-UI 7.1.0, Emotion, Lucide React, Open Sans
- **State Management**: Redux Toolkit 2.8
- **Routing**: React Router v6.30
- **API**: Axios with automatic token refresh and CSRF protection
- **Form Handling**: React Hook Form 7.57 + Zod 3.25 validation
- **Testing**: Vitest + React Testing Library 16.3
- **Data Visualization**: Chart.js 4.4 with react-chartjs-2
- **Data Tables**: TanStack Table 8.21
- **Date Handling**: date-fns 4.1
- **Notifications**: React Hot Toast 2.5

## Project Setup and Running

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ganjianping/gjpb-admin-console-web-react-ts-public.git
cd gjpb-admin-console-web-react-ts-public
```

2. Install dependencies:

```bash
npm install
```

### Environment Setup

⚠️ **Security Notice**: This project requires environment variables for Firebase configuration. 

1. **Copy the environment template**:
```bash
cp .env.example .env
```

2. **Configure Firebase credentials**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Get your project configuration
   - Update `.env` with your real Firebase credentials

3. **Read the security guide**:
   - 📖 See [ENVIRONMENT_SECURITY.md](./ENVIRONMENT_SECURITY.md) for detailed setup instructions
   - 🔒 See [FIREBASE_PERFORMANCE.md](./FIREBASE_PERFORMANCE.md) for Firebase Performance setup

**Never commit your `.env` file!** It contains sensitive credentials.

### Available Scripts

- **Development mode**:

```bash
npm run dev
```

This runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

- **Build for production**:

```bash
npm run build
```

- **Preview production build**:

```bash
npm run preview
```

- **Lint code**:

```bash
npm run lint          # Run ESLint checks (currently 0 errors, 0 warnings)
npm run lint:fix      # Auto-fix ESLint issues where possible
```

- **Type checking**:

```bash
npm run type-check    # Run TypeScript type checking
```

- **Run tests**:

```bash
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Code Quality & Standards

This project maintains high code quality standards:

### ✅ ESLint Configuration
- **Zero linting errors and warnings** - All 44+ ESLint issues have been resolved
- **Strict TypeScript rules** with proper error handling using `unknown` type
- **React hooks best practices** with proper dependency arrays and memoization
- **Performance optimizations** with `useCallback` and `useMemo` where appropriate
- **Accessibility compliance** with ESLint accessibility rules

### 🛡️ Type Safety
- **Comprehensive TypeScript coverage** with strict configuration
- **Type-safe error handling** throughout the application
- **Proper API response typing** with generic interfaces
- **Redux state type safety** with TypeScript integration

### 🎯 Best Practices
- **React hooks optimization** - All hooks follow React's rules and performance guidelines
- **Proper component composition** with clear separation of concerns
- **CSRF protection** with comprehensive error handling
- **Internationalization** with type-safe translation keys
- **Responsive design** with mobile-first approach

### 📊 Testing Coverage
- **Unit tests** for critical components and utilities
- **Integration tests** for complex workflows
- **Type-safe test utilities** with proper mocking

## Development Environment

The application supports multiple environments:

- **Development**: Default environment during development (`npm run dev`)
- **Mock**: For running with mock data (`VITE_ENV=mock npm run dev`)
- **Production**: Production build (`npm run build`)

## Project Structure

```
gjpb-admin-console-web/
├── apps/                # Micro-frontend architecture
│   ├── shell/           # Main shell/host application
│   │   ├── src/         # Shell application source code (entry point)
│   │   │   ├── assets/  # Shell-specific assets
│   │   │   ├── components/ # Shell-specific components
│   │   │   ├── hooks/   # Custom hooks for shell
│   │   │   ├── layouts/ # Page layouts
│   │   │   ├── pages/   # Page components
│   │   │   ├── redux/   # Redux store and slices
│   │   │   ├── routes/  # Application routing
│   │   │   └── theme/   # Theme configuration
│   │   └── __tests__/   # Tests for shell components
│   ├── auth-mf/         # Authentication micro-frontend
│   │   └── src/         # Auth micro-frontend source code
│   │       ├── components/ # Auth-specific components
│   │       ├── pages/   # Auth pages (login, register, etc.)
│   │       ├── services/ # Auth services
│   │       └── utils/   # Auth utilities
│   └── shared-lib/      # Shared components and utilities
│       └── src/         # Shared library source code
│           ├── components/ # Shared UI components
│           ├── hooks/   # Shared custom hooks
│           ├── services/ # Shared API services
│           └── utils/   # Shared utility functions
├── tools/               # Development and build tools
├── docker/              # Docker configuration files
└── public/              # Static assets
```

> **Architecture Note:** 
> 
> This project follows a micro-frontend architecture:
>
> 1. The application is divided into independent micro-frontends in the `apps/` directory
> 2. `apps/shell/` serves as the container application that hosts other micro-frontends
> 3. `apps/auth-mf/` contains authentication-related functionality
> 4. `apps/shared-lib/` provides shared components and utilities
> 5. The entry point is `apps/shell/src/main.tsx`
>
> When adding new features, please add them to the appropriate micro-frontend in the `apps/` directory.

## Authentication

The application uses secure authentication with HTTP-only cookies and CSRF protection:

- Supports login via username, email, or mobile number
- Implements automatic token refresh
- Provides role-based access control with fine-grained permissions
- Handles session management and token expiration
- Protects against CSRF attacks with dedicated protection mechanism

## Internationalization

The application supports multiple languages using i18next:

- English (default)
- Chinese (Simplified and Traditional)

Features:
- Automatic language detection based on browser settings
- Manual language selection via the application header
- Supports right-to-left (RTL) languages
- Date and number formatting based on locale

## Themes

The application supports light and dark modes:

- Automatically detects user's system preference
- Allows manual switching via the theme toggle
- Persists theme selection across sessions
- Customized Material-UI components for consistent theming

## Contributing

### Development Guidelines

1. **Code Quality**: Ensure all code passes ESLint checks (`npm run lint`)
2. **Type Safety**: Use TypeScript strictly - avoid `any` types, use proper error handling
3. **React Best Practices**: 
   - Use `useCallback` and `useMemo` for performance optimization
   - Follow React hooks rules (no conditional hooks)
   - Proper dependency arrays in `useEffect`
4. **Testing**: Write tests for new features and bug fixes
5. **Accessibility**: Follow WCAG 2.1 AA guidelines

### Pull Request Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run linting and type checking (`npm run lint && npm run type-check`)
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with a clear description of changes

### Code Style

- **ESLint**: All code must pass ESLint checks with zero errors/warnings
- **TypeScript**: Use strict typing, avoid `any` unless absolutely necessary
- **Error Handling**: Use `unknown` type for errors with proper type guards
- **Performance**: Use React optimization hooks where appropriate
- **Internationalization**: All user-facing text must use translation keys

## Accessibility

The application is built with accessibility in mind, following WCAG 2.1 AA compliance guidelines:

- Proper semantic HTML structure
- Keyboard navigation support
- ARIA attributes where appropriate
- Color contrast compliance
- Screen reader compatibility
- Focus management and visible focus indicators

## Recent Updates & Improvements

### ✅ December 2024 - Code Quality Enhancement
- **Resolved all 44+ ESLint issues** including TypeScript `any` type violations
- **Improved React hooks performance** with proper `useCallback` and `useMemo` usage
- **Enhanced type safety** by replacing `any` types with proper TypeScript types
- **Optimized component re-renders** with proper dependency arrays
- **Added comprehensive error handling** with `unknown` type and type guards
- **Fast refresh optimization** for better developer experience

### 🛡️ Security & Performance
- **CSRF protection enhancement** with improved error handling
- **Authentication flow optimization** with better token management
- **API client improvements** with type-safe error handling
- **Memory leak prevention** with proper cleanup in React components

## License

This project is proprietary and confidential. All rights reserved.

Copyright © 2025 GJPB
