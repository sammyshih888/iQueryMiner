// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import {
    getDatabase,
    ref,
    child,
    get,
    set,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAR61OMax3cXpU8d90K9Q-ZpxACLKh7khc",
    authDomain: "iquery-3a94d.firebaseapp.com",
    databaseURL: "https://iquery-3a94d-default-rtdb.firebaseio.com",
    projectId: "iquery-3a94d",
    storageBucket: "iquery-3a94d.appspot.com",
    messagingSenderId: "484882782214",
    appId: "1:484882782214:web:d2279fcf807704c6a5cb87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase();
const dbRef = ref(getDatabase());


console.log('getData ==> ');
get(child(dbRef, `test_log`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            let docs = snapshot.val();
            let totalDoc = 0;
            for (let it in docs) {
                //console.log(it+"==>"+docs[it].length+"--->"+totalDoc);
                if (docs[it].length != undefined) {
                    totalDoc += docs[it].length;
                }
            }

            check(totalDoc);
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
    });


function writeToDB(data, preDocNums) {
    let d = new Date();
    let st = d.getTime();
    let ymd =
        d.getFullYear() +
        "_" +
        (d.getMonth() + 1) +
        "_" +
        d.getDate() + "_" + st;
    set(ref(database, `test_log/${ymd}`), data);
    let totalCount = preDocNums + data.length;
    console.log("totalCount : " + totalCount);
    set(ref(database, `test_log/info`), { total: totalCount });
}

function check(preDocNums) {

    console.log('start content.js ...preDocNums:' + preDocNums);

    let url = window.location.href;
    //console.log('>> site:' + url);

    let total = 0;

    if (url.indexOf('google.com/search') >= 0) {
        // google search

        let titles = document.getElementsByTagName('h3');
        let data = [];
        for (let it of titles) {

            console.log('||----- ' + it.textContent);
            let link = it.parentElement.href;
            // skip undefined link
            if (link == undefined) {
                continue;
            }
            console.log('   ||===>> ' + link);

            let top = it.parentElement.parentElement.parentElement.parentElement;
            let spans = top.getElementsByTagName('span');
            for (let spit of spans) {
                if (spit.textContent == undefined || spit.textContent.length < 25) {
                    // skip short context : advertisment , store
                    continue;
                }
                console.log('   ||===>> span : ' + spit.textContent.length + " : " + spit.textContent);
                data.push({
                    title: it.textContent,
                    url: link,
                    abstract: spit.textContent
                });
                break;
            }
        }
        console.log('\n\n');
        console.log(data);
        writeToDB(data, preDocNums);
        total = preDocNums;
        if (data.length != undefined) {
            total += data.length;
        }

    } else {
        // others
        let ps = document.getElementsByTagName('p');
        for (let it of ps) {
            console.log('   ===>> ' + it.textContent);
        }
    }

    // generate html content
    var html_content = `<div class="mypanel">    
    <div class="box box-down cyan">
      <h2>iQuery</h2>
      <p>links：<b>${total}</b></p>
      <img src="https://assets.codepen.io/2301174/icon-supervisor.svg" alt="">
    </div>
  </div>`;

    var bdy = document.getElementsByTagName('body')[0];

    // console.log( html_content ) ;
    //console.log('---------') ;
    //console.log(bdy.innerHTML) ;
    bdy.innerHTML = bdy.innerHTML + html_content;


    console.log('end content.js !');
}



