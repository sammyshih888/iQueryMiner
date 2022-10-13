/**
* Template Name: NiceAdmin - v2.4.0
* Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
var ddtable;
var anaDdtable;
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener))
    } else {
      select(el, all).addEventListener(type, listener)
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function (e) {
      select('body').classList.toggle('toggle-sidebar')
    })
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle')) {
    on('click', '.search-bar-toggle', function (e) {
      select('.search-bar').classList.toggle('search-bar-show')
    })
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
      } else {
        selectHeader.classList.remove('header-scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Initiate tooltips
   */
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /**
   * Initiate quill editors
   */
  if (select('.quill-editor-default')) {
    new Quill('.quill-editor-default', {
      theme: 'snow'
    });
  }

  if (select('.quill-editor-bubble')) {
    new Quill('.quill-editor-bubble', {
      theme: 'bubble'
    });
  }

  if (select('.quill-editor-full')) {
    new Quill(".quill-editor-full", {
      modules: {
        toolbar: [
          [{
            font: []
          }, {
            size: []
          }],
          ["bold", "italic", "underline", "strike"],
          [{
            color: []
          },
          {
            background: []
          }
          ],
          [{
            script: "super"
          },
          {
            script: "sub"
          }
          ],
          [{
            list: "ordered"
          },
          {
            list: "bullet"
          },
          {
            indent: "-1"
          },
          {
            indent: "+1"
          }
          ],
          ["direction", {
            align: []
          }],
          ["link", "image", "video"],
          ["clean"]
        ]
      },
      theme: "snow"
    });
  }

  /**
   * Initiate TinyMCE Editor
   */
  // const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;

  // tinymce.init({
  //   selector: 'textarea.tinymce-editor',
  //   plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
  //   editimage_cors_hosts: ['picsum.photos'],
  //   menubar: 'file edit view insert format tools table help',
  //   toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
  //   toolbar_sticky: true,
  //   toolbar_sticky_offset: isSmallScreen ? 102 : 108,
  //   autosave_ask_before_unload: true,
  //   autosave_interval: '30s',
  //   autosave_prefix: '{path}{query}-{id}-',
  //   autosave_restore_when_empty: false,
  //   autosave_retention: '2m',
  //   image_advtab: true,
  //   link_list: [{
  //     title: 'My page 1',
  //     value: 'https://www.tiny.cloud'
  //   },
  //   {
  //     title: 'My page 2',
  //     value: 'http://www.moxiecode.com'
  //   }
  //   ],
  //   image_list: [{
  //     title: 'My page 1',
  //     value: 'https://www.tiny.cloud'
  //   },
  //   {
  //     title: 'My page 2',
  //     value: 'http://www.moxiecode.com'
  //   }
  //   ],
  //   image_class_list: [{
  //     title: 'None',
  //     value: ''
  //   },
  //   {
  //     title: 'Some class',
  //     value: 'class-name'
  //   }
  //   ],
  //   importcss_append: true,
  //   file_picker_callback: (callback, value, meta) => {
  //     /* Provide file and text for the link dialog */
  //     if (meta.filetype === 'file') {
  //       callback('https://www.google.com/logos/google.jpg', {
  //         text: 'My text'
  //       });
  //     }

  //     /* Provide image and alt text for the image dialog */
  //     if (meta.filetype === 'image') {
  //       callback('https://www.google.com/logos/google.jpg', {
  //         alt: 'My alt text'
  //       });
  //     }

  //     /* Provide alternative source and posted for the media dialog */
  //     if (meta.filetype === 'media') {
  //       callback('movie.mp4', {
  //         source2: 'alt.ogg',
  //         poster: 'https://www.google.com/logos/google.jpg'
  //       });
  //     }
  //   },
  //   templates: [{
  //     title: 'New Table',
  //     description: 'creates a new table',
  //     content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
  //   },
  //   {
  //     title: 'Starting my story',
  //     description: 'A cure for writers block',
  //     content: 'Once upon a time...'
  //   },
  //   {
  //     title: 'New list with dates',
  //     description: 'New List with dates',
  //     content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
  //   }
  //   ],
  //   template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  //   template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  //   height: 600,
  //   image_caption: true,
  //   quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  //   noneditable_class: 'mceNonEditable',
  //   toolbar_mode: 'sliding',
  //   contextmenu: 'link image table',
  //   skin: useDarkMode ? 'oxide-dark' : 'oxide',
  //   content_css: useDarkMode ? 'dark' : 'default',
  //   content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
  // });

  /**
   * Initiate Bootstrap validation check
   */
  var needsValidation = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(needsValidation)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })

  /** 
   * Initiate Datatables
   */

  const setTable = () => {
    const datatables = select('.datatable', true)
    if (document.getElementsByClassName('datatable')[0].getElementsByTagName('tr').length > 1) {
      // datatables.forEach(datatable => {
      ddtable = new simpleDatatables.DataTable(datatables[0]);
      // break;
      // })
    } else {
      setTimeout(setTable, 1000);
    }
  }
  setTable();

  /**
   * Autoresize echart charts
   */
  const mainContainer = select('#main');
  if (mainContainer) {
    setTimeout(() => {
      new ResizeObserver(function () {
        select('.echart', true).forEach(getEchart => {
          echarts.getInstanceByDom(getEchart).resize();
        })
      }).observe(mainContainer);
    }, 200);
  }

})();


function tsearch( target){
  anaDdtable.search(target);
}

//=========================
// import analysis json-file
//=========================
document.getElementById("anaJson").addEventListener("change", handleFile, false);
function handleFile() {
  console.log(this.files[0].name); /* now you can work with the file list */
  console.log(this.files[0]);
  const promise1 = this.files[0].text();
  promise1.then((value) => {
    // console.log(value);
    let dataObj = JSON.parse(value);
    console.log(dataObj);



    let newTbody = document.getElementsByClassName('anaDtable')[0].getElementsByTagName('tbody')[0];
    let hitTerms = [];
    for (let r of ddtable.rows().dt.data) {
      let link = r.getElementsByTagName('a')[0].href;
      let addTerms = '<td>';
      for (let doc of dataObj.documents) {
        if (doc.url == link) {
          // add super terms
          for (let ts of doc.terms) {
            if (ts.term != undefined && ts.term.total != undefined && ts.term.total > 3) {
              addTerms += `<span class="badge bg-info">${ts.term.text}(${ts.term.total})</span> `;
              hitTerms.push(ts.term.text);
            } else {
              break;
            }
          }
          break;
        }
      }
      addTerms += '</td>';
      // '<td><span class="badge bg-warning">test</span></td>'
      newTbody.innerHTML += (r.innerHTML + addTerms);
    }

    // build table
    let atable = document.getElementsByClassName('anaDtable')[0];
    anaDdtable = new simpleDatatables.DataTable(atable);
    anaDdtable.columns().sort(4,'desc');

    // set hot terms
    let termItem = '';
    for(let term of dataObj.terms){
      if( hitTerms.indexOf(term.text)>0)
      termItem+=`<span onclick='tsearch("${term.text}");' style='margin-right: 3px;margin-top: 3px;' class="btn btn-sm btn-outline-danger">${term.text}(${term.total})</span>`;
    }
    document.getElementById('hot_terms').innerHTML+=termItem;

    // scroll to target
    window.location = '/index.html#ana_result';

  });

}



document.getElementById('btn_export').addEventListener('click', function (evt) {
  if (ddtable.data != undefined) {
    let jsonObjs = [];
    for (let item of ddtable.data) {

      let dt = item.getElementsByTagName('th')[0].textContent;
      let alink = item.getElementsByTagName('a')[0];
      let atitle = alink.textContent;
      let aurl = alink.href;
      let tds = item.getElementsByTagName('td');
      let abs = tds[1].textContent;
      let akw = tds[2].textContent;
      console.log(dt);
      console.log(atitle);
      console.log(aurl);
      console.log(abs);
      console.log(akw);
      jsonObjs.push({
        date: dt,
        title: atitle,
        url: aurl,
        abstract: abs,
        keyword: akw
      });
    }

    let data = JSON.stringify(jsonObjs);
    let type = "application/json";
    let name = "export.json";
    let blob = new Blob([data], { type });
    let url = window.URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.download = name;
    link.href = url;
    link.click();

    window.URL.revokeObjectURL(url);

  }
});