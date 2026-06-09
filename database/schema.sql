CREATE DATABASE IF NOT EXISTS roadmaster;
USE roadmaster;

CREATE TABLE users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(100)  NOT NULL,
    email        VARCHAR(100)  NOT NULL UNIQUE,
    password     VARCHAR(255)  NOT NULL,
    role         ENUM('student', 'teacher') NOT NULL,
    license_type VARCHAR(255)  DEFAULT 'B', 
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id   INT NOT NULL,
    student_id   INT NOT NULL,
    lesson_date  DATETIME NOT NULL,
    status       ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes        TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE questions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    question_text   TEXT NOT NULL,
    image_path      VARCHAR(255),
    option_a        VARCHAR(255) NOT NULL,
    option_b        VARCHAR(255) NOT NULL,
    option_c        VARCHAR(255) NOT NULL,
    option_d        VARCHAR(255) NOT NULL,
    correct_answer  ENUM('a', 'b', 'c', 'd') NOT NULL,
    license_type    ENUM('A', 'B', 'C', 'D') NOT NULL DEFAULT 'B',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_results (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    student_id  INT NOT NULL,
    score       INT NOT NULL,
    total       INT NOT NULL,
    passed      BOOLEAN NOT NULL,
    taken_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id)
);

CREATE TABLE available_slots (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id  INT NOT NULL,
    slot_date   DATETIME NOT NULL,
    is_booked   BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
);