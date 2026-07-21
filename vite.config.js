import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, existsSync, mkdirSync, statSync, createReadStream } from 'fs';
import { join } from 'path';

// Custom plugin to handle cloud runner's public assets
function cloudRunnerAssets() {
  const publicPath = resolve('cloud-runner/subway-surfers-clone/public');

  return {
    name: 'cloud-runner-assets',

    // During dev, serve static assets from the cloud runner's public folder.
    // In dev mode BASE_URL is "/" so the game requests /models/Idle.glb etc.
    // We also handle the full nested path for the production-like preview.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url.split('?')[0];

        // Try to serve from cloud runner's public dir at root level
        // (handles /models/..., /textures/..., /TrainModels/...)
        const rootFilePath = join(publicPath, decodeURIComponent(url));
        try {
          if (existsSync(rootFilePath) && statSync(rootFilePath).isFile()) {
            const ext = rootFilePath.split('.').pop().toLowerCase();
            const mimeTypes = {
              glb: 'model/gltf-binary',
              gltf: 'model/gltf+json',
              png: 'image/png',
              jpg: 'image/jpeg',
              jpeg: 'image/jpeg',
              mp3: 'audio/mpeg',
              ogg: 'audio/ogg',
              wav: 'audio/wav',
            };
            if (mimeTypes[ext]) {
              res.setHeader('Content-Type', mimeTypes[ext]);
            }
            createReadStream(rootFilePath).pipe(res);
            return;
          }
        } catch (e) {
          // Fall through
        }

        // Also handle the nested path (for production-like testing)
        const prefix = '/cloud-runner/subway-surfers-clone/';
        if (url.startsWith(prefix)) {
          const assetPath = url.slice(prefix.length);
          const nestedFilePath = join(publicPath, decodeURIComponent(assetPath));
          try {
            if (existsSync(nestedFilePath) && statSync(nestedFilePath).isFile()) {
              const ext = nestedFilePath.split('.').pop().toLowerCase();
              const mimeTypes = {
                glb: 'model/gltf-binary', gltf: 'model/gltf+json',
                png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
                mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav',
              };
              if (mimeTypes[ext]) {
                res.setHeader('Content-Type', mimeTypes[ext]);
              }
              createReadStream(nestedFilePath).pipe(res);
              return;
            }
          } catch (e) {
            // Fall through
          }
        }

        // Serve intern-block-blast public assets
        const blastPrefix = '/intern-block-blast/';
        if (url.startsWith(blastPrefix)) {
          const assetPath = url.slice(blastPrefix.length);
          const blastPublic = resolve('intern-block-blast/public');
          const filePath = join(blastPublic, decodeURIComponent(assetPath));
          try {
            if (existsSync(filePath) && statSync(filePath).isFile()) {
              const ext = filePath.split('.').pop().toLowerCase();
              if (ext === 'mp3') res.setHeader('Content-Type', 'audio/mpeg');
              createReadStream(filePath).pipe(res);
              return;
            }
          } catch (e) {}
        }

        // Serve onboarding-quest assets
        const questPrefix = '/onboarding-quest/';
        if (url.startsWith(questPrefix)) {
          const assetPath = url.slice(questPrefix.length);
          const questDir = resolve('onboarding-quest');
          const filePath = join(questDir, decodeURIComponent(assetPath));
          try {
            if (existsSync(filePath) && statSync(filePath).isFile()) {
              const ext = filePath.split('.').pop().toLowerCase();
              if (ext === 'mp3') res.setHeader('Content-Type', 'audio/mpeg');
              if (ext === 'html') { next(); return; }
              createReadStream(filePath).pipe(res);
              return;
            }
          } catch (e) {}
        }

        next();
      });
    },

    // During build, copy public assets into the output
    closeBundle() {
      const dest = resolve('dist/cloud-runner/subway-surfers-clone');
      if (existsSync(publicPath)) {
        if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
        cpSync(publicPath, dest, { recursive: true });
      }
      // Copy block blast music
      const blastSrc = resolve('intern-block-blast/public/music');
      const blastDest = resolve('dist/intern-block-blast/music');
      if (existsSync(blastSrc)) {
        if (!existsSync(blastDest)) mkdirSync(blastDest, { recursive: true });
        cpSync(blastSrc, blastDest, { recursive: true });
      }
      // Copy onboarding quest music
      const questSrc = resolve('onboarding-quest/music');
      const questDest = resolve('dist/onboarding-quest/music');
      if (existsSync(questSrc)) {
        if (!existsSync(questDest)) mkdirSync(questDest, { recursive: true });
        cpSync(questSrc, questDest, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve('index.html'),
        runner: resolve('cloud-runner/subway-surfers-clone/index.html'),
        blast: resolve('intern-block-blast/index.html'),
        quest: resolve('onboarding-quest/index.html'),
      },
    },
  },
  plugins: [cloudRunnerAssets()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://ew4z195och.execute-api.us-east-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
