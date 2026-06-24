import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

function apiBridge() {
  return {
    name: 'api-bridge',
    enforce: 'pre' as const,
    configureServer(server: any) {
      console.log('[api-bridge] configured');
      const handler = async (req: any, res: any, next: any) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        console.log('[api-bridge] handling', req.url);

        const targetUrl = new URL(req.url.replace(/^\/api/, ''), 'http://127.0.0.1:3000');

        try {
          if (targetUrl.pathname === '/categories') {
            const categories = new Set<string>();
            let cursor: string | null = null;

            for (let page = 0; page < 12 && categories.size < 6; page += 1) {
              const productsUrl = new URL('/products', 'http://127.0.0.1:3000');
              productsUrl.searchParams.set('limit', '100');
              if (cursor) {
                productsUrl.searchParams.set('cursor', cursor);
              }

              const response = await fetch(productsUrl.toString());
              if (!response.ok) {
                break;
              }

              const payload = (await response.json()) as { data?: Array<{ category?: string }>; next_cursor?: string | null };
              for (const item of payload.data ?? []) {
                if (item.category) {
                  categories.add(item.category);
                }
              }

              cursor = payload.next_cursor ?? null;
              if (!cursor) {
                break;
              }
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ data: Array.from(categories).sort() }));
            return;
          }

          const response = await fetch(targetUrl.toString());
          const body = await response.arrayBuffer();

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            res.setHeader(key, value);
          });
          res.end(Buffer.from(body));
        } catch (error) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Proxy error' }));
        }
      };

      server.middlewares.stack.unshift({ route: '', handle: handler });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiBridge()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});