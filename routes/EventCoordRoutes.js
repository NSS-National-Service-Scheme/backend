import { Router } from 'express';
import EventController from '../controller/EventCoordController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const eventCoordRouter= Router();

eventCoordRouter.post('/addEventCoordinator', authorizeRoles(4), EventController.addEventCoordinator);
eventCoordRouter.put('/updateEventCoordinator', authorizeRoles(4), EventController.updateEventCoordinator);
eventCoordRouter.delete('/deleteEventCoordinator', authorizeRoles(4), EventController.deleteEventCoordinator);
eventCoordRouter.get('/getAllEventCoordinators', authorizeRoles(4), EventController.getAllEventCoordinators);

export default eventCoordRouter;
