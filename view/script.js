const userInput = document.getElementById('inputUser');
let finalId;
let lastInput;
let idBox;
let isSavingNewText = false;

function generateTextDiv(numberOfNewBoxes) {
    let boxes = document.getElementById("textsList");
    idBox = finalId;
    for (let i = 0; i < numberOfNewBoxes; ++i) {
        if (!isSavingNewText) {
            idBox = i + 1;
        }
        let textBox = document.createElement("div");
        textBox.setAttribute("id", "box" + (idBox));
        textBox.classList.add("textBox");
        boxes.appendChild(textBox);
    }
}

function textTooLong(text) {
    return text.length > 30;
}

function openTextInNewPage(text, id) {
    const newPage = window.open('', '_blank');
    newPage.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>localhost:400/text/${id}</title>
        </head>
        <body>
            <h1>Text complet:</h1>
            <p>${text}</p>
        </body>
        </html>
    `);
    newPage.document.close();
}

function finalTextInBox(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, 30) + " ...";
    }
    return text;
}

function populateLastBox() {
    let id = finalId
    const lastTextBox = document.getElementById(`box${finalId}`);
    if (lastTextBox) {
        lastTextBox.textContent = finalTextInBox(lastInput, 30);
        if (textTooLong(lastInput)) {
            lastTextBox.addEventListener('click', () => {
                openTextInNewPage(lastInput, finalId);
            });
        }
    } else {
        console.error(`Text box with ID box${finalId} not found.`);
    }
}

async function getLastIdFromServer() {
    try {
        const response = await fetch('http://localhost:4000/text/last-id');
        const data = await response.json();
        console.log('Response from server:', data);

        if (data.lastId !== undefined) {
            finalId = data.lastId;
            console.log('Last ID:', finalId);
        } else {
            console.log('No ID found.');
        }
    } catch (error) {
        console.error('Error fetching the last ID:', error);
    }
}

async function populateBoxes() {
    try {
        const response = await fetch('http://localhost:4000/texts');
        const data = await response.json();
        console.log('Texts received from server:', data);

        data.forEach(item => {
            const textBox = document.getElementById(`box${item.id}`);
            if (textBox) {
                textBox.textContent = finalTextInBox(item.text_data, 30);
                if (textTooLong(item.text_data)) {
                    textBox.addEventListener('click', () => {
                        openTextInNewPage(item.text_data, item.id);
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error fetching texts:', error);
    }
}

async function sendTextToServer(text) {
    try {
        const response = await fetch('http://localhost:4000/text/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });

        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveText(event) {
    const text = userInput.value.trim();
    if (text !== '') {
        lastInput = text;
        await sendTextToServer(text);
        await getLastIdFromServer();
        ++finalId;
        generateTextDiv(1);
        populateLastBox();
    }
}

document.addEventListener('DOMContentLoaded', async (event) => {
    await getLastIdFromServer();
    console.log("The last ID value is:", finalId);
    generateTextDiv(finalId);
    populateBoxes();
});

document.querySelector('textarea').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        isSavingNewText = true;
        event.preventDefault();
        saveText(event);
        userInput.value = "";
    }
});