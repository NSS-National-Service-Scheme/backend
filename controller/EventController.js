import EventsModule from '../modules/EventsModule.js';
import { validateEventdata } from '../utilites/dataValidator/Event.js';
import {
    setResponseBadRequest,
    setResponseOk,
    setResponseInternalError,
} from '../utilites/response.js';
import { uploadImageBuffer } from '../utilites/cloudinary.js';
const EventController = {
   createEvent: async (req, res) => {
    // console.log both body and file:
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
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
        Registration,
        InstructionSet,
      } = req.body;
      console.log("Here");
      const validationError = validateEventdata(Event_Name);
      if (validationError) {
        const response = setResponseBadRequest(validationError);
        return res.status(response.responseCode).json(response.responseBody);
      }
      console.log("Not Herre");

      // -------- File Upload Handling ----------
      let PosterURL = '';
      if (req.file) {
        try {
          PosterURL = await uploadImageBuffer(req.file.buffer, req.file.originalname);
        } catch (err) {
          console.error("Cloudinary upload failed:", err); 
          const response = setResponseInternalError({
            error: 'Image upload failed',
          });
          return res.status(response.responseCode).json(response.responseBody);
        }
      }
      console.log("posterURL:",PosterURL);
      console.log('About to add event');
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
        console.log(error);
      const response = setResponseInternalError({ error: error.message });
      return res.status(response.responseCode).json(response.responseBody);
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
            const EventID  = req.params.eventID;
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
