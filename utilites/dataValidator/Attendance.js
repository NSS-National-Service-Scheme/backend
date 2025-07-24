export const validateNewAttendanceData = (EventID, StudentID, Status) => {
    if (!EventID || !StudentID || !Status) {
        return 'All fields are required.';
    }
    return null; // No validation errors
}