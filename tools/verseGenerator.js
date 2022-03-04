const bible = require('./bible.js');
const bibleCount = require('./bibleCounts.json');


const BIBLE_ID = '685d1470fe4d5c3b-01';

const VERSES = [
    ...bibleCount.map(e=>{abbr:e.abbr, )
];

console.log(VERSES);

const verseIndex = new Date().getDate();
console.log(verseIndex);

const verseID = VERSES[verseIndex];

const getVerse = () => {
    const url = `/${BIBLE_ID}/search?query=${verseID}`;
    bible.get(url)
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
}