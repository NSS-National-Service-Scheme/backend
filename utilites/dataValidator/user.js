const validateNewUserData = (UserName, pwd, email) => {
    if (!UserName || !pwd || !email) {
        return 'All fields are required.';
    }
};

export { validateNewUserData };
