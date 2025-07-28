import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
import ProfileController from '../controller/ProfileController.js';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
const profileRouter = Router();

profileRouter.post(
    '/addProfile',
    authorizeRoles(5),
    upload.single('DP'),
    ProfileController.addProfile
);
profileRouter.get(
    '/getProfile',
    authorizeRoles(5),
    ProfileController.getProfile
);
profileRouter.put(
    '/updateProfile',
    authorizeRoles(5),
    upload.single('DP'),
    ProfileController.updateProfile
);
profileRouter.delete(
    '/deleteStudentProfile/:UserID',
    authorizeRoles(5),
    ProfileController.deleteStudentProfile
);
profileRouter.delete(
    '/deleteStaffProfile/:UserID',
    authorizeRoles(5),
    ProfileController.deleteStaffProfile
);
profileRouter.get(
    '/getAllStudents',
    authorizeRoles(5),
    ProfileController.getAllStudents
);
profileRouter.get(
    '/getAllStaffs',
    authorizeRoles(5),
    ProfileController.getAllStaffs
);

export default profileRouter;
