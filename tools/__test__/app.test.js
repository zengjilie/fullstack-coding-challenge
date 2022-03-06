const { text } = require("express");
const request = require("supertest");
const app = require("../app");

describe("api test", () => {
    jest.setTimeout(300000);
    describe("test homepage api", () => {
        //should respond with 200
        //should get bible array
        //should yield all bibles without duplicates

        test("request homepage, should respond with 200 status code", async () => {
            const response = await request(app).get("/").expect(200);
            expect(response.statusCode).toBe(200);
        });

        test("request homepage, body should contian bibles with type of array", async () => {
            const response = await request(app).get("/");
            expect(response._body.bibles).toBeInstanceOf(Array);
        });

        test("request homepage, returned bibles should not contain any duplicates", async () => {
            const response = await request(app).get("/");
            const bibles = response._body.bibles;

            let duplicate = false;
            const set = new Set();
            bibles.forEach((e) => {
                if (set.has(e)) {
                    duplicate = true;
                } else {
                    set.add(e);
                }
            });

            expect(duplicate).toBe(false);
        });
    });

    describe("fetch all books given bibleId", () => {
        //should fetch all the books given bibleId
        const bibleId = "bba9f40183526463-01"; //BSB
        test("request with bibleId, response body contains books array and version obejct", async () => {
            const response = await request(app).get(`/${bibleId}`);
            expect(response._body.books).toBeInstanceOf(Array);
            expect(response._body.version).toBeInstanceOf(Object);
        });
    });

    describe('fetch all chapters given bibleId and bookId', () => {
        //should fetch all the chapters
        const bibleId = 'bba9f40183526463-01';//BSB
        const bookId = 'GEN';
        test('request with bibeId and bookId, response body contains chapters, version, bookId ', async () => {
            const response = await request(app).get(`/${bibleId}/books/${bookId}`);
            expect(response._body.chapters).toBeInstanceOf(Array);
            expect(response._body.version).toBe('BSB');
            expect(response._body.bookId).toBe('GEN');
        })
    })

    describe('fetch all verses given bibleId and chapterId', () => {
        const bibleId = 'bba9f40183526463-01';//BSB
        const chapterId = 'GEN.1';
        test('request with bibeId and chapterId, response body contains paragraphs, totalVerses , version, boodId,number,singleVerses', async () => {
            const response = await request(app).get(`/${bibleId}/chapters/${chapterId}`);
            expect(response._body.paragraphs).toBeInstanceOf(Array);
            expect(response._body.totalVerses).toBeInstanceOf(Array);
            expect(response._body.version).toBe('BSB');
            expect(response._body.bookId).toBe('GEN');
            expect(response._body.number).toBe('1');
            expect(response._body.singleVerses).toBeInstanceOf(Array);
        })

    })

    describe('fetch search results given bibleId an query string', () => {
        //should fetch all 100 first search results given bibleId and query string
        const bibleId = 'bba9f40183526463-01';//BSB
        const query = 'john';

        test('request with bibeId and query string, response body contains, search results', async () => {
            const response = await request(app).get(`/${bibleId}/search?query=${query}}`);
            expect(response._body.results.verses).toBeInstanceOf(Array);
            expect(response._body.bibleId).toBe(bibleId);
        })
    })
});
