import pool from '../db/connectionPool.js';
import AttendanceController from '../controller/AttendanceController.js';
import { setResponseBadRequest, setResponseInternalError , setResponseOk } from '../utilites/response.js';


const WorkingHoursModule = {
    getWorkingHours: async (startDate, endDate) => {
        try{
            const db = await pool.getConnection();
            await db.query('LOCK TABLES Events READ');
            const query = 'Select * from Events WHERE Event_Date >= ? AND Event_Date <= ?';
            const results = await db.query(query, [startDate, endDate]);
            await db.query('UNLOCK TABLES');
            return setResponseOk("Event retrived successfully", results);

        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: "Failed to retrieve working hours" });     
        }finally {
            db.release();
        }
    },

    AttendanceByEvents: async (eventIDs) => {
  try {
    const result = {};

    for (const id of eventIDs) {
      const attendance = await AttendanceController.getAttendanceByEventID(id);
      result[id] = attendance;
    }

    return setResponseOk("Attendance fetched for all events", result);
  } catch (err) {
    return setResponseInternalError({
      error: "Failed to retrieve attendance for events",
      err,
    });
  }
},



}