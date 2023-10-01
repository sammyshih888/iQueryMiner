# iQueryMiner

Extension: https://chrome.google.com/webstore/detail/concepttracker/mfhffmciljnokfnpomlhhkgdepafjdjd/related?hl=en&authuser=0

# Introduction
In the process of conducting reports and research, it is quite simple to collect data through google. However, it is not easy and takes a lot of time to filter out meaningful key information from a large amount of data.
I hope to design a system to help sort out the query results on google and summarize known or even unknown key concepts from these results. 
For example, if we are conducting research reports related to Covid-19, the known keywords may be covid, alpha, beta, and omicron. But because the world's epidemic situation continues to change, many new variant information may be unknown to us, such as: X.BB, BA.2.75, BQ.1. We hope that through this system, even if these new variant keywords are not used in the query, the system can still analyze that these keywords are highly related to the current concept of Covid, and provide them to users.

# System Architecture
![alt text](https://i.imgur.com/c5f8PSw.png)

# Components
## A.Concept Tracker
- deployment platform：chrome extension
- development programming languages：javascript、css、html
- database：Firebase Realtime Database
The chrome extension on the browser can continuously track the user's query records on Google, and the system will record the title, link, and keywords of the query result pages, google abstract, and send these query records back to the Firebase Realtime Database.
The plug-in will display a small icon next to the Google search result page to show the number of tracked links. The iQuery information area on the right side of the page as shown in the figure below.
![alt text](https://i.imgur.com/IKHzmoM.png)

## B.Concept Analyser (offline process)
- deployment platform：node.js
- development programming language：javascript
This module is mainly used to analyze the information collected by the Concept Tracker and generate relative concept results. The whole process is carried out offline, so when the system is deployed, a fixed time schedule (task scheduling) will be set, so that the analysis program can perform analysis according to the required analysis frequency. The whole analysis process has the following steps: 
1. From the document hyperlinks recorded in the firebase database, use the web crawler to obtain the original data content on the webpage.
2. Document Feature Extraction: 
- Remove unnecessary information from the text data obtained in step 1. Including html tags, footer, header, etc.
- Use [winknlp](https://winkjs.org/wink-nlp) to perform stem word mapping, then calculate term frequency, and use high frequent terms as the main information representing concepts. Combined with [BM25 Algorithm](https://en.wikipedia.org/wiki/Okapi_BM25), the high freqyent terms just now are filtered out of document related hot terms.
3. Collect the above information export it as a JSON file. Provide analysis result page. 

## C.Dashboard
- deployment platform：web page（web server）
- development programming language：javascript
- database：Firebase Realtime Database
ConceptTracker Page mainly consists of two parts: 1. Tracking records 2. Analysis results
1. Tracking records
- Obtain tracking records from firebase database and present relevant information on the web page. The webpage will display: data tracking period (Date), covered topics and number of links, recent tracking activity, and detailed content table of all recent queries table. You can search and sort functions on the table. 
- In addition, the data functions include a. Export, which can export and save tracking data (tracking json log), and b. Data reset: After reset, all database data will be cleared, and subject tracking can be performed again.
![alt text](https://i.imgur.com/VdOOPab.jpg)
2. Analysis Results
- For results of the analysis, you need to choose to import the JSON file produced by Concept Analyzer (import analysis json). Relevant analytics information will be presented.
- The analysis results mainly provide two key pieces of information:
  - Analysis Hot Terms: represents the hot key terms in the tracking process or the key concepts. There is a number behind each concept to represent the concept score. The concepts are arranged from high scores to low scores from top to bottom. After clicking a concept tag, the central analysis table will display the link content related to this concept.
  - Super terms: the main concepts analyzed for each tracking link. Displayed in the last column of each link data in the analysis table. After clicking on a certain concept label, it will filter and display the link content related to this concept.
![alt text](https://i.imgur.com/s3N97HH.jpg)
