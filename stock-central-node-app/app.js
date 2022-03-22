const express = require('express')
const cors = require('cors');
const Joi = require('joi')
const bodyParser = require('body-parser')
let functions = require('./functions')
let connectToRDB = require('./aws_rdb')
let sqlConnectionPool = require('./generate_sql_connection_pool');
const { error } = require('console');
const app = express();
app.use(cors({
    origin: '*'
}));

// "proxyConfig": "proxy.conf.json"

app.use(express.json())

const port = process.env.PORT || 3000;
var rdb = connectToRDB.connectToRDB()
var mysql_pool = sqlConnectionPool.sqlConnectionPool


app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// base route
app.get('/', (req, res) => {
    res.send('chimp')
})


// endpoint to get price information for specified ticker
app.get('/api/quote/:ticker', async (req, res) => {
    const ticker = req.params.ticker
    let priceData = await functions.getPriceData(ticker)
    try {
        if (priceData == 'undefined' || priceData == null) {
            res.status(400).send('Enter a valid stock ticker')
            // connection.release()
        }
        else {
            res.status(200).send(priceData)
            // connection.release()
        }
    }
    catch (e) {
        console.error(e)
        res.status(400).send('Enter a valid stock ticker')
        // connection.release()
    }
});

// endpoint to get company news for specified stock ticker
app.get('/api/companyNews/:ticker', async (req, res) => {
    const ticker = req.params.ticker
    let newsData = await functions.getNewsData(ticker)
    try {
        if (newsData == 'undefined' || newsData == null) {
            res.status(400).send('Enter a valid stock ticker')
            // connection.release()
        }
        else {
            res.status(200).send(newsData)
            // connection.release()
        }
    }
    catch (e) {
        console.error(e)
        res.status(400).send('Enter a valid stock ticker')
        // connection.release()
    }
});

// gets all users
app.get('/api/users', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.log('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query('SELECT * FROM stock_central.users', function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            res.status(200).send(result)
            connection.release()
        });
    });
});

// endpoint to get user information by user ID
app.get('/api/users/:id', (req, res, next) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = undefined
        userID = parseInt(req.params.id);
        if (isNaN(userID)) {
            next()
            return
        }

        if (typeof userID !== 'undefined') {
            rdb.query("SELECT * FROM stock_central.users WHERE user_id = '" + userID + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                res.status(200).send(result)
                connection.release()
            });
        }
        else {
            res.status(400).send('Must specify user ID in request params')
            connection.release()
        }
    });
});

app.get('/api/users/:username', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let username = req.params.username;
        if (typeof username == 'undefined' || typeof username !== 'string' || username.includes('@') == true) {
            res.status(400).send('Must specify username in request params')
            connection.release()
        }
        if (typeof username !== 'undefined') {
            rdb.query("SELECT * FROM stock_central.users WHERE username = '" + username + "'", function (error, result) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                res.status(200).send(result)
                connection.release()
            });
        }
        else {
            res.status(400).send('Must specify username in request params')
            connection.release()
        }
    });
});
// endpoint to get user by email
app.get('/api/getUserByEmail/:email', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let email = undefined
        email = req.params.email;
        // if () {
        //     next()
        //     return
        // }
        if (typeof email !== 'undefined' || email !== '') {
            rdb.query(`SELECT * FROM stock_central.users WHERE email = '${email}'`, function (error, result) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                res.status(200).send(result)
                connection.release()
            });
        }
        else {
            res.status(400).send('Must specify email in request params')
            connection.release()
        }
    });
});


app.get('/api/getUserByFirstName/:firstName', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let firstName = req.params.firstName
        if (typeof firstName !== 'string') {
            console.error('firstName must be of type string')
            connection.release()
            res.status(400).send('firstName must be string!')
        }
        rdb.query(`SELECT * FROM users WHERE first_name = '${firstName}'`, function (error, result) {
            if (error) {
                console.error(error);
                throw error;
            }
            res.status(200).send(result)
            connection.release()
        })
    })
})

// endpoint to create new user
app.post('/api/users', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let username = req.body.username
        let firstName = req.body.firstName
        let lastName = req.body.lastName
        let email = req.body.email
        if (typeof username !== 'string' || typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string') {
            res.status(400).send('username, first/last name, and email must be strings.')
            connection.release()
        }
        rdb.query(`INSERT IGNORE INTO stock_central.users (username, first_name, last_name, email) VALUES ('${username}', '${firstName}', '${lastName}', '${email}')`, function (error, result) {
            if (error) {
                console.error(error);
                throw error;
            }
            res.status(200).send(result)
            connection.release()
        });
    });
});


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// endpoint to get all posts 
app.get('/api/posts/:id', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = req.params.id
        rdb.query(`SELECT * FROM posts WHERE fk_user_id != ${userID}`, function (error, result) {
            if (error) {
                console.error(error)
                throw error
            }
            res.status(200).send(result)
            connection.release()
        });
    })
});
// endpoint to get post by ID
app.get('/api/post/:id', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let postID = undefined
        try {
            postID = parseInt(req.params.id)
        }
        catch (e) {
            res.status(400).send(e)
            connection.release()
        }

        rdb.query(`SELECT * FROM posts WHERE post_id = ${postID}`, function (error, result) {
            if (error) {
                console.error(error)
                throw error
            }
            res.status(200).send(result)
            connection.release()
        });
    });
});

app.post('/api/createPost', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let messageContent = req.body.messageContent
        let userID = parseInt(req.body.id)

        if (typeof messageContent !== 'string' || typeof userID !== 'number') {
            res.status(400).send('User ID needs to be an int and messageContent needs to be a string')
            connection.release()
        }
        rdb.query(`INSERT INTO posts (fk_user_id, message_content, num_likes) VALUES ('${userID}', '${messageContent}', '${0}')`, function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            res.status(200).send('post successfully created!')
            connection.release()
        });
    });
});


// endpoint to like a post by its post ID
app.patch('/api/likePost/:postId', (req, res) => {
    let postID = req.params.postId
    if (isNaN(postID)) {
        res.status(400).send('post ID must be an int')
        connection.release()
    }
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query(`UPDATE posts SET num_likes = num_likes + 1 WHERE post_id = ${postID}`, function (error, result) {
            if (error) {
                console.error(error)
                throw error
            }
            res.status(200).send('Number of likes increased successfully!')
            connection.release()
        });
    });
});


// endpoint to unlike a post by its post ID
app.patch('/api/unlikePost/:postId', (req, res) => {
    let postID = req.params.postId
    if (isNaN(postID)) {
        res.status(400).send('post ID must be an int')
    }
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query(`UPDATE posts SET num_likes = num_likes - 1 WHERE post_id = ${postID}`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            }
            res.status(200).send('Number of likes decremented successfully!')
            connection.release()
        });
    });
});

app.get('/api/getLikes/:id', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = undefined
        try {
            userID = parseInt(req.params.id)
        }
        catch (e) {
            res.status(400).send(e)
            connection.release()
        }

        rdb.query(`SELECT * FROM likes WHERE fk_user_id = ${userID}`, function (error, result) {
            if (error) {
                console.error(error)
                throw error
            }
            res.status(200).send(result)
            connection.release()
        });
    });
});


// app.post('/api/createPost', (req, res) => {
//     mysql_pool.getConnection(function (err, connection) {
//         if (err) {
//             console.error('Error getting connection from pool: ' + err)
//             connection.release()
//             throw err
//         }
//         let userID = req.body.id
//         let messageContent = req.body.messageContent
//         let postID = -1

//         if (typeof messageContent !== 'string' || typeof userID !== 'number') {
//             res.status(400).send('User ID needs to be an int and messageContent needs to be a string')
//             connection.release()
//         }
//         rdb.query(`INSERT INTO posts (fk_user_id, message_content) VALUES ('${userID}', '${messageContent}')`, function (error, result) {
//             if (error) {
//                 console.error(error);
//                 connection.release()
//                 throw error;
//             }
//             res.status(201).send(result)
//             connection.release()
//         });
//         postID = getPostID(userID, messageContent)
//         rdb.query(`INSERT INTO likes (fk_user_id, fk_post_id) VALUES (${userID}, ${postID})`, function (error, result) {
//             if (error) {
//                 console.error(error)
//                 connection.release()
//                 throw error
//             }
//             else {
//                 res.status(201).send(result)
//                 connection.release()
//             }
           
//         })
//     });
// });


function getPostID(userID, messageContent) {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query(`SELECT post_id FROM posts WHERE fk_user_id = ${userID} AND message_content = '${messageContent}'`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            }
            connection.release()
            return result
        })
    })
}

// endpoint to like a post by its post ID
app.patch('/api/likePost/:postId/:userID', (req, res) => {
    let userID = req.params.userID
    let postID = req.params.postId
    if (isNaN(postID) || isNaN(userID)) {
        res.status(400).send('post and user ID must be an int')
    }
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query(`INSERT INTO likes (fk_user_id, fk_post_id) VALUES (${userID}, ${postID})`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            }
            rdb.query(`UPDATE posts SET num_likes = num_likes + 1 WHERE post_id = ${postID}`, function (error, result) {
                if (error) {
                    console.error(error)
                    throw error
                }
                res.status(200).send('Number of likes increased successfully!')
                connection.release()
            });
        });
    });
});


// endpoint to unlike a post by its post ID
app.patch('/api/unlikePost/:postId/:userId', (req, res) => {
    let userID = req.params.userId
    let postID = req.params.postId
    if (isNaN(postID) && isNaN(userID)) {
        res.status(400).send('post and user ID must be an int')
    }
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query(`DELETE FROM likes WHERE fk_user_id = ${userID} AND fk_post_id = '${postID}';`, function (error, result) {
            if (error) {
                console.error(error);
                connection.release()
                throw error;
            }
            rdb.query(`UPDATE posts SET num_likes = num_likes - 1 WHERE post_id = ${postID}`, function (error, result) {
                if (error) {
                    console.error(error)
                    connection.release()
                    throw error
                }
                res.status(200).send('Number of likes decremented successfully!')
                connection.release()
            });
        })
    });
});

app.patch('/api/updateUserInfo/:userID/:firstName/:lastName/:username', (req, res) => {
    let userID = req.params.userID;
    let firstName = req.params.firstName;
    let lastName = req.params.lastName;
    let username = req.params.username;
    if (isNaN(userID)) {
        res.status(400).send('post ID must be an int')
        connection.release()
    }
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        rdb.query(`UPDATE users SET username = '${username}', first_name = '${firstName}', last_name = '${lastName}' WHERE user_id = ${userID}`, function (error, result) {
            if (error) {
                console.error(error)
                throw error
            }
            res.status(200).send(result);
            connection.release()
        });
    });
});


// endpoint to generate feed for logged in user
app.get('/api/posts/generateFeed/:userId', (req, res) => {
    let messagesInfo = {}
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = -1
        try {
            userID = parseInt(req.params.userId)
        }
        catch (e) {
            res.status(400).send(e)
            connection.release()
        }

        // let friendsList = []
        // rdb.query(`SELECT fk_user_id_2 FROM friends WHERE fk_user_id_1 = ${userID};`, function (error1, friendsIDList) {
        //    if (error1) {
        //         console.error(error1)
        //         throw error1
        //     }
        //     friendsIDList.forEach(friend => {
        //         friendsList.push(friend['fk_user_id_2'])
        //     });
        rdb.query(`SELECT posts.message_content, posts.created_at, posts.post_id, posts.fk_user_id, posts.num_likes FROM posts JOIN friends ON friends.fk_user_id_2 = posts.fk_user_id WHERE friends.fk_user_id_1 = '${userID}' AND posts.created_at > (NOW() - INTERVAL 7 DAY) AND posts.num_likes >= 0 LIMIT 10;`, function (error, result) {
            if (error) {
                console.error(error);
                throw error;
            }
            console.log(result);
            res.status(200).send(result);
            connection.release();
        });
        /*
        if (userID != 1) {
            rdb.query(`SELECT posts.message_content, posts.ticker, posts.created_at, posts.post_id, posts.fk_user_id FROM friends JOIN posts ON friends.fk_user_id_2 = posts.fk_user_id JOIN likes ON likes.fk_post_id = posts.post_id WHERE friends.fk_user_id_1 = ${userID} AND posts.created_at > (NOW() - INTERVAL 7 DAY) AND likes.num_likes > 10 LIMIT 10;;`,
                function (error2, messages) {
                    if (error2) {
                        console.error(error2)
                        throw error2
                    }
                    messagesInfo = JSON.parse(JSON.stringify(messages))
                    res.status(200).send(messagesInfo)
                    connection.release()
                });
        }
        */
    });
});


// endpoint to get username from user id (helper for generate feed stuff)
app.get('/api/getUsernames/:id', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = undefined
        try {
            userID = parseInt(req.params.id)
        }
        catch (e) {
            res.status(400).send(e)
            connection.release()
        }
        rdb.query(`SELECT username FROM users WHERE user_id = ${userID}`, function (error3, usernameObj) {
            if (error3) {
                console.error(error3)
                connection.release()
                throw error3
            }
            if (usernameObj.length == 0) {
                res.status(404).send(`user with user ID of ${userID} was not found`)
                connection.release()
            }
            res.status(200).send(usernameObj)
            connection.release()
        });
    });
});

app.get('/api/getUsers/:input' , (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let input = req.params.input;
        let query = "SELECT * FROM users WHERE username LIKE ?";
        let value = input + "%"
        rdb.query(query,[value] , function (error3, usernameObj) {
            if (error3) {
                console.error(error3)
                connection.release()
                throw error3
            }
            res.status(200).send(usernameObj)
            connection.release()
        });
    });
})





// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// WATCHLIST ENDPOINTS

// endpoint to get the watchlist items for a user by his ID
app.get('/api/getWatchlistItems/:id', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = parseInt(req.params.id)
        if (isNaN(userID)) {
            res.status(400).send('USER ID must be an int')
            connection.release()
        }
        rdb.query(`SELECT * FROM watchlist WHERE fk_user_id = ${userID}`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            }
            res.status(200).send(result)
            connection.release()
        })
    })
})


app.post('/api/addToWatchlist', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = req.body.id
        let ticker = req.body.ticker
        if (userID === 'undefined' && ticker === 'undefined') {
            res.status(400).send('a user id and ticker symbol need to be specified')
            connection.release()
        }
        rdb.query(`INSERT INTO watchlist (fk_user_id, ticker) VALUES (${userID}, '${ticker}')`, function (error, result) {
            if (error) {
                console.log(error);
                connection.release()
                throw error;
            }
            res.status(201).send(result)
            connection.release()
        })
    })
})

app.delete('/api/removeFromWatchlist', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = req.body.id
        let ticker = req.body.ticker
        if (userID === 'undefined' && ticker === 'undefined') {
            res.status(400).send('a user id and ticker symbol need to be specified')
            connection.release()
        }
        rdb.query(`DELETE FROM watchlist WHERE fk_user_id = ${userID} AND ticker = '${ticker}';`, function (error, result) {
            if (error) {
                console.error(error);
                connection.release()
                throw error;
            }
            res.status(200).send(result)
            connection.release()
        })
    })
})



// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// FRIENDS table endpoints

app.post('/api/addFriend', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID_1 = -1
        let userID_2 = -1
        try {
            userID_1 = parseInt(req.body.id)
            userID_2 = parseInt(req.body.id2)
        }
        catch (e) {
            console.error(e)
            res.status(400).send(e)
            connection.release()
         }
        
        rdb.query(`INSERT IGNORE INTO friends (fk_user_id_1, fk_user_id_2) VALUES (${userID_1}, ${userID_2})`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            } 
            res.status(201).send(result)
            connection.release()
        })
    })
})

app.get('/api/getFriendsList/:id', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID = parseInt(req.params.id)
        if (isNaN(userID)) {
            res.status(400).send('USER ID must be an int')
            connection.release()
        }
        rdb.query(`SELECT * FROM friends WHERE fk_user_id_1 = ${userID}`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            }
            res.status(200).send(result)
            connection.release()
        })
    })
})


app.delete('/api/deleteFriend', (req, res) => {
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            console.error('Error getting connection from pool: ' + err)
            connection.release()
            throw err
        }
        let userID_1 = -1
        let userID_2 = -1
        try {
            userID_1 = parseInt(req.body.id)
            userID_2 = parseInt(req.body.id2)
        }
        catch (e) {
            console.error(e)
            res.status(400).send(e)
            connection.release()
        }
        rdb.query(`DELETE FROM friends WHERE fk_user_id_1 = ${userID_1} AND fk_user_id_2 = ${userID_2}`, function (error, result) {
            if (error) {
                console.error(error)
                connection.release()
                throw error
            }
            res.status(200).send(result)
            connection.release()
        })
    })
})



// ------------------------------------------------------------------------------------------------------------------------------------------------------------------




app.listen(port, () => {
    console.log(`Express server listening on ${port}...`);
});







