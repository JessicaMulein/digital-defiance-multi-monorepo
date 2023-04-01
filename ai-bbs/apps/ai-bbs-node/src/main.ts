import { Request,Response } from 'express';
import express = require('express');
import path = require('path');
import expressStaticGzip = require('express-static-gzip');

const app = express();
const distPath = path.join(__dirname, '../../apps/ai-bbs');

// Serve static files
app.use('/', expressStaticGzip(distPath, {
  enableBrotli: true,
  customCompressions: [],
  orderPreference: ['br', 'gzip']
}));

// API router
const apiRouter = express.Router();

apiRouter.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the API' });
});

app.use(apiRouter);

// Serve the index.html for all other requests
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
