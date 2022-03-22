SELECT * FROM stock_central.users;

CREATE TABLE users (
	user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
	likes_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    fk_user_id INT,
    fk_post_id INT,
    FOREIGN KEY (fk_user_id) references users (user_id),
    FOREIGN KEY (fk_post_id) REFERENCES posts (post_id)
);

CREATE TABLE posts (
	post_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY ,
    fk_user_id INT,
    message_content text,
    created_at datetime default current_timestamp,
    num_likes INT,
    FOREIGN KEY (fk_user_id) REFERENCES users (user_id)
);

CREATE TABLE watchlist (
	watchlist_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    fk_user_id INT,
    ticker VARCHAR(10),
    FOREIGN KEY (fk_user_id) REFERENCES users (user_id)
);

CREATE TABLE friends (
	friend_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    fk_user_id_1 INT,
    fk_user_id_2 INT,
    FOREIGN KEY (fk_user_id_1) REFERENCES users (user_id),
    FOREIGN KEY (fk_user_id_2) REFERENCES users (user_id)
);

TRUNCATE TABLE users;