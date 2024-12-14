import connection from '../connection/dbConnection.js';

export const saveText = (text) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO user_texts (text_data) VALUES (?)';
        connection.query(query, [text], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

export const getLastId = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(id) AS last_id FROM user_texts';
        connection.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results[0]?.last_id || null);
        });
    });
};

export const getAllTexts = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM user_texts';
        connection.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};