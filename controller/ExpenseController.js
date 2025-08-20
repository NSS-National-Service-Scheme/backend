import validateExpense from '../utilites/dataValidator/expense.js';
import ExpenseModule from '../modules/ExpenseModule.js';
import { uploadImageBuffer } from '../utilites/cloudinary.js';

import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest,
} from '../utilites/response.js';
const ExpenseController = {
    addExpense: async (req, res) => {
        try {
            const { EventID, Amount, Description, Image } = req.body;
            let ImageURL = '';
            if (Image) {
                try {
                    ImageURL = await uploadImage(Image);
                } catch (err) {
                    const response = setResponseInternalError({
                        error: 'Image upload failed',
                    });
                    return res
                        .status(response.responseCode)
                        .json(response.responseBody);
                }
            }
            const trimmedEventID = EventID.trim();
            const trimmedAmount = Amount.trim();
            const trimmedDescription = Description.trim();
            const validationError = validateExpense(
                trimmedEventID,
                trimmedAmount,
                trimmedDescription,
                ImageURL
            );

            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }
            console.log(ImageURL);
            const results = await ExpenseModule.addExpense(
                trimmedEventID,
                trimmedAmount,
                trimmedDescription,
                ImageURL
            );
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    updateExpense: async (req, res) => {
        try {
            const { ExpenseID, EventID, Amount, Description, ImageURL } =
                req.body;
            const results = await ExpenseModule.updateExpense(
                ExpenseID,
                EventID,
                Amount,
                Description,
                ImageURL
            );
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    deleteExpense: async (req, res) => {
        try {
            const { ExpenseID } = req.body;
            const results = await ExpenseModule.deleteExpense(ExpenseID);
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAllExpenses: async (req, res) => {
        try {
            const { EventID } = req.body;
            const results = await ExpenseModule.getAllExpenses(EventID);
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getExpenseById: async (req, res) => {
        try {
            const { ExpenseID } = req.body;
            const results = await ExpenseModule.getExpenseById(ExpenseID);
            return res.status(results.responseCode).json(results.responseBody);
        } catch (error) {
            const response = setResponseInternalError(error);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default ExpenseController;
