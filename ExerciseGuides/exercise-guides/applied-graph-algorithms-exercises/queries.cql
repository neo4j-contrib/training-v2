// tag::most-reviewed-cities[]
MATCH (c:City)
RETURN c.name, size((c)<-[:IN_CITY]-()) AS numberOfReviews
ORDER BY numberOfReviews DESC
LIMIT 10;
// end::most-reviewed-cities[]

// Find the most reviewed restaurants
// tag::most-reviewed-restaurants[]
match (b:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
WHERE (b)-[:IN_CATEGORY]->(:Category {name: "Restaurants"})
RETURN b.id, b.name,
       [(b)-[:IN_CATEGORY]->(category) | category.name] AS categories,
       size((b)<-[:REVIEWS]-()) AS reviews
ORDER BY reviews DESC
LIMIT 10;
// end::most-reviewed-restaurants[]

// Find interesting reviewers to use to explain the data

// tag::interesting-reviewers[]
MATCH (u:User)-[:WROTE]->()-[:REVIEWS]-(business:Business)
WHERE (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})

WITH u, count(*) AS totalReviews
ORDER BY totalReviews DESC
LIMIT 1000
MATCH (u)-[:WROTE]->()-[:REVIEWS]->()-[:IN_CATEGORY]->(cat)

WITH u, totalReviews, cat, count(*) AS count ORDER BY u, count DESC
WHERE count > 5
RETURN u.id, u.name, totalReviews, collect(cat.name)[..5] AS categories
ORDER BY totalReviews DESC;
// end::interesting-reviewers[]

// Calculating taxonomy

// tag::compute-taxonomy-template[]
// Fill in this part
WITH {item:id(category),
      categories: collect(id(business))} as userData
WITH collect(userData) as data
CALL algo.similarity.overlap(data, {
  write: true, similarityCutoff: 0.75
})
YIELD nodes, similarityPairs, p50, p75, p90, p99
RETURN nodes, similarityPairs, p50, p75, p90, p99;
// end::compute-taxonomy-template[]

// tag::compute-taxonomy[]
MATCH (category:Category)
MATCH (category)<-[:IN_CATEGORY]-(business)
WITH {item:id(category),
      categories: collect(id(business))} as userData
WITH collect(userData) as data
CALL algo.similarity.overlap(data, {
  write: true, similarityCutoff: 0.75
})
YIELD nodes, similarityPairs, p50, p75, p90, p99
RETURN nodes, similarityPairs, p50, p75, p90, p99;
// end::compute-taxonomy[]

// Remove transitive taxonomy
// tag::transitive-taxonomy[]
MATCH (g1:Category)-[:NARROWER_THAN*2..]->(g3:Category),
      (g1)-[d:NARROWER_THAN]->(g3)
DELETE d;
// end::transitive-taxonomy[]

// Top level categories
MATCH (u:User)-[:WROTE]->()-[:REVIEWS]-(business:Business)
WHERE (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
WITH u, count(*) AS totalReviews
ORDER BY totalReviews DESC
LIMIT 1000
MATCH (u)-[:WROTE]->()-[:REVIEWS]->()-[:IN_CATEGORY]->(cat)-[:NARROWER_THAN*0..]->(superCat)
WHERE not (superCat)-[:NARROWER_THAN]->()
WITH u, totalReviews, superCat, count(*) AS count ORDER BY u, count DESC WHERE count > 5
RETURN u.id, u.name, totalReviews, collect(superCat.name)[..10] AS categories
ORDER BY totalReviews DESC;

// Phoenix Reviewers
MATCH (u:User)-[:WROTE]->()-[:REVIEWS]-(business:Business)
WHERE (business)-[:IN_CITY]->(:City {name: "Phoenix"})
RETURN count(distinct u);

MATCH (u:User)-[:WROTE]->()-[:REVIEWS]-(business:Business)
WHERE (business)-[:IN_CITY]->(:City {name: "Phoenix"})
WITH distinct u
SET u:Phoenix;

// Find the top reviewers in a category
MATCH (u:User)-[:WROTE]->()-[:REVIEWS]-(business:Business)
WHERE (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
AND (business:Business)-[:IN_CATEGORY]->(:Category {name: "Fast Food"})
RETURN  u.id, u.name,  count(*) AS count
ORDER BY count DESC
LIMIT 10;

// tag::userids[]
:param userIds => ["XEHZoTDWjw3w-gcQyYIe4g", "d_TBs6J3twMy9GChqUEXkg", "NwPnvTALYMNZgdiwHHkuAQ"];
// end::userids[]

// tag::selected-users[]
MATCH (u:User)-[:WROTE]->()-[:REVIEWS]->(business:Business)-[:IN_CATEGORY]->(category)
WHERE u.id IN $userIds AND (business)-[:IN_CITY]->(:City {name: "Phoenix"})
WITH u, category, count(*) AS count
ORDER BY u, count DESC
RETURN u, collect({category: category.name, count: count})[..5] AS reviews;
// end::selected-users[]

// tag::pick-similar-user[]
:param userId => "NwPnvTALYMNZgdiwHHkuAQ";
// end::pick-similar-user[]

// Find other people who have reviewed the same businesses
// tag::similar-users[]
MATCH (u:User {id: $userId})-[:WROTE]->()-[:REVIEWS]-(business:Business)<-[:REVIEWS]-()<-[:WROTE]-(other)
RETURN other.id, other.name, count(*) AS count
ORDER BY count DESC
LIMIT 10;
// end::similar-users[]


// User similarity
MATCH (u:User:Phoenix)
WITH u LIMIT 100
MATCH (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
OPTIONAL MATCH (u)-[:WROTE]->(review)-[:REVIEWS]->(business)
WITH u, collect(coalesce(review.stars, 0)) AS reviews
WITH u, [review in reviews where review > 0] AS reviews
return id(u), size(reviews)

// feature vectors for user similarity
MATCH (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
WITH collect(id(business)) AS businesses
MATCH (u:User:Phoenix)
WITH businesses, u, [(u)-[:WROTE]->(review)-[:REVIEWS]->(business) |
                     {item: id(business), weight: review.stars}] AS weights
WITH u, algo.ml.featureVector(businesses, weights) AS reviews
WITH u, [review in reviews where review > 0] AS reviews
return id(u), size(reviews) AS reviews
ORDER BY reviews DESC
LIMIT 10;


MATCH (u:User:Phoenix)
WITH  u, [(u)-[:WROTE]->(review)-[:REVIEWS]->(business) |
                     {id: id(business), weight: review.stars}] AS weights
return id(u), size(weights) AS reviews, weights
ORDER BY reviews DESC
LIMIT 10;


MATCH (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
WITH collect(id(business)) AS businesses
MATCH (u:User:Phoenix)
WITH businesses, collect({item: id(u), selectedValues: [(u)-[:WROTE]->(review)-[:REVIEWS]->(business) |
                     {item: id(business), weight: review.stars}]}) AS weights
call algo.ml.featureVector.stream(businesses, weights)
YIELD nodeId, featureVector
RETURN count(*);

MATCH (business:Business)-[:IN_CITY]->(:City {name: "Phoenix"})
WITH collect(id(business)) AS businesses
MATCH (u:User:Phoenix)
WITH businesses, u LIMIT 50000
  WITH businesses, collect({item: id(u), selectedValues: [(u)-[:WROTE]->(review)-[:REVIEWS]->(business) |
                       {item: id(business), weight: review.stars}]}) AS weights
call algo.ml.featureVector.stream(businesses, weights, {concurrency: 1})
YIELD nodeId, featureVector
RETURN count(*);

// Cypher loading
call algo.similarity.cosine.stream(
  "MATCH (u)-[:WROTE]->(review)-[r:REVIEWS]->(business)
   RETURN id(u) AS item, id(business) AS id, r.stars AS weight",
  {graph: "cypher", skipValue: algo.NaN()});

// top K similar graph for people reviewing Phoenix businesses
// tag::topk-similar-users[]
CALL algo.similarity.cosine(
    "MATCH (u:User:Phoenix)
     WITH u LIMIT 50000
     MATCH (u)-[:WROTE]->(review:Review)-[:REVIEWS]->(business:Business)-[:IN_CITY]->(c:City)
     WHERE c.name = $city
     RETURN id(u) AS item, id(business) AS id, review.stars AS weight",
    {graph: "cypher", similarityCutoff:0.5, degreeCutoff:3, write:true, topK:10,
     skipValue: algo.NaN(), params: {city: "Phoenix"}})
YIELD nodes, similarityPairs, min, max, mean, stdDev, p90, p95, p99
RETURN *
// end::topk-similar-users[]

// tag::topk-similar-users-template[]
CALL algo.similarity.cosine(
    "// Fill in this part of the query
     RETURN id(u) AS item, id(business) AS id, review.stars AS weight",
    {graph: "cypher", similarityCutoff:0.5, degreeCutoff:3, write:true, topK:10,
     skipValue: algo.NaN(), params: {city: "Phoenix"}})
YIELD nodes, similarityPairs, min, max, mean, stdDev, p90, p95, p99
RETURN *
// end::topk-similar-users-template[]

// tag::find-topk-similar-users[]
MATCH (me:User {id: $userId})-[similarity:SIMILAR]-(other)
RETURN other, similarity.score AS similarity
ORDER BY similarity DESC
// end::find-topk-similar-users[]


// Find places near a point
:params location => {latitude: 33.452506, longitude: -112.074791};

MATCH (b:Business)
WHERE distance(b.location, point($location)) < 500
RETURN b.id, b.name, distance(b.location, point($location)) as distance
ORDER BY distance

// Which places should I go?
:param userId => "vLixm38Zd-xgAvN1LQJfKQ";

// Places reviewd by anybody
MATCH (b:Business)
WHERE distance(b.location, point($location)) < 1000
MATCH (other:User)-[:WROTE]->(review)-[:REVIEWS]->(b:Business)
RETURN b.id, b.name, collect(other.name) AS people, avg(review.stars) AS stars
ORDER BY stars DESC
LIMIT 10

// Places reviewed by people similar to me
MATCH (b:Business)
WHERE distance(b.location, point($location)) < 1000
MATCH (me:User {id: $userId})-[:SIMILAR]-(other)-[:WROTE]->(review)-[:REVIEWS]->(b:Business)
RETURN b.id, b.name, collect(other.name) AS people, avg(review.stars) AS stars
ORDER BY stars DESC
