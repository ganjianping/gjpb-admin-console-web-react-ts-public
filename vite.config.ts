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
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/v1'),
          configure: (proxy) => {
            // Add timeout to proxy server
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setTimeout(10000); // 10 seconds timeout
            });
            
            // Handle proxy errors
            proxy.on('error', (err, req, res) => {
              console.error(`Proxy error: ${err.message}`);
              
              if (isDev && req.url?.includes('/csrf-token') && res.writable) {
                try {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ csrfToken: `mock-csrf-token-${Date.now()}` }));
                  console.info('Returning mock CSRF token due to proxy error');
                } catch (e: unknown) {
                  const errorMsg = e instanceof Error ? e.message : 'Unknown error';
                  console.warn(`Error sending mock CSRF response: ${errorMsg}`);
                }
              } else if (res.writable) {
                try {
                  res.writeHead(502, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ 
                    error: 'Bad Gateway',
                    message: 'Cannot connect to backend service',
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
