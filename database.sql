CREATE DATABASE IF NOT EXISTS uo;
USE uo;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_quiz_result_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_result_completed_at ON quiz_results(completed_at);

SELECT id, username, email, created_at FROM users;

SELECT 
    qr.id,
    u.username,
    qr.score,
    qr.total_questions,
    ROUND((qr.score / qr.total_questions * 100), 1) as percentage,
    qr.time_taken,
    qr.quiz_type,
    qr.completed_at
FROM quiz_results qr
JOIN users u ON qr.user_id = u.id
ORDER BY qr.completed_at DESC;


SELECT 
    u.username,
    COUNT(qr.id) as total_quizzes,
    AVG(qr.score / qr.total_questions * 100) as avg_percentage,
    MAX(qr.score) as best_score,
    SUM(qr.time_taken) as total_time_seconds
FROM users u
LEFT JOIN quiz_results qr ON u.id = qr.user_id
GROUP BY u.id, u.username;


SELECT 
    u.username,
    qr.score,
    qr.total_questions,
    ROUND((qr.score / qr.total_questions * 100), 1) as percentage,
    qr.completed_at
FROM quiz_results qr
JOIN users u ON qr.user_id = u.id
ORDER BY (qr.score / qr.total_questions) DESC, qr.completed_at ASC
LIMIT 10;