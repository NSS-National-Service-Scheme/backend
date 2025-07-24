import pool from '../db/connectionPool.js';
import {
    setResponseInternalError,
    setResponseUnauth,
    setResponseOk,
    setResponseBadRequest,
} from '../utilites/response.js';
import { decrypt } from '../utilites/encryption.js';

export const StaffProfileModule = {
    addStaffProfile: async (UserID, MobileNo, Email) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Staff WRITE');
            const [results] = await db.query(
                'INSERT INTO Staff (UserID, MobileNo, Email) VALUES (?, ?, ?)',
                [UserID, MobileNo, Email]
            );
            await db.query('UNLOCK TABLES');

            await db.query('Lock Table User WRITE');
            db.query('UPDATE User SET isActive = TRUE WHERE UserID = ?', [
                UserID,
            ]);
            await db.query('UNLOCK TABLES');
            return setResponseOk('Staff profile added successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    UpdateStaffProfile: async (UserID, MobileNo, Email) => {
        const db = await pool.getConnection();
        try {
            const fields = [];
            const values = [];

            if (MobileNo !== undefined && MobileNo !== null) {
                fields.push('MobileNo = ?');
                values.push(MobileNo);
            }

            if (Email !== undefined && Email !== null) {
                fields.push('Email = ?');
                values.push(Email);
            }

            if (fields.length === 0) {
                return setResponseInternalError({
                    error: 'No valid fields to update.',
                });
            }

            values.push(UserID);

            const query = `UPDATE Staff SET ${fields.join(', ')} WHERE UserID = ?`;

            await db.query('LOCK TABLES Staff WRITE');
            const [results] = await db.query(query, values);
            await db.query('UNLOCK TABLES');

            return setResponseOk('Staff profile updated successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    deleteStaffProfile: async (UserID) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Staff WRITE');
            console.log(UserID);
            const [results] = await db.query(
                'DELETE FROM Staff WHERE UserID = ?',
                [UserID]
            );
            await db.query('UNLOCK TABLES');

            if (results.affectedRows === 0) {
                return setResponseBadRequest('Staff profile not found.');
            }

            return setResponseOk('Staff profile deleted successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    getStaffProfilebyId: async (UserID) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Staff READ');
            const [results] = await db.query(
                'SELECT * FROM Staff WHERE UserID = ?',
                [UserID]
            );
            await db.query('UNLOCK TABLES');

            if (results.length === 0) {
                return setResponseBadRequest('Staff profile not found.');
            }

            return setResponseOk('Staff profile fetched successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    getAllStaffProfiles: async () => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Staff READ');
            const [results] = await db.query('SELECT * FROM Staff');
            await db.query('UNLOCK TABLES');
            return setResponseOk(
                'All staff profiles fetched successfully',
                results
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },
};

// -------------------- STUDENT MODULE --------------------

export const StudentProfileModule = {

    addStudentProfile: async (
        UserID,
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
    ) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Student WRITE');
            const [results] = await db.query(
                `INSERT INTO Student 
                (UserID, RollNo, Name, Sex, Community, Aadhar, Minority_Community,
                SchoolID, DeptID, MobileNo, YearOfAdmission, Branch, PersonalEmail,
                GaurdianName, HostelOrDayScholar,DOB,Blood_Group,Address,ImageURL) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?,?)`,
                [
                    UserID,
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
                    ImageURL,
                ]
            );
            await db.query('UNLOCK TABLES');
            await db.query('Lock Table User WRITE');
            db.query('UPDATE User SET isActive = TRUE WHERE UserID = ?', [
                UserID,
            ]);
            await db.query('UNLOCK TABLES');
            return setResponseOk('Student profile added successfully', results);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    updateStudentProfile: async (
        UserID,
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
    ) => {
        const db = await pool.getConnection();
        try {
            const fields = [];
            const values = [];

            if (RollNo !== undefined) {
                fields.push('RollNo = ?');
                values.push(RollNo);
            }
            if (Name !== undefined) {
                fields.push('Name = ?');
                values.push(Name);
            }
            if (Sex !== undefined) {
                fields.push('Sex = ?');
                values.push(Sex);
            }
            if (Community !== undefined) {
                fields.push('Community = ?');
                values.push(Community);
            }
            if (Aadhar !== undefined) {
                fields.push('Aadhar = ?');
                values.push(Aadhar);
            }
            if (Minority_Community !== undefined) {
                fields.push('Minority_Community = ?');
                values.push(Minority_Community);
            }
            if (SchoolID !== undefined) {
                fields.push('SchoolID = ?');
                values.push(SchoolID);
            }
            if (DeptID !== undefined) {
                fields.push('DeptID = ?');
                values.push(DeptID);
            }
            if (MobileNo !== undefined) {
                fields.push('MobileNo = ?');
                values.push(MobileNo);
            }
            if (YearOfAdmission !== undefined) {
                fields.push('YearOfAdmission = ?');
                values.push(YearOfAdmission);
            }
            if (Branch !== undefined) {
                fields.push('Branch = ?');
                values.push(Branch);
            }
            if (PersonalEmail !== undefined) {
                fields.push('PersonalEmail = ?');
                values.push(PersonalEmail);
            }
            if (GaurdianName !== undefined) {
                fields.push('GaurdianName = ?');
                values.push(GaurdianName);
            }
            if (HostelOrDayScholar !== undefined) {
                fields.push('HostelOrDayScholar = ?');
                values.push(HostelOrDayScholar);
            }
            if (DOB !== undefined) {
                fields.push('DOB = ?');
                values.push(DOB);
            }
            if (Blood_Group !== undefined) {
                fields.push('Blood_Group = ?');
                values.push(Blood_Group);
            }
            if (Address !== undefined) {
                fields.push('Address = ?');
                values.push(Address);
            }
            if (ImageURL !== undefined) {
                fields.push('ImageURL = ?');
                values.push(ImageURL);
            }

            if (fields.length === 0) {
                return setResponseBadRequest('No fields provided for update.');
            }

            fields.push('UpdatedAt = NOW()');
            values.push(UserID);

            await db.query('LOCK TABLES Student WRITE');
            const [results] = await db.query(
                `UPDATE Student SET ${fields.join(', ')} WHERE UserID = ?`,
                values
            );
            await db.query('UNLOCK TABLES');

            return setResponseOk(
                'Student profile updated successfully',
                results
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    deleteStudentProfile: async (UserID) => {
        const db = await pool.getConnection();
        try {
            console.log(UserID);
            await db.query('LOCK TABLES Student WRITE');
            const [results] = await db.query(
                'DELETE FROM Student WHERE UserID = ?',
                [UserID]
            );
            await db.query('UNLOCK TABLES');

            if (results.affectedRows === 0) {
                return setResponseBadRequest('Student profile not found.');
            }

            return setResponseOk(
                'Student profile deleted successfully',
                results
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    getStudentProfileById: async (UserID) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Student READ');
            const [results] = await db.query(
                'SELECT * FROM Student WHERE UserID = ?',
                [UserID]
            );
            await db.query('UNLOCK TABLES');

            if (results.length === 0) {
                return setResponseBadRequest('Student profile not found.');
            }

            const student = results[0];

            // Decrypt sensitive fields
            student.Community = decrypt(student.Community);
            student.Aadhar = decrypt(student.Aadhar);
            student.Minority_Community = decrypt(student.Minority_Community);
            student.MobileNo = decrypt(student.MobileNo);

            return setResponseOk(
                'Student profile fetched successfully',
                student
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },

    getAllStudentProfiles: async () => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Student READ');
            const [results] = await db.query('SELECT * FROM Student');
            await db.query('UNLOCK TABLES');

            const decryptedResults = results.map((student) => ({
                ...student,
                Community: decrypt(student.Community),
                Aadhar: decrypt(student.Aadhar),
                Minority_Community: decrypt(student.Minority_Community),
                MobileNo: decrypt(student.MobileNo),
            }));

            return setResponseOk(
                'All student profiles fetched successfully',
                decryptedResults
            );
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError({ error: error.message });
        } finally {
            db.release();
        }
    },
};
