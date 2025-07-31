const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

app.post('/api/dify', async (req, res) => {
    try {
        const difyUrl = 'https://api.dify.ai/v1/workflows/run';
        const difyBearerToken = process.env.DIFY_API_KEY;

        const response = await axios.post(difyUrl, req.body, {
            headers: {
                'Authorization': `Bearer ${difyBearerToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error calling Dify API:', error);
        res.status(500).json({ error: 'Failed to fetch data from Dify API' });
    }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});
