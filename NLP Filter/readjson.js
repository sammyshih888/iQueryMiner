const path = require('path');
const fs = require('fs');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
//joining path of directory 
const directoryPath = '/Users/samantha/Documents/GitHub/iQueryMiner/NLP Filter/jsFiles'
var jsonfiles = [];
var totalDocs = 0 ;
var done = false;
var documentData = [];

// Load wink-bm25-text-search
var bm25 = require('./wink-bm25-text-search');
// Create search engine's instance
var engine = bm25();
// Load NLP utilities
var nlp = require('wink-nlp-utils');
const containedMarkings = require('wink-nlp/src/contained-markings');

var pipe = [
    nlp.string.lowerCase,
    nlp.string.tokenize0,
    nlp.tokens.removeWords,
    nlp.tokens.stem,
    nlp.tokens.propagateNegations
];
// Contains search query.
// Step I: Define config
// Only field weights are required in this example.
engine.defineConfig({ fldWeights: { title: 1, body: 2 } });
// Step II: Define PrepTasks pipe.
// Set up 'default' preparatory tasks i.e. for everything else
engine.definePrepTasks(pipe);


//passsing directoryPath and callback function
fs.readdir(directoryPath,
    function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach

        for (const f of files) {
            console.log(f);
            if (f.endsWith('.json')) {
                console.log('=====> parsing json')
                jsonfiles.push(path.join(directoryPath, f));
            }
        }
        done = true;
    });


function calResult() {
    console.log('calResult ==> engine totalDocs : '+totalDocs );
    if (totalDocs == 50) {
        // Step IV: Consolidate
        // Consolidate before searching
        engine.consolidate();

        result = engine.exportJSON();
        console.log('\n\n\n');
        console.log(result);
    } else {

        setTimeout(() => {
            calResult()
        }, 100);

    }


}

function check_work() {
    console.log("check work.... ")
    if (done) {
        // Define preparatory task pipe!


        // Step III: Add Docs
        // Add documents now...
        jsonfiles.forEach(jf => {
            fs.readFile(jf, (err, data) => {
                if (err) throw err;
                let example = JSON.parse(data);
                console.log('add : '+jf) ;
                //console.log(example);
                documentData.push(example);
                engine.addDoc(example, jf);
                totalDocs++;
            });
        });

        setTimeout(() => {
            calResult()
        }, 100);

    } else {
        setTimeout(() => {
            check_work()
        }, 100);
    }
}
// timer
setTimeout(() => {
    check_work()
}, 100);