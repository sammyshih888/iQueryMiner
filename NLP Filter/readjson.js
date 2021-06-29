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

    var max_index = 4394;
    if (totalDocs == 50) {
        // Step IV: Consolidate
        // Consolidate before searching
        engine.consolidate();

        result = engine.exportJSON();
        resultObj = JSON.parse(result);

        // termid : word
        var termsMap = [] ;
        for (const key in resultObj[5]) {
            termsMap[ resultObj[5][key]] = key;
        }


        for (const doc_name in resultObj[2]) {
            console.log('doc name :'+doc_name) ;
            var terms = resultObj[2][doc_name]['freq'];
            var new_terms={};
            var show_terms=[];
            for(let tid=0 ; tid<max_index ; tid++){
                if(terms[tid]==null){
                    new_terms["w"+tid] = 0 ;
                }else{
                    new_terms["w"+tid] = terms[tid] ;
                    show_terms.push({ 'w':termsMap[tid],'s':terms[tid]});
                }
            }

            resultObj[2][doc_name]['freq']=new_terms;
            // for (const term_id in terms) {
            //     console.log( term_id+" : "+terms[term_id]) ;
            // }
            //console.log(new_terms) ;

            show_terms = show_terms.sort(function (a,b) {
                // console.log(a.s) ;
                // console.log(b.s) ;
                if(a.s>b.s){
                    return -1 ;
                }else if(a.s<b.s){
                    return 1 ;
                }else{
                    return 0 ;
                }
            });

            let st = '';
            for (const item of show_terms) {
                //st+=item.w+':'+item.s+" " ;
                st+=item.w + " ";
            }
            console.log(st+"\n\n");

        }
        result = JSON.stringify(resultObj) ;
        console.log('\n\n\n');
        //console.log(result);
        fs.writeFile("final.json", result, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Write operation complete.');
            }
          });
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
                jf = jf.substring(jf.lastIndexOf('/')+1);
                // console.log('add : '+jf) ;
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