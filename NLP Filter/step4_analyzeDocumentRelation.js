const fs = require('fs');


// ============================
// variables
// ============================
let input_name = 'lc_1625638907932_final.json';
// result json file 
let output_json_fname = input_name.replace('final.json', 'doc_rel.json');
let output_json = {};
// cooccur file : csv file(co-occurance) for 3d charts
let output_csv_fname = input_name.replace('final.json', 'doc_rel.csv');


let docs_info;
let terms_info;

let doc_name_list = [];
let name_id_map = {};
let doc_grp = [];
let all_grps = [];

// co-occurence terms
var cooccur_table = [];
const count_type = 'real_score'; // real_score , doc_unit

let pairs_score = [];

function read_docfeatures(fname) {
    let rawdata = fs.readFileSync(input_name);
    rawdata = JSON.parse(rawdata);
    docs_info = rawdata[2];
    terms_info = rawdata[3];
}

function prepare_data_structure() {

    for (doc_name in docs_info) {
        // console.log(docKey);
        doc_name_list.push(doc_name);
        doc_grp.push(null);
    }

    // ============================
    // ====== name,id map =========
    // ============================
    doc_name_list.sort();
    for (let id = 0; id < doc_name_list.length; id++) {
        name_id_map[doc_name_list[id]] = id;
        //console.log(id + " ==> " + name);
    }
    output_json['index_doc'] = doc_name_list;
}

function build_cooccur_table() {
    let doc_size = doc_name_list.length;
    for (let ir = 0; ir < doc_size; ir++) {
        for (let ic = 0; ic < doc_size; ic++) {
            if (ic == 0) {
                cooccur_table[ir] = [];
            }
            cooccur_table[ir].push(0)
        }
    }
    for (let tid = 0; tid < terms_info.length; tid++) {
        let docs_of_some_term = terms_info[tid];
        // docs_of_some_term => term1 : [doc1 , doc2 , doc3 , ....]
        for (let i = 0; i < docs_of_some_term.length; i++) {
            for (let j = i + 1; j < docs_of_some_term.length; j++) {

                let d1 = name_id_map[docs_of_some_term[i]];
                let s1 = docs_info[docs_of_some_term[i]]['freq']['w' + tid];

                let d2 = name_id_map[docs_of_some_term[j]];
                let s2 = docs_info[docs_of_some_term[j]]['freq']['w' + tid];

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
                    cooccur_table[d1][d2] += score;
                else
                    cooccur_table[d2][d1] += score;
            }
        }
    }

    output_json['doc_rel_matrix'] = {
        'count_type': count_type,
        'matrix': cooccur_table
    };
}

function get_docs_pair_rank() {

    // ===========================
    // sort by pair-distance
    // ===========================

    for (let i = 0; i < cooccur_table.length - 1; i++) {
        for (let j = i + 1; j < cooccur_table[i].length; j++) {
            pairs_score.push({
                doc_a: i,
                doc_b: j,
                score: cooccur_table[i][j]
            });
        }
    }

    // sort
    pairs_score.sort(function(a, b) {
        return a.score > b.score ? -1 : 1;
    });

    // console.log(pairs_score);

}

function aggregate_group() {

    // ===========================
    // aggregate group
    // ===========================
    output_json['groups_info'] = []
    const total_doc_size = doc_name_list.length;

    let pre_g_size = total_doc_size;
    let last_score = -1;
    // add to group
    for (const pairObj of pairs_score) {
        let ga = doc_grp[pairObj.doc_a];
        let gb = doc_grp[pairObj.doc_b];
        if (ga == null && gb == null) {
            // new group
            let ngrp = []
            ngrp.push(pairObj.doc_a);
            ngrp.push(pairObj.doc_b);
            all_grps.push(ngrp);
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
            for (const gt of all_grps) {
                if (gt != ga && gt != gb) {
                    n_grp.push(gt);
                }
            }
            all_grps = n_grp;
        }
        last_score = pairObj.score;

        // ===================================

        let grp_elts = 0;
        for (let g of all_grps) {
            console.log('   -- >' + g);
            grp_elts += g.length;
        }
        let g_size = (total_doc_size - grp_elts) + all_grps.length;
        console.log('group size:' + g_size + "    ==> " + last_score);
        console.log();

        if (g_size != pre_g_size) {
            output_json['groups_info'].push({
                grp_size: g_size,
                grp_score: last_score,
                non_solo_grps: JSON.parse(JSON.stringify(all_grps))
            });
            pre_g_size = g_size;
        }
        // ===================================

    }
}

function output_results() {

    // ===================================
    // write to output json file
    // ===================================
    fs.writeFileSync(output_json_fname, JSON.stringify(output_json));

    // ===================================
    // write to csv file(co-occurance) for 3d charts
    // ===================================

    // header
    var str_data = ',';
    for (let i = 0; i < doc_name_list.length; i++) {
        str_data += (',' + i);
    }
    str_data += '\n';
    // data
    for (let i = 0; i < cooccur_table.length; i++) {
        str_data += i + ',';
        for (let j = 0; j < cooccur_table[i].length; j++) {
            str_data += (',' + cooccur_table[i][j]);
        }
        str_data += '\n';
    }
    fs.writeFileSync(output_csv_fname, str_data);
}

read_docfeatures(input_name);

prepare_data_structure();

build_cooccur_table();

get_docs_pair_rank();

aggregate_group();

output_results();