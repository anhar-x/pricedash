const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample data (in a real app, this would come from a database)
const priceData = {
    'new york': {
        'coffee': { avg_price: 4.50, currency: 'USD' },
        'taxi': { avg_price: 15.00, currency: 'USD', unit: 'per 5km' },
        'bread': { avg_price: 3.50, currency: 'USD' }
    },
    'london': {
        'coffee': { avg_price: 3.50, currency: 'GBP' },
        'taxi': { avg_price: 12.00, currency: 'GBP', unit: 'per 5km' },
        'bread': { avg_price: 2.20, currency: 'GBP' }
    },
    'calicut': {
        'chai': {avg_price: 12, currency: 'INR'},
        'rickshaw': {avg_price: 40, currency: 'INR', unit: 'per 2km'},
        'bread': {avg_price: 30, currency: 'INR'},
    }
};

// API endpoint to get price data
app.get('/api/price', (req, res) => {
    const { location, item } = req.query;
    const locationLower = location?.toLowerCase();
    const itemLower = item?.toLowerCase();

    if (!locationLower || !itemLower) {
        return res.status(400).json({ error: 'Location and item are required' });
    }

    const locationData = priceData[locationLower];
    if (!locationData) {
        return res.status(404).json({ error: 'Location not found' });
    }

    const itemData = locationData[itemLower];
    if (!itemData) {
        return res.status(404).json({ error: 'Item not found' });
    }

    res.json(itemData);
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 