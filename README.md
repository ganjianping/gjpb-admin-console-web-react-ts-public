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
- **Firebase integration** with Performance Monitoring and Analytics
- **Code quality assurance** with ESLint, strict TypeScript, and comprehensive testing
- **Production-ready** with zero linting errors and comprehensive error handling

## 🏗️ Architecture

### Core Components
- **Shell Application**: Main dashboard with navigation and layout
- **Authentication Microfrontend**: Standalone login system with Module Federation
- **Shared Library**: Common utilities, services, and components
- **Firebase Integration**: Performance monitoring & analytics
- **Backend API Integration**: RESTful API communication with JWT tokens

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **HTTP-only Cookies**: Secure token storage with SameSite protection
- **Automatic Token Refresh**: Seamless user experience with background token renewal
- **CSRF Protection**: Modern SameSite cookie protection
- **Role-based Access Control**: Fine-grained permission system
- **Environment Security**: Secure configuration management

## Tech Stack

- **Core**: React.js 19.1, TypeScript, Vite 6.3.5
- **UI**: Material-UI 7.1.0, Emotion, Lucide React, Open Sans
- **State Management**: Redux Toolkit 2.8
- **Routing**: React Router v6.30
- **API**: Axios with automatic token refresh and CORS handling
- **Form Handling**: React Hook Form 7.57 + Zod 3.25 validation
- **Firebase**: Performance Monitoring 11.9.0 + Analytics
- **Testing**: Vitest + React Testing Library 16.3
- **Data Visualization**: Chart.js 4.4 with react-chartjs-2
- **Data Tables**: TanStack Table 8.21
- **Date Handling**: date-fns 4.1
- **Notifications**: React Hot Toast 2.5

## 🛠️ Project Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/ganjianping/gjpb-admin-console-web-react-ts-public.git
cd gjpb-admin-console-web-react-ts-public
```

2. **Install dependencies**:
```bash
npm install
```

### 🔒 Environment Setup

⚠️ **Security Notice**: This project requires environment variables for Firebase configuration.

1. **Copy the environment template**:
```bash
cp .env.example .env
```

2. **Configure Firebase credentials**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
   - Go to **Project Settings** > **General** > **Your apps**
   - Click **Add app** > **Web** (</> icon)
   - Copy the configuration values
   - Update `.env` with your real Firebase credentials

3. **Important Security Guidelines**:
   - **NEVER commit your `.env` file!** It contains sensitive credentials
   - The `.env.example` file shows the required format with placeholder values
   - Your `.env` file is automatically ignored by git for security

**Example `.env` configuration**:
```env
# API Configuration
VITE_API_BASE_URL=/api/v1
VITE_USE_MOCK=false

# Firebase Configuration (replace with your actual values)
VITE_FIREBASE_API_KEY=your-real-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 🚀 Available Scripts

- **Development mode**:
```bash
npm run dev
```
Runs the app in development mode. Opens [http://localhost:3000](http://localhost:3000) in your browser.

- **Build for production**:
```bash
npm run build
```

- **Preview production build**:
```bash
npm run preview
```

- **Code quality**:
```bash
npm run lint          # Run ESLint checks (currently 0 errors, 0 warnings)
npm run lint:fix      # Auto-fix ESLint issues where possible
npm run type-check    # Run TypeScript type checking
```

- **Testing**:
```bash
npm run test          # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🔧 Development Modes

### Backend API Mode (Production)
```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=/api/v1
```
- Connects to real backend API
- Requires backend server running on `http://localhost:8081`
- Full authentication with JWT tokens

### Mock Mode (Development)
```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=/api
```

**Mock User Accounts**:
| Username | Email | Password | Role | Mobile |
|----------|-------|----------|------|---------|
| `gjpb` | gjpb@gmail.com | `123456` | SUPER_ADMIN | +65 89765432 |
| `admin` | admin@example.com | `123456` | ADMIN | +65 88887777 |
| `user` | user@example.com | `123456` | USER | +65 99998888 |

## 🏁 Quick Start

1. **For development with mock data**:
```bash
# Set up mock mode
echo "VITE_USE_MOCK=true" > .env
echo "VITE_API_BASE_URL=/api" >> .env

# Start development server
npm run dev

# Login with: gjpb / 123456
```

2. **For production with real backend**:
```bash
# Set up production mode
echo "VITE_USE_MOCK=false" > .env
echo "VITE_API_BASE_URL=/api/v1" >> .env

# Add your Firebase config to .env
# Start your backend server on localhost:8081
# Start development server
npm run dev
```

## 🛡️ Code Quality & Standards

### ✅ ESLint Configuration
- **Zero linting errors and warnings** - All 44+ ESLint issues resolved
- **Strict TypeScript rules** with proper error handling using `unknown` type
- **React hooks best practices** with proper dependency arrays and memoization
- **Performance optimizations** with `useCallback` and `useMemo` where appropriate
- **Accessibility compliance** with ESLint accessibility rules

### 🎯 Type Safety
- **Comprehensive TypeScript coverage** with strict configuration
- **Type-safe error handling** throughout the application
- **Proper API response typing** with generic interfaces
- **Redux state type safety** with TypeScript integration

### 📊 Performance & Monitoring
- **Firebase Performance Monitoring**: Automatic Core Web Vitals tracking
- **Firebase Analytics**: User behavior and interaction tracking
- **Code Splitting**: Optimized bundle loading with React.lazy()
- **Lazy Loading**: Route-based code splitting for better performance

## 🔧 Backend Integration

### API Endpoints
- **Authentication**: `POST /api/v1/auth/tokens` (Login)
- **Token Refresh**: `PUT /api/v1/auth/tokens` (Auto-refresh)
- **User Management**: Standard CRUD operations
- **Role-based Access**: Permission-based endpoint access

### CORS Configuration Required
Your backend needs to allow requests from the frontend:

**Allowed Origins**: `http://localhost:3000`, `http://localhost:3001`  
**Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`  
**Allowed Headers**: `Content-Type, Authorization, X-Requested-With, Accept`  
**Credentials**: `true`

### Security Features
- **JWT Token Management**: Automatic refresh and secure storage
- **HTTP-only Cookies**: Secure token storage with SameSite=Lax protection
- **CSRF Protection**: Modern cookie-based CSRF prevention
- **Error Handling**: Comprehensive error catching and user feedback

## 🏗️ Project Structure

```
├── apps/
│   ├── auth-mf/          # Authentication Microfrontend
│   ├── shared-lib/       # Shared utilities and services
│   └── shell/            # Main application shell
├── public/               # Static assets
├── tools/                # Build and development tools
├── docker/               # Docker configuration
├── .env.example          # Environment template
└── vite.config.ts        # Vite configuration with proxy
```

## 🚀 Deployment

### Firebase Performance Setup
1. Create a Firebase project
2. Enable Performance Monitoring
3. Add web app to Firebase project
4. Update environment variables with Firebase config
5. Deploy to production (Firebase Performance only works in production)

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

---

**© 2025 GJPB. All Rights Reserved.**

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
   - 📊 See [FIREBASE_ANALYTICS_IMPLEMENTATION.md](./FIREBASE_ANALYTICS_IMPLEMENTATION.md) for Firebase Analytics setup

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
