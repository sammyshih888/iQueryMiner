# Purpose
- Retest clustering with simplified source list

# Data
- 2 specific seperate topics with 10 articles each, handpicked based on special word frequency

# Method
- Features: BM25
- Clustering: K-means/aggregate grouping

# Results
- K-means: inconsistent
- Aggregate grouping: 
```
Two groups best case: 
7,8,6,2,4,3,0
17,19,18,13,14,10,16
```

# Discussion and Conclusion
- K-means gives different results due to different initial seeds(k-means seeding)
- Aggregate grouping is fairly accurate and consistent, though there are some outliers(1,5,9,11,12,15)
- Topic specificity seems to be key to accurate grouping–hard to distinguish between general topics
- Future improvements can be on identifying which is the best case for aggregate grouping
