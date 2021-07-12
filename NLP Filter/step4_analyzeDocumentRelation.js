const fs = require('fs');

let rawdata = fs.readFileSync('lc_1625638907932_final.json');
let bm25_info = JSON.parse(rawdata);
var doc_info = bm25_info[2];
var term_info = bm25_info[3];
doc_name_list = [];
doc_grp = []
for (doc_name in doc_info) {
    // console.log(docKey);
    doc_name_list.push(doc_name);
    doc_grp.push(null);
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


// ============================
//    build co-occurance table
// ============================


var count_data = [];
for (let ir = 0; ir < id; ir++) {
    for (let ic = 0; ic < id; ic++) {
        if (ic == 0) {
            count_data[ir] = [];
        }
        count_data[ir].push(0)
    }
}

const count_type = 'real_score'; // real_score , doc_unit
for (let tid = 0; tid < term_info.length; tid++) {
    let docs_of_some_term = term_info[tid];
    // docs_of_some_term => term1 : [doc1 , doc2 , doc3 , ....]
    for (let i = 0; i < docs_of_some_term.length; i++) {
        for (let j = i + 1; j < docs_of_some_term.length; j++) {

            let d1 = name_id_map[docs_of_some_term[i]];
            let s1 = doc_info[docs_of_some_term[i]]['freq']['w' + tid];

            let d2 = name_id_map[docs_of_some_term[j]];
            let s2 = doc_info[docs_of_some_term[j]]['freq']['w' + tid];

            let score = 0;
            switch (count_type) {
                case 'real_score':
                    score = s1 + s2;
                    break;
                case 'doc_unit':
                    score = 1;
                    break;
            }
            if (d1 < d2)
                count_data[d1][d2] += score;
            else
                count_data[d2][d1] += score;
        }
    }
}

// ===========================
// sort by pair-distance
// ===========================
pairs_score = [];
for (let i = 0; i < count_data.length - 1; i++) {
    for (let j = i + 1; j < count_data[i].length; j++) {
        pairs_score.push({
            doc_a: i,
            doc_b: j,
            score: count_data[i][j]
        });
    }
}

pairs_score.sort(function(a, b) {
    return a.score > b.score ? -1 : 1;
});

// console.log(pairs_score);

// ===========================
// aggregate group
// ===========================
groups = []
last_score = -1;
// add to group
for (const pairObj of pairs_score) {
    let ga = doc_grp[pairObj.doc_a];
    let gb = doc_grp[pairObj.doc_b];
    if (ga == null && gb == null) {
        // new group
        let ngrp = []
        ngrp.push(pairObj.doc_a);
        ngrp.push(pairObj.doc_b);
        groups.push(ngrp);
        doc_grp[pairObj.doc_a] = ngrp;
        doc_grp[pairObj.doc_b] = ngrp;

    } else if (ga != null && gb == null) {
        // add gb to ba
        ga.push(pairObj.doc_b);
        doc_grp[pairObj.doc_b] = ga;
    } else if (ga == null && gb != null) {
        // add ga to gb
        gb.push(pairObj.doc_a);
        doc_grp[pairObj.doc_a] = gb;
    } else if (ga != gb) {
        // merge ga and gb
        // to do ... unfininshed
        let gc = ga.concat(gb);
        let change_list = [];
        for (let i = 0; i < doc_grp.length; i++) {
            if (doc_grp[i] == ga || doc_grp[i] == gb) {
                change_list.push(i);
            }
        }
        for (let i = 0; i < change_list.length; i++) {
            doc_grp[change_list[i]] = gc;
        }
        let n_grp = [];
        n_grp.push(gc);
        for (const gt of groups) {
            if (gt != ga && gt != gb) {
                n_grp.push(gt);
            }
        }
        groups = n_grp;
    }

    last_score = pairObj.score;
    console.log('group size:' + groups.length + "    ==> " + last_score);
    for (let g of groups) {
        console.log('   -- >' + g);
    }
    console.log();

}




// ===================================
// write to csv file for 3d charts
// ===================================

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
fs.writeFileSync('doc_rel_full_score_unit.csv', str_data);;