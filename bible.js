const axios = require('axios');
require('dotenv').config();

//API
const bible = axios.create({
    baseURL: process.env.API_URL,
    timeout: 1000,
    headers: {
        'api-key': process.env.API_KEY,
        'Accept': 'application/json'
    },
})

module.exports = bible;