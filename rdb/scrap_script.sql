INSERT INTO users (username, first_name, last_name, age, email) VALUES ('testUser3', 'thirdUserFName', 'thirdUserLName', 7, 'test3@gmail.com');
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);

INSERT INTO posts (fk_user_id, message_content, ticker, created_at) VALUES (3, 'test third message', 'PINS', NOW() - INTERVAL 14 DAY);
UPDATE posts SET num_likes = 11 WHERE post_id = 3;
ALTER TABLE posts AUTO_INCREMENT = 1;

INSERT INTO friends (fk_user_id_1, fk_user_id_2) VALUES (1, 3);

INSERT INTO users (username, first_name, last_name, age, email) VALUES ('psj', 'Prateek', 'Jukalkar', 21, 'psjukalkar30@gmail.com');

INSERT INTO friends (fk_user_id_1, fk_user_id_2) VALUES (4, 2);
SELECT * FROM users;

SELECT * FROM posts;



