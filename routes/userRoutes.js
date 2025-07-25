import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
import UserController from '../controller/UserController.js';
const userRouter = Router();

userRouter.post('/addUser', UserController.addNewUser);
userRouter.put('/updateUser/:id',  UserController.updateUser);
userRouter.get('/getallUser',  UserController.getAllUsers);
userRouter.get('/getUser/:id',  UserController.getUserById);
userRouter.delete('/deleteUser/:id',UserController.deleteUser);
userRouter.post('/IsActive',  UserController.isActiveUser);
export default userRouter;
