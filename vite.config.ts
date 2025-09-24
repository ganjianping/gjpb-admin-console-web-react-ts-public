import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Check if we're in development mode
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@apps': path.resolve(__dirname, './apps'),
        'auth-mf': path.resolve(__dirname, './apps/auth-mf/src'),
        '@shared': path.resolve(__dirname, './apps/shared-lib/src'),
      },
    },
    server: {
      port: 3000,
      host: true,
      strictPort: true, // Force port 3000, fail if busy
      cors: true, // Enable CORS for the dev server
      proxy: {
        '/api': {
          target: 'http://localhost:8081',
          changeOrigin: true,
          secure: false,
          ws: true, // Enable WebSocket proxying
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
          },
          configure: (proxy) => {
            // Add timeout to proxy server
            proxy.on('proxyReq', (proxyReq, req) => {
              proxyReq.setTimeout(10000); // 10 seconds timeout
              console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:8081${req.url}`);
              console.log(`[Proxy] Headers:`, req.headers);
            });
            
            // Handle proxy errors
            proxy.on('error', (err, _req, res) => {
              console.error(`Proxy error: ${err.message}`);
              
              if (res.writable) {
                try {
                  res.writeHead(502, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    error: 'Bad Gateway',
                    message: 'Cannot connect to backend service. Make sure your backend is running on http://localhost:8081',
                    status: 502
                  }));
                } catch (e: unknown) {
                  const errorMsg = e instanceof Error ? e.message : 'Unknown error';
                  console.warn(`Error sending error response: ${errorMsg}`);
                }
              }
            });
          }
        }
      }
    },
    // Performance optimizations
    build: {
      target: 'es2020',
      sourcemap: isDev ? 'inline' : false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Custom chunk splitting strategy for better control
          manualChunks: (id) => {
            // Debug logging (remove in production)
            if (isDev) {
              console.log('📦 Analyzing module:', id);
            }
            
            // Microfrontend modules - create dedicated chunks
            if (id.includes('auth-mf/src')) {
              return 'auth-mf';
            }
            if (id.includes('user-mf/src')) {
              return 'user-mf';
            }
            if (id.includes('bm-mf/src')) {
              return 'base-mf';
            }
            
            // Shared library - separate chunk for shared components
            if (id.includes('shared-lib/src')) {
              return 'shared-lib';
            }
            
            // Core React libraries
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('node_modules/react-router')) {
              return 'react-vendor';
            }
            
            // UI Framework
            if (id.includes('@mui/material') || 
                id.includes('@mui/icons-material') || 
                id.includes('@mui/x-')) {
              return 'mui-vendor';
            }
            
            // Utility libraries
            if (id.includes('node_modules/axios') ||
                id.includes('node_modules/lodash') ||
                id.includes('node_modules/date-fns')) {
              return 'utils-vendor';
            }
            
            // i18n libraries
            if (id.includes('node_modules/i18next') ||
                id.includes('node_modules/react-i18next')) {
              return 'i18n-vendor';
            }
            
            // Redux libraries
            if (id.includes('node_modules/@reduxjs') ||
                id.includes('node_modules/react-redux')) {
              return 'redux-vendor';
            }
            
            // Other node_modules go to common vendor chunk
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            
            // Default: let Vite decide (usually goes to main chunk)
            return undefined;
          },
          
          // Control chunk file naming pattern
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? 
              chunkInfo.facadeModuleId.split('/').pop()?.replace('.ts', '').replace('.tsx', '') : 
              'chunk';
            return `${chunkInfo.name}-${facadeModuleId}-[hash].js`;
          },
          
          // Control entry file naming  
          entryFileNames: '[name]-[hash].js',
          
          // Control asset file naming
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      // Optimize CSS
      cssCodeSplit: true,
      // Use esbuild minification for a faster build
      minify: 'esbuild',
    },
  }
})
