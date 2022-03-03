const add = require('./functions.js');

test('Add 2 + 2 equals 4', () => {
    expect(add(2, 2)).toBe(4);
})
