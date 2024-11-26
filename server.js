import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'andrei',
    password: 'Paraclis123',
    database: 'user_input',
    port: 3306,
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database with ID: ' + connection.threadId);
});

app.post('/text/save', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text cannot be empty' });
    }

    const query = 'INSERT INTO user_texts (text_data) VALUES (?)';
    connection.query(query, [text], (err, results) => {
        if (err) {
            console.error('Error inserting text:', err.message);
            return res.status(500).json({ error: 'Error saving the text' });
        }
        res.status(200).json({ message: 'Text successfully saved!' });
    });
});

app.get('/text/last-id', (req, res) => {
    const getLastIdQuery = 'SELECT MAX(id) AS last_id FROM user_texts';

    connection.query(getLastIdQuery, (err, results) => {
        if (err) {
            console.error('Error fetching the last ID:', err.message);
            return res.status(500).json({ error: 'Error fetching the last ID' });
        }
        const lastId = results[0]?.last_id;

        if (lastId === null || lastId === undefined) {
            console.log('No IDs found in the table');
            return res.status(404).json({ message: 'No IDs found in the table' });
        }
        res.status(200).json({ lastId });
    });
});

app.get('/texts', (req, res) => {
    const query = 'SELECT * FROM user_texts';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching texts:', err);
            return res.status(500).json({ error: 'Error fetching texts' });
        }
        console.log('Texts successfully retrieved');
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
