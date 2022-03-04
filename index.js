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

    const { data } = response?.data;

    //=== [Data from Bible.api is not cleaned !!!] ===

    //=== Filtering all English Bibles Remove all the duplicate entry ===

    const set = new Set();

    let engBible = data?.filter(entry => {
        if (entry.language.name == 'English' && !set.has(entry.dblId)) {
            set.add(entry.dblId);
            return true;
        }
    });

    //=== VerseOfDay===
    const verse = await getVerse();
    res.render('index', { bbData: JSON.stringify(engBible), verse: verse[0] });
});

app.get('/:bibleId', async (req, res) => {
    const response = await bible.get(`/${req.params.bibleId}/books?include-chapters=true`);
    const response2 = await bible.get(`/${req.params.bibleId}`);

    const books = response?.data?.data;//array
    const version = response2?.data?.data;//string

    console.log(books);

    res.render('books', { books, version });
})

app.get('/:bibleId/:bookId',async(req, res)=>{
    const {bibleId, bookId} = req.params;
    const response = await bible.get(`/${bibleId}/books/${bookId}/chapters`);
    const response2 = await bible.get(`/${req.params.bibleId}`);

    const chapters = response?.data?.data;
    const version = response2?.data?.data.abbreviation;//string

    // console.log(chapters);
    console.log(version);

    res.render('chapters',{chapters, version, book:bookId});
})

//port
const PORT = process.env.port || 5000;

app.listen(PORT, () => {
    console.log('Listening to port 5000')
});