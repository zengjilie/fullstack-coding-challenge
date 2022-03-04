const verseData = require('./bibleCounts.json');//total 66 books
const axios = require('axios');

const getVerse = async () => {
    // Public API
    const baseURL = 'https://labs.bible.org/api/?passage=';

    //Use Today's date 
    const random = new Date().getDate() - 1;

    const book = verseData[random];
    // console.log(book);

    const bookName = book.abbr;
    const bookChapterNum = book.chapters.length;
    const randomChapter = book.chapters[bookChapterNum > random ? random : random % bookChapterNum];

    const chapter = randomChapter.chapter;
    const verses = randomChapter.verses;

    const url = baseURL + bookName + ' ' + chapter + ':' + verses + '&type=json&formatting=para';
    const { data: response } = await axios.get(url)

    return response;
}

module.exports = getVerse;