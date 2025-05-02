import { defineConfig } from 'vite';

export default defineConfig({
    base: '/animal-playground/', // Add this line for GitHub Pages
    build: {
        target: 'esnext'
    }
});