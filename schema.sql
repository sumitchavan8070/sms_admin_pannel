-- School Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS school_management_system;
USE school_management_system;

-- Schools table for multi-school architecture
CREATE TABLE schools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    established_year YEAR,
    principal_name VARCHAR(255),
    academic_year VARCHAR(20) DEFAULT '2023-2024',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (staff, students, parents)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'teacher', 'student', 'parent') NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    section VARCHAR(10),
    grade_level INT,
    teacher_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);

-- Subjects table
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class subjects mapping
CREATE TABLE class_subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Student enrollments
CREATE TABLE student_enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    academic_year VARCHAR(20) DEFAULT '2024-2025',
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Staff attendance table
CREATE TABLE staff_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('present', 'absent', 'late', 'half_day') NOT NULL,
    working_hours DECIMAL(4,2),
    notes TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON SET NULL,
    UNIQUE KEY unique_staff_date (staff_id, date)
);

-- Student attendance table
CREATE TABLE student_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') NOT NULL,
    period_1 BOOLEAN DEFAULT FALSE,
    period_2 BOOLEAN DEFAULT FALSE,
    period_3 BOOLEAN DEFAULT FALSE,
    period_4 BOOLEAN DEFAULT FALSE,
    period_5 BOOLEAN DEFAULT FALSE,
    period_6 BOOLEAN DEFAULT FALSE,
    notes TEXT,
    marked_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON SET NULL,
    UNIQUE KEY unique_student_date (student_id, date)
);

-- Leave types table
CREATE TABLE leave_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_days_per_year INT,
    requires_medical_certificate BOOLEAN DEFAULT FALSE,
    is_paid BOOLEAN DEFAULT TRUE,
    applicable_to ENUM('staff', 'student', 'both') DEFAULT 'both',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Staff leave applications
CREATE TABLE staff_leave_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    medical_certificate VARCHAR(500),
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT,
    approved_date TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    FOREIGN KEY (approved_by) REFERENCES users(id) ON SET NULL
);

-- Student leave applications
CREATE TABLE student_leave_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    applied_by INT NOT NULL, -- Parent or guardian
    status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT,
    approved_date TIMESTAMP NULL,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    FOREIGN KEY (applied_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON SET NULL
);

-- Fee categories table
CREATE TABLE fee_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL,
    frequency ENUM('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time') DEFAULT 'monthly',
    applicable_classes JSON, -- Array of class IDs
    due_date_offset INT DEFAULT 0, -- Days from start of period
    late_fee DECIMAL(10,2) DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Student fees table
CREATE TABLE student_fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    fee_category_id INT NOT NULL,
    academic_year VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    late_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fee_category_id) REFERENCES fee_categories(id)
);

-- Fee payments table
CREATE TABLE fee_payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_fee_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'bank_transfer', 'cheque', 'online') NOT NULL,
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    received_by INT,
    receipt_number VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_fee_id) REFERENCES student_fees(id) ON DELETE CASCADE,
    FOREIGN KEY (received_by) REFERENCES users(id) ON SET NULL
);

-- Salary table for staff
CREATE TABLE salaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    month TINYINT NOT NULL,
    year YEAR NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    allowances DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    overtime_rate DECIMAL(8,2) DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0,
    gross_salary DECIMAL(10,2) NOT NULL,
    tax_deduction DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2) NOT NULL,
    payment_date DATE,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_month_year (staff_id, month, year)
);

-- Timetable table
CREATE TABLE timetables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    day_of_week TINYINT NOT NULL, -- 1=Monday, 7=Sunday
    period_number TINYINT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assignments table
CREATE TABLE assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    teacher_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    max_marks DECIMAL(5,2) DEFAULT 100,
    attachment_url VARCHAR(500),
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Assignment submissions table
CREATE TABLE assignment_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    submission_text TEXT,
    attachment_url VARCHAR(500),
    submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marks_obtained DECIMAL(5,2),
    feedback TEXT,
    graded_by INT,
    graded_date TIMESTAMP NULL,
    status ENUM('submitted', 'graded', 'late') DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (graded_by) REFERENCES users(id) ON SET NULL,
    UNIQUE KEY unique_assignment_student (assignment_id, student_id)
);

-- Exams table
CREATE TABLE exams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    exam_type ENUM('unit_test', 'mid_term', 'final', 'practical', 'project') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE
);

-- Exam schedules table
CREATE TABLE exam_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_id INT NOT NULL,
    class_id INT NOT NULL,
    subject_id INT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(20),
    max_marks DECIMAL(5,2) DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- Student grades table
CREATE TABLE student_grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    exam_schedule_id INT NOT NULL,
    marks_obtained DECIMAL(5,2),
    grade VARCHAR(5),
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_schedule_id) REFERENCES exam_schedules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_exam (student_id, exam_schedule_id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('general', 'attendance', 'fee', 'exam', 'leave', 'emergency') DEFAULT 'general',
    target_audience ENUM('all', 'staff', 'students', 'parents', 'specific') DEFAULT 'all',
    target_users JSON, -- Array of user IDs for specific targeting
    sent_by INT NOT NULL,
    scheduled_at TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    status ENUM('draft', 'scheduled', 'sent', 'failed') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (sent_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Notification recipients table
CREATE TABLE notification_recipients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    notification_id INT NOT NULL,
    user_id INT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_notification_user (notification_id, user_id)
);

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON SET NULL,
    UNIQUE KEY unique_school_setting (school_id, setting_key)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);
CREATE INDEX idx_student_attendance_date ON student_attendance(date);
CREATE INDEX idx_leave_applications_status ON staff_leave_applications(status);
CREATE INDEX idx_student_leave_status ON student_leave_applications(status);
CREATE INDEX idx_fees_status ON student_fees(status);
CREATE INDEX idx_notifications_school ON notifications(school_id);
CREATE INDEX idx_audit_logs_school_date ON audit_logs(school_id, created_at);

-- Insert sample data
INSERT INTO users (email, password, first_name, last_name, role, phone) VALUES
('admin@school.com', '$2a$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Admin', 'User', 'admin', '1234567890'),
('teacher@school.com', '$2a$10$rQZ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'John', 'Teacher', 'teacher', '1234567891'),
('student@school.com', '$2a$10$rQZ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Jane', 'Student', 'student', '1234567892');

INSERT INTO classes (name, section, grade_level, teacher_id) VALUES
('Class 10', 'A', 10, 2),
('Class 9', 'B', 9, 2);

INSERT INTO subjects (name, code, description) VALUES
('Mathematics', 'MATH', 'Mathematics subject'),
('English', 'ENG', 'English subject'),
('Science', 'SCI', 'Science subject');

INSERT INTO student_enrollments (student_id, class_id) VALUES (3, 1);

INSERT INTO attendance (user_id, date, status, marked_by) VALUES
(2, CURDATE(), 'present', 1),
(3, CURDATE(), 'present', 1);

INSERT INTO fees (student_id, fee_type, amount, due_date) VALUES
(3, 'Tuition Fee', 5000.00, DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(3, 'Library Fee', 500.00, DATE_ADD(CURDATE(), INTERVAL 15 DAY));
