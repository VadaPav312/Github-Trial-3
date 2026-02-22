require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 1. SERVE YOUR FILES: This tells the server to show your index.html
app.use(express.static(__dirname));

// 2. THE AI ROUTE: This talks to the actual Azure AI, not your own URL
const ACTUAL_AZURE_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions"; 

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch(ACTUAL_AZURE_ENDPOINT, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${process.env.AZURE_AI_TOKEN}` 
            },
            body: JSON.stringify({
                messages: req.body.messages, // Assumes your frontend sends a messages array
                model: "gpt-4o" // Or your specific Azure model name
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Failed to fetch AI data" });
    }
});

// 3. ROOT ROUTE: Sends index.html when you visit the main link
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Secure server running on port ${PORT}`));