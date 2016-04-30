const cids = require('../lib/parse-chise-ids.js');
const defs = cids.parseDirectory('test/data', true);
if(defs.size !== 198)
    process.exit(1);