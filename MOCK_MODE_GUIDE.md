# Mock Mode Setup - Development Guide

## ✅ Mock Mode Successfully Configured!

The application is now running in **Mock Mode** which allows you to test all features without needing a real backend API server.

## 🔧 Current Configuration

### Environment Variables (`.env`)
```dotenv
# Enable mock mode for development
VITE_USE_MOCK=true

# Enable mock CSRF tokens 
VITE_ENABLE_MOCK_CSRF=true

# API Configuration
VITE_API_BASE_URL=/api
```

### Firebase Configuration Fixed
- ✅ **Fixed**: Changed `process.env` to `import.meta.env` for Vite compatibility
- ✅ **Status**: Firebase Analytics and Performance Monitoring properly configured
- ✅ **Development**: Firebase services disabled in localhost (as designed)

## 🔐 Mock User Accounts

You can log in with any of these test accounts:

### Super Admin Account
- **Username**: `gjpb`
- **Email**: `gjpb@gmail.com`
- **Password**: `123456`
- **Role**: `SUPER_ADMIN`
- **Mobile**: +65 89765432

### Admin Account
- **Username**: `admin`
- **Email**: `admin@example.com`
- **Password**: `123456`
- **Role**: `ADMIN`
- **Mobile**: +65 88887777

### Regular User Account
- **Username**: `user`
- **Email**: `user@example.com`
- **Password**: `123456`
- **Role**: `USER`
- **Mobile**: +65 99998888

## 🚀 How to Test

1. **Access Application**: http://localhost:3000
2. **Login**: Use any of the mock accounts above
3. **Test Features**:
   - ✅ Dashboard with analytics
   - ✅ User management (view/edit/delete simulations)
   - ✅ Document management
   - ✅ Profile updates and password changes
   - ✅ Settings (theme/language changes)
   - ✅ Analytics tracking (disabled in dev, logged to console)
   - ✅ Report generation

## 📊 Analytics in Mock Mode

- **Firebase Analytics**: Disabled in development (localhost)
- **Console Logging**: Analytics events are logged to browser console
- **Page Views**: Tracked and logged for debugging
- **User Events**: Form submissions, button clicks logged

## 🔍 Debugging Tips

### Check Browser Console
- Mock API calls logged with `[MockApiService]` prefix
- Firebase Analytics logs show `disabled in development`
- Authentication flow logged step by step

### Network Tab
- No real API calls made (all mocked locally)
- Authentication tokens are generated locally
- CSRF protection simulated

### Local Storage
- User info stored in `gjpb_user_info`
- Authentication state persisted

## 🛠️ Mock API Features

### Authentication
- ✅ Login with username/email/mobile
- ✅ Token generation (JWT-like format)
- ✅ Token refresh simulation
- ✅ Role-based access control
- ✅ Session management

### Error Simulation
- ✅ Invalid credentials handling
- ✅ Network delay simulation (800ms)
- ✅ Token expiry scenarios

## 🔄 Switching Back to Real API

To switch back to real API mode:

1. Edit `.env`:
   ```dotenv
   # Disable mock mode
   VITE_USE_MOCK=false
   # VITE_ENABLE_MOCK_CSRF=false
   ```

2. Update API base URL to your backend:
   ```dotenv
   VITE_API_BASE_URL=https://your-api-server.com/api
   ```

3. Restart development server:
   ```bash
   npm run dev
   ```

## ✨ Ready for Development!

The application is now running in full mock mode. You can:
- Test all UI components and flows
- Develop new features without backend dependencies
- Validate user interactions and analytics
- Test authentication and authorization flows
- Debug frontend logic in isolation

**Access the app**: http://localhost:3000

Happy coding! 🎉
