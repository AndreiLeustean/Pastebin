import express from 'express';
import cors from 'cors';
import { handleSaveText, handleGetLastId, handleGetAllTexts } from '../controllers/textController.js';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.post('/text/save', handleSaveText);
app.get('/text/last-id', handleGetLastId);
app.get('/texts', handleGetAllTexts);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});