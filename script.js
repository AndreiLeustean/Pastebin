const userInput = document.getElementById('inputUser');
let finalId;
let lastInput;

function generateTextDiv(numberOfNewBoxes) {
    let boxes = document.getElementById("textsList");
    for (let i = 0; i < numberOfNewBoxes; ++i) {
        let textBox = document.createElement("div");
        textBox.setAttribute("id", "box" + (i + 1));
        textBox.classList.add("textBox");
        boxes.appendChild(textBox);
    }
}

async function getLastIdFromServer() {
    try {
        const response = await fetch('http://localhost:4000/getLastId');
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
        const response = await fetch('http://localhost:4000/getTexts');
        const data = await response.json();
        console.log('Texts received from server:', data);

        data.forEach(item => {
            const textBox = document.getElementById(`box${item.id}`);
            if (textBox) {
                textBox.textContent = item.text_data;
            }
        });
    } catch (error) {
        console.error('Error fetching texts:', error);
    }
}

async function sendTextToServer(text) {
    try {
        const response = await fetch('http://localhost:4000/saveText', {
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

document.addEventListener('DOMContentLoaded', async (event) => {
    await getLastIdFromServer();
    console.log("The last ID value is:", finalId);
    generateTextDiv(finalId);
    populateBoxes();
});

async function saveText(event) {
    const text = userInput.value.trim();
    if (text !== '') {
        lastInput = text;
        await sendTextToServer(text);
        await getLastIdFromServer();
        console.log(finalId);
        ++finalId;
        console.log(finalId);
        generateTextDiv(1);
        populateLastBox();
    }
}

function populateLastBox() {
    const lastTextBox = document.getElementById(`box${finalId}`);
    if (lastTextBox) {
        lastTextBox.textContent = lastInput;
    }
}

document.querySelector('textarea').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        saveText(event);
        userInput.value = "";
    }
});