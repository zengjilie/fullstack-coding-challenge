const express = require('express');
const bible = require('./tools/bible.js');
const getVerse = require('./tools/verseGenerator.js');
const axios = require('axios');
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

app.get('/:bibleId/books/:bookId', async (req, res) => {
    const { bibleId, bookId } = req.params;
    const response = await bible.get(`/${bibleId}/books/${bookId}/chapters`);
    const response2 = await bible.get(`/${req.params.bibleId}`);

    const chapters = response?.data?.data;
    const bibleVersion = response2?.data?.data.abbreviation;//string

    // console.log(chapters);

    res.render('chapters', { chapters, version: bibleVersion, bookId });
})

app.get('/:bibleId/chapters/:chapterId', async (req, res) => {
    const { bibleId, chapterId } = req.params;
    const response = await bible.get(`/${bibleId}/chapters/${chapterId}?content-type=json`);
    const response2 = await bible.get(`/${bibleId}/chapters/${chapterId}/verses?content-type=json`);
    const response3 = await bible.get(`/${req.params.bibleId}`);

    const chapterContent = response?.data?.data;
    const { bookId, number } = chapterContent;
    const totalVerses = response2?.data?.data;
    const bibleVersion = response3?.data?.data.abbreviation;
    console.log(chapterContent);

    const paragraphs = [];
    chapterContent.content.forEach(e => {
        let curPara = '';
        e.items.forEach(entry => {
            if (entry.type === 'tag') {
                curPara += entry.items[0].text + ' ';
            } else if (entry.type === 'text') {
                curPara += entry.text;
            }
        })
        paragraphs.push(curPara);
    })


    // res.json(totalVerses);

    res.render('verses', { paragraphs, totalVerses, version: bibleVersion, bookId, number });
})

//port
const PORT = process.env.port || 5000;

app.listen(PORT, () => {
    console.log('Listening to port 5000')
});