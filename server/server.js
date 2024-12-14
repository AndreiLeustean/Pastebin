import express from 'express';
import cors from 'cors';
import { handleSaveText, handleGetLastId, handleGetAllTexts } from '../controllers/textController.js';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('view'));

app.set('view engine', 'ejs');
app.set('views', './view');

app.post('/text/save', handleSaveText);
app.get('/text/last-id', handleGetLastId);
app.get('/texts', handleGetAllTexts);

app.get('/', (req, res) => {
    const data = { name: 'Pastebin User' };
    res.render('index', data);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});