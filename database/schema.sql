-- Create database
CREATE DATABASE IF NOT EXISTS school_management_system;
USE school_management_system;

-- Schools table
CREATE TABLE schools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name ENUM('admin', 'principal', 'teacher', 'student', 'parent', 'staff') UNIQUE NOT NULL,
    description VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    section VARCHAR(10),
    capacity INT DEFAULT 0,
    room VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    schoolId INT NOT NULL,
    classTeacherId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schoolId) REFERENCES schools(id),
    INDEX idx_school_grade (schoolId, grade)
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dateOfBirth DATE,
    gender ENUM('male', 'female', 'other'),
    address TEXT,
    studentId VARCHAR(50) UNIQUE,
    employeeId VARCHAR(50) UNIQUE,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    profilePicture VARCHAR(255),
    joinDate DATE,
    schoolId INT NOT NULL,
    roleId INT NOT NULL,
    classId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schoolId) REFERENCES schools(id),
    FOREIGN KEY (roleId) REFERENCES roles(id),
    FOREIGN KEY (classId) REFERENCES classes(id),
    INDEX idx_email (email),
    INDEX idx_school_role (schoolId, roleId),
    INDEX idx_student_id (studentId),
    INDEX idx_employee_id (employeeId)
);

-- Add foreign key for class teacher after users table is created
ALTER TABLE classes ADD FOREIGN KEY (classTeacherId) REFERENCES users(id);

-- Subjects table
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    credits INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    schoolId INT NOT NULL,
    teacherId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schoolId) REFERENCES schools(id),
    FOREIGN KEY (teacherId) REFERENCES users(id),
    INDEX idx_school_code (schoolId, code)
);

-- Class subjects junction table
CREATE TABLE class_subjects (
    classId INT NOT NULL,
    subjectId INT NOT NULL,
    PRIMARY KEY (classId, subjectId),
    FOREIGN KEY (classId) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subjectId) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Staff attendance table
CREATE TABLE staff_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    checkInTime TIME,
    checkOutTime TIME,
    status ENUM('present', 'absent', 'late', 'half_day') DEFAULT 'present',
    remarks TEXT,
    staffId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staffId) REFERENCES users(id),
    UNIQUE KEY unique_staff_date (staffId, date),
    INDEX idx_staff_date (staffId, date)
);

-- Student attendance table
CREATE TABLE student_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    remarks TEXT,
    studentId INT NOT NULL,
    subjectId INT,
    markedById INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES users(id),
    FOREIGN KEY (subjectId) REFERENCES subjects(id),
    FOREIGN KEY (markedById) REFERENCES users(id),
    INDEX idx_student_date (studentId, date),
    INDEX idx_subject_date (subjectId, date)
);

-- Leave types table
CREATE TABLE leave_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    maxDays INT DEFAULT 0,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Staff leave applications table
CREATE TABLE staff_leave_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    totalDays INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    approverRemarks TEXT,
    appliedDate DATE,
    approvedDate DATE,
    staffId INT NOT NULL,
    leaveTypeId INT NOT NULL,
    approvedById INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staffId) REFERENCES users(id),
    FOREIGN KEY (leaveTypeId) REFERENCES leave_types(id),
    FOREIGN KEY (approvedById) REFERENCES users(id),
    INDEX idx_staff_status (staffId, status),
    INDEX idx_date_range (startDate, endDate)
);

-- Student leave applications table
CREATE TABLE student_leave_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    totalDays INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    approverRemarks TEXT,
    appliedDate DATE,
    approvedDate DATE,
    studentId INT NOT NULL,
    leaveTypeId INT NOT NULL,
    approvedById INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES users(id),
    FOREIGN KEY (leaveTypeId) REFERENCES leave_types(id),
    FOREIGN KEY (approvedById) REFERENCES users(id),
    INDEX idx_student_status (studentId, status),
    INDEX idx_date_range (startDate, endDate)
);

-- Fee categories table
CREATE TABLE fee_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    isActive BOOLEAN DEFAULT TRUE,
    schoolId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schoolId) REFERENCES schools(id),
    INDEX idx_school_active (schoolId, isActive)
);

-- Student fees table
CREATE TABLE student_fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(10,2) NOT NULL,
    paidAmount DECIMAL(10,2) DEFAULT 0,
    remainingAmount DECIMAL(10,2) DEFAULT 0,
    dueDate DATE NOT NULL,
    status ENUM('pending', 'paid', 'overdue', 'partial') DEFAULT 'pending',
    remarks TEXT,
    studentId INT NOT NULL,
    feeCategoryId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES users(id),
    FOREIGN KEY (feeCategoryId) REFERENCES fee_categories(id),
    INDEX idx_student_status (studentId, status),
    INDEX idx_due_date (dueDate)
);

-- Fee payments table
CREATE TABLE fee_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(10,2) NOT NULL,
    paymentMethod ENUM('cash', 'card', 'bank_transfer', 'online', 'cheque') NOT NULL,
    status ENUM('success', 'pending', 'failed', 'cancelled') DEFAULT 'success',
    transactionId VARCHAR(100),
    receiptNumber VARCHAR(100),
    remarks TEXT,
    paymentDate DATE NOT NULL,
    studentId INT NOT NULL,
    studentFeeId INT NOT NULL,
    collectedById INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES users(id),
    FOREIGN KEY (studentFeeId) REFERENCES student_fees(id),
    FOREIGN KEY (collectedById) REFERENCES users(id),
    INDEX idx_student_date (studentId, paymentDate),
    INDEX idx_receipt (receiptNumber),
    INDEX idx_transaction (transactionId)
);

-- Salaries table
CREATE TABLE salaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    basicSalary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    netSalary DECIMAL(10,2) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    paidDate DATE,
    remarks TEXT,
    staffId INT NOT NULL,
    processedById INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staffId) REFERENCES users(id),
    FOREIGN KEY (processedById) REFERENCES users(id),
    UNIQUE KEY unique_staff_month_year (staffId, month, year),
    INDEX idx_month_year (month, year),
    INDEX idx_status (status)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('general', 'academic', 'attendance', 'fee', 'leave', 'emergency') DEFAULT 'general',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    scheduledAt DATETIME,
    isSent BOOLEAN DEFAULT FALSE,
    senderId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(id),
    INDEX idx_sender_type (senderId, type),
    INDEX idx_scheduled (scheduledAt),
    INDEX idx_priority (priority)
);

-- Notification recipients table
CREATE TABLE notification_recipients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isRead BOOLEAN DEFAULT FALSE,
    readAt DATETIME,
    notificationId INT NOT NULL,
    recipientId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notificationId) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (recipientId) REFERENCES users(id),
    UNIQUE KEY unique_notification_recipient (notificationId, recipientId),
    INDEX idx_recipient_read (recipientId, isRead),
    INDEX idx_notification (notificationId)
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key_active (`key`, isActive)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action ENUM('create', 'update', 'delete', 'login', 'logout') NOT NULL,
    entityName VARCHAR(100) NOT NULL,
    entityId INT,
    oldValues JSON,
    newValues JSON,
    ipAddress VARCHAR(45),
    userAgent VARCHAR(255),
    userId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id),
    INDEX idx_user_action (userId, action),
    INDEX idx_entity (entityName, entityId),
    INDEX idx_created_at (createdAt)
);

-- Timetables table
CREATE TABLE timetables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    dayOfWeek ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    room VARCHAR(100),
    isActive BOOLEAN DEFAULT TRUE,
    classId INT NOT NULL,
    subjectId INT NOT NULL,
    teacherId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (classId) REFERENCES classes(id),
    FOREIGN KEY (subjectId) REFERENCES subjects(id),
    FOREIGN KEY (teacherId) REFERENCES users(id),
    INDEX idx_class_day (classId, dayOfWeek),
    INDEX idx_teacher_day (teacherId, dayOfWeek),
    INDEX idx_time_slot (dayOfWeek, startTime, endTime)
);

-- Assignments table
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    dueDate DATETIME NOT NULL,
    maxMarks INT DEFAULT 100,
    status ENUM('draft', 'published', 'closed') DEFAULT 'draft',
    attachments JSON,
    subjectId INT NOT NULL,
    classId INT NOT NULL,
    teacherId INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subjectId) REFERENCES subjects(id),
    FOREIGN KEY (classId) REFERENCES classes(id),
    FOREIGN KEY (teacherId) REFERENCES users(id),
    INDEX idx_class_subject (classId, subjectId),
    INDEX idx_teacher_status (teacherId, status),
    INDEX idx_due_date (dueDate)
);

-- Assignment submissions table
CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT,
    attachments JSON,
    submittedAt DATETIME NOT NULL,
    marks INT,
    feedback TEXT,
    status ENUM('submitted', 'graded', 'returned') DEFAULT 'submitted',
    gradedAt DATETIME,
    assignmentId INT NOT NULL,
    studentId INT NOT NULL,
    gradedById INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignmentId) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (studentId) REFERENCES users(id),
    FOREIGN KEY (gradedById) REFERENCES users(id),
    UNIQUE KEY unique_assignment_student (assignmentId, studentId),
    INDEX idx_student_status (studentId, status),
    INDEX idx_assignment (assignmentId),
    INDEX idx_submitted_at (submittedAt)
);
