SELECT * FROM posts;

INSERT INTO posts (fk_user_id, message_content, ticker) VALUES (3, 'test third message within 2 weeks', 'PINS');
UPDATE posts SET num_likes = 12 WHERE posts.fk_user_id = 2;
INSERT INTO friends (fk_user_id_1, fk_user_id_2) VALUES (1, 2);
SELECT * FROM friends;

SELECT fk_user_id_2 FROM friends WHERE fk_user_id_1 = 1;

-- SELECT * FROM friends JOIN posts ON friends.fk_user_id_2 = posts.fk_user_id JOIN likes ON likes.fk_user_id = posts.fk_user_id WHERE fk_user_id_1 = 1 AND posts.created_at > (NOW() - INTERVAL 7 DAY) ORDER BY likes.num_likes DESC LIMIT 10;
SELECT posts.message_content, posts.ticker, posts.created_at, posts.post_id, posts.fk_user_id FROM friends JOIN posts ON friends.fk_user_id_2 = posts.fk_user_id JOIN likes ON likes.fk_post_id = posts.post_id WHERE friends.fk_user_id_1 = 4 AND posts.created_at > (NOW() - INTERVAL 7 DAY) AND likes.num_likes > 10 LIMIT 10;

INSERT INTO posts (fk_user_id, message_content, ticker) VALUES (4, 'Prateek test msg 2', 'ZG');

SELECT * FROM stock_central.users WHERE first_name = 'Prateek';

SELECT * FROM users;
select * from posts;
SELECT * FROM friends; 

UPDATE users SET pswd = '123' WHERE user_id = 2;

INSERT INTO likes (fk_user_id, fk_post_id, num_likes) VALUES (4, 8, 22);

ALTER TABLE posts DROP num_likes;

ALTER TABLE friends RENAME COLUMN fK_user_id_2 TO fk_user_id_2;

ALTER TABLE likes ALTER COLUMN num_likes SET DEFAULT 0;

CREATE TABLE likes (
	likes_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fk_user_id INT,
    fk_post_id INT,
    FOREIGN KEY (fk_user_id) REFERENCES users (user_id),
    FOREIGN KEY (fk_post_id) REFERENCES posts (post_id)
);

CREATE TABLE watchlist (
	watchlist_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    fk_user_id INT,
    ticker VARCHAR(10),
    FOREIGN KEY (fk_user_id) REFERENCES users (user_id)    
);

INSERT INTO likes (fk_user_id, fk_post_id) VALUES (1, 1);

UPDATE likes SET num_likes = 30 WHERE likes_id = 3;

ALTER TABLE likes ADD num_likes INT;

ALTER TABLE users ADD pswd VARCHAR(100);