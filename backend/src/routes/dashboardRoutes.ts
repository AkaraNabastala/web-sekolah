import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import {
  getDashboardActivities,
  getDashboardStatistics
} from '../controllers/dashboardController.js';

export const dashboardRouter = Router();

dashboardRouter.get('/statistics', requireAdmin, getDashboardStatistics);
dashboardRouter.get('/activities', requireAdmin, getDashboardActivities);
