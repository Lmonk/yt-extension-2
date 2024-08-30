import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist-tmp',
    rollupOptions: {
      input: {
        content_script: path.resolve(__dirname, 'src/content-scripts/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',  // Use 'iife' format here
      },
    },
  },
});
