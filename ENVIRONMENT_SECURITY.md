# 🔒 Environment Security Guide

This document explains how to securely configure environment variables for the GJPB Admin Console.

## 🚨 **IMPORTANT SECURITY NOTICE**

**NEVER commit your `.env` file to git!** It contains sensitive credentials that should remain private.

## 📁 **File Structure**

- **`.env`** - Your private environment variables (NEVER commit this)
- **`.env.example`** - Template file with placeholder values (safe to commit)
- **`.gitignore`** - Ensures `.env` files are not tracked by git

## 🛠️ **Setup Instructions**

### 1. **Copy the Example File**
```bash
cp .env.example .env
```

### 2. **Update with Real Values**
Edit `.env` with your actual Firebase credentials:

```env
# Replace these with your real Firebase project values
VITE_FIREBASE_API_KEY=your-real-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
# ... etc
```

### 3. **Get Firebase Credentials**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Go to **Project Settings** > **General**
4. Scroll to "Your apps" section
5. Click **Add app** > **Web** (</> icon)
6. Copy the configuration values

## 🔐 **What's Protected**

### **Sensitive Data (Never Commit)**
- Firebase API keys
- Project IDs
- Authentication domains
- Measurement IDs
- Any credentials or tokens

### **Safe to Commit**
- Template files (`.env.example`)
- Configuration structure
- Comments and documentation
- Non-sensitive default values

## 📋 **Environment Files Explained**

### **`.env` (Private)**
```env
# Your actual production/development credentials
VITE_FIREBASE_API_KEY=AIzaSyDdR3aL_cR3d3nT1aLs...
VITE_FIREBASE_PROJECT_ID=gjpb-admin-prod
```

### **`.env.example` (Public Template)**
```env
# Example values showing the required structure
VITE_FIREBASE_API_KEY=REPLACE_WITH_YOUR_API_KEY
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🛡️ **Security Best Practices**

### **✅ Do This**
- Use `.env.example` as a template
- Keep real credentials in `.env` only
- Add `.env*` to `.gitignore`
- Use different Firebase projects for dev/staging/prod
- Regularly rotate API keys

### **❌ Never Do This**
- Commit `.env` files to git
- Share credentials in chat/email
- Use production credentials in development
- Hardcode credentials in source code
- Put credentials in documentation

## 🔧 **Development vs Production**

### **Development Environment**
- Use a separate Firebase project for development
- Enable Firebase Performance only when needed
- Use demo/test credentials for local development

### **Production Environment**
- Use dedicated production Firebase project
- Enable all Firebase features
- Use strong, unique credentials
- Set up proper access controls

## 🚀 **Deployment Considerations**

### **CI/CD Pipelines**
- Set environment variables in your deployment platform
- Never store credentials in CI/CD config files
- Use encrypted secrets management

### **Hosting Platforms**
- **Vercel**: Add env vars in dashboard
- **Netlify**: Set in site settings
- **Firebase Hosting**: Use Firebase config
- **Docker**: Use environment injection

## 🆘 **If Credentials Are Compromised**

1. **Immediately revoke** the compromised API key
2. **Generate new credentials** in Firebase Console
3. **Update environment variables** in all environments
4. **Check access logs** for unauthorized usage
5. **Review security rules** in Firebase

## 📞 **Getting Help**

If you need help with environment setup:
1. Check this documentation first
2. Review Firebase Console documentation
3. Ensure `.env` follows the `.env.example` format
4. Verify Firebase project permissions

Remember: **Security is everyone's responsibility!** 🔒
