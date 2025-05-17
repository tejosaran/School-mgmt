const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: 'your-host.region.rds.amazonaws.com',
  user: 'your-cloud-username',
  password: '2002',
  database: 'school_management'
  
});

// Convert pool to use promises
const promisePool = pool.promise();

module.exports = promisePool; 
