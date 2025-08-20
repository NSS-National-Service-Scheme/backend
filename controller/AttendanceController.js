import AttendanceModule from '../modules/AttendanceModule.js';
import { validateNewAttendanceData } from '../utilites/dataValidator/Attendance.js';
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest,
} from '../utilites/response.js';
const AttendanceController = {
    addAttendance: async (req, res) => {
        try {
            const { EventID, RollNo, Status } = req.body;
            console.log('Entered');
            const result = await AttendanceModule.addAttedance(
                EventID,
                RollNo,
                Status
            );
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    deleteAttendanceByID: async (req, res) => {
        try {
            const { AttendanceID } = req.params;
            const result =
                await AttendanceModule.deleteAttendanceByID(AttendanceID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    updateAttendanceByID: async (req, res) => {
        try {
            const { AttendanceID } = req.params;
            const { EventID, StudentID, Status } = req.body;

            const result = await AttendanceModule.updateAttendanceByID(
                AttendanceID,
                EventID,
                StudentID,
                Status
            );
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    deleteEventAttendance: async (req, res) => {
        try {
            const { EventID } = req.params;
            const result =
                await AttendanceModule.deleteEventAttendance(EventID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAttendanceByEventID: async (req, res) => {
        try {
            const { EventID } = req.params;
            const result =
                await AttendanceModule.getAttendanceByEventID(EventID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAttendanceByID: async (req, res) => {
        try {
            const { AttendanceID } = req.params;
            const result =
                await AttendanceModule.getAttendanceByID(AttendanceID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default AttendanceController;
