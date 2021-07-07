const path = require('path');
const fs = require('fs');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
//joining path of directory 
var directoryPath = '/Users/samantha/Documents/GitHub/iQueryMiner/NLP Filter/jsFiles2'
var jsonfiles = [];
var totalDocs = 0;

// Load wink-bm25-text-search
var bm25 = require('./wink-bm25-text-search');
// Create search engine's instance
var engine = bm25();
// Load NLP utilities
var nlp = require('wink-nlp-utils');
const containedMarkings = require('wink-nlp/src/contained-markings');
const { dir } = require('console');

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


folders = fs.readdirSync('./');
targets = []
folders.forEach(file => {
    //console.log(file);
    if (file.startsWith("lc_") && fs.statSync(file).isDirectory()) {
        targets.push(file);
    }
});
targets.sort()
// console.log(targets)
directoryPath = targets.pop()
console.log(directoryPath);

jsonfiles = fs.readdirSync(directoryPath);

for (let i = 0; i < jsonfiles.length; i++) {

    let data = fs.readFileSync(directoryPath + '/' + jsonfiles[i]);

    let dataObj = JSON.parse(data);
    engine.addDoc(dataObj, jsonfiles[i]);
    totalDocs++;
}




console.log('calResult ==> engine totalDocs : ' + totalDocs);

engine.consolidate();

result = engine.exportJSON();

fs.writeFile(directoryPath + "_final.json", result, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Write operation complete.');
    }
});





////////////////////////////////////
// doc-terms
////////////////////////////////////


resultObj = JSON.parse(result);
var nTerms = resultObj[4];
var terms = resultObj[5];
var docs = resultObj[2];
// termid : word
var termsMap = [];
for (const key in terms) {
    termsMap[terms[key]] = key;
}
var docTerms = ''
for (const doc_name in docs) {
    console.log('doc name: ' + doc_name);
    docTerms += ('doc name: ' + doc_name + '\n');
    var terms = docs[doc_name]['freq'];
    var new_terms = {};
    var show_terms = [];
    for (let tid = 0; tid < nTerms; tid++) {
        if (terms[tid] == null) {
            new_terms["w" + tid] = 0;
        } else {
            new_terms["w" + tid] = terms[tid];
            show_terms.push({ 'w': termsMap[tid], 's': terms[tid] });
        }
    }

    docs[doc_name]['freq'] = new_terms;
    // for (const term_id in terms) {
    //     console.log( term_id+" : "+terms[term_id]) ;
    // }
    //console.log(new_terms) ;

    show_terms = show_terms.sort(function (a, b) {
        // console.log(a.s) ;
        // console.log(b.s) ;
        if (a.s > b.s) {
            return -1;
        } else if (a.s < b.s) {
            return 1;
        } else {
            return 0;
        }
    });

    let st = '';
    for (const item of show_terms) {
        //st+=item.w+':'+item.s+" " ;
        st += item.w + " ";
    }
    console.log(st + "\n\n");
    docTerms += (st + '\n\n');


}

fs.writeFile(directoryPath + "_docTerms.txt", docTerms, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Write operation complete.');
    }
});
