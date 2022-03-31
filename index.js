const express = require("express");
const bible = require("./tools/bible.js");
const getVerse = require("./tools/verseGenerator.js");
const axios = require("axios");
const { resolveInclude } = require("ejs");
const app = express();
require('dotenv').config();

// const buildStyles = require('./tools/gulpfile.js');
// buildStyles();// comment this line if not in dev environment

//Set View Engine
app.set("view engine", "ejs");
//MW
app.use(express.json());
app.use(express.static("public"));

//Routes
app.get("/", async (req, res) => {
    try {
        const response = await bible.get("");

        const { data } = response?.data;

        //=== [Data from Bible.api is not cleaned !!!] ===

        //=== Filtering all English Bibles Remove all the duplicate entry ===

        const set = new Set();

        let engBible = data.filter((entry) => {
            if (entry.language.name == "English" && !set.has(entry.dblId)) {
                set.add(entry.dblId);
                return true;
            }
        });

        // console.log(engBible);

        //=== VerseOfDay ===

        try {
            let verse = await getVerse();
            const regex = /<(“[^”]*”|'[^’]*’|[^'”>])*>/g;
            const text = verse[0].text.replace(regex, ""); // remove </p> in text string
            verse[0].text = text;
            res.render("home", { bibles: engBible, verse: verse[0] });
        } catch (err) {
            res.render("home", { bibles: [], verse: {} });
            console.log('error verse', err);
        }
    } catch (err) {
        console.log('error bible',err);
    }
});

app.get("/:bibleId", async (req, res) => {
    try {
        const response = await bible.get(
            `/${req.params.bibleId}/books?include-chapters=true`
        );
        const response2 = await bible.get(`/${req.params.bibleId}`);

        const books = response?.data?.data; //array
        const version = response2?.data?.data; //object

        // console.log(version);
        // res.json(version);
        // console.log(books);
        res.render("books", { books, version });
    } catch (err) {
        res.render("home", { bibles: [], verse: {} });
    }
});

app.get("/:bibleId/books/:bookId", async (req, res) => {
    const { bibleId, bookId } = req.params;
    try {
        const response = await bible.get(
            `/${bibleId}/books/${bookId}/chapters`
        );
        const response2 = await bible.get(`/${req.params.bibleId}`);

        const chapters = response?.data?.data;
        const bibleVersion = response2?.data?.data?.abbreviationLocal; //string

        // console.log(chapters);

        res.render("chapters", { chapters, version: bibleVersion, bookId });
    } catch (err) {
        // console.log(err);
        res.render("home", { bibles: [], verse: {} })
    }
});

app.get("/:bibleId/chapters/:chapterId", async (req, res) => {
    const { bibleId, chapterId } = req.params;
    try {
        const response = await bible.get(
            `/${bibleId}/chapters/${chapterId}?content-type=json`
        );
        const response2 = await bible.get(
            `/${bibleId}/chapters/${chapterId}/verses?content-type=json`
        );
        const response3 = await bible.get(`/${req.params.bibleId}`);

        const chapterContent = response?.data?.data;
        const { bookId, number } = chapterContent;
        const totalVerses = response2?.data?.data;
        const bibleVersion = response3?.data?.data?.abbreviationLocal;

        const paragraphs = []; //verses organized by paragraph
        let singleVerses = []; //single verses

        //Concatenate verse to paragraph
        chapterContent.content.forEach((e) => {
            let curPara = "";
            let curVerse = "";


            //some paragraphs has no verse, need to data cleaning
            for (let i = 0; i < e.items.length; i++) {
                const entry = e.items[i];
                if (entry.type === 'tag') {
                    if (entry.name === 'verse') {
                        singleVerses.push(curVerse);
                        curVerse = '';
                        curVerse += entry.items[0].text + ' ';
                    } else if (entry.name === 'char') {
                        curVerse += entry.items[0].text;
                    }
                    curPara += entry.items[0].text + ' ';
                } else if (entry.type === 'text') {
                    curVerse += entry.text;
                    curPara += entry.text;
                }
            }
            singleVerses.push(curVerse);
            paragraphs.push(curPara);

        });

        singleVerses = singleVerses.filter(e => e !== '' && e.charAt(0) >= '0' && e.charAt(0) <= '9');

        // res.json(singleVerses);
        // res.json(chapterContent) ;
        res.render("verses", {
            paragraphs,
            totalVerses,
            version: bibleVersion,
            bookId,
            number,
            singleVerses,
        });
    } catch (err) {
        console.log(err);
        res.render("home", { bibles: [], verse: {} });
    }
});

app.get("/:bibleId/verses/:verseId", async (req, res) => {
    const { bibleId, verseId } = req.params;
    const response = await bible.get(`/${bibleId}/verses/${verseId}`);
    const verse = response?.data?.data;
    res.json(verse);
    // console.log(verse);
});

app.get("/:bibleId/search", async (req, res) => {
    const { query } = req.query;
    const { bibleId } = req.params;
    try {
        const response = await bible.get(
            `/${bibleId}/search?query=${query}&limit=100&sort=relevance`
        );
        const results = response?.data?.data;
        res.render("search", { results, bibleId });
    } catch (err) {
        res.render("home", { bibles: [], verse: {} });
    }
    // console.log(results);
    // res.json(results);
});

//port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Listening to port", PORT);
});
