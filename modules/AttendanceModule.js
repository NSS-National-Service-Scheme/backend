import pool from '../db/connectionPool.js';
import {
    setResponseBadRequest,
    setResponseInternalError,
    setResponseOk,
} from '../utilites/response.js';
import { validateNewAttendanceData } from '../utilites/dataValidator/Attendance.js';
const AttedanceModule = {
    addAttedance: async (EventID, StudentID, Status) => {
        let db;
        try {
            db = await pool.getConnection();
            db.query('LOCK TABLES EventAttendance WRITE');
            const query =
                'INSERT INTO EventAttendance (EventID, StudentID, Status) VALUES (?, ?, ?)';
            const results = await db.query(query, [EventID, StudentID, Status]);
            db.query('UNLOCK TABLES');
            return setResponseOk('Attendance added successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to add attendance',
            });
        } finally {
            db.release();
        }
    },

    deleteAttendanceByID: async (AttendanceID) => {
        let db;
        try {
            db = await pool.getConnection();
            db.query('LOCK TABLES EventAttendance WRITE');
            db.query('DELETE FROM EventAttendance WHERE AttendanceID = ?', [
                AttendanceID,
            ]);
            db.query('UNLOCK TABLES');
            return setResponseOk('Attendance deleted successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to delete attendance',
            });
        } finally {
            db.release();
        }
    },

    updateAttendanceByID: async (AttendanceID, EventID, StudentID, Status) => {
        let db;
        try {
            db = await pool.getConnection();
            const fields = [];
            const values = [];

            if (EventID) {
                fields.push('EventID = ?');
                values.push(EventID);
            }
            if (StudentID) {
                fields.push('StudentID = ?');
                values.push(StudentID);
            }

            if (Status) {
                fields.push('Status = ?');
                values.push(Status);
            }

            if (fields.length === 0) {
                return setResponseBadRequest('No fields to update');
            }

            values.push(AttendanceID);
            db.query('LOCK TABLES EventAttendance WRITE');
            const query = `UPDATE EventAttendance SET ${fields.join(', ')} WHERE AttendanceID = ?`;
            console.log(query, values);
            await db.query(query, values);
            db.query('UNLOCK TABLES');
            return setResponseOk('Attendance updated successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to update attendance',
            });
        } finally {
            db.release();
        }
    },

    deleteEventAttendance: async (EventID) => {
        let db;
        try {
            db = await pool.getConnection();
            db.query('LOCK TABLES EventAttendance WRITE');
            const results = await db.query(
                'DELETE FROM EventAttendance WHERE EventID = ?',
                [EventID]
            );
            if (results.affectedRows === 0) {
                return setResponseBadRequest(
                    'No attendance records found for this event'
                );
            }
            db.query('UNLOCK TABLES');
            return setResponseOk('Attendance records deleted successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to delete attendance records',
            });
        } finally {
            db.release();
        }
    },

    getAttendanceByEventID: async (EventID) => {
        let db;
        try {
            db = await pool.getConnection();
            db.query('LOCK TABLES EventAttendance READ');
            const results = await db.query(
                'SELECT * FROM EventAttendance WHERE EventID = ?',
                [EventID]
            );
            db.query('UNLOCK TABLES');
            if (results.length === 0) {
                return setResponseBadRequest(
                    'No attendance records found for this event'
                );
            }
            return setResponseOk(
                'Attendance records retrieved successfully',
                results
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to retrieve attendance records',
            });
        } finally {
            db.release();
        }
    },

    getAttendanceByID: async (AttendanceID) => {
        let db;
        try {
            db = await pool.getConnection();
            db.query('LOCK TABLES EventAttendance READ');
            const results = await db.query(
                'SELECT * FROM EventAttendance WHERE AttendanceID = ?',
                [AttendanceID]
            );
            db.query('UNLOCK TABLES');
            if (results.length === 0) {
                return setResponseBadRequest('Attendance record not found');
            }
            return setResponseOk(
                'Attendance record retrieved successfully',
                results[0]
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to retrieve attendance record',
            });
        } finally {
            db.release();
        }
    },
};

export default AttedanceModule;
