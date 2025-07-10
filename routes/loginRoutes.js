import { Router } from 'express';
import LoginController from '../controller/LoginController.js';
const loginRouter = Router();
loginRouter.post('/login', LoginController.login);
loginRouter.post('/logout', LoginController.logout);

export default loginRouter;
