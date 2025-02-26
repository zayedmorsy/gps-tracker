const express = require('express');  // استدعاء Express.js
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// إعداد CORS و JSON parsing
app.use(cors());
app.use(bodyParser.json());

// API لاستقبال بيانات GPS
app.post('/update-location', (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    console.log(`Received GPS Data: Latitude=${latitude}, Longitude=${longitude}`);
    res.status(200).json({ message: "Location received successfully" });
});

// تشغيل السيرفر
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
