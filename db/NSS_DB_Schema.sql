/*
  ===========================================================================
   NSS DB Schema (MySQL Syntax)
  ===========================================================================
  Purpose:
    Schema tailored for the NSS system using TiDB with MySQL compatibility.
    It maintains users, roles, students, staff, events, blood donations,
    attendance, and expenses with relational integrity.

  Key Features:
    - Fully normalized MySQL-compatible structure
    - AUTO_INCREMENT primary keys
    - Foreign key constraints with ON DELETE handling
    - Compatible with TiDB (no PostgreSQL-specific types or triggers)

  Notes:
    - DATETIME used instead of TIMESTAMP for broader compatibility
    - Use indexing and CDC for real-time use cases
  ===========================================================================
*/

-- ===========================================================================
-- Drop Tables in Dependency Order
-- ===========================================================================

DROP TABLE IF EXISTS Expenses;
DROP TABLE IF EXISTS EventCoordMapping;
DROP TABLE IF EXISTS EventAttendance;
DROP TABLE IF EXISTS BloodDonation;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS Staff;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Role;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS School;
DROP TABLE IF EXISTS Department;

-- ===========================================================================
-- Schema Definition
-- ===========================================================================

-- Table: Role
CREATE TABLE IF NOT EXISTS Role (
  RoleID INT AUTO_INCREMENT PRIMARY KEY,
  Role_Name VARCHAR(255) NOT NULL
);

-- Table: User
CREATE TABLE IF NOT EXISTS User (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(255) NOT NULL,
  Password VARCHAR(255) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  IsActive BOOLEAN DEFAULT TRUE,
  LastLogin DATETIME,
  CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  RoleID INT,
  FOREIGN KEY (RoleID) REFERENCES Role(RoleID) ON DELETE SET NULL
);

-- Table: Staff
CREATE TABLE IF NOT EXISTS Staff (
  StaffID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  MobileNo VARCHAR(20),
  Email VARCHAR(255),
  FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

-- Table: School
CREATE TABLE IF NOT EXISTS School (
  SchoolID INT AUTO_INCREMENT PRIMARY KEY,
  School_name VARCHAR(255) NOT NULL
);

-- Table: Department
CREATE TABLE IF NOT EXISTS Department (
  DeptID INT AUTO_INCREMENT PRIMARY KEY,
  Dept_name VARCHAR(255) NOT NULL,
  Unit INT
);

-- Table: Student
CREATE TABLE IF NOT EXISTS Student (
  StudentID INT AUTO_INCREMENT PRIMARY KEY,
  UserID INT,
  RollNo VARCHAR(50) NOT NULL,
  Name VARCHAR(255) NOT NULL,
  Sex VARCHAR(10),
  Community VARCHAR(100),
  Aadhar VARCHAR(20),
  Minority_Community BOOLEAN,
  SchoolID INT,
  DeptID INT,
  MobileNo VARCHAR(20),
  YearOfAdmission INT,
  Branch VARCHAR(100),
  PersonalEmail VARCHAR(255),
  GaurdianName VARCHAR(255),
  HostelOrDayScholar VARCHAR(50),
  FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
  FOREIGN KEY (SchoolID) REFERENCES School(SchoolID) ON DELETE SET NULL,
  FOREIGN KEY (DeptID) REFERENCES Department(DeptID) ON DELETE SET NULL
);

-- Table: Events
CREATE TABLE IF NOT EXISTS Events (
  EventID INT AUTO_INCREMENT PRIMARY KEY,
  Event_Name VARCHAR(255) NOT NULL,
  Event_hours INT,
  Event_Type VARCHAR(100),
  Event_Date DATE,
  Event_Time TIME,
  Event_Venue VARCHAR(255),
  EventDescription TEXT,
  Status VARCHAR(50),
  PosterURL VARCHAR(500),
  InstructionSet TEXT
);

-- Table: BloodDonation
CREATE TABLE IF NOT EXISTS BloodDonation (
  DonorID INT AUTO_INCREMENT PRIMARY KEY,
  DonorName VARCHAR(255),
  Age INT,
  ContactNumber VARCHAR(20),
  Gender VARCHAR(10),
  BloodGroup VARCHAR(10),
  RollOrStaffID VARCHAR(50),
  DonatedStatus BOOLEAN,
  TimeInStamp DATETIME,
  TimeOutStamp DATETIME,
  IsNSSMember BOOLEAN,
  EventID INT,
  FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE SET NULL
);

-- Table: EventAttendance
CREATE TABLE IF NOT EXISTS EventAttendance (
  AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
  EventID INT,
  StudentID INT,
  FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
  FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- Table: EventCoordMapping
CREATE TABLE IF NOT EXISTS EventCoordMapping (
  EventID INT,
  StudentID INT,
  CoordinationRole VARCHAR(255),
  PRIMARY KEY (EventID, StudentID),
  FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE,
  FOREIGN KEY (StudentID) REFERENCES Student(StudentID) ON DELETE CASCADE
);

-- Table: Expenses
CREATE TABLE IF NOT EXISTS Expenses (
  EventID INT,
  Amount DECIMAL(10, 2),
  `Desc` TEXT,
  ImageURL VARCHAR(500),
  PRIMARY KEY (EventID, ImageURL),
  FOREIGN KEY (EventID) REFERENCES Events(EventID) ON DELETE CASCADE
);

  INSERT IGNORE INTO Role values (1,"Web Maintner"),
                          (2,"PO"),
                          (3,"Student Coordinator"),
                          (4,"Event Coordinator"),
                          (5,"Member");

