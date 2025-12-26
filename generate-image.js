const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = import.meta.env.OPENAI_API_KEY;

app.post('/generate-image', async (req, res) => {
    const prompt = req.body.prompt;  // The text you want to convert to an image

    try {
        const response = await axios.post('https://api.openai.com/v1/images/generations', {
            prompt: prompt,
            n: 1,
            size: '1024x1024'
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const imageUrl = response.data.data[0].url;
        res.json({ imageUrl: imageUrl });

    } catch (error) {
        res.status(500).json({ error: 'Error generating image' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});