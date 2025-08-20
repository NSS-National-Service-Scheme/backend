import {
    setResponseBadRequest,
    setResponseInternalError,
} from '../utilites/response.js';
import {
    StaffProfileModule,
    StudentProfileModule,
} from '../modules/ProfileModule.js';
import {
    validateStaffData,
    validateStudentData,
} from '../utilites/dataValidator/Profile.js';
import { encrypt } from '../utilites/encryption.js';
import { uploadImageBuffer } from '../utilites/cloudinary.js';

const ProfileController = {
    addProfile: async (req, res) => {
        console.log(req.jwt);
        const userType = req.jwt.RoleID === 2 ? 'staff' : 'student';

        if (userType === 'staff') {
            try {
                let { MobileNo, Email } = req.body;
                MobileNo = MobileNo?.trim();
                Email = Email?.trim();

                const validationError = validateStaffData(MobileNo, Email);
                if (validationError) {
                    const response = setResponseBadRequest(validationError);
                    return res
                        .status(response.responseCode)
                        .json(response.responseBody);
                }

                const response = await StaffProfileModule.addStaffProfile(
                    req.jwt.UserID,
                    MobileNo,
                    Email
                );
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            } catch (error) {
                const response = setResponseInternalError({
                    error: error.message,
                });
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }
        } else {
            try {
                console.log('BODY:', req.body);
                console.log('FILE:', req.file);
                let {
                    RollNo,
                    Name,
                    Sex,
                    Community,
                    Aadhar,
                    Minority_Community,
                    SchoolID,
                    DeptID,
                    MobileNo,
                    YearOfAdmission,
                    Branch,
                    PersonalEmail,
                    GaurdianName,
                    HostelOrDayScholar,
                    DOB,
                    Blood_Group,
                    Address
                } = req.body;
                
                let ImageURL = '';
                if (req.file) {
                    try {
                        ImageURL = await uploadImageBuffer(req.file.buffer, req.file.originalname);
                    } catch (err) {
                        console.error("Cloudinary upload failed:", err);
                        const response = setResponseInternalError({
                            error: 'Image upload failed',
                        });
                        return res.status(response.responseCode).json(response.responseBody);
                    }
                }
                
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
                DOB = DOB?.trim();
                Blood_Group = Blood_Group?.trim();
                Address = Address?.trim();

                const validationError = validateStudentData(
                    RollNo,
                    Name,
                    Sex,
                    Community,
                    Aadhar,
                    Minority_Community,
                    SchoolID,
                    DeptID,
                    MobileNo,
                    YearOfAdmission,
                    Branch,
                    PersonalEmail,
                    GaurdianName,
                    HostelOrDayScholar
                );
                if (validationError) {
                    const response = setResponseBadRequest(validationError);
                    return res
                        .status(response.responseCode)
                        .json(response.responseBody);
                }

                Community = encrypt(Community);
                Aadhar = encrypt(Aadhar);
                Minority_Community = encrypt(Minority_Community);
                MobileNo = encrypt(MobileNo);
                
                const response = await StudentProfileModule.addStudentProfile(
                    req.jwt.UserID,
                    RollNo,
                    Name,
                    Sex,
                    Community,
                    Aadhar,
                    Minority_Community,
                    SchoolID,
                    DeptID,
                    MobileNo,
                    YearOfAdmission,
                    Branch,
                    PersonalEmail,
                    GaurdianName,
                    HostelOrDayScholar,
                    DOB,
                    Blood_Group,
                    Address,
                    ImageURL
                );
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            } catch (error) {
                const response = setResponseInternalError({
                    error: error.message,
                });
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
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

                const response = await StaffProfileModule.UpdateStaffProfile(
                    req.jwt.UserID,
                    MobileNo,
                    Email
                );
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            } catch (error) {
                console.log(error); 
                const response = setResponseInternalError({
                    error: error.message,
                });
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }
        } else {
            try {
                // FIXED: Call the correct method name
                const {
                    RollNo, Name, Sex, Community, Aadhar, Minority_Community,
                    SchoolID, DeptID, MobileNo, YearOfAdmission, Branch,
                    PersonalEmail, GaurdianName, HostelOrDayScholar,
                    DOB, Blood_Group, Address, ImageURL
                } = req.body;

                const response = await StudentProfileModule.updateStudentProfile(
                    req.jwt.UserID,
                    RollNo, Name, Sex, Community, Aadhar, Minority_Community,
                    SchoolID, DeptID, MobileNo, YearOfAdmission, Branch,
                    PersonalEmail, GaurdianName, HostelOrDayScholar,
                    DOB, Blood_Group, Address, ImageURL
                );
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            } catch (error) {
                console.log(error);
                const response = setResponseInternalError({
                    error: error.message,
                });
                return res
                    .status(response.responseCode)
                    .json(response.responseBody);
            }
        }
    },

    getProfile: async (req, res) => {
        const userType = req.jwt.RoleID === 2 ? 'staff' : 'student';
        try {
            const { UserID } = req.jwt;

            const response =
                userType === 'staff'
                    ? await StaffProfileModule.getStaffProfilebyId(UserID)
                    : await StudentProfileModule.getStudentProfileById(UserID);

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

    deleteStudentProfile: async (req, res) => {
        try {
            const UserID = req.params.UserID;
            const response =
                await StudentProfileModule.deleteStudentProfile(UserID);
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

    deleteStaffProfile: async (req, res) => {
        try {
            const UserID = req.params.UserID;
            const response =
                await StaffProfileModule.deleteStaffProfile(UserID);
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

    // FIXED: Call correct method names
    getAllStudents: async (req, res) => {
        try {
            const response = await StudentProfileModule.getAllStudentProfiles();
            return res
                .status(response.responseCode)
                .json(response.responseBody);
            console.log(response);
        } catch (error) {
            const response = setResponseInternalError({ error: error.message });
            return res
                .status(response.responseCode)
                .json(response.responseBody);
        }
    },

    getAllStaffs: async (req, res) => {
        try {
            const response = await StaffProfileModule.getAllStaffProfiles();
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

export default ProfileController;