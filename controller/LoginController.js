import LoginModule from '../modules/LoginModule.js';
import { validateLoginData } from '../utilites/dataValidator/login.js';
import {
    setResponseBadRequest,
    setResponseOk,
    setResponseInternalError,
} from '../utilites/response.js';
import { generateToken } from '../utilites/auth/Tokens.js';
const LoginController = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log('Received request to login:', req.body);
            const validationError = validateLoginData(username, password);
            if (validationError) {
                const response = setResponseBadRequest(validationError);
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }

            const loginResponse = await LoginModule.login(username, password);

            if (loginResponse.responseCode !== 200) {
                return res
                    .status(loginResponse.responseCode)
                    .json(loginResponse.responseBody);
            }

            const user = loginResponse.responseBody.DATA;

            const token = generateToken({
                RoleID: user.RoleID,
                UserID: user.UserID,
                Username: user.Username,
                userType: user.userType,
                userTypeID: user.userTypeID,
            });

            return res.status(200).json({
                MESSAGE: 'Login successful',
                TOKEN: token,
                USER: user,
            });
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    logout: (req, res) => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
            });

            const response = setResponseOk('Logged out successfully');
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

export default LoginController;
