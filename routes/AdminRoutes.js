import { Router } from 'express';
import AdminController from '../controller/AdminController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const AdminRouter = Router();

AdminRouter.get('/getDepts', AdminController.getDepts);
AdminRouter.get('/getSchool', AdminController.getSchools);

export default AdminRouter;
