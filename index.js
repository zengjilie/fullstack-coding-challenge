const express = require('express');
const axios = require('axios');

require('dotenv').config();

const app = express();

//Set View Engine
app.set('view engine', 'ejs');

//MW
app.use(express.json());
app.use(express.static('public'));

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

            //=== [Data from Bible.api is not cleaned !!!] ===

            //=== Filtering all English Bibles Remove all the duplicate entry ===

            const set = new Set();

            let engBible = data.filter(entry =>{
                if(entry.language.name == 'English' && !set.has(entry.dblId)){
                    set.add(entry.dblId);
                    return true;
                }
            });


            res.render('index', { bbData: JSON.stringify(engBible)});
        })
        .catch(err => console.log(err))
});

//port
const PORT = process.env.port || 5000;

app.listen(PORT, () => {
    console.log('Listening to port 5000')
});