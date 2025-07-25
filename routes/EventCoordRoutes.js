import { Router } from 'express';
import EventController from '../controller/EventCoordController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const EventCoordRoutes = Router();

EventCoordRoutes.post(
    '/addEventCoordinator',
    EventController.addEventCoordinator
);
EventCoordRoutes.put(
    '/updateEventCoordinator',
    EventController.updateEventCoordinator
);
EventCoordRoutes.delete(
    '/deleteEventCoordinator',
    EventController.deleteEventCoordinator
);
EventCoordRoutes.get(
    '/getAllEventCoordinators',
    EventController.getAllEventCoordinators
);

export default EventCoordRoutes;
