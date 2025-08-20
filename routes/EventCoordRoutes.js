import { Router } from 'express';
import EventController from '../controller/EventCoordController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const EventCoordRoutes = Router();

EventCoordRoutes.post(
    '/addEventCoordinator',
    authorizeRoles(4),
    EventController.addEventCoordinator
);
EventCoordRoutes.put(
    '/updateEventCoordinator',
    authorizeRoles(4),
    EventController.updateEventCoordinator
);
EventCoordRoutes.delete(
    '/deleteEventCoordinator',
    authorizeRoles(4),
    EventController.deleteEventCoordinator
);
EventCoordRoutes.get(
    '/getAllEventCoordinators',
    authorizeRoles(4),
    EventController.getAllEventCoordinators
);

export default EventCoordRoutes;
