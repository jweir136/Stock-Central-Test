var mysql = require('mysql');
var rdb = mysql.createConnection({
    host: 'stock-central.cpbbumloza64.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'stockcentral',
    port: '3306',
    database: 'stock_central'
});

function connectToRDB() {
    rdb.connect(function (err) {
        if (err) {
            console.error('Database connection failed: ' + err.stack);
            return;
        }
        console.log('Connected!');
    });
    return rdb
}

function endRDBConnection() {
    rdb.end()
}

module.exports.mysql = mysql
module.exports.connectToRDB = connectToRDB
module.exports.endRDBConnection = endRDBConnection