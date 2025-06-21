-- Quiz Master Database Setup Script for MySQL Workbench
-- Database: uo
-- Run this script in MySQL Workbench to create the required tables

USE uo;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    time_taken INT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    quiz_type VARCHAR(50) DEFAULT 'general',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_quiz_result_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_result_completed_at ON quiz_results(completed_at);

-- Show the created tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE quiz_results;

-- Insert sample data (optional)
-- Sample users (passwords are hashed versions of 'password123')
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@quizmaster.com', 'pbkdf2:sha256:600000$your-salt-here$hashed-password'),
('demo_user', 'demo@quizmaster.com', 'pbkdf2:sha256:600000$your-salt-here$hashed-password');

-- Sample quiz results
INSERT INTO quiz_results (user_id, score, total_questions, time_taken, quiz_type) VALUES
(1, 8, 10, 45, 'general'),
(1, 9, 10, 52, 'programming'),
(2, 7, 10, 48, 'general'),
(2, 6, 10, 55, 'programming');

-- Show sample data
SELECT * FROM users;
SELECT * FROM quiz_results; 