# User Management API Specification

## Overview
This document provides the complete API specification for the User Management system. Please update the user management codebase based on the following API endpoints and their specifications.

## Base URL
```
/api/v1/users
```

## Authentication
All endpoints require authentication. Unauthorized requests will receive a 401 response:

```json
{
    "status": {
        "code": 401,
        "message": "Unauthorized",
        "errors": {
            "error": "Full authentication is required to access this resource"
        }
    },
    "data": null,
    "meta": {
        "serverDateTime": "2025-06-17 05:45:10"
    }
}
```

## API Endpoints

### 1. Query Users
**Endpoint:** `GET /api/v1/users`

**Description:** Retrieve a paginated list of users with optional filtering and sorting.

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | integer | Page number (0-based) | `0` |
| `size` | integer | Number of items per page | `10` |
| `sort` | string | Field to sort by | `username` |
| `direction` | string | Sort direction (`asc`, `desc`) | `asc` |
| `username` | string | Filter by username | `admin` |
| `nickname` | string | Filter by nickname | `Admin` |
| `email` | string | Filter by email | `admin@example.com` |
| `mobileCountryCode` | string | Filter by mobile country code | `65` |
| `mobileNumber` | string | Filter by mobile number | `62388237` |
| `accountStatus` | string | Filter by account status | `active`, `locked`, `suspend`, `pending_verification` |
| `active` | boolean | Filter by active status | `true`, `false` |
| `roleCode` | string | Filter by role code | `USER`, `ADMIN` |

**Success Response (200):**
```json
{
    "status": {
        "code": 200,
        "message": "Users retrieved successfully",
        "errors": null
    },
    "data": {
        "content": [
            {
                "id": "c60b9bd5-1f1d-47b7-aacb-5b1e01f42967",
                "username": "6562388237",
                "nickname": null,
                "email": null,
                "mobileCountryCode": "65",
                "mobileNumber": "62388237",
                "accountStatus": "active",
                "active": true,
                "lastLoginAt": "2025-05-27T07:55:23",
                "lastLoginIp": "0:0:0:0:0:0:0:1",
                "passwordChangedAt": "2025-05-27T07:54:37",
                "createdAt": "2025-05-27T07:54:37",
                "updatedAt": "2025-05-27T15:54:54",
                "roles": [
                    {
                        "id": "550e8400-e29b-41d4-a716-446655440010",
                        "code": "USER",
                        "name": "Regular User",
                        "description": "Standard authenticated user with basic reading, commenting, and profile management privileges",
                        "sortOrder": 10,
                        "level": 0,
                        "parentRoleId": null,
                        "systemRole": true,
                        "active": true,
                        "createdAt": "2025-05-25T15:21:28",
                        "updatedAt": "2025-05-25T15:21:28",
                        "createdBy": null,
                        "updatedBy": null
                    }
                ]
            }
        ],
        "pageable": {
            "pageNumber": 0,
            "pageSize": 10,
            "sort": {
                "empty": false,
                "sorted": true,
                "unsorted": false
            },
            "offset": 0,
            "paged": true,
            "unpaged": false
        },
        "last": true,
        "totalPages": 1,
        "totalElements": 4,
        "first": true,
        "size": 10,
        "number": 0,
        "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
        },
        "numberOfElements": 4,
        "empty": false
    },
    "meta": {
        "serverDateTime": "2025-05-28 21:40:07"
    }
}
```

### 2. Create User
**Endpoint:** `POST /api/v1/users`

**Description:** Create a new user account.

**Request Body:**
```json
{
    "username": "admin",
    "password": "Password@1",
    "nickname": "Admin",
    "email": "admin@gmail.com",
    "mobileCountryCode": "65",
    "mobileNumber": "62243434",
    "accountStatus": "active",
    "roleCodes": ["USER"],
    "active": true
}
```

**Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Unique username for the account |
| `password` | string | Yes | User password (must meet security requirements) |
| `nickname` | string | No | Display name for the user |
| `email` | string | No | User's email address |
| `mobileCountryCode` | string | No | Mobile phone country code |
| `mobileNumber` | string | No | Mobile phone number |
| `accountStatus` | string | No | Account status (`active`, `locked`, `suspend`, `pending_verification`) |
| `roleCodes` | array | No | Array of role codes to assign to the user |
| `active` | boolean | No | Whether the account is active |

**Success Response (200):**
```json
{
    "status": {
        "code": 200,
        "message": "User created successfully",
        "errors": null
    },
    "data": {
        "id": "3d93788a-cfc6-463f-b2e9-06b8c39ca458",
        "username": "admin1",
        "nickname": "Admin",
        "email": "admin1@gmail.com",
        "mobileCountryCode": "65",
        "mobileNumber": "62243432",
        "accountStatus": "active",
        "active": true,
        "lastLoginAt": null,
        "lastLoginIp": null,
        "passwordChangedAt": "2025-06-17T05:48:41.725552",
        "createdAt": "2025-06-17T05:48:41.725552",
        "updatedAt": "2025-06-17T05:48:41.725552",
        "roles": [
            {
                "id": "550e8400-e29b-41d4-a716-446655440010",
                "code": "USER",
                "name": "Regular User",
                "description": "Standard authenticated user with basic reading, commenting, and profile management privileges",
                "sortOrder": 10,
                "level": 0,
                "parentRoleId": null,
                "systemRole": true,
                "active": true,
                "createdAt": "2025-05-25T15:21:28",
                "updatedAt": "2025-05-25T15:21:28",
                "createdBy": null,
                "updatedBy": null
            }
        ]
    },
    "meta": {
        "serverDateTime": "2025-06-17 05:48:41",
        "requestId": "2081d52a-8094-4d31-9c90-9c1ed51ad601",
        "sessionId": "no-session"
    }
}
```

**Error Response (400):**
```json
{
    "status": {
        "code": 400,
        "message": "Request error",
        "errors": {
            "error": "Username is already taken"
        }
    },
    "data": null,
    "meta": {
        "serverDateTime": "2025-05-29 03:51:26"
    }
}
```

### 3. Update User (Full Update)
**Endpoint:** `PUT /api/v1/users/{userId}`

**Description:** Update all fields of an existing user. All fields must be provided.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | string (UUID) | The unique identifier of the user to update |

**Request Body:** Same schema as Create User (excluding password field for updates)

**Success Response:** Same structure as Create User response

### 4. Update User (Partial Update)
**Endpoint:** `PATCH /api/v1/users/{userId}`

**Description:** Update specific fields of an existing user. Only provided fields will be updated.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | string (UUID) | The unique identifier of the user to update |

**Request Body:** Partial user object with only the fields to be updated

**Success Response:** Same structure as Create User response

### 5. Delete User
**Endpoint:** `DELETE /api/v1/users/{userId}`

**Description:** Delete an existing user account.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | string (UUID) | The unique identifier of the user to delete |

**Success Response (200):**
```json
{
    "status": {
        "code": 200,
        "message": "User deleted successfully",
        "errors": null
    },
    "data": null,
    "meta": {
        "serverDateTime": "2025-06-17 05:48:41"
    }
}
```

## Data Models

### User Object
```json
{
    "id": "string (UUID)",
    "username": "string",
    "nickname": "string | null",
    "email": "string | null",
    "mobileCountryCode": "string | null",
    "mobileNumber": "string | null",
    "accountStatus": "string",
    "active": "boolean",
    "lastLoginAt": "string (ISO 8601) | null",
    "lastLoginIp": "string | null",
    "passwordChangedAt": "string (ISO 8601)",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "roles": "Role[]"
}
```

### Role Object
```json
{
    "id": "string (UUID)",
    "code": "string",
    "name": "string",
    "description": "string",
    "sortOrder": "integer",
    "level": "integer",
    "parentRoleId": "string (UUID) | null",
    "systemRole": "boolean",
    "active": "boolean",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)",
    "createdBy": "string | null",
    "updatedBy": "string | null"
}
```

## Error Handling

### Common Error Response Structure
```json
{
    "status": {
        "code": "integer",
        "message": "string",
        "errors": "object | null"
    },
    "data": null,
    "meta": {
        "serverDateTime": "string"
    }
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors, duplicate username, etc.)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user does not exist)
- `500` - Internal Server Error

## Implementation Notes

1. **Authentication:** All endpoints require valid authentication tokens
2. **Validation:** Implement proper input validation for all fields
3. **Security:** Passwords should be hashed and never returned in responses
4. **Pagination:** Default page size should be configurable
5. **Filtering:** Support case-insensitive filtering where applicable
6. **Audit Trail:** Track user creation, updates, and deletions
7. **Role Management:** Ensure proper role validation and assignment
8. **Error Handling:** Provide meaningful error messages for all failure scenarios