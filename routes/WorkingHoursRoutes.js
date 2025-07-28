import { Router } from 'express';
import WorkingHoursController from '../controller/WorkingHoursController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const WorkingHoursRoutes = Router();
WorkingHoursRoutes.get(
    '/getWorkingHours/:startDate/:endDate',
    authorizeRoles(4),WorkingHoursController.getWorkingHours
);
export default WorkingHoursRoutes;