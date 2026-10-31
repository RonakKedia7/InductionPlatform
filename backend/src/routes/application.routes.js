import express from 'express';

import {getMyApplication, submitApplication,} from '../controllers/application.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protectRoute, submitApplication);
router.get('/me', protectRoute, getMyApplication);

export default router;
