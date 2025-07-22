import EventCoordModule from "../modules/EventCoordModule.js";
import {
    setResponseBadRequest,
    setResponseOk,
    setResponseInternalError,
} from '../utilites/response.js';
const EventCoordController = {
    addEventCoordinator: async (req, res) => {
        try{
        const { eventID, CoordinationRole, StudentID, Hours } = req.body;
        const response = await EventCoordModule.addEventCoordinator(eventID, CoordinationRole, StudentID, Hours);
        return res
                .status(response.responseCode)
                .json(response.responseBody);
    }catch (error) {
        console.log(error);
        const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    updateEventCoordinator: async (req, res) => {
        try{
        const { eventID, CoordinationRole, StudentID, Hours } = req.body;
        const response = await EventCoordModule.updateEventCoordinator(eventID, CoordinationRole, StudentID, Hours);
        return res
                .status(response.responseCode)
                .json(response.responseBody);
    }catch (error) {
        const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

    },

    deleteEventCoordinator: async (req, res) => {
        try{
        const { eventID, StudentID } = req.body;
        const response = await EventCoordModule.deleteEventCoordinator(eventID, StudentID);
        return res
                .status(response.responseCode)
                .json(response.responseBody);
    }catch (error) {
        const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    
    },

    getAllEventCoordinators: async (req, res) => {
        try {
            const {eventID} = req.body;
            const response = await EventCoordModule.getEventCoordinators(eventID);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
}

export default EventCoordController;