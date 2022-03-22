CREATE TABLE users (
	user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    age INT,
    email VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends (
	friend_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fk_user_id_1 INT,
    fK_user_id_2 INT,
    FOREIGN KEY (fk_user_id_1) REFERENCES users (user_id),
    FOREIGN KEY (fk_user_id_2) REFERENCES users (user_id)
);

CREATE TABLE posts (
	post_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fk_user_id INT,
    message_content TEXT,
    ticker VARCHAR(10),
    num_likes INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user_id) REFERENCES users (user_id)
);

CREATE TABLE stocks (
	stock_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stock_name VARCHAR(100),
    ticker VARCHAR(10)
);

CREATE TABLE watchlist (
	watchlist_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fk_user_id INT,
    fk_stock_id INT,
    watchlist_name VARCHAR(100),
    FOREIGN KEY (fk_user_id) REFERENCES users (user_id),
    FOREIGN KEY (fk_stock_id) REFERENCES stocks (stock_id)
);