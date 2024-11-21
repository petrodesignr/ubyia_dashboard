const mysql = require('mysql');

//Connecxion a la base de données
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DB,
    port: process.env.DB_PORT,
    charset: 'utf8mb4'
});

// Open the MySQL connection
connection.connect(error => {


    if (error) {
        console.log('Failed to connect to DB ---->', error);
        throw error;
    }

    console.log('Successfully connected to the database !');
});

module.exports = connection;

