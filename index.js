const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();

//Set View Engine
app.set('view engine', 'ejs');

//MW
app.use(express.json());

//API
const bible = axios.create({
    baseURL: process.env.API_URL,
    timeout: 1000,
    headers: {
        'api-key': process.env.API_KEY,
        'Accept': 'application/json'
    },
})

//Routes
app.get('/', async (req, res) => {
    bible.get('')
        .then((response) => {

            const { data } = response.data;

            //Get all English Bibles
            let engBible = data.filter(entry =>{
                if(entry.language.name == 'English'){
                    return true;
                }
            });

            //Send filtered data to the frontend
            res.json(engBible);
            // res.render('index', { bbData: JSON.stringify(engBible)});
        })
        .catch(err => console.log(err))
});

//port
const PORT = process.env.port || 5000;

app.listen(PORT, () => {
    console.log('Listening to port 5000')
});