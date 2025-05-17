const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
host: 'mydb.abcd1234.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '2002',
  database: 'school',
  port: 3306,
});

// Convert pool to use promises
const promisePool = pool.promise();

module.exports = promisePool; 
