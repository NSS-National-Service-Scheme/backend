export const validateLoginData = (username, password) => {
    if (!username || !password) {
        return 'Username and password are required.';
    }
    return null; // No validation errors
};
