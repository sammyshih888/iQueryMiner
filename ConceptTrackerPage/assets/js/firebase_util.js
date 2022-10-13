import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
    getDatabase,
    ref,
    child,
    get,
    set,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js";

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
var finallist = [];
function getData() {
    get(child(dbRef, `test_log`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                //console.log(snapshot.val());
                let my_data = snapshot.val();
                let idx = 0;
                for (let datetime in my_data) {
                    idx++;
                    //console.log("date : " + datetime);
                    if (datetime == 'info') {
                        console.log("not iterator==>");
                        console.log(my_data[datetime]);
                        console.log("-------");
                        continue;
                    }
                    let dtime = parseInt(datetime.substr(datetime.lastIndexOf('_') + 1))
                    let rowRoot = document.getElementsByClassName('datatable')[0].getElementsByTagName('tbody')[0];
                    for (let content of my_data[datetime]) {
                        // console.log('content >> ');
                        // console.log(content);
                        content['date'] = dtime;
                        finallist.push(content);

                        //-----
                        let row =
                            `<tr><th scope="row">${new Date(dtime).toLocaleDateString()}</th>
                        <td><a href="${content.url}" class="text-primary" target='blank'>${content.title}</a></td>
                        <td>${content.abstract}</td>
                        
                        <td><span class="badge bg-success">${content.keyword}</span></td>
                      </tr>`;
                        
                        rowRoot.innerHTML = rowRoot.innerHTML + row;
                    }

                    let mm = new Date().getTime() - new Date(dtime).getTime();
                    let ndays = mm / 1000 / 86400;
                    let tags = ['text-success', 'text-danger', 'text-primary', 'text-info', 'text-dark', 'text-warning', 'text-muted'];
                    let content = `<div class="activity-item d-flex">
                    <div class="activite-label">${ndays.toFixed(1)} days</div>
                    <i class='bi bi-circle-fill activity-badge ${tags[idx % tags.length]} align-self-start'></i>
                    <div class="activity-content">
                      ${my_data[datetime][0].keyword} ( ${my_data[datetime].length} )
                    </div>
                  </div>`;


                    let contentRoot = document.getElementById('act_list');
                    contentRoot.innerHTML = contentRoot.innerHTML + content;

                }
                // console.log(finallist);
                let tpn = [];
                let lkn = [];
                let dr = [];
                for (let item of finallist) {
                    if (tpn.indexOf(item.keyword) < 0) {
                        tpn.push(item.keyword);
                    }
                    if (lkn.indexOf(item.url) < 0) {
                        lkn.push(item.url);
                    }
                    dr.push(new Date(item.date));
                }
                // set topic number
                // console.log(tpn);
                document.getElementById('topic_num').textContent = tpn.length;
                // set links number
                // console.log(lkn);
                document.getElementById('link_num').textContent = lkn.length;
                // set daterange
                // console.log(dr);
                if(dr.length>0){
                    dr.sort();
                    let ds = dr[0].toLocaleDateString() + " ~ " + dr[dr.length - 1].toLocaleDateString();
                    document.getElementById('data_range').innerHTML = ds;
                }

        
                

            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error(error);
        });
}
function writeData(usr, lang, lecture, func, score) {
    let d = new Date();
    let st = d.getTime();
    let ymd =
        d.getFullYear() +
        "_" +
        (d.getMonth() + 1) +
        "_" +
        d.getDate();
    set(ref(database, `practice_log/${usr}/${ymd}/${st}`), {
        student: usr,
        lang: lang,
        lecture: lecture,
        func: func,
        count: score,
    });
}

function cleanData(){
    set(ref(database, `test_log/`), {});
    set(ref(database, `test_log/info`), { total: 0 });
}
// writeData();
// writeData('jeff2','cpp','variable','test_fun' , 17);



export default { getData , cleanData };