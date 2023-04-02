import { Router } from 'express';
import { testGet } from '../controllers/test';
import { openAiRouter  } from '../routes/openai.route';
import { isAuthenticated } from './auth.route';
import { feedRouter } from './feed.route';

// all routes prefixed with /api
export const apiRouter = Router();
// Sub-routers
// -----
// all routes prefixed with /api/openai
apiRouter.use('/openai', openAiRouter);
apiRouter.use('/feed', feedRouter);

// Commands
// -----
// /api/test
apiRouter.get('/test', testGet);