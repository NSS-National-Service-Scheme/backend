import EventsModule from '../modules/EventsModule.js';
import { validateEventdata } from '../utilites/dataValidator/Event.js';
import {
    setResponseBadRequest,
    setResponseOk,
    setResponseInternalError,
} from '../utilites/response.js';
import { uploadImage } from '../utilites/cloudinary.js';
const EventController = {
    createEvent: async (req, res) => {
        try {
            const {
                Event_Name,
                Event_hours,
                Event_Type,
                Event_Date,
                Event_Time,
                Event_Venue,
                EventDescription,
                Status,
                Poster,
                Registration,
                InstructionSet,
            } = req.body;
            const validationError = validateEventdata(Event_Name);

            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }
            let PosterURL = '';
            if (Poster) {
                try {
                    PosterURL = await uploadImage(Poster);
                } catch (err) {
                    const response = setResponseInternalError({
                        error: 'Image upload failed',
                    });
                    return res
                        .status(response.responseCode)
                        .json(response.responseBody);
                }
            }
            const results = await EventsModule.addEvent(
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
            );
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    updateEvent: async (req, res) => {
        try {
            const {
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
                InstructionSet,
            } = req.body;
            const results = await EventsModule.updateEvent(
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
            );
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    deleteEvent: async (req, res) => {
        try {
            const { EventID } = req.body;
            const results = await EventsModule.deleteEvent(EventID);
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getEventById: async (req, res) => {
        try {
            const { EventID } = req.body;
            const results = await EventsModule.getEventById(EventID);
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAllEvents: async (req, res) => {
        try {
            const results = await EventsModule.getAllEvents();
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default EventController;
