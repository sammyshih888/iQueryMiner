const fs = require('fs');

let rawdata = fs.readFileSync('lc_1625638907932_final.json');
let docinfo = JSON.parse(rawdata);

doc_name_list = [];
for (docKey in docinfo[2]) {
    // console.log(docKey);
    doc_name_list.push(docKey);
}

// ============================
// ====== name,id map =========
// ============================

doc_name_list.sort();
var name_id_map = {};
var id = 0;
for (const name of doc_name_list) {
    console.log(id + " ==> " + name);
    name_id_map[name] = id;
    id++;
}

// ===========================
var count_data = [];
for (let ir = 0; ir < id; ir++) {
    for (let ic = 0; ic < id; ic++) {
        if (ic == 0) {
            count_data[ir] = [];
        }
        count_data[ir].push(0)
    }
}

// console.log(count_data);

//count co-occurance
let tid = 0;
for (let term_docs of docinfo[3]) {
    for (let i = 0; i < term_docs.length; i++) {
        for (let j = i + 1; j < term_docs.length; j++) {
            let d1 = name_id_map[term_docs[i]];
            let s1 = docinfo[2][term_docs[i]]['freq']['w' + tid];

            let d2 = name_id_map[term_docs[j]];
            let s2 = docinfo[2][term_docs[j]]['freq']['w' + tid];
            // count_data[d1][d2]++;
            // count_data[d2][d1]++;

            let sum = s1 + s2;
            count_data[d1][d2] += sum;
            // count_data[d1][d2] += sum;

        }
    }
    tid++;
}

// ===========================
// write to csv file
// ===========================

// header
var str_data = ',';
for (let i = 0; i < id; i++) {
    str_data += (',' + i);
}
str_data += '\n';
// data
for (let i = 0; i < count_data.length; i++) {
    str_data += i + ',';
    for (let j = 0; j < count_data[i].length; j++) {
        str_data += (',' + count_data[i][j]);
    }
    str_data += '\n';
}
fs.writeFileSync('lc_1625638907932_final.csv', str_data);