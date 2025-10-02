# Firebase Setup Guide

## Issue Fixed
The Firebase Analytics warnings have been resolved. The application now handles missing Firebase configuration gracefully.

## Current Status
- ✅ Firebase Analytics warnings fixed
- ✅ Development mode shows debug messages instead of warnings
- ✅ Production mode shows appropriate warnings if Firebase is not configured
- ✅ Application continues to work without Firebase configuration

## To Enable Firebase Analytics (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Add a web app to your project
4. Copy the configuration values
5. Create a `.env.local` file in the project root
6. Add the Firebase configuration:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

7. Restart the development server

## Changes Made

### Firebase Configuration (`apps/shell/src/config/firebase.ts`)
- Added validation for Firebase configuration completeness
- Improved error handling for missing environment variables
- Better logging messages for development vs production

### Analytics Utilities (`apps/shell/src/utils/firebaseAnalytics.ts`)
- Updated all analytics functions to handle missing configuration gracefully
- Different logging levels for development (debug) vs production (warnings)
- Clearer messages about why analytics is disabled

## Console Messages

### Development Mode (localhost)
```
🔥 Firebase configuration incomplete - services disabled
📊 To enable Firebase, configure environment variables in .env.local
🔧 Analytics page view "Settings" not tracked - disabled in development
```

### Production Mode (without Firebase config)
```
🔥 Firebase configuration incomplete - services disabled
📊 To enable Firebase, configure environment variables in .env.local
⚠️ Analytics page view "Settings" not tracked - Firebase Analytics not initialized
⚠️ Check Firebase configuration in environment variables
```

### Production Mode (with Firebase config)
```
🔥 Firebase Performance monitoring initialized
📊 Firebase Analytics initialized
📊 Analytics: Page view tracked - Settings
```