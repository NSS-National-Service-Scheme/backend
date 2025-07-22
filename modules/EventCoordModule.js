import pool from '../db/connectionPool.js';
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest
} from '../utilites/response.js';

const EventCoordModule = {
    addEventCoordinator: async (eventID, CoordinationRole ,StudentID , Hours ) => {
        const db = await pool.getConnection();

        try {
            await db.query('LOCK TABLES EventCoordMapping WRITE, Events READ, Student READ');
            const [existingRows] = await db.query(
                'SELECT * FROM EventCoordMapping WHERE EventID = ? AND StudentID = ?', 
                [eventID, StudentID]
            );
            if (existingRows.length > 0) {
                return setResponseBadRequest ('Student is already an event coordinator for this event' );
            }
            await db.query(
                'INSERT INTO EventCoordMapping (EventID, CoordinationRole, StudentID, Hours) VALUES (?, ?, ?, ?)',
                [eventID, CoordinationRole, StudentID, Hours]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event coordinator added successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to add event coordinator');
        }finally{
            await db.query('UNLOCK TABLES');
            db.release();
        }   
    },

    updateEventCoordinator: async (eventID, CoordinationRole, StudentID, Hours) => {
        const db = await pool.getConnection();

        try {
            await db.query('LOCK TABLES EventCoordMapping WRITE, Events READ, Student READ');
            const [existingRows] = await db.query(
                'SELECT * FROM EventCoordMapping WHERE EventID = ? AND StudentID = ?', 
                [eventID, StudentID]
            );
            if (existingRows.length === 0) {
                return setResponseBadRequest('Event coordinator not found for this event');
            }
            await db.query(
                'UPDATE EventCoordMapping SET CoordinationRole = ?, Hours = ? WHERE EventID = ? AND StudentID = ?',
                [CoordinationRole, Hours, eventID, StudentID]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event coordinator updated successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to update event coordinator');
        }finally {
            await db.query('UNLOCK TABLES');
            db.release();
        }
    },

    deleteEventCoordinator: async (eventID, StudentID) => {
        const db = await pool.getConnection();

        try {
            await db.query('LOCK TABLES EventCoordMapping WRITE, Events READ, Student READ');
            const [existingRows] = await db.query(
                'SELECT * FROM EventCoordMapping WHERE EventID = ? AND StudentID = ?', 
                [eventID, StudentID]
            );
            if (existingRows.length === 0) {
                return setResponseBadRequest('Event coordinator not found for this event');
            }
            await db.query(
                'DELETE FROM EventCoordMapping WHERE EventID = ? AND StudentID = ?',
                [eventID, StudentID]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event coordinator deleted successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to delete event coordinator');
        }finally {
            await db.query('UNLOCK TABLES');
            db.release();
        }
    },

    getEventCoordinators: async (eventID) => {
        const db = await pool.getConnection();

        try {
            await db.query('LOCK TABLES EventCoordMapping READ, Events READ, Student READ');
            const [rows] = await db.query(
                'SELECT ECM.EventID, ECM.CoordinationRole, ECM.StudentID, ECM.Hours, S.Name ' +
                'FROM EventCoordMapping ECM JOIN Student S ON ECM.StudentID = S.StudentID ' +
                'WHERE ECM.EventID = ?',
                [eventID]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event coordinators retrieved successfully', rows);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to retrieve event coordinators');
        }finally {
            await db.query('UNLOCK TABLES');
            db.release();
        }
    },

}

export default EventCoordModule;
