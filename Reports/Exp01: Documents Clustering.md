# Purpose
- Test working flow and verify clustering method

# Data
- [5 sepearate topics each with 10 articles][https://github.com/sammyshih888/iQueryMiner/blob/main/NLP%20Filter/sourceList.txt] 

# Method
- Features: BM25
- Clustering: K-means
  - ```javascript
    const options = {
      k: 5,
      maxIter: 10,
      threshold: 0.2,
    };
    ```
# Results
```txt
Document 0 ==> 0
Document 1 ==> 0
Document 2 ==> 0
Document 3 ==> 0
Document 4 ==> 0
Document 5 ==> 0
Document 6 ==> 0
Document 7 ==> 0
Document 8 ==> 1
Document 9 ==> 0
Document 10 ==> 0
Document 11 ==> 0
Document 12 ==> 0
Document 13 ==> 2
Document 14 ==> 0
Document 15 ==> 0
Document 16 ==> 0
Document 17 ==> 0
Document 18 ==> 0
Document 19 ==> 0
Document 20 ==> 0
Document 21 ==> 0
Document 22 ==> 3
Document 23 ==> 0
Document 24 ==> 0
Document 25 ==> 0
Document 26 ==> 0
Document 27 ==> 0
Document 28 ==> 0
Document 29 ==> 0
Document 30 ==> 0
Document 31 ==> 0
Document 32 ==> 0
Document 33 ==> 0
Document 34 ==> 0
Document 35 ==> 0
Document 36 ==> 0
Document 37 ==> 0
Document 38 ==> 0
Document 39 ==> 0
Document 40 ==> 0
Document 41 ==> 0
Document 42 ==> 0
Document 43 ==> 0
Document 44 ==> 0
Document 45 ==> 4
Document 46 ==> 0
Document 47 ==> 0
Document 48 ==> 0
Document 49 ==> 0
```

# Discussion and Conclusion
- Groups documents with different topics together, a few documents are the only ones in a category(13, 22, 45)
- 
