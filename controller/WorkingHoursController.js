import { validateDate } from '../utilites/dataValidator/wrkHours.js';
import WorkingHoursModule from '../modules/WorkingHoursModule.js';
import { StudentProfileModule } from '../modules/ProfileModule.js';
import EventCoordModule from '../modules/EventCoordModule.js';

import {
    setResponseBadRequest,
    setResponseInternalError,
} from '../utilites/response.js';

const WorkingHoursController = {
    getWorkingHours: async (req, res) => {
        try {
            const { startDate, endDate } = req.body;

            // Step 1: Validate dates
            const validationError = validateDate(startDate, endDate);
            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }

            // Step 2: Fetch events within the date range
            const eventsResponse = await WorkingHoursModule.getWorkingHours(
                startDate,
                endDate
            );
            if (eventsResponse.responseCode !== 200) {
                return res
                    .status(eventsResponse.responseCode)
                    .json(eventsResponse.responseBody);
            }

            // Step 3: Extract EventID list and create EventID → EventName map
            const eventIDs = eventsResponse.responseBody.map(
                (row) => row.EventID
            );
            const eventIDToName = new Map();
            for (const event of eventsResponse.responseBody) {
                eventIDToName.set(event.EventID, event.EventName);
            }

            // Step 4: Fetch attendance data
            const attendanceResponse =
                await WorkingHoursModule.AttendanceByEvents(eventIDs);
            if (attendanceResponse.responseCode !== 200) {
                return res
                    .status(attendanceResponse.responseCode)
                    .json(attendanceResponse.responseBody);
            }

            // Step 5: Build attendance map
            const attendanceMap = new Map(); // key: `${EventID}_${StudentID}`, value: Hours
            for (const entry of attendanceResponse.responseBody) {
                const key = `${entry.EventID}_${entry.StudentID}`;
                attendanceMap.set(key, entry.Hours || 0);
            }

            // Step 6: Build coordination map
            const coordMap = new Map(); // key: `${EventID}_${StudentID}`, value: Hours
            for (const eventID of eventIDs) {
                const coordRes =
                    await EventCoordModule.getEventCoordinators(eventID);
                const coordinators = Array.isArray(coordRes.responseBody)
                    ? coordRes.responseBody
                    : [coordRes.responseBody];

                for (const coord of coordinators) {
                    if (coord?.StudentID) {
                        const key = `${eventID}_${coord.StudentID}`;
                        coordMap.set(key, coord.Hours || 0);
                    }
                }
            }

            // Step 7: Get all student details
            const allStudentsRes =
                await StudentProfileModule.getAllStudentProfiles();
            const students = allStudentsRes.responseBody.map((row) => ({
                StudentID: row.StudentID,
                Name: row.Name,
                RollNo: row.RollNo,
            }));

            // Step 8: Construct final data table
            const result = students.map((student) => {
                const row = {
                    RollNo: student.RollNo,
                    Name: student.Name,
                };

                for (const eventID of eventIDs) {
                    const eventName =
                        eventIDToName.get(eventID) || `Event_${eventID}`;
                    const key = `${eventID}_${student.StudentID}`;
                    const attHours = attendanceMap.get(key) || 0;
                    const coordHours = coordMap.get(key) || 0;
                    const totalHours =
                        attHours > 0 ? attHours + coordHours : coordHours;
                    row[eventName] = totalHours; // Use event name instead of ID
                }

                return row;
            });

            // Step 9: Send structured JSON for frontend
            return res.status(200).json({
                columns: [
                    'RollNo',
                    'Name',
                    ...eventIDs.map((id) => eventIDToName.get(id)),
                ],
                data: result,
            });
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default WorkingHoursController;
