import  { Router } from 'express';
import EventController from '../controller/EventController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';
const eventController = Router();

eventController.post('/createEvent',authorizeRoles(4),EventController.createEvent);
eventController.put('/updateEvent',authorizeRoles(4),EventController.updateEvent);
eventController.delete('/deleteEvent',authorizeRoles(4), EventController.deleteEvent);
eventController.get('/getEventbyID',authorizeRoles(4),EventController.getEventById);
eventController.get('/getAllEvents', authorizeRoles(4),EventController.getAllEvents);

export default eventController;