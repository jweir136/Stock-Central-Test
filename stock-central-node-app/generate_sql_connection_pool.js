let connectToRDB = require('./aws_rdb')
var mysql = connectToRDB.mysql

var connectionPool = mysql.createPool({
    connectionLimit: 100,
    host: 'stock-central.cpbbumloza64.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'stockcentral',
    database: 'stock_central',
    port: '3306'
});

module.exports.sqlConnectionPool = connectionPool