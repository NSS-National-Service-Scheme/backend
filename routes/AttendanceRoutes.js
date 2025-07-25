import { Router } from 'express';
import AttendanceController from '../controller/AttendanceController.js';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const AttendanceRoutes = Router();

AttendanceRoutes.post(
    '/addAttendance',
    authorizeRoles(4),
    AttendanceController.addAttendance
);
AttendanceRoutes.put(
    '/updateAttendance/:AttendanceID',
    authorizeRoles(4),
    AttendanceController.updateAttendanceByID
);
AttendanceRoutes.delete(
    '/deleteAttendance/:AttendanceID',
    authorizeRoles(4),
    AttendanceController.deleteAttendanceByID
);
AttendanceRoutes.get(
    '/getAttendanceByID/:AttendanceID',
    authorizeRoles(4),
    AttendanceController.getAttendanceByID
);
AttendanceRoutes.get(
    '/getAttendanceByEventID/:EventID',
    authorizeRoles(4),
    AttendanceController.getAttendanceByEventID
);
AttendanceRoutes.delete(
    '/deleteEventAttendance/:EventID',
    authorizeRoles(4),
    AttendanceController.deleteEventAttendance
);

export default AttendanceRoutes;
