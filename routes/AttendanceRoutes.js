import { Router } from 'express';
import AttendanceController from '../controller/AttendanceController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const AttendanceRoutes = Router();

AttendanceRoutes.post(
    '/addAttendance',
    AttendanceController.addAttendance
);
AttendanceRoutes.put(
    '/updateAttendance/:AttendanceID',

    AttendanceController.updateAttendanceByID
);
AttendanceRoutes.delete(
    '/deleteAttendance/:AttendanceID',
    authorizeRoles,
    AttendanceController.deleteAttendanceByID
);
AttendanceRoutes.get(
    '/getAttendanceByID/:AttendanceID',
    AttendanceController.getAttendanceByID
);
AttendanceRoutes.get(
    '/getAttendanceByEventID/:EventID',
    AttendanceController.getAttendanceByEventID
);
AttendanceRoutes.delete(
    '/deleteEventAttendance/:EventID',
    AttendanceController.deleteEventAttendance
);

export default AttendanceRoutes;
