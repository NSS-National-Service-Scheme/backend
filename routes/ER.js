import { Router } from 'express';
import EventController from '../controller/EventController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });
const EventRoutes = Router();

EventRoutes.post('/createEvent', upload.single('Poster'), EventController.createEvent);

EventRoutes.put('/updateEvent', EventController.updateEvent);
EventRoutes.delete(
    '/deleteEvent',
    authorizeRoles(4),
    EventController.deleteEvent
);
EventRoutes.get(
    '/getEventbyID',
    authorizeRoles(4),
    EventController.getEventById
);
EventRoutes.get(
    '/getAllEvents',
    authorizeRoles(4),
    EventController.getAllEvents
);

export default EventRoutes;
