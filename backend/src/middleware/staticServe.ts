import express, { Express } from 'express';
import path from 'path';
import fs from 'fs';

export function setupStaticServing(app: Express): void {
  if (process.env.NODE_ENV === 'production') {
    const candidates = [
      path.resolve(__dirname, '../../../frontend/dist'),
      path.resolve(__dirname, '../../frontend/dist'),
      path.resolve(process.cwd(), '../frontend/dist'),
      path.resolve(process.cwd(), 'frontend/dist'),
    ];

    const frontendDist = candidates.find((p) => fs.existsSync(p));

    if (frontendDist) {
      console.log(`Serving production frontend from: ${frontendDist}`);
      app.use(express.static(frontendDist));
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
          return next();
        }
        res.sendFile(path.join(frontendDist, 'index.html'));
      });
    } else {
      console.warn('Production frontend build not found in candidate paths.');
    }
  }
}
