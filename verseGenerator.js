const bible = require('./bible.js');

const BIBLE_ID = '685d1470fe4d5c3b-01';
const VERSES = [
  `JER.29.11`,
  `PSA.23`,
  `1COR.4.4-8`,
  `PHP.4.13`,
  `JHN.3.16`,
  `ROM.8.28`,
  `ISA.41.10`,
  `PSA.46.1`,
  `GAL.5.22-23`,
  `HEB.11.1`,
  `2TI.1.7`,
  `1COR.10.13`,
  `PRO.22.6`,
  `ISA.40.31`,
  `JOS.1.9`,
  `HEB.12.2`,
  `MAT.11.28`,
  `ROM.10.9-10`,
  `PHP.2.3-4`,
  `MAT.5.43-44`,
];
const verseIndex = new Date().getDate();
console.log(verseIndex);

const verseID = VERSES[verseIndex];

const getVerse = ()=>{
    const url = `/${BIBLE_ID}/search?query=${verseID}`;
    bible.get(url)
        .then(response => {
            console.log(response);
        })
        .catch(err =>{
            console.log(err);
        })
}

getVerse();