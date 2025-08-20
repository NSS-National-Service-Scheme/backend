import pool from '../db/connectionPool.js';
import { validateEventdata } from '../utilites/dataValidator/Event.js';
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest,
} from '../utilites/response.js';

const EventsModule = {
    addEvent: async (
        Event_Name,
        Event_hours,
        Event_Type,
        Event_Date,
        Event_Time,
        Event_Venue,
        EventDescription,
        Status,
        PosterURL,
        Registration,
        InstructionSet
    ) => {
        const db = await pool.getConnection();
        try {
            console.log("Here", Event_Name, Event_hours, Event_Type, Event_Date, Event_Time, Event_Venue, EventDescription, Status, PosterURL, Registration, InstructionSet);
            await db.query('LOCK TABLES Events WRITE');
            console.log('INSERT INTO Events (Event_Name, Event_hours, Event_Type, Event_Date, Event_Time, Event_Venue, EventDescription, Status, PosterURL, Registration, InstructionSet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    Event_Name,
                    Event_hours,
                    Event_Type,
                    Event_Date,
                    Event_Time,
                    Event_Venue,
                    EventDescription,
                    Status,
                    PosterURL,
                    Registration,
                    InstructionSet,
                ]);
            const results = await db.query(
                'INSERT INTO Events (Event_Name, Event_hours, Event_Type, Event_Date, Event_Time, Event_Venue, EventDescription, Status, PosterURL, Registration, InstructionSet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    Event_Name,
                    Event_hours,
                    Event_Type,
                    Event_Date,
                    Event_Time,
                    Event_Venue,
                    EventDescription,
                    Status,
                    PosterURL,
                    Registration,
                    InstructionSet,
                ]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event Added Succefully', results);
        } catch (error) {
            console.log("error:",error);
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: 'Failed to add event' });
        } finally {
            await db.query('UNLOCK TABLES');
            db.release();
        }
    },
    updateEvent: async (
        EventID,
        Event_Name,
        Event_hours,
        Event_Type,
        Event_Date,
        Event_Time,
        Event_Venue,
        EventDescription,
        Status,
        PosterURL,
        Registration,
        InstructionSet
    ) => {
        const db = await pool.getConnection();
        try {
            const fields = [];
            const values = [];

            if (Event_Name) {
                fields.push('Event_Name = ?');
                values.push(Event_Name);
            }
            if (Event_hours) {
                fields.push('Event_hours = ?');
                values.push(Event_hours);
            }
            if (Event_Type) {
                fields.push('Event_Type = ?');
                values.push(Event_Type);
            }
            if (Event_Date) {
                fields.push('Event_Date = ?');
                values.push(Event_Date);
            }
            if (Event_Time) {
                fields.push('Event_Time = ?');
                values.push(Event_Time);
            }
            if (Event_Venue) {
                fields.push('Event_Venue = ?');
                values.push(Event_Venue);
            }
            if (EventDescription) {
                fields.push('EventDescription = ?');
                values.push(EventDescription);
            }
            if (Status) {
                fields.push('Status = ?');
                values.push(Status);
            }
            if (PosterURL) {
                fields.push('PosterURL = ?');
                values.push(PosterURL);
            }
            if (Registration) {
                fields.push('Registration = ?');
                values.push(Registration);
            }
            if (InstructionSet) {
                fields.push('InstructionSet = ?');
                values.push(InstructionSet);
            }
            if (fields.length === 0) {
                return setResponseBadRequest('No valid fields to update.');
            }

            values.push(EventID);
            const query = `UPDATE Events SET ${fields.join(', ')} WHERE EventID = ?`;
            const [results] = await db.query(query, values);
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event updated successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to update event',
            });
        } finally {
            await db.query('UNLOCK TABLES');
            db.release();
        }
    },

    deleteEvent: async (EventID) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Events WRITE');
            const [results] = await db.query(
                'DELETE FROM Events WHERE EventID = ?',
                [EventID]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Event deleted successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({
                error: 'Failed to delete event',
            });
        } finally {
            db.release();
        }
    },

    getEventById: async (EventID) => {
        const db = await pool.getConnection();
        try {
            const [results] = await db.query(
                'SELECT * FROM Events WHERE EventID = ?',
                [EventID]
            );
            if (results.length === 0) {
                return setResponseBadRequest('Event not found');
            }
            return setResponseOk('Event retrieved successfully', results[0]);
        } catch (error) {
            return setResponseInternalError({
                error: 'Failed to retrieve event',
            });
        } finally {
            db.release();
        }
    },

    getAllEvents: async () => {
        const db = await pool.getConnection();
        try {
            const [results] = await db.query('SELECT * FROM Events');
            return setResponseOk('Events retrieved successfully', results);
        } catch (error) {
            return setResponseInternalError({
                error: 'Failed to retrieve events',
            });
        } finally {
            db.release();
        }
    },
};

export default EventsModule;
