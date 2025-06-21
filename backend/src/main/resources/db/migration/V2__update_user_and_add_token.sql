-- V2__update_user_and_add_token.sql

-- Rename 'name' column to 'username' in 'user' table
ALTER TABLE user
    CHANGE COLUMN name username VARCHAR(255);

-- Add 'password' and 'role' columns to 'user' table
ALTER TABLE user
    ADD COLUMN password VARCHAR(255),
    ADD COLUMN role VARCHAR(50);

-- Create 'token' table
CREATE TABLE token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    access_token VARCHAR(512),
    refresh_token VARCHAR(512),
    is_logged_out BOOLEAN DEFAULT FALSE,
    user_id BIGINT,
    CONSTRAINT fk_token_user
      FOREIGN KEY (user_id)
      REFERENCES user(id)
      ON DELETE CASCADE
);
