const verseData = require('./bibleCounts.json');//total 66 books
const axios = require('axios');

const getVerse = async () => {
    // Public API
    const baseURL = 'https://labs.bible.org/api/?passage=';
    const verseId = [
        'Romans 8:38-39',
        'Lamentations 3:22-23',
        '2 Corinthians 4:16-18',
        'John 15:13',
        'Ephesians 3:20',
        'Deuteronomy 31:6',
        'Psalm 27:12',
        'John 4:18',
        'Romans 8:31',
        'Romans 15:13',
        'Psalm 31:24',
        'Isaiah 41:10',
        'Isaiah 40:31',
        'Mark 10:27',
        '1 Peter 5:7',
        'Matthew 19:26',
        'Philippians 4:13',
        '1 Corinthians 15:58',
        'Proverbs 3:3-6',
        '1 Corinthians 16:13-14',
        'Matthews 17:20',
        'Psalm 107:1',
        'Jeremiah 29:11',
        'Psalm 34:8',
        'Romans 8:28',
        'Nehemiah 8:10',
        'Psalm 96: 1-3',
        'Proverbs 29:25',
        'Isaiah 66:13',
        'Proverbs 31:2',
    ];
    //Use Today's date 
    const random = new Date().getDate() - 1;
    const url = baseURL + verseId[random] + '&type=json&formatting=para';
    const { data: response } = await axios.get(url)

    console.log(response);
    return response;
}
module.exports = getVerse;