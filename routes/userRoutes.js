import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
import UserController from '../controller/UserController.js';
const userRouter = Router();

userRouter.post('/addUser', authorizeRoles(3), UserController.addNewUser);
userRouter.put('/updateUser/:id', authorizeRoles(3), UserController.updateUser);
userRouter.get('/getallUser', authorizeRoles(3), UserController.getAllUsers);
userRouter.get('/getUser/:id', authorizeRoles(3), UserController.getUserById);
userRouter.delete(
    '/deleteUser/:id',
    authorizeRoles(3),
    UserController.deleteUser
);
userRouter.post('/IsActive', authorizeRoles(5), UserController.isActiveUser);

export default userRouter;
