const express = require("express");
const bible = require("./bible.js");
const getVerse = require("./verseGenerator.js");
const axios = require("axios");
const { resolveInclude } = require("ejs");
const app = express();
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

        const { data } = response.data;
        //=== [Data from Bible.api is not cleaned !!!] ===

        //=== Filtering all English Bibles Remove all the duplicate entry ===

        const set = new Set();

        let engBible = data.filter((entry) => {
            if (entry.language.name == "English" && !set.has(entry.dblId)) {
                set.add(entry.dblId);
                return true;
            }
        });
        //=== VerseOfDay ===
        try {
            let verse = await getVerse();
            const text = verse[0].text.replace("</p>", ""); // remove </p> in text string
            verse[0].text = text;

            res.send({ bibles: engBible, verse: verse[0] });
        } catch (err) {
            // console.log(err);
            res.send("err");
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/:bibleId", async (req, res) => {
    try {
        const response = await bible.get(
            `/${req.params.bibleId}/books?include-chapters=true`
        );
        const response2 = await bible.get(`/${req.params.bibleId}`);

        const books = response.data.data; //array
        const version = response2.data.data; //string

        // console.log(books);

        res.send({ books, version });
    } catch (err) {
        console.log(err);
        res.send("books");
    }
});

app.get("/:bibleId/books/:bookId", async (req, res) => {
    const { bibleId, bookId } = req.params;
    try {
        const response = await bible.get(
            `/${bibleId}/books/${bookId}/chapters`
        );
        const response2 = await bible.get(`/${req.params.bibleId}`);

        const chapters = response.data.data;
        const bibleVersion = response2.data.data.abbreviation; //string

        // console.log(chapters);

        res.send({ chapters, version: bibleVersion, bookId });
    } catch (err) {
        // console.log(err);
        res.send("err");
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

        const chapterContent = response.data.data;
        const { bookId, number } = chapterContent;
        const totalVerses = response2.data.data;
        const bibleVersion = response3.data.data.abbreviation;

        const paragraphs = []; //verses organized by paragraph
        const singleVerses = []; //single verses

        //Concatenate verse to paragraph
        chapterContent.content.forEach((e) => {
            let curPara = "";
            e.items.forEach((entry) => {
                let curVerse = "";
                if (entry.type === "tag") {
                    curPara += entry.items[0].text + " ";
                } else if (entry.type === "text") {
                    curPara += entry.text;
                    curVerse += entry.text;
                    singleVerses.push(curVerse);
                }
            });
            paragraphs.push(curPara);
        });

        // console.log(singleVerses);
        // res.json(totalVerses);
        res.send({
            paragraphs,
            totalVerses,
            version: bibleVersion,
            bookId,
            number,
            singleVerses,
        });
    } catch (err) {
        res.send("err");
    }
});

app.get("/:bibleId/verses/:verseId", async (req, res) => {
    const { bibleId, verseId } = req.params;
    const verse = response.data.data;
    try {
        const response = await bible.get(`/${bibleId}/verses/${verseId}`);
        res.json(verse);
    } catch (err) {
        res.json("err");
    }
    // console.log(verse);
});

app.get("/:bibleId/search", async (req, res) => {
    const { query } = req.query;
    const { bibleId } = req.params;
    try {
        const response = await bible.get(
            `/${bibleId}/search?query=${query}&limit=100&sort=relevance`
        );
        const results = response.data.data;
        res.send({ results, bibleId });
    } catch (err) {
        res.send({ bibleId });
    }
    // console.log(results);
    // res.json(results);
});

module.exports = app;