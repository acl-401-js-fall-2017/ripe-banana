Ripe Banana Aggregation
===

## Description

This is an optional assignment to use the aggregation pipeline feature of mongodb.

## Route Enhancements

route | data
---|---
`GET /films` | [{ title, released, studio.name, averageRating }]
`GET /films/top` | [{ title, released, studio.name, averageRating }] - top 10 sorted by highest rating
`GET /actors` | [{ name, movieCount }]
`GET /reviewer` | [{ name, company, countOfReviews, averageReview }]

See if you can make up additional routes or queries...

## Rubric: **10pts** bonus possible
