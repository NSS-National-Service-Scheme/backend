import { Router } from 'express';
import EventController from '../controller/EventController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
const EventRoutes = Router();

EventRoutes.post(
    '/createEvent',
    EventController.createEvent
);
EventRoutes.put('/updateEvent', authorizeRoles(4), EventController.updateEvent);
EventRoutes.delete(
    '/deleteEvent',
    EventController.deleteEvent
);
EventRoutes.get(
    '/getEventbyID',
    EventController.getEventById
);
EventRoutes.get(
    '/getAllEvents',
    EventController.getAllEvents
);

export default EventRoutes;
