# Firebase Performance Monitoring Setup

This guide explains how Firebase Performance Monitoring has been integrated to replace Web Vitals in the GJPB Admin Console.

## 🔥 What Firebase Performance Provides

### **Automatic Monitoring (No Code Required)**
- ✅ **Core Web Vitals**: CLS, FID, FCP, LCP, TTFB
- ✅ **Page Load Times**: Full page load performance
- ✅ **Network Requests**: HTTP request monitoring
- ✅ **App Start Time**: Initial app bootstrap time

### **Custom Monitoring (With Code)**
- 🎯 **Custom Traces**: Track specific operations
- 📊 **Custom Metrics**: Add business-specific measurements
- 🏷️ **Custom Attributes**: Segment data by user/feature

## 🚀 Setup Instructions

### 1. **Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable **Performance Monitoring** in the project

### 2. **Get Firebase Configuration**
1. In Firebase Console, go to **Project Settings** > **General**
2. Scroll to "Your apps" section
3. Click **Add app** > **Web** (</> icon)
4. Register your app
5. Copy the configuration object

### 3. **Update Environment Variables**
Update your `.env` file with your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. **Deploy to Production**
Firebase Performance only works in production. For testing:
```bash
npm run build
npm run preview
# Or deploy to your hosting provider
```

## 📊 Usage Examples

### **Automatic Page Tracking**
Use the custom hook in any page component:

```tsx
import { useFirebasePerformance } from '../hooks/useFirebasePerformance';

const MyPage = () => {
  const user = useAppSelector(selectCurrentUser);
  
  // Automatically tracks page load time
  useFirebasePerformance('my-page', user?.username);
  
  return <div>My Page Content</div>;
};
```

### **Custom Action Tracking**
Track user interactions and operations:

```tsx
import { useActionTracing } from '../hooks/useFirebasePerformance';

const MyComponent = () => {
  const { traceAction } = useActionTracing();
  
  const handleSubmit = async (data: FormData) => {
    await traceAction(
      'form_submission',
      () => submitForm(data),
      { form_type: 'user_profile', user_role: 'admin' }
    );
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

### **Manual Trace Management**
For complex operations with multiple steps:

```tsx
import { startTrace, stopTrace, setTraceAttribute, setTraceMetric } from '../utils/firebasePerformance';

const MyService = {
  async complexOperation() {
    const trace = startTrace('complex_operation');
    
    try {
      // Step 1
      setTraceAttribute(trace, 'step', 'data_processing');
      const data = await processData();
      
      // Step 2
      setTraceAttribute(trace, 'step', 'api_calls');
      const results = await makeApiCalls(data);
      
      // Add metrics
      setTraceMetric(trace, 'items_processed', data.length);
      setTraceAttribute(trace, 'status', 'success');
      
      return results;
    } catch (error) {
      setTraceAttribute(trace, 'status', 'error');
      throw error;
    } finally {
      stopTrace(trace);
    }
  }
};
```

## 📈 Viewing Performance Data

### **Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Performance** in the left sidebar
4. View real-time and historical performance data

### **Available Dashboards**
- **Web Vitals**: Core Web Vitals metrics over time
- **Page Loads**: Page load performance by URL
- **Network Requests**: HTTP request performance
- **Custom Traces**: Your custom measurements

### **Data Segmentation**
Filter and segment data by:
- **Device Type**: Desktop, Mobile, Tablet
- **Browser**: Chrome, Firefox, Safari, etc.
- **Country/Region**: Geographic performance insights
- **App Version**: Compare performance across releases
- **Custom Attributes**: Your business-specific segments

## 🔄 Migration from Web Vitals

### **What Changed**
- ❌ **Removed**: `apps/shell/src/utils/reportWebVitals.ts`
- ✅ **Added**: Firebase Performance SDK and configuration
- 🔄 **Updated**: `main.tsx` to initialize Firebase instead of Web Vitals

### **Benefits Over Web Vitals**
1. **Real-time Dashboard**: View performance data in Firebase Console
2. **Historical Data**: 90 days of performance history
3. **Automatic Network Monitoring**: HTTP requests tracked automatically
4. **User Segmentation**: Analyze performance by demographics
5. **Alerts**: Get notified of performance regressions
6. **Custom Traces**: Track business-specific operations

### **What You Get**
- **Same Core Web Vitals data** (CLS, FID, FCP, LCP, TTFB)
- **Plus comprehensive additional metrics**
- **Professional performance monitoring dashboard**
- **Team collaboration features**

## 🎯 Best Practices

### **Page Tracking**
- Use `useFirebasePerformance` hook in all major pages
- Include user context when available
- Use consistent page names across the app

### **Custom Traces**
- Trace operations that take > 100ms
- Include relevant attributes for filtering
- Use consistent naming conventions
- Don't trace too granularly (avoid performance overhead)

### **Attributes and Metrics**
- Add user role, feature flags, A/B test variants
- Include error states and success metrics
- Use string attributes for filtering, numeric metrics for aggregation

## 🚨 Important Notes

### **Production Only**
Firebase Performance only collects data in production environments. The code includes automatic detection:

```typescript
// Only initializes in production
if (window.location.hostname !== 'localhost') {
  performance = getPerformance(app);
}
```

### **Bundle Size**
Firebase SDK adds ~45KB to your bundle (vs ~3KB for Web Vitals). This trade-off provides comprehensive monitoring capabilities.

### **Privacy**
Performance data is sent to Google Firebase servers. Ensure this complies with your privacy policy and data handling requirements.

## 🔧 Development vs Production

### **Development (localhost)**
- Firebase Performance is disabled
- Console logs show "Firebase Performance monitoring disabled in development"
- No performance data is collected

### **Production**
- Firebase Performance automatically initializes
- All performance data is collected and sent to Firebase
- Real-time monitoring and alerting is active

This setup ensures optimal development experience while providing comprehensive production monitoring.
