export const validateStaffData = (MobileNo,Email) =>{
    if (!MobileNo || !Email) {
        return 'All fields are required';
    }

    if (!/^\d{10}$/.test(MobileNo)) {
        return 'Mobile number must be 10 digits';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
        return 'Invalid email format';
    }

    return null;
}


export const validateStudentData = (RollNo,Name,Sex,Community,Aadhar,Minority_Community,
                    SchoolID,DeptID,MobileNo,YearOfAdmission,Branch,PersonalEmail
                    ,GaurdianName,HostelOrDayScholar) => {
    
    if (!RollNo || !Name || !Sex
        || !Community || !Aadhar || !Minority_Community
        || !SchoolID || !DeptID || !MobileNo || !YearOfAdmission
        || !Branch || !PersonalEmail || !GaurdianName || !HostelOrDayScholar) {

        return 'All fields are required';
    }

    if (RollNo.length !== 16) {
        return 'Roll Number must be exactly 14 characters';
    }

    if (!/^\d{10}$/.test(MobileNo)) {
        return 'Mobile number must be 10 digits';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(PersonalEmail)) {
        return 'Invalid email format';
    }

    if (!/^\d{12}$/.test(Aadhar)) {
        return 'Aadhar number must be 12 digits';
    }

    if (!/^\d{4}$/.test(YearOfAdmission)) {
        return 'Year of admission must be a 4-digit number';
    }

    if (!/^[A-Za-z\s]+$/.test(Name)) {
        return 'Name can only contain letters and spaces';
    }

    if (!/^[A-Za-z\s]+$/.test(GaurdianName)) {
        return 'Guardian name can only contain letters and spaces';
    }

    if (!/^[A-Za-z\s]+$/.test(HostelOrDayScholar)) {
        return 'Name can only contain letters and spaces';
    }


    return null; 

}