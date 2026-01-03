import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'photobook.html'
            }
        }
    },
    server: {
        // Open photobook.html by default
        open: '/photobook.html'
    }
});
