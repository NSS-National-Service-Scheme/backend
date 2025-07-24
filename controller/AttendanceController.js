import AttendanceModule from '../modules/AttendanceModule.js';
import { validateNewAttendanceData } from '../utilites/dataValidator/Attendance';
const AttendanceController = {
    addAttendance: async (req, res) => {
        try {
            const { EventID, StudentID, Status } = req.body;
            const validationError = validateNewAttendanceData(EventID, StudentID, Status);
            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res.status(response.responseCode).json(response.responseBody);
            }
            const result = await AttendanceModule.addAttedance(EventID, StudentID, Status);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    deleteAttendanceByID: async (req, res) => {
        try {
            const { AttendanceID } = req.params;
            const result = await AttendanceModule.deleteAttendanceByID(AttendanceID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    updateAttendanceByID: async (req, res) => {
        try {
            const { AttendanceID } = req.params;
            const { EventID, StudentID, Status } = req.body;
            const validationError = validateNewAttendanceData(EventID, StudentID, Status);
            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res.status(response.responseCode).json(response.responseBody);
            }
            const result = await AttendanceModule.updateAttendanceByID(EventID, StudentID, Status, AttendanceID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    deleteEventAttendance: async (req, res) => {
        try {
            const { EventID } = req.params;
            const result = await AttendanceModule.deleteEventAttendance(EventID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    getAttendanceByEventID: async (req, res) => {
        try {
            const { EventID } = req.params;
            const result = await AttendanceModule.getAttendanceByEventID(EventID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    getAttendanceByID: async (req, res) => {
        try {
            const { AttendanceID } = req.params;
            const result = await AttendanceModule.getAttendanceByID(AttendanceID);
            return res.status(result.responseCode).json(result.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },
}

export default AttendanceController;