// ===== FIXED WORKING HOURS CONTROLLER =====
import { validateDate } from '../utilites/dataValidator/wrkHours.js';
import WorkingHoursModule from '../modules/WorkingHoursModule.js';
import { StudentProfileModule } from '../modules/ProfileModule.js';
import EventCoordModule from '../modules/EventCoordModule.js';
import {
    setResponseInternalError,
    setResponseOk,
    setResponseBadRequest,
} from '../utilites/response.js';

const WorkingHoursController = {
    getWorkingHours: async (req, res) => {
        try {
            const { startDate, endDate } = req.params;

            // Step 1: Validate input
            if (!startDate || !endDate) {
                const response = setResponseBadRequest('Start date and end date are required');
                return res.status(response.responseCode).json(response.responseBody);
            }

            // Step 2: Validate dates
            const validationError = validateDate(startDate, endDate);
            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }

            // Step 3: Fetch events within the date range
            const eventsResponse = await WorkingHoursModule.getWorkingHours(
                startDate,
                endDate
            );

            if (eventsResponse.responseCode !== 200) {
                return res
                    .status(eventsResponse.responseCode)
                    .json(eventsResponse.responseBody);
            }

            // Step 4: Extract events array from response
            let events = eventsResponse.responseBody || [];

            // Since we fixed the module, events should now be a proper array
            // But keep some safety checks for backward compatibility
            if (!Array.isArray(events)) {
                if (events && events.DATA && Array.isArray(events.DATA)) {
                    events = events.DATA;
                } else if (events && events.data && Array.isArray(events.data)) {
                    events = events.data;
                } else if (events && typeof events === 'object') {
                    events = [events];
                } else {
                    events = [];
                }
            }

            // Final safety check
            if (!Array.isArray(events) || events.length === 0) {
                return res.status(200).json({
                    success: true,
                    columns: ['RollNo', 'Name'],
                    data: [],
                    message: 'No events found in the specified date range'
                });
            }

            // Step 5: Extract EventID list and create EventID → EventName and EventID → Event_hours maps
            const eventIDs = events
                .filter(event => event && event.EventID)
                .map(event => event.EventID);

            if (eventIDs.length === 0) {
                return res.status(200).json({
                    success: true,
                    columns: ['RollNo', 'Name'],
                    data: [],
                    message: 'No valid events found in the specified date range'
                });
            }

            const eventIDToName = new Map();
            const eventIDToHours = new Map(); // Store Event_hours for each event
            events.forEach((event) => {
                if (event && event.EventID) {
                    // Use Event_Name from your database structure (not EventName)
                    eventIDToName.set(event.EventID, event.Event_Name || `Event_${event.EventID}`);
                    eventIDToHours.set(event.EventID, event.Event_hours || 0); // Store Event_hours
                }
            });

            // Step 6: Fetch attendance data for all events at once
            const attendanceResponse = await WorkingHoursModule.AttendanceByEvents(eventIDs);
            if (attendanceResponse.responseCode !== 200) {
                return res
                    .status(attendanceResponse.responseCode)
                    .json(attendanceResponse.responseBody);
            }

            // Step 7: Build attendance set
            const attendanceSet = new Set(); // key: `${EventID}_${StudentID}`
            let attendanceData = attendanceResponse.responseBody || [];
            
            // Since we fixed the module, attendanceData should now be a proper array
            // But keep some safety checks for backward compatibility
            if (!Array.isArray(attendanceData)) {
                if (attendanceData.DATA && Array.isArray(attendanceData.DATA)) {
                    attendanceData = attendanceData.DATA;
                } else if (attendanceData.data && Array.isArray(attendanceData.data)) {
                    attendanceData = attendanceData.data;
                } else {
                    attendanceData = [];
                }
            }
            
            attendanceData.forEach((entry) => {
                if (entry && entry.EventID && entry.StudentID && entry.Status === 'Attended') {
                    const key = `${entry.EventID}_${entry.StudentID}`;
                    attendanceSet.add(key);
                }
            });

            // Step 8: Build coordination map using Promise.all for better performance
            const coordMap = new Map(); // key: `${EventID}_${StudentID}`, value: coordination Hours
            
            const coordPromises = eventIDs.map(async (eventID) => {
                try {
                    const coordRes = await EventCoordModule.getEventCoordinators(eventID);
                    
                    if (coordRes.responseCode === 200 && coordRes.responseBody) {
                        let coordinators = coordRes.responseBody;
                        
                        // Handle nested structure for coordinators
                        if (!Array.isArray(coordinators)) {
                            if (coordinators.DATA && Array.isArray(coordinators.DATA)) {
                                coordinators = coordinators.DATA;
                            } else if (coordinators.data && Array.isArray(coordinators.data)) {
                                coordinators = coordinators.data;
                            } else {
                                coordinators = [coordinators];
                            }
                        }

                        return coordinators
                            .filter(coord => coord && coord.StudentID)
                            .map(coord => ({
                                eventID,
                                studentID: coord.StudentID,
                                hours: coord.Hours || 0
                            }));
                    }
                    return [];
                } catch (coordError) {
                    console.error(`Error fetching coordinators for event ${eventID}:`, coordError);
                    return [];
                }
            });

            const coordResults = await Promise.all(coordPromises);
            coordResults.flat().forEach(coord => {
                if (coord.studentID) {
                    const key = `${coord.eventID}_${coord.studentID}`;
                    coordMap.set(key, coord.hours);
                }
            });

            // Step 9: Get all student details
            const allStudentsRes = await StudentProfileModule.getAllStudentProfiles();
            
            if (allStudentsRes.responseCode !== 200) {
                return res
                    .status(allStudentsRes.responseCode)
                    .json(allStudentsRes.responseBody);
            }

            // Extract students data - handle your specific response structure
            let studentsData = allStudentsRes.responseBody || [];
            if (!Array.isArray(studentsData)) {
                if (studentsData.DATA && Array.isArray(studentsData.DATA)) {
                    studentsData = studentsData.DATA;
                } else if (studentsData.data && Array.isArray(studentsData.data)) {
                    studentsData = studentsData.data;
                } else {
                    studentsData = [];
                }
            }

            const students = studentsData
                .filter(student => student && student.StudentID) // Filter out invalid students
                .map((student) => ({
                    StudentID: student.StudentID,
                    Name: student.Name || 'Unknown',
                    RollNo: student.RollNo || 'N/A',
                }));

            if (students.length === 0) {
                return res.status(200).json({
                    success: true,
                    columns: ['RollNo', 'Name', ...Array.from(eventIDToName.values())],
                    data: [],
                    message: 'No students found'
                });
            }

            // Step 10: Construct final data table
            const result = students.map((student) => {
                const row = {
                    RollNo: student.RollNo,
                    Name: student.Name,
                };

                // Add hours for each event
                eventIDs.forEach((eventID) => {
                    const eventName = eventIDToName.get(eventID) || `Event_${eventID}`;
                    const key = `${eventID}_${student.StudentID}`;
                    
                    const eventHours = eventIDToHours.get(eventID) || 0; // Get Event_hours from Events table
                    const coordHours = coordMap.get(key) || 0; // Get coordination hours
                    const isAttended = attendanceSet.has(key); // Check if student attended
                    const isCoordinator = coordMap.has(key); // Check if student is coordinator
                    
                    let totalHours = 0;
                    
                    if (isCoordinator) {
                        // If coordinator: Event_hours + coordination Hours
                        totalHours = eventHours + coordHours;
                    } else if (isAttended) {
                        // If only attended: Event_hours
                        totalHours = eventHours;
                    }
                    // If neither attended nor coordinator: totalHours remains 0
                    
                    row[eventName] = totalHours;
                });

                return row;
            });

            // Step 11: Send structured JSON for frontend
            return res.status(200).json({
                success: true,
                columns: [
                    'RollNo',
                    'Name',
                    ...Array.from(eventIDToName.values())
                ],
                data: result,
                summary: {
                    totalEvents: eventIDs.length,
                    totalStudents: students.length,
                    dateRange: { startDate, endDate }
                }
            });

        } catch (error) {
            console.error('Error in getWorkingHours:', error);
            const response = setResponseInternalError({ 
                error: 'Failed to generate working hours report: ' + error.message 
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    // Additional helper method to get working hours for a specific student
    getStudentWorkingHours: async (req, res) => {
        try {
            const { studentId, startDate, endDate } = req.body;

            if (!studentId) {
                const response = setResponseBadRequest('Student ID is required');
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }

            if (!startDate || !endDate) {
                const response = setResponseBadRequest('Start date and end date are required');
                return res.status(response.responseCode).json(response.responseBody);
            }

            const validationError = validateDate(startDate, endDate);
            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }

            // Fetch events in date range
            const eventsResponse = await WorkingHoursModule.getWorkingHours(startDate, endDate);
            if (eventsResponse.responseCode !== 200) {
                return res
                    .status(eventsResponse.responseCode)
                    .json(eventsResponse.responseBody);
            }

            // Handle events data structure - extract from DATA property
            let events = eventsResponse.responseBody || [];
            if (!Array.isArray(events)) {
                if (events.DATA && Array.isArray(events.DATA)) {
                    events = events.DATA;
                } else if (events.data && Array.isArray(events.data)) {
                    events = events.data;
                } else if (typeof events === 'object') {
                    events = [events];
                } else {
                    events = [];
                }
            }

            const eventIDs = events
                .filter(event => event && event.EventID)
                .map(event => event.EventID);

            if (eventIDs.length === 0) {
                return res.status(200).json({
                    success: true,
                    studentId: studentId,
                    dateRange: { startDate, endDate },
                    totalHours: 0,
                    eventDetails: []
                });
            }

            // Create event maps
            const eventIDToHours = new Map();
            events.forEach((event) => {
                if (event && event.EventID) {
                    eventIDToHours.set(event.EventID, event.Event_hours || 0);
                }
            });

            // Get student's attendance
            const attendanceResponse = await WorkingHoursModule.AttendanceByEvents(eventIDs);
            let attendanceData = attendanceResponse.responseBody || [];
            
            // Handle nested structure
            if (!Array.isArray(attendanceData)) {
                if (attendanceData.DATA && Array.isArray(attendanceData.DATA)) {
                    attendanceData = attendanceData.DATA;
                } else if (attendanceData.data && Array.isArray(attendanceData.data)) {
                    attendanceData = attendanceData.data;
                } else {
                    attendanceData = [];
                }
            }
            
            // Filter for this student and only attended events
            const studentAttendedEvents = new Set();
            attendanceData.forEach(att => {
                if (att && att.StudentID === parseInt(studentId) && att.Status === 'Attended') {
                    studentAttendedEvents.add(att.EventID);
                }
            });

            // Get coordination data for this student
            const coordPromises = eventIDs.map(async (eventID) => {
                try {
                    const coordRes = await EventCoordModule.getEventCoordinators(eventID);
                    if (coordRes.responseCode === 200 && coordRes.responseBody) {
                        let coordinators = coordRes.responseBody;
                        
                        if (!Array.isArray(coordinators)) {
                            if (coordinators.DATA && Array.isArray(coordinators.DATA)) {
                                coordinators = coordinators.DATA;
                            } else if (coordinators.data && Array.isArray(coordinators.data)) {
                                coordinators = coordinators.data;
                            } else {
                                coordinators = [coordinators];
                            }
                        }

                        const studentCoord = coordinators.find(coord => 
                            coord && coord.StudentID === parseInt(studentId)
                        );
                        
                        return studentCoord ? {
                            eventID,
                            coordHours: studentCoord.Hours || 0
                        } : null;
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching coordinators for event ${eventID}:`, error);
                    return null;
                }
            });

            const coordResults = await Promise.all(coordPromises);
            const studentCoordMap = new Map();
            coordResults.forEach(result => {
                if (result) {
                    studentCoordMap.set(result.eventID, result.coordHours);
                }
            });

            // Calculate hours for each event
            let totalHours = 0;
            const eventDetails = [];

            eventIDs.forEach(eventID => {
                const eventHours = eventIDToHours.get(eventID) || 0;
                const isAttended = studentAttendedEvents.has(eventID);
                const coordHours = studentCoordMap.get(eventID) || 0;
                const isCoordinator = studentCoordMap.has(eventID);

                let hours = 0;
                let status = 'Not Participated';

                if (isCoordinator) {
                    hours = eventHours + coordHours;
                    status = 'Coordinator' + (isAttended ? ' + Attended' : '');
                } else if (isAttended) {
                    hours = eventHours;
                    status = 'Attended';
                }

                if (hours > 0) {
                    totalHours += hours;
                    eventDetails.push({
                        eventId: eventID,
                        eventName: events.find(e => e.EventID === eventID)?.Event_Name || 'Unknown Event',
                        hours: hours,
                        status: status
                    });
                }
            });

            return res.status(200).json({
                success: true,
                studentId: studentId,
                dateRange: { startDate, endDate },
                totalHours: totalHours,
                eventDetails: eventDetails
            });

        } catch (error) {
            console.error('Error in getStudentWorkingHours:', error);
            const response = setResponseInternalError({ 
                error: 'Failed to get student working hours: ' + error.message 
            });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    }
};

export default WorkingHoursController;