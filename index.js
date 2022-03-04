const express = require('express');
const bible = require('./tools/bible.js');
const getVerse = require('./tools/verseGenerator.js');
const app = express();

//Set View Engine
app.set('view engine', 'ejs');

//MW
app.use(express.json());
app.use(express.static('public'));


//Routes
app.get('/', async (req, res) => {
    const response = await bible.get('')

    const { data } = response.data;

    //=== [Data from Bible.api is not cleaned !!!] ===

    //=== Filtering all English Bibles Remove all the duplicate entry ===

    const set = new Set();

    let engBible = data.filter(entry => {
        if (entry.language.name == 'English' && !set.has(entry.dblId)) {
            set.add(entry.dblId);
            return true;
        }
    });
    //=== VerseOfDay===
    const verse = await getVerse();
    res.render('index', { bbData: JSON.stringify(engBible),verse:verse[0] });
});

//port
const PORT = process.env.port || 5000;

app.listen(PORT, () => {
    console.log('Listening to port 5000')
});