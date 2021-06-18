chrome.alarms.create("every1min", {
    periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name === "every5min") {
        checkIfNewContent();
    }
});
var rssUrl = "http://rss.cnn.com/rss/edition.rss";

function checkIfNewContent()
{
    console.log("background.js --> " + new Date());
    fetch(rssUrl).then((res) => {
        res.text().then((plainxml) => {

            var domParser = new DOMParser();
            var xmlParsed = domParser.parseFromString(plainxml, 'text/xml');

            var lastBuildDate = xmlParsed.querySelectorAll('lastBuildDate')[0].textContent;

            chrome.storage.local.get('lastbuild', function (result) {
                if (result.lastbuild != lastBuildDate)
                {
                    chrome.storage.local.set({ 'lastbuild': lastBuildDate }, function () {
                        chrome.browserAction.setBadgeText({ text: 'News' });
                        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
                    });
                }

            });

        })
    });


}