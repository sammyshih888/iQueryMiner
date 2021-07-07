const fetch = require("node-fetch");
var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
const { listenerCount } = require("events");
const htmlparser2 = require("htmlparser2");

const winkNLP = require('wink-nlp');
const its = require('wink-nlp/src/its.js');
const as = require('wink-nlp/src/as.js');
const model = require('wink-eng-lite-model');
const nlp = winkNLP(model);

var nlptool = require('wink-nlp-utils');

//-------- Global Variable --------//

var dataMap = []; // category , link-list


//----------- Functions -----------//

function readFromSourceList() {

    // create output folder
    var dir = './lc_'+new Date().getTime();
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    fs.readFile('specificSourceList.txt', function (err, data) {
        if (err) throw err;

        var currentCategory;
        var lines = data.toString().split('\n');
        var fileNum = 1;
        for (let line of lines) {
            // console.log(line.trim());
            line = line.trim();
            if (line.startsWith("https://") || line.startsWith("http://")) {
                dataMap[currentCategory].push(line);
                currentCategory.replace(/\s/g, '');
                checkIfNewContent(line, dir+'/'+currentCategory + "File_" + fileNum+ ".json");
                fileNum++;
            }else if(line.length == 0) {
                continue;
            }else{
                dataMap[line] = [];
                currentCategory = line;
                fileNum = 1;
            }
            // console.log('\n--------\n');
        }

    });
}

function nlpFilter(content) {
    const doc = nlp.readDoc(content);

    var stopWordArr = doc.tokens().out(its.stopWordFlag, as.array);
    var typeArr = doc.tokens().out(its.type, as.array);
    var posArr = doc.tokens().out(its.pos, as.array);
    var tksArr = doc.tokens().out(its.value, as.array);
    var stemArr = nlptool.tokens.stem(tksArr);
    var tksFrqArr = doc.tokens().out(its.value, as.freqTable);

    var uniqueStems = [];
    stemArr.forEach(element => {
        if (uniqueStems.indexOf(element) < 0) {
            uniqueStems.push(element);
        }
    });
    var finalElts = [];
    uniqueStems.forEach(elt => {
        finalElts.push({ 'stem': elt, 'items': [], 'total': 0 })
    });


    for (var tf of tksFrqArr) {
        var i = tksArr.indexOf(tf[0]);
        if (i >= 0 && stopWordArr[i] == false && typeArr[i] == 'word') {
            if (posArr[i] == 'CCONJ' || posArr[i] == 'SCONJ' || posArr[i] == 'ADP' || posArr[i] == 'INTJ' || posArr[i] == 'PRON' || posArr[i] == 'PART') {
                //finalElts.splice(i,1);
                continue;
            }
            tf.push(typeArr[i]);
            tf.push(posArr[i]);
            // tf : term , frq , type , pos
            // if( tf[0]=="’s" || tf[0]=="’S"){
            //     console.log(tf[0]+"===>"+posArr[i])
            // }

            var targetIdx = uniqueStems.indexOf(stemArr[i]);

            finalElts[targetIdx]['items'].push(tf[0]);
            finalElts[targetIdx]['items'].push(tf[1]);
            finalElts[targetIdx]['total'] += tf[1];

            console.log();
            console.log(finalElts[targetIdx]) ;
            console.log();

        }
    }

    for(var i = 0; i < finalElts.length; i++){
        if(finalElts[i]['total']==0){
            finalElts.splice(i,1);
            i--;
        }
    }

    
    return finalElts;
}

function generatePseudoContext(termInfo){

    var text="";
    for(var i = 0; i < termInfo.length; i++){
        for(var j = 0; j < termInfo[i]['total']; j++){
            text = text+ " " + termInfo[i]['stem'];
        }
    }
    return text;
}

function writeToFile(filename, content, link) {
    //preprocess--------------
    var termInfo = nlpFilter(content);
    var psContext = generatePseudoContext(termInfo);

    //
    var info={
        'url':link,
        'terms':termInfo,
        'body':psContext, //pseudoContext
        'title':""
    };

    var text = JSON.stringify(info);
    fs.writeFile(filename, text, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Write operation complete.');
        }
    });
}

function checkIfNewContent(rssUrl, filename) {
    // console.log("background.js --> " + new Date());
    fetch(rssUrl).then((res) => {
        res.text().then((plainxml) => {
            var simplifiedText = "";
            // use html2 parser https://www.npmjs.com/package/htmlparser2
            const parser = new htmlparser2.Parser({
                onopentag(name, attributes) { },
                ontext(text) {
                    this.text = text;
                },
                onclosetag(tagname) {

                    if (tagname === "p" || tagname === "h1"|| tagname === "h2"|| tagname === "h3"|| tagname === "h4"|| tagname === "h5") {
                        simplifiedText = simplifiedText + this.text;
                    }
                },
            });
            parser.write(plainxml);
            parser.end();


            writeToFile(filename, simplifiedText, rssUrl);

        })
    });

}

//------------ =.= ------------//


readFromSourceList();