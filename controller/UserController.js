import UserModule from '../modules/UserModule.js';
import { encrypt } from '../utilites/encryption.js';
import { validateNewUserData } from '../utilites/dataValidator/user.js';
import {
    setResponseBadRequest,
    setResponseInternalError,
} from '../utilites/response.js';

const UserController = {
    addNewUser: async (req, res) => {
        const { UserName, Password, Email } = req.body;
        console.log('Received request to add new user:', req.body);
        const validationError = validateNewUserData(UserName, Password, Email);
        if (validationError) {
            const response = setResponseBadRequest(validationError);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }

        try {
            const encryptedPwd = encrypt(Password);
            const response = await UserModule.addNewUser(
                UserName,
                encryptedPwd,
                Email
            );
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    updateUser: async (req, res) => {
        const UserId = req.params.id;
        const { UserName, Password, Email } = req.body;
        try {
            const updates = {};
            console.log('Received request to update user:', req.body);
            if (UserName) updates.UserName = UserName;
            if (Password) updates.Password = encrypt(Password);
            if (Email) updates.Email = Email;
            const response = await UserModule.updateUser(UserId, updates);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const response = await UserModule.getAllUsers();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getUserById: async (req, res) => {
        const userId = req.params.id;
        try {
            const response = await UserModule.getUserById(userId);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
    deleteUser: async (req, res) => {
        const userId = req.params.id;
        try {
            const response = await UserModule.deleteUser(userId);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    isActiveUser: async (req, res) => {
        const userId = req.params.UserId;
        try {
            const response = await UserModule.isActiveUser(userId);
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },
};

export default UserController;
