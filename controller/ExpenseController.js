import validateExpense from '../utilites/dataValidator/expense.js';
import ExpenseModule from '../modules/ExpenseModule.js';
const ExpenseController = {
    addExpense: async (req, res) => {
        try {
            const { EventID, Amount, Description, ImageURL } = req.body;
            EventID = EventID.trim();
            Amount = Amount.trim();
            Description = Description.trim();
            ImageURL = ImageURL.trim();
            const validationError = validateExpense(
                EventID,
                Amount,
                Description,
                ImageURL
            );

            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }

            const results = await ExpenseModule.addExpense(
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

    getExpensesByEvent: async (req, res) => {
        try {
            const { EventID } = req.body;
            const results = await ExpenseModule.getExpensesByEvent(EventID);
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
