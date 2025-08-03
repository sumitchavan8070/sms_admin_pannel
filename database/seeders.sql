-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'System Administrator'),
('principal', 'School Principal'),
('teacher', 'Teacher'),
('student', 'Student'),
('parent', 'Parent/Guardian'),
('staff', 'Administrative Staff');

-- Insert sample school
INSERT INTO schools (name, address, phone, email, website, description) VALUES
('Demo High School', '123 Education Street, Learning City, LC 12345', '+1-555-0123', 'info@demohighschool.edu', 'https://demohighschool.edu', 'A premier educational institution committed to excellence in learning and character development.');

-- Insert sample classes
INSERT INTO classes (name, grade, section, capacity, room, schoolId) VALUES
('Grade 9A', '9', 'A', 30, 'Room 101', 1),
('Grade 9B', '9', 'B', 30, 'Room 102', 1),
('Grade 10A', '10', 'A', 28, 'Room 201', 1),
('Grade 10B', '10', 'B', 28, 'Room 202', 1),
('Grade 11A', '11', 'A', 25, 'Room 301', 1),
('Grade 11B', '11', 'B', 25, 'Room 302', 1),
('Grade 12A', '12', 'A', 22, 'Room 401', 1),
('Grade 12B', '12', 'B', 22, 'Room 402', 1);

-- Insert sample users (password is 'password' hashed with bcrypt)
INSERT INTO users (firstName, lastName, email, password, phone, gender, employeeId, schoolId, roleId, joinDate) VALUES
('John', 'Admin', 'admin@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-0001', 'male', 'EMP202401001', 1, 1, '2024-01-01'),
('Sarah', 'Principal', 'principal@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-0002', 'female', 'EMP202401002', 1, 2, '2024-01-01'),
('Michael', 'Johnson', 'teacher@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-0003', 'male', 'EMP202401003', 1, 3, '2024-01-15'),
('Emily', 'Davis', 'teacher2@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-0004', 'female', 'EMP202401004', 1, 3, '2024-01-15'),
('David', 'Wilson', 'teacher3@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-0005', 'male', 'EMP202401005', 1, 3, '2024-02-01'),
('Lisa', 'Brown', 'teacher4@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-0006', 'female', 'EMP202401006', 1, 3, '2024-02-01');

-- Insert sample students
INSERT INTO users (firstName, lastName, email, password, phone, gender, studentId, schoolId, roleId, classId, joinDate) VALUES
('Alex', 'Smith', 'student@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-1001', 'male', 'STU202401001', 1, 4, 1, '2024-01-15'),
('Emma', 'Jones', 'student2@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-1002', 'female', 'STU202401002', 1, 4, 1, '2024-01-15'),
('James', 'Miller', 'student3@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-1003', 'male', 'STU202401003', 1, 4, 2, '2024-01-15'),
('Sophia', 'Garcia', 'student4@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-1004', 'female', 'STU202401004', 1, 4, 2, '2024-01-15'),
('William', 'Martinez', 'student5@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-1005', 'male', 'STU202401005', 1, 4, 3, '2024-01-15'),
('Olivia', 'Rodriguez', 'student6@school.com', '$2b$10$rOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5YjKKjKKjKOzJKKNFQqr5Y', '+1-555-1006', 'female', 'STU202401006', 1, 4, 3, '2024-01-15');

-- Update class teachers
UPDATE classes SET classTeacherId = 3 WHERE id = 1;
UPDATE classes SET classTeacherId = 4 WHERE id = 2;
UPDATE classes SET classTeacherId = 5 WHERE id = 3;
UPDATE classes SET classTeacherId = 6 WHERE id = 4;

-- Insert sample subjects
INSERT INTO subjects (name, code, description, credits, schoolId, teacherId) VALUES
('Mathematics', 'MATH101', 'Algebra, Geometry, and Calculus', 4, 1, 3),
('English Literature', 'ENG101', 'Reading, Writing, and Literary Analysis', 3, 1, 4),
('Physics', 'PHY101', 'Mechanics, Thermodynamics, and Electromagnetism', 4, 1, 5),
('Chemistry', 'CHEM101', 'Organic and Inorganic Chemistry', 4, 1, 6),
('Biology', 'BIO101', 'Cell Biology, Genetics, and Ecology', 3, 1, 3),
('History', 'HIST101', 'World History and Civilizations', 3, 1, 4),
('Computer Science', 'CS101', 'Programming and Computer Fundamentals', 3, 1, 5),
('Physical Education', 'PE101', 'Sports and Physical Fitness', 2, 1, 6);

-- Insert class-subject relationships
INSERT INTO class_subjects (classId, subjectId) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 7), (3, 8),
(4, 1), (4, 2), (4, 3), (4, 4), (4, 7), (4, 8),
(5, 1), (5, 2), (5, 3), (5, 4), (5, 7),
(6, 1), (6, 2), (6, 3), (6, 4), (6, 7),
(7, 1), (7, 2), (7, 3), (7, 4), (7, 7),
(8, 1), (8, 2), (8, 3), (8, 4), (8, 7);

-- Insert leave types
INSERT INTO leave_types (name, description, maxDays) VALUES
('Sick Leave', 'Medical leave for illness', 10),
('Casual Leave', 'Personal leave for personal matters', 12),
('Annual Leave', 'Yearly vacation leave', 21),
('Maternity Leave', 'Leave for maternity purposes', 90),
('Emergency Leave', 'Leave for emergency situations', 5),
('Study Leave', 'Leave for educational purposes', 30);

-- Insert fee categories
INSERT INTO fee_categories (name, description, amount, schoolId) VALUES
('Tuition Fee', 'Monthly tuition fee', 500.00, 1),
('Library Fee', 'Annual library access fee', 50.00, 1),
('Laboratory Fee', 'Science laboratory usage fee', 100.00, 1),
('Sports Fee', 'Sports and physical education fee', 75.00, 1),
('Transportation Fee', 'School bus transportation fee', 150.00, 1),
('Examination Fee', 'Semester examination fee', 25.00, 1);

-- Insert sample student fees
INSERT INTO student_fees (amount, remainingAmount, dueDate, studentId, feeCategoryId) VALUES
(500.00, 500.00, '2024-02-01', 7, 1),
(500.00, 500.00, '2024-02-01', 8, 1),
(500.00, 500.00, '2024-02-01', 9, 1),
(500.00, 500.00, '2024-02-01', 10, 1),
(50.00, 50.00, '2024-02-15', 7, 2),
(50.00, 50.00, '2024-02-15', 8, 2),
(100.00, 100.00, '2024-02-20', 7, 3),
(100.00, 100.00, '2024-02-20', 8, 3);

-- Insert sample timetable entries
INSERT INTO timetables (dayOfWeek, startTime, endTime, room, classId, subjectId, teacherId) VALUES
('monday', '09:00:00', '10:00:00', 'Room 101', 1, 1, 3),
('monday', '10:00:00', '11:00:00', 'Room 101', 1, 2, 4),
('monday', '11:30:00', '12:30:00', 'Lab 1', 1, 3, 5),
('tuesday', '09:00:00', '10:00:00', 'Room 101', 1, 4, 6),
('tuesday', '10:00:00', '11:00:00', 'Room 101', 1, 5, 3),
('tuesday', '11:30:00', '12:30:00', 'Room 101', 1, 6, 4),
('wednesday', '09:00:00', '10:00:00', 'Room 101', 1, 1, 3),
('wednesday', '10:00:00', '11:00:00', 'Room 101', 1, 2, 4),
('thursday', '09:00:00', '10:00:00', 'Lab 1', 1, 3, 5),
('thursday', '10:00:00', '11:00:00', 'Room 101', 1, 4, 6),
('friday', '09:00:00', '10:00:00', 'Room 101', 1, 5, 3),
('friday', '10:00:00', '11:00:00', 'Gym', 1, 8, 6);

-- Insert system settings
INSERT INTO system_settings (`key`, value, description) VALUES
('school_year', '2024-2025', 'Current academic year'),
('semester', 'Spring 2024', 'Current semester'),
('attendance_grace_period', '15', 'Grace period in minutes for late attendance'),
('max_login_attempts', '5', 'Maximum login attempts before account lockout'),
('session_timeout', '3600', 'Session timeout in seconds'),
('backup_frequency', 'daily', 'Database backup frequency'),
('notification_retention_days', '90', 'Days to retain notifications'),
('default_password', 'password123', 'Default password for new users');

-- Insert sample notifications
INSERT INTO notifications (title, message, type, priority, senderId, isSent) VALUES
('Welcome to School Management System', 'Welcome to our comprehensive school management platform. Please update your profile information.', 'general', 'medium', 2, TRUE),
('Semester Examination Schedule', 'The semester examinations will begin from March 1st, 2024. Please check the detailed schedule on the notice board.', 'academic', 'high', 2, TRUE),
('Fee Payment Reminder', 'This is a reminder that your monthly fee payment is due. Please make the payment by the due date to avoid late fees.', 'fee', 'medium', 2, TRUE),
('Parent-Teacher Meeting', 'Parent-teacher meeting is scheduled for February 15th, 2024. All parents are requested to attend.', 'general', 'high', 2, TRUE);

-- Insert notification recipients (send to all students)
INSERT INTO notification_recipients (notificationId, recipientId) VALUES
(1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12),
(2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12),
(3, 7), (3, 8), (3, 9), (3, 10), (3, 11), (3, 12),
(4, 7), (4, 8), (4, 9), (4, 10), (4, 11), (4, 12);

-- Insert sample assignments
INSERT INTO assignments (title, description, instructions, dueDate, maxMarks, status, subjectId, classId, teacherId) VALUES
('Algebra Problem Set 1', 'Solve the given algebraic equations and show your work.', 'Please solve all problems step by step. Show all calculations clearly.', '2024-02-10 23:59:59', 100, 'published', 1, 1, 3),
('Essay on Shakespeare', 'Write a 500-word essay on any Shakespeare play of your choice.', 'Choose one play and analyze its themes, characters, and literary devices.', '2024-02-15 23:59:59', 100, 'published', 2, 1, 4),
('Physics Lab Report', 'Submit your lab report on the pendulum experiment.', 'Include hypothesis, methodology, observations, and conclusions.', '2024-02-12 23:59:59', 50, 'published', 3, 1, 5);

-- Insert sample attendance records
INSERT INTO staff_attendance (date, checkInTime, checkOutTime, status, staffId) VALUES
('2024-01-15', '08:30:00', '16:30:00', 'present', 3),
('2024-01-15', '08:45:00', '16:30:00', 'late', 4),
('2024-01-15', '08:30:00', '16:30:00', 'present', 5),
('2024-01-15', '08:30:00', '16:30:00', 'present', 6),
('2024-01-16', '08:30:00', '16:30:00', 'present', 3),
('2024-01-16', '08:30:00', '16:30:00', 'present', 4),
('2024-01-16', NULL, NULL, 'absent', 5),
('2024-01-16', '08:30:00', '16:30:00', 'present', 6);

INSERT INTO student_attendance (date, status, studentId, subjectId, markedById) VALUES
('2024-01-15', 'present', 7, 1, 3),
('2024-01-15', 'present', 8, 1, 3),
('2024-01-15', 'absent', 9, 1, 3),
('2024-01-15', 'present', 10, 1, 3),
('2024-01-15', 'present', 7, 2, 4),
('2024-01-15', 'late', 8, 2, 4),
('2024-01-15', 'absent', 9, 2, 4),
('2024-01-15', 'present', 10, 2, 4);
