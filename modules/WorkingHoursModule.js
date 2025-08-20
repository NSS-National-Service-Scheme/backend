// ===== FIXED WORKING HOURS MODULE =====
import pool from '../db/connectionPool.js';
import {
    setResponseBadRequest,
    setResponseInternalError,
    setResponseOk,
} from '../utilites/response.js';

const WorkingHoursModule = {
    getWorkingHours: async (startDate, endDate) => {
        let db;
        try {
            db = await pool.getConnection();
            await db.query('LOCK TABLES Events read');
            const query = 'SELECT * FROM Events WHERE Event_Date >= ? AND Event_Date <= ?';
            const [results] = await db.query(query, [startDate, endDate]); // ✅ Destructure to get only data
            console.log('Events data:', results);
            await db.query('UNLOCK TABLES');
            return setResponseOk('Events retrieved successfully', results);
        } catch (error) {
            if (db) await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to retrieve working hours: ' + error.message,
            });
        } finally {
            if (db) db.release();
        }
    },

    AttendanceByEvents: async (eventIDs) => {
        let db;
        try {
            if (!eventIDs || eventIDs.length === 0) {
                return setResponseOk('No events to fetch attendance for', []);
            }

            db = await pool.getConnection();
            
            // Create placeholders for IN clause
            const placeholders = eventIDs.map(() => '?').join(',');
            const query = `SELECT * FROM EventAttendance WHERE EventID IN (${placeholders})`;
            
            await db.query('LOCK TABLES EventAttendance read');
            const [results] = await db.query(query, eventIDs); // ✅ Destructure to get only data
            await db.query('UNLOCK TABLES');
            
            return setResponseOk('Attendance fetched for all events', results);
        } catch (error) {
            if (db) await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to retrieve attendance for events: ' + error.message,
            });
        } finally {
            if (db) db.release();
        }
    },

    // Helper method to get attendance by single event ID
    getAttendanceByEventID: async (eventID) => {
        let db;
        try {
            db = await pool.getConnection();
            await db.query('LOCK TABLES EventAttendance read');
            const query = 'SELECT * FROM EventAttendance WHERE EventID = ?';
            const [results] = await db.query(query, [eventID]); // ✅ Destructure to get only data
            await db.query('UNLOCK TABLES');
            return setResponseOk('Attendance retrieved successfully', results);
        } catch (error) {
            if (db) await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to retrieve attendance: ' + error.message,
            });
        } finally {
            if (db) db.release();
        }
    },
};

export default WorkingHoursModule;