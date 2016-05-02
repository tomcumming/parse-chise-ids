const assert = require('assert');
const cids = require('../lib/parse-chise-ids.js');
const defs = cids.parseDirectory('test/data', true);
if(defs.size !== 198)
    process.exit(1);

const chise_name_cases = [
    { src: '不', target: 'U+4E0D' },
    { src: '𨀉', target: 'U-00028009' },
    { src: '𨰹', target: 'U-00028C39' }
];

chise_name_cases.forEach(tc => {
    assert.deepStrictEqual(cids.chiseName(tc.src), tc.target);
});