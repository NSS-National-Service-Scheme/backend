import {
    setResponseBadRequest,
    setResponseInternalError,
} from '../utilites/response.js';
import { StaffProfileModule, StudentProfileModule } from '../modules/ProfileModule.js';
import { validateStaffData, validateStudentData } from '../utilites/dataValidator/Profile.js';
import { encrypt } from '../utilites/encryption.js';
const ProfileController = {
    addProfile: async (req, res) => {
        const userType = req.jwt.RoleID === 2 ? 'staff' : 'student';

        if (userType === 'staff') {
            try {
                let { MobileNo, Email } = req.body;
                MobileNo = MobileNo?.trim();
                Email = Email?.trim();

                const validationError = validateStaffData(MobileNo, Email);
                if (validationError) {
                    const response = setResponseBadRequest(validationError);
                    return res.status(response.responseCode).json(response.responseBody);
                }

                const response = await StaffProfileModule.addStaffProfile(req.jwt.UserID, MobileNo, Email);
                return res.status(response.responseCode).json(response.responseBody);
            } catch (error) {
                const response = setResponseInternalError({ error: error.message });
                return res.status(response.responseCode).json(response.responseBody);
            }
        } else {
            try {
                let {
                    RollNo, Name, Sex, Community, Aadhar, Minority_Community,
                    SchoolID, DeptID, MobileNo, YearOfAdmission, Branch, PersonalEmail,
                    GaurdianName, HostelOrDayScholar
                } = req.body;
                console.log(req.body);
                RollNo = RollNo?.trim().toUpperCase();
                Name = Name?.trim();
                Sex = Sex?.trim();
                Community = Community?.trim();
                Aadhar = Aadhar?.trim();
                Minority_Community = Minority_Community?.trim();
                SchoolID = SchoolID?.trim();
                DeptID = DeptID?.trim();
                MobileNo = MobileNo?.trim();
                YearOfAdmission = YearOfAdmission?.trim();
                Branch = Branch?.trim();
                PersonalEmail = PersonalEmail?.trim();
                GaurdianName = GaurdianName?.trim();
                HostelOrDayScholar = HostelOrDayScholar?.trim();

                const validationError = validateStudentData(RollNo, Name, Sex, Community, Aadhar, Minority_Community,
                    SchoolID, DeptID, MobileNo, YearOfAdmission, Branch, PersonalEmail,
                    GaurdianName, HostelOrDayScholar);
                if (validationError) {
                    const response = setResponseBadRequest(validationError);
                    return res.status(response.responseCode).json(response.responseBody);
                }

            
                Community = encrypt(Community);
                Aadhar = encrypt(Aadhar);
                Minority_Community = encrypt(Minority_Community);
                MobileNo = encrypt(MobileNo);


                const response = await StudentProfileModule.addStudentProfile(
                    req.jwt.UserID, RollNo, Name, Sex, Community, Aadhar, Minority_Community,
                    SchoolID, DeptID, MobileNo, YearOfAdmission, Branch, PersonalEmail,
                    GaurdianName, HostelOrDayScholar
                );
                return res.status(response.responseCode).json(response.responseBody);
            } catch (error) {
                const response = setResponseInternalError({ error: error.message });
                return res.status(response.responseCode).json(response.responseBody);
            }
        }
    },

    updateProfile: async (req, res) => {
        const userType = req.jwt.RoleID === 2 ? 'staff' : 'student';

        if (userType === 'staff') {
            try {
                let { MobileNo, Email } = req.body;
                MobileNo = MobileNo?.trim();
                Email = Email?.trim();

                const response = await StaffProfileModule.UpdateStaffProfile(req.jwt.UserID, MobileNo, Email);
                return res.status(response.responseCode).json(response.responseBody);
            } catch (error) {
                const response = setResponseInternalError({ error: error.message });
                return res.status(response.responseCode).json(response.responseBody);
            }
        } else {
            try {
                const updateData = { ...req.body };
                const response = await StudentProfileModule.updateStudentByUserID(req.jwt.UserID, updateData);
                return res.status(response.responseCode).json(response.responseBody);
            } catch (error) {
                const response = setResponseInternalError({ error: error.message });
                return res.status(response.responseCode).json(response.responseBody);
            }
        }
    },

    getProfile: async (req, res) => {
        const userType = req.jwt.RoleID === 2 ? 'staff' : 'student';
        try {
            const { UserID } = req.jwt;

            const response = userType === 'staff'
                ? await StaffProfileModule.getStaffProfilebyId(UserID)
                : await StudentProfileModule.getStudentProfileById(UserID);

            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    deleteStudentProfile: async (req, res) => {
        try {
            const UserID  = req.params.UserID;
            const response = await StudentProfileModule.deleteStudentProfile(UserID);
            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    deleteStaffProfile: async (req, res) => {
        try {
            const UserID  = req.params.UserID;
            console.log(UserID);
            const response = await StaffProfileModule.deleteStaffProfile(UserID);
            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    },

    getAllStudents : async (req, res) => {
        try {
            const response = await StudentProfileModule.getAllStudents();
            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    } ,

    getAllStaffs : async (req, res) => {
        try {
            const response = await StaffProfileModule.getAllStaffs();
            return res.status(response.responseCode).json(response.responseBody);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res.status(response.responseCode).json(response.responseBody);
        }
    }
};

export default ProfileController;
