-- Create User table
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

-- Create Task table
CREATE TABLE task (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    user_id BIGINT,
    CONSTRAINT fk_user
      FOREIGN KEY (user_id)
      REFERENCES user(id)
      ON DELETE CASCADE
);
