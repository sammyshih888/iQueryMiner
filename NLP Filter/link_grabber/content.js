console.log('start content.js ...');

//===============


let rits = document.getElementById('search').getElementsByClassName('g');
var links = [];
var titles = [];
for (let item of rits) {
    let linkItm = item.getElementsByTagName('a')[0];
    let href = '';
    try {
        href = linkItm.getAttribute('href');
    } catch (error) {
        //console.error(linkItm);
        //console.error('=========== no link ============');
    }

    let title = '';
    try {
        title = linkItm.getElementsByTagName('h3')[0].textContent;
    } catch (error) {
        //console.error(linkItm);
        //console.error('=========== no title ============')
    }

    // links.push(href);
    // titles.push(title);
    console.log(href);
    console.log(title);
    console.log('===========');

    var espan = document.createElement('div');
    var eb = document.createElement('a');
    eb.append('(+) <<<< Add to list');
    // eb.onclick = function() { console.log('click') };
    eb.setAttribute('class', 'addItem');
    eb.dataset.link = href;
    eb.dataset.title = title;
    // eb.addEventListener("click", function() {
    //     //alert('hi');
    //     console.log('clicik!!');
    // });
    espan.append(eb);
    // console.log(item);
    // console.log(item.children[1]);
    // console.log(item.children[1].firstChild);
    // console.log(item.children[1].firstChild.firstChild);
    item.getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].append(espan);
}
//===============



// const tag = 'my_keywords' ;


// // 取出關鍵字，放進清單 (kws_list)
// var kws = localStorage.getItem(tag) ;
// var kws_list = [] ; 
// if( kws != null ){
//     kws_list = kws.split(',');
// }

// // 處理網頁的關鍵字
// // 1. 取出放在主標題的關鍵字 id=firstHeading
// var new_kw = document.getElementById('firstHeading').firstChild.textContent.trim() ;
// // 2. 檢查是否已經有紀錄
// if( kws_list.indexOf(new_kw)==-1){
//     // 未出現過的關鍵字，加入
//     kws_list.push(new_kw) ;
//     localStorage.setItem(tag , kws_list.toString()) ;
// }

// // 產生 html 版面內容

var html_content =
    '<div class="btnNav">' +
    '<a id="closeBtn" href="javascript:void(0)" class="closebtn">✊🏼</a>' +
    '<a id="openBtn" href="javascript:void(0)" class="openbtn">👉🏼</a>' +
    '</div>' +
    '<div id="mySidenav" class="sidenav"></div>';

// // 將 html 內容遷入原來的網頁
var bdy = document.getElementsByTagName('body')[0];

// console.log( html_content ) ;
// //console.log('---------') ;
// //console.log(bdy.innerHTML) ;
bdy.innerHTML = html_content + bdy.innerHTML;

// // 設置按鈕的動作
document.getElementById('closeBtn').addEventListener("click", function() {
    let item = document.getElementById("mySidenav");
    item.style.width = "500px";
    item.style.left = "-800px";
});
document.getElementById('openBtn').addEventListener("click", function() {
    document.getElementById("mySidenav").style.left = "0px";
});


var addItemElts = document.getElementsByClassName('addItem');
for (let item of addItemElts) {
    item.addEventListener("click", function() {
        console.log('click!!');
        console.log(this.dataset.title);
        console.log(this.dataset.link);
        links.push(this.dataset.link);
        titles.push(this.dataset.title);
        var html_links = '';
        for (var i = 0; i < links.length; i++) {
            html_links = html_links + '<a href="' + links[i] + '">' + titles[i] + '</a>';
        }
        document.getElementById('mySidenav').innerHTML = html_links;
    });
}

console.log('end content.js !');

console.log('end content.js !');