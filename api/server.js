const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Thông tin Google Sheets
const SPREADSHEET_ID = '14R9efcJ2hGE3mCgmJqi6TNbqkm4GFe91LEAuCyCa4O0';
const RANGE = 'don_hang!A:CS'; // Phạm vi cột A đến CS
const API_KEY = 'AIzaSyA9g2qFUolpsu3_HVHOebdZb0NXnQgXlFM';

app.use(express.static(path.join(__dirname)));

app.get('/data', async (req, res) => {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await axios.get(url);

        const rawData = response.data.values || [];
        if (rawData.length === 0) {
            return res.status(200).json({ message: 'Không có dữ liệu trong phạm vi được chỉ định.' });
        }

        // Giữ nguyên tiêu đề và dữ liệu
        const updatedData = rawData;

        // Trả về dữ liệu
        res.status(200).json({ data: updatedData });
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data : 'Failed to fetch data from Google Sheets' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});