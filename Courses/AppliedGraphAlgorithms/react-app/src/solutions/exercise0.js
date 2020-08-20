export const FETCH_USER_INFO_QUERY = `
MATCH (u:User {id: $userId})
MATCH (u)-[:WROTE]->(r:Review)
WITH u, avg(r.stars) AS averageStars
MATCH (u)-[:WROTE]->(:Review)-[:REVIEWS]->(:Business)-[:IN_CATEGORY]-(c:Category)
WITH u, averageStars, c.name AS category, COUNT(*) AS num ORDER BY num DESC
RETURN u {
  .name, 
  numReviews: toFloat(SIZE((u)-[:WROTE]->(:Review))), 
  categories: COLLECT(category)[..5],
  averageStars
} AS userInfo
`;