import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@mui/material', '@mui/icons-material'],
            utils: ['axios', 'lodash', 'date-fns']
          }
        }
      },
      // Optimize CSS
      cssCodeSplit: true,
      // Use esbuild minification for a faster build
      minify: 'esbuild',
    },
  }
})
