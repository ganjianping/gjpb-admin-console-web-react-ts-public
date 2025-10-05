# CMS Micro Frontend

This micro frontend module handles Content Management System (CMS) features for the admin console.

## Features

- **Websites Management**: Full CRUD operations for website listings
  - Create, read, update, and delete websites
  - Search and filter capabilities
  - Pagination support
  - Tag management

## Structure

```
cms-mf/
├── src/
│   ├── websites/           # Website management feature
│   │   ├── components/     # React components
│   │   ├── constants/      # Constants and configurations
│   │   ├── hooks/          # Custom React hooks
│   │   ├── i18n/           # Internationalization
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── public-api.ts       # Public exports
├── tsconfig.json
└── README.md
```

## Usage

Import the required components and hooks from the module:

```typescript
import { WebsitesPage } from '@cms-mf/websites';
```

## Development

This module follows the same patterns as other micro frontends in the application:
- Type-safe API calls with TypeScript
- Reusable hooks for state management
- Internationalization support (EN/ZH)
- Consistent UI/UX with Material-UI
