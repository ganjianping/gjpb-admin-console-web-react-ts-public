# Rubi Micro Frontend - Vocabularies Module

This is a React-based micro frontend module for managing English vocabularies with images and phonetic audio.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete vocabularies
- **Search & Filtering**: Filter by word, language, tags, and active status
- **Rich Vocabulary Data**:
  - Word with image support
  - Phonetic transcription and audio
  - Definition and translation
  - Part of speech and tenses (simple past, past perfect)
  - Synonyms and plural forms
  - Example sentences and tags
  
## Directory Structure

```
src/
├── vocabularies/
│   ├── components/          # React components
│   ├── constants/           # Application constants
│   ├── hooks/              # React hooks
│   ├── i18n/               # i18n translations
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript types
│   ├── utils/              # Utility functions
│   └── index.ts
├── public-api.ts           # Public API exports
└── vite-env.d.ts          # Vite environment types
```

## API Endpoints

- `GET /v1/vocabularies` - Get paginated list of vocabularies
- `POST /v1/vocabularies` - Create a new vocabulary
- `PUT /v1/vocabularies/{id}` - Update a vocabulary
- `DELETE /v1/vocabularies/{id}` - Delete a vocabulary

## Response Structure

The API returns responses in the following format:

```json
{
  "status": {
    "code": 200,
    "message": "Success",
    "errors": null
  },
  "data": {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  },
  "meta": {
    "serverDateTime": "2025-12-31 23:52:46",
    "requestId": "...",
    "sessionId": "..."
  }
}
```

## Vocabulary Object

```typescript
{
  id: string;
  word: string;
  definition?: string;
  translation?: string;
  example?: string;
  synonyms?: string;
  pluralForm?: string;
  phonetic?: string;
  phoneticAudioFilename?: string;
  phoneticAudioOriginalUrl?: string;
  wordImageFilename?: string;
  wordImageOriginalUrl?: string;
  partOfSpeech?: string;
  simplePastTense?: string;
  pastPerfectTense?: string;
  tags?: string;
  lang?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
```

## Internationalization

The module supports both English (en) and Chinese (zh) translations. Translations are automatically loaded from the i18n bundle.

## Development

To use this module in the shell application:

```tsx
import { VocabulariesPage } from '@rubi-mf';

// In your router configuration
<Route path="/vocabularies" element={<VocabulariesPage />} />
```
