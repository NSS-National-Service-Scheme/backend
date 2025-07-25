import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
import ProfileController from '../controller/ProfileController.js';
const profileRouter = Router();

profileRouter.post(
    '/addProfile',
    ProfileController.addProfile
);
profileRouter.get(
    '/getProfile',
    ProfileController.getProfile
);
profileRouter.put(
    '/updateProfile',
    ProfileController.updateProfile
);
profileRouter.delete(
    '/deleteStudentProfile/:UserID',
    ProfileController.deleteStudentProfile
);
profileRouter.delete(
    '/deleteStaffProfile/:UserID',
    ProfileController.deleteStaffProfile
);
profileRouter.get(
    '/getAllStudents',
    ProfileController.getAllStudents
);
profileRouter.get(
    '/getAllStaffs',
    ProfileController.getAllStaffs
);

export default profileRouter;
