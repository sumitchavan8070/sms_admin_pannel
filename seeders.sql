-- Seed data for School Management System

USE school_management_system;

-- Insert roles
INSERT INTO roles (name, description, permissions) VALUES
('Principal', 'School Principal with full administrative access', '["all"]'),
('IT Admin', 'IT Administrator with system management access', '["users", "system", "reports"]'),
('Accountant', 'Financial management and fee collection', '["fees", "payroll", "financial_reports"]'),
('Teacher', 'Teaching staff with class management access', '["classes", "attendance", "assignments", "grades"]'),
('Student', 'Student with limited access to personal data', '["profile", "assignments", "grades", "attendance"]'),
('Parent', 'Parent/Guardian with access to child information', '["child_info", "fees", "communication"]');

-- Insert sample schools
INSERT INTO schools (name, logo_url, address, phone, email, website, established_year, principal_name) VALUES
('Greenwood High School', '/logos/greenwood.png', '123 Education Street, Learning City, LC 12345', '+1 (555) 123-4567', 'info@greenwoodhigh.edu', 'www.greenwoodhigh.edu', 1985, 'Dr. John Smith'),
('Riverside Academy', '/logos/riverside.png', '456 Knowledge Avenue, Study Town, ST 67890', '+1 (555) 234-5678', 'contact@riversideacademy.edu', 'www.riversideacademy.edu', 1992, 'Ms. Sarah Johnson'),
('Oakmont Elementary', '/logos/oakmont.png', '789 Learning Lane, Education City, EC 13579', '+1 (555) 345-6789', 'hello@oakmontelementary.edu', 'www.oakmontelementary.edu', 2001, 'Mr. Robert Wilson');

-- Insert sample users (Principal, IT Admin, Teachers, Students, Parents)
INSERT INTO users (school_id, role_id, email, password_hash, first_name, last_name, phone, department, designation, salary, join_date, employee_id) VALUES
-- Principal
(1, 1, 'principal@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'John', 'Smith', '+1 (555) 123-4567', 'Administration', 'Principal', 85000.00, '2020-01-01', 'EMP001'),

-- IT Admin
(1, 2, 'admin@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Robert', 'Wilson', '+1 (555) 456-7890', 'Administration', 'IT Administrator', 55000.00, '2020-02-01', 'EMP002'),

-- Accountant
(1, 3, 'accountant@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Lisa', 'Anderson', '+1 (555) 567-8901', 'Finance', 'Accountant', 48000.00, '2020-03-01', 'EMP003'),

-- Teachers
(1, 4, 'sarah.johnson@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Sarah', 'Johnson', '+1 (555) 234-5678', 'Mathematics', 'Senior Teacher', 45000.00, '2020-08-15', 'EMP004'),
(1, 4, 'mike.chen@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Mike', 'Chen', '+1 (555) 345-6789', 'Physics', 'Teacher', 42000.00, '2021-01-10', 'EMP005'),
(1, 4, 'emily.davis@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Emily', 'Davis', '+1 (555) 456-7890', 'English', 'Teacher', 40000.00, '2021-06-01', 'EMP006');

-- Insert sample students
INSERT INTO users (school_id, role_id, email, password_hash, first_name, last_name, phone, date_of_birth, gender, student_id) VALUES
(1, 5, 'alex.student@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Alex', 'Thompson', '+1 (555) 111-2222', '2007-05-15', 'male', 'STU001'),
(1, 5, 'emma.student@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Emma', 'Rodriguez', '+1 (555) 222-3333', '2007-08-22', 'female', 'STU002'),
(1, 5, 'james.student@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'James', 'Wilson', '+1 (555) 333-4444', '2006-12-10', 'male', 'STU003');

-- Insert sample parents
INSERT INTO users (school_id, role_id, email, password_hash, first_name, last_name, phone, parent_id) VALUES
(1, 6, 'parent1@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Michael', 'Thompson', '+1 (555) 111-0000', 'PAR001'),
(1, 6, 'parent2@greenwoodhigh.edu', '$2b$10$rQZ8kqVZ9Z8kqVZ9Z8kqVOeJ8kqVZ9Z8kqVZ9Z8kqVZ9Z8kqVZ9Z8', 'Maria', 'Rodriguez', '+1 (555) 222-0000', 'PAR002');

-- Insert subjects
INSERT INTO subjects (school_id, name, code, description) VALUES
(1, 'Mathematics', 'MATH', 'Mathematics curriculum for all grades'),
(1, 'Physics', 'PHY', 'Physics science curriculum'),
(1, 'Chemistry', 'CHEM', 'Chemistry science curriculum'),
(1, 'English', 'ENG', 'English language and literature'),
(1, 'History', 'HIST', 'World and national history'),
(1, 'Biology', 'BIO', 'Biological sciences curriculum');

-- Insert classes
INSERT INTO classes (school_id, name, section, grade_level, class_teacher_id, room_number, academic_year) VALUES
(1, 'Grade 10', 'A', 10, 4, '201', '2023-2024'),
(1, 'Grade 10', 'B', 10, 5, '202', '2023-2024'),
(1, 'Grade 11', 'A', 11, 6, '301', '2023-2024'),
(1, 'Grade 11', 'B', 11, 4, '302', '2023-2024');

-- Insert class subjects
INSERT INTO class_subjects (class_id, subject_id, teacher_id) VALUES
(1, 1, 4), -- Grade 10A - Mathematics - Sarah Johnson
(1, 2, 5), -- Grade 10A - Physics - Mike Chen
(1, 4, 6), -- Grade 10A - English - Emily Davis
(2, 1, 4), -- Grade 10B - Mathematics - Sarah Johnson
(2, 2, 5), -- Grade 10B - Physics - Mike Chen
(3, 1, 4), -- Grade 11A - Mathematics - Sarah Johnson
(3, 2, 5); -- Grade 11A - Physics - Mike Chen

-- Insert student enrollments
INSERT INTO student_enrollments (student_id, class_id, academic_year, enrollment_date) VALUES
(7, 1, '2023-2024', '2023-08-01'), -- Alex Thompson in Grade 10A
(8, 1, '2023-2024', '2023-08-01'), -- Emma Rodriguez in Grade 10A
(9, 2, '2023-2024', '2023-08-01'); -- James Wilson in Grade 10B

-- Insert leave types
INSERT INTO leave_types (school_id, name, description, max_days_per_year, requires_medical_certificate, is_paid, applicable_to) VALUES
(1, 'Casual Leave', 'General casual leave for personal matters', 12, FALSE, TRUE, 'staff'),
(1, 'Medical Leave', 'Leave for medical reasons', 30, TRUE, TRUE, 'both'),
(1, 'Emergency Leave', 'Emergency situations', 5, FALSE, TRUE, 'both'),
(1, 'Maternity Leave', 'Maternity leave for female staff', 90, TRUE, TRUE, 'staff'),
(1, 'Study Leave', 'Leave for educational purposes', 10, FALSE, FALSE, 'staff');

-- Insert fee categories
INSERT INTO fee_categories (school_id, name, description, amount, frequency, applicable_classes, due_date_offset) VALUES
(1, 'Tuition Fee', 'Monthly tuition fee', 500.00, 'monthly', '[1,2,3,4]', 5),
(1, 'Library Fee', 'Annual library fee', 100.00, 'yearly', '[1,2,3,4]', 30),
(1, 'Lab Fee', 'Laboratory usage fee', 150.00, 'quarterly', '[1,2,3,4]', 15),
(1, 'Sports Fee', 'Sports and activities fee', 75.00, 'half_yearly', '[1,2,3,4]', 20),
(1, 'Admission Fee', 'One-time admission fee', 1000.00, 'one_time', '[1,2,3,4]', 0);

-- Insert sample student fees
INSERT INTO student_fees (student_id, fee_category_id, academic_year, amount, due_date, status) VALUES
(7, 1, '2023-2024', 500.00, '2024-01-05', 'paid'),
(7, 2, '2023-2024', 100.00, '2024-01-30', 'pending'),
(8, 1, '2023-2024', 500.00, '2024-01-05', 'paid'),
(8, 2, '2023-2024', 100.00, '2024-01-30', 'pending');

-- Insert sample assignments
INSERT INTO assignments (class_id, subject_id, teacher_id, title, description, assigned_date, due_date, max_marks) VALUES
(1, 1, 4, 'Calculus Problem Set', 'Solve the given calculus problems from chapter 5', '2024-01-15', '2024-01-22', 100),
(1, 2, 5, 'Physics Lab Report', 'Write a detailed report on the motion experiment', '2024-01-10', '2024-01-20', 50),
(2, 1, 4, 'Algebra Quiz Preparation', 'Prepare for the upcoming algebra quiz', '2024-01-12', '2024-01-19', 25);

-- Insert sample timetable
INSERT INTO timetables (class_id, subject_id, teacher_id, day_of_week, period_number, start_time, end_time, room_number, academic_year) VALUES
(1, 1, 4, 1, 1, '09:00:00', '09:45:00', '201', '2023-2024'), -- Monday, Period 1, Math
(1, 2, 5, 1, 2, '10:00:00', '10:45:00', 'Lab1', '2023-2024'), -- Monday, Period 2, Physics
(1, 4, 6, 1, 3, '11:15:00', '12:00:00', '201', '2023-2024'), -- Monday, Period 3, English
(1, 1, 4, 2, 1, '09:00:00', '09:45:00', '201', '2023-2024'), -- Tuesday, Period 1, Math
(1, 2, 5, 2, 2, '10:00:00', '10:45:00', 'Lab1', '2023-2024'); -- Tuesday, Period 2, Physics

-- Insert sample staff attendance
INSERT INTO staff_attendance (staff_id, date, check_in_time, check_out_time, status, working_hours) VALUES
(1, '2024-01-15', '08:30:00', '16:30:00', 'present', 8.0),
(2, '2024-01-15', '08:45:00', '16:45:00', 'present', 8.0),
(3, '2024-01-15', '09:00:00', '17:00:00', 'present', 8.0),
(4, '2024-01-15', '08:30:00', '16:30:00', 'present', 8.0),
(5, '2024-01-15', '09:15:00', '17:15:00', 'late', 8.0),
(6, '2024-01-15', NULL, NULL, 'absent', 0.0);

-- Insert sample student attendance
INSERT INTO student_attendance (student_id, class_id, date, status, period_1, period_2, period_3, period_4, period_5, period_6, marked_by) VALUES
(7, 1, '2024-01-15', 'present', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, 4),
(8, 1, '2024-01-15', 'present', TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, 4),
(9, 2, '2024-01-15', 'late', FALSE, TRUE, TRUE, TRUE, TRUE, TRUE, 4);

-- Insert system settings
INSERT INTO system_settings (school_id, setting_key, setting_value, data_type, description) VALUES
(1, 'academic_year', '2023-2024', 'string', 'Current academic year'),
(1, 'attendance_threshold', '75', 'number', 'Minimum attendance percentage required'),
(1, 'max_class_size', '35', 'number', 'Maximum students per class'),
(1, 'late_fee_percentage', '5', 'number', 'Late fee percentage for overdue payments'),
(1, 'notification_email', 'true', 'boolean', 'Enable email notifications'),
(1, 'notification_sms', 'false', 'boolean', 'Enable SMS notifications');
