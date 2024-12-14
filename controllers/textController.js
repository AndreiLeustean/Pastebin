import { saveText, getLastId, getAllTexts } from '../model/textModel.js';

export const handleSaveText = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text cannot be empty' });
    }
    try {
        await saveText(text);
        res.status(200).json({ message: 'Text successfully saved!' });
    } catch (error) {
        console.error('Error saving text:', error.message);
        res.status(500).json({ error: 'Error saving the text' });
    }
};

export const handleGetLastId = async (req, res) => {
    try {
        const lastId = await getLastId();
        if (lastId === null) {
            return res.status(404).json({ message: 'No IDs found in the table' });
        }
        res.status(200).json({ lastId });
    } catch (error) {
        console.error('Error fetching last ID:', error.message);
        res.status(500).json({ error: 'Error fetching the last ID' });
    }
};

export const handleGetAllTexts = async (req, res) => {
    try {
        const texts = await getAllTexts();
        res.status(200).json(texts);
    } catch (error) {
        console.error('Error fetching texts:', error.message);
        res.status(500).json({ error: 'Error fetching texts' });
    }
};