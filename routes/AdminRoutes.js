import { Router } from 'express';
import AdminController from '../controller/AdminController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const AdminRouter= Router();

AdminRouter.get("/getDepts",authorizeRoles(5),AdminController.getDepts);
AdminRouter.get("/getSchool",authorizeRoles(5),AdminController.getSchools);

export default AdminRouter;