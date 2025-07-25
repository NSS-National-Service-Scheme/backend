import { Router } from 'express';
import EventController from '../controller/EventCoordController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const eventCoordRouter = Router();

eventCoordRouter.post(
    '/addEventCoordinator',
    EventController.addEventCoordinator
);
eventCoordRouter.put(
    '/updateEventCoordinator',
    EventController.updateEventCoordinator
);
eventCoordRouter.delete(
    '/deleteEventCoordinator',
    EventController.deleteEventCoordinator
);
eventCoordRouter.get(
    '/getAllEventCoordinators',
    EventController.getAllEventCoordinators
);

export default eventCoordRouter;
