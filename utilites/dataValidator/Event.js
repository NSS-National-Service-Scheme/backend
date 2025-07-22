export const validateEventdata = (Event_Name)=> {
    if (!Event_Name) {
        return 'Event Name is required';
    }

    return null;
}
