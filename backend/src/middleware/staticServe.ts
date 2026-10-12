import express, { Express } from 'express';
import path from 'path';
import fs from 'fs';

export function setupStaticServing(app: Express): void {
  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.resolve(__dirname, '../../../frontend/dist');
    if (fs.existsSync(frontendDist)) {
      app.use(express.static(frontendDist));
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
          return next();
        }
        res.sendFile(path.join(frontendDist, 'index.html'));
      });
    }
  }
}
