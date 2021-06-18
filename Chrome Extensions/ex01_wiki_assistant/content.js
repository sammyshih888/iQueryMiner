console.log('start content.js ...') ;


const tag = 'my_keywords' ;


// 取出關鍵字，放進清單 (kws_list)
var kws = localStorage.getItem(tag) ;
var kws_list = [] ; 
if( kws != null ){
    kws_list = kws.split(',');
}

// 處理網頁的關鍵字
// 1. 取出放在主標題的關鍵字 id=firstHeading
var new_kw = document.getElementById('firstHeading').firstChild.textContent.trim() ;
// 2. 檢查是否已經有紀錄
if( kws_list.indexOf(new_kw)==-1){
    // 未出現過的關鍵字，加入
    kws_list.push(new_kw) ;
    localStorage.setItem(tag , kws_list.toString()) ;
}

// 產生 html 版面內容
var html_links = '' ;
for( var i=0 ; i<kws_list.length ; i++) {
    html_links= html_links+'<a href="https://zh.wikipedia.org/wiki/'+kws_list[i]+'">'+kws_list[i]+'</a>'   ;    
}
var html_content = 
'<div class="btnNav">'+
    '<a id="closeBtn" href="javascript:void(0)" class="closebtn">✊🏼</a>'+
    '<a id="openBtn" href="javascript:void(0)" class="openbtn">👉🏼</a>'+
'</div>' +
'<div id="mySidenav" class="sidenav">'+html_links+'</div>' ;

// 將 html 內容遷入原來的網頁
var bdy = document.getElementsByTagName('body')[0];

console.log( html_content ) ;
//console.log('---------') ;
//console.log(bdy.innerHTML) ;
bdy.innerHTML = html_content + bdy.innerHTML ;

// 設置按鈕的動作
document.getElementById('closeBtn').addEventListener("click", function(){
    document.getElementById("mySidenav").style.width = "0px";
});     
document.getElementById('openBtn').addEventListener("click", function(){
    document.getElementById("mySidenav").style.width = "255px";
}  );                              
                                                
                  
console.log('end content.js !') ;