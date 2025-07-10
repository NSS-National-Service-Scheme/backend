import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
import UserController from '../controller/UserController.js';
const userRouter = Router();

userRouter.post('/add', authorizeRoles(3), UserController.addNewUser);
userRouter.put('/update/:id', authorizeRoles(3), UserController.updateUser);
userRouter.get('/getall', authorizeRoles(3), UserController.getAllUsers);
userRouter.get('/get/:id', authorizeRoles(3), UserController.getUserById);
userRouter.delete('/delete/:id', authorizeRoles(3), UserController.deleteUser);

export default userRouter;
