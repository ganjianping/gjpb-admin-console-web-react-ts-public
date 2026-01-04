# Rubi MF - API Documentation

## Vocabulary Management API

### Base URL
`/v1/vocabularies`

## Endpoints

### 1. Get Vocabularies (GET)
Retrieve a paginated list of vocabularies with optional filters.

**URL:** `GET /v1/vocabularies`

**Query Parameters:**
- `page` (optional): Page number (0-indexed). Default: 0
- `size` (optional): Items per page. Default: 20
- `sort` (optional): Sort field. Default: "updatedAt"
- `direction` (optional): Sort direction ("asc" or "desc"). Default: "desc"
- `word` (optional): Filter by word (partial match)
- `lang` (optional): Filter by language (EN, ZH, etc.)
- `tags` (optional): Filter by tags (partial match)
- `isActive` (optional): Filter by active status (true/false)

**Example Request:**
```
GET /v1/vocabularies?page=0&size=20&sort=updatedAt&direction=desc&lang=EN
```

**Response:**
```json
{
  "status": {
    "code": 200,
    "message": "Vocabularies retrieved successfully",
    "errors": null
  },
  "data": {
    "content": [
      {
        "id": "4e1548e6-5805-43b5-b6f0-08a4ecf4e846",
        "word": "eat",
        "wordImageFilename": "eat.jpg",
        "wordImageOriginalUrl": "https://t15.baidu.com/it/u=1342350492,1654149186&fm=224&app=112&f=JPEG?w=402&h=499",
        "simplePastTense": null,
        "pastPerfectTense": null,
        "translation": null,
        "synonyms": null,
        "pluralForm": null,
        "phonetic": null,
        "phoneticAudioFilename": "eat.mp3",
        "phoneticAudioOriginalUrl": "https://dictionary.cambridge.org/media/english/uk_pron/u/uke/ukeas/ukeasil014.mp3",
        "partOfSpeech": null,
        "definition": "to put or take food into the mouth",
        "example": null,
        "tags": "basic",
        "lang": "EN",
        "displayOrder": 999,
        "isActive": true,
        "createdAt": "2025-12-31T23:52:31",
        "updatedAt": "2025-12-31T23:52:31",
        "createdBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "updatedBy": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1
  },
  "meta": {
    "serverDateTime": "2025-12-31 23:52:46",
    "requestId": "f733abf5-68cd-4a15-adf3-3aece5db80ba",
    "sessionId": "no-session"
  }
}
```

### 2. Create Vocabulary (POST)
Create a new vocabulary entry.

**URL:** `POST /v1/vocabularies`

**Request Body:**
```json
{
  "word": "study",
  "definition": "to learn by reading, thinking, or practice",
  "translation": "研究，学习",
  "example": "I need to study for my exam.",
  "synonyms": "learn, research",
  "pluralForm": "studies",
  "phonetic": "[ˈstʌdi]",
  "phoneticAudioFilename": "study.mp3",
  "phoneticAudioOriginalUrl": "https://example.com/study.mp3",
  "wordImageFilename": "study.jpg",
  "wordImageOriginalUrl": "https://example.com/study.jpg",
  "partOfSpeech": "verb",
  "simplePastTense": "studied",
  "pastPerfectTense": "had studied",
  "tags": "academic,education",
  "lang": "EN",
  "displayOrder": 1,
  "isActive": true
}
```

**Response:**
```json
{
  "status": {
    "code": 201,
    "message": "Vocabulary created successfully",
    "errors": null
  },
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "word": "study",
    "definition": "to learn by reading, thinking, or practice",
    ...
  },
  "meta": { ... }
}
```

### 3. Update Vocabulary (PUT)
Update an existing vocabulary.

**URL:** `PUT /v1/vocabularies/{id}`

**URL Parameters:**
- `id`: The vocabulary ID (UUID)

**Request Body:**
```json
{
  "word": "study",
  "definition": "Updated definition",
  "translation": "Updated translation",
  ...
}
```

**Response:**
```json
{
  "status": {
    "code": 200,
    "message": "Vocabulary updated successfully",
    "errors": null
  },
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    ...
  },
  "meta": { ... }
}
```

### 4. Delete Vocabulary (DELETE)
Delete a vocabulary entry.

**URL:** `DELETE /v1/vocabularies/{id}`

**URL Parameters:**
- `id`: The vocabulary ID (UUID)

**Response:**
```json
{
  "status": {
    "code": 204,
    "message": "Vocabulary deleted successfully",
    "errors": null
  },
  "data": null,
  "meta": { ... }
}
```

## Response Structure

All API responses follow this standard structure:

```json
{
  "status": {
    "code": 200,                          // HTTP status code
    "message": "Success message",         // Human-readable message
    "errors": null                        // Error details if applicable
  },
  "data": {                               // Actual response data
    ...
  },
  "meta": {                               // Metadata
    "serverDateTime": "2025-12-31 23:52:46",
    "requestId": "uuid",
    "sessionId": "uuid"
  }
}
```

## Vocabulary Object Schema

```typescript
{
  // Required Fields
  id: string;                            // UUID, auto-generated
  word: string;                          // The vocabulary word
  lang: string;                          // Language code (EN, ZH, etc.)

  // Optional Fields
  definition?: string;                   // Word definition
  translation?: string;                  // Translation to other language
  example?: string;                      // Example sentence
  synonyms?: string;                     // Comma-separated synonyms
  pluralForm?: string;                   // Plural form of the word
  
  // Phonetics
  phonetic?: string;                     // Phonetic transcription (e.g., [ˈstʌdi])
  phoneticAudioFilename?: string;        // Audio file name
  phoneticAudioOriginalUrl?: string;     // URL to audio file
  
  // Images
  wordImageFilename?: string;            // Image file name
  wordImageOriginalUrl?: string;         // URL to image
  
  // Grammar & Forms
  partOfSpeech?: string;                 // noun, verb, adjective, etc.
  simplePastTense?: string;              // Simple past form
  pastPerfectTense?: string;             // Past perfect form
  
  // Metadata
  tags?: string;                         // Comma-separated tags
  displayOrder?: number;                 // Display order in lists
  isActive?: boolean;                    // Whether vocabulary is active
  
  // Audit Fields
  createdAt?: string;                    // ISO 8601 timestamp
  updatedAt?: string;                    // ISO 8601 timestamp
  createdBy?: string;                    // Creator user ID
  updatedBy?: string;                    // Last updater user ID
}
```

## Pagination Response

When retrieving vocabularies with pagination:

```json
{
  "data": {
    "content": [...],                    // Array of vocabulary objects
    "page": 0,                           // Current page (0-indexed)
    "size": 20,                          // Items per page
    "totalElements": 100,                // Total number of items
    "totalPages": 5                      // Total number of pages
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "status": {
    "code": 400,
    "message": "Bad request",
    "errors": [
      {
        "field": "word",
        "message": "Word cannot be empty"
      }
    ]
  },
  "data": null,
  "meta": { ... }
}
```

### 404 Not Found
```json
{
  "status": {
    "code": 404,
    "message": "Vocabulary not found",
    "errors": null
  },
  "data": null,
  "meta": { ... }
}
```

### 500 Internal Server Error
```json
{
  "status": {
    "code": 500,
    "message": "Internal server error",
    "errors": null
  },
  "data": null,
  "meta": { ... }
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Vocabulary created successfully |
| 204 | No Content - Deletion successful |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Permission denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

## Examples

### Get all active English vocabularies
```
GET /v1/vocabularies?lang=EN&isActive=true&sort=word&direction=asc
```

### Get vocabularies with "basic" tag
```
GET /v1/vocabularies?tags=basic&page=0&size=50
```

### Get vocabularies updated in descending order
```
GET /v1/vocabularies?sort=updatedAt&direction=desc&size=20
```

### Search for vocabulary starting with "s"
```
GET /v1/vocabularies?word=s&lang=EN
```
