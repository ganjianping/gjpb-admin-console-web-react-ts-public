#!/bin/bash

echo "🧹 Clearing all caches for profile module fix..."

# Clear Vite cache
echo "1. Clearing Vite cache..."
rm -rf node_modules/.vite

# Clear browser cache instructions
echo ""
echo "✅ Vite cache cleared!"
echo ""
echo "📋 Next steps:"
echo "   1. Stop the dev server (Ctrl+C if running)"
echo "   2. Run: npm run dev"
echo "   3. In your browser:"
echo "      - Open DevTools (F12 or Cmd+Option+I)"
echo "      - Right-click the refresh button"
echo "      - Select 'Empty Cache and Hard Reload'"
echo "      OR"
echo "      - Press Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)"
echo ""
echo "🔍 Check the console for these logs:"
echo "   - [Profile i18n] Adding translations to initialized i18n"
echo "   - [Profile i18n] Translations added successfully"
echo "   - [Profile i18n] EN translation check - profile.tabs.personal: Personal Information"
echo ""
echo "If you still see missingKey errors after this:"
echo "   1. Check the Network tab to see if profile module is loaded"
echo "   2. Check Console for any i18n initialization errors"
echo "   3. Try closing the browser completely and reopening"
echo ""
