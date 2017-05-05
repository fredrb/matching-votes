'use strict';

let match = require('./matching.js');
let data = require('./' + process.argv[2]);

let matches = match(data.mentors, data.mentees);

console.log("Suggestions");
matches.slice(0,25).forEach(m => {
    console.log("-----------------");
    console.log(`Match: ${m.match.map((v) => ` ${v.mentor} and ${v.mentee}`)}`);
    console.log(`Score: ${m.score}`);
});


