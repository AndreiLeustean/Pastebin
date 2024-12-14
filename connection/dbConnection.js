import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'andrei',
    password: 'Paraclis123',
    database: 'user_input',
    port: 3306,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database with ID:', connection.threadId);
});

export default connection;