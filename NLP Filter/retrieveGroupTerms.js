const fs = require('fs');

let docRelatedInfo = fs.readFileSync('./retrieveGroupTerms/lc_1625638907932_doc_rel.json');
docRelatedInfo = JSON.parse(docRelatedInfo);
let docFeatures = fs.readFileSync('./retrieveGroupTerms/lc_1625638907932_final.json');
docFeatures = JSON.parse(docFeatures);

var docs_info = docFeatures[2];
var term_info = docFeatures[3];

let words = [];
for(let word in docFeatures[5]){
    words[docFeatures[5][word]] = word;
}

let data = [];

var groups_set = new Set(); //1:(7) [17, 19, 18, 13, 14, 10, 16]
for( let i of [7, 8, 6, 2, 4, 3, 0])
    groups_set.add(  docRelatedInfo['index_doc'][i]);

const count_type = 'real_score'; // real_score , doc_unit
for (let tid = 0; tid < term_info.length; tid++) {
    let docs_of_some_term = term_info[tid];
    // docs_of_some_term => term1 : [doc1 , doc2 , doc3 , ....]
    let count = 0;
    for (let i = 0; i < docs_of_some_term.length; i++) {
        if(groups_set.has(docs_of_some_term[i])){

            let score = docs_info[docs_of_some_term[i]]['freq']['w'+tid] ;
            count += score ;
            //count++;
        }
    }
    if(count>0){
        data.push({
            'word':words[tid],
            'tid':tid
            ,'c':count
        });
    }
}

data.sort(function (a,b) {
    return a.c > b.c ? -1:1 ;
})

console.log(data);