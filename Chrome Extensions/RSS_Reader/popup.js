class InitPopup {
    constructor() {
        this.rssUrl = "http://rss.cnn.com/rss/edition.rss";
    }
    populatePopup() {
        fetch(this.rssUrl).then((res) => {
            res.text().then((plainxml) => {
                var domParser = new DOMParser();
                var xmlParsed = domParser.parseFromString(plainxml, 'text/xml')
                xmlParsed.querySelectorAll('item').forEach((item) => {
                    // Creating the render
                    var h1 = document.createElement('h1');
                    h1.textContent = item.querySelector('title').textContent;

                    var publicationDate = document.createElement('span');
                    publicationDate.textContent = item.querySelector('pubDate').textContent;

                    var link = document.createElement('a');
                    link.href = item.querySelector('link').textContent;
                    link.appendChild(h1);
                    link.appendChild(publicationDate);
                    //In fact, when you build a chrome app, a simple HREF doesn’t work. You need to tell chrome how to handle the click on a link.
                    //So we’ll add this little adjustment to our popup.js file
                    link.onclick = function () {
                        chrome.tabs.create({ active: true, url: item.querySelector('link').textContent });
                    };
                    
                    document.getElementById('render-div').appendChild(link);

                })
            })
        });
    }

}
new InitPopup().populatePopup();
