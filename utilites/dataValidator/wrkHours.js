export const validateDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
        return 'Start date and end date are required fields';
    }

    return null;
};
