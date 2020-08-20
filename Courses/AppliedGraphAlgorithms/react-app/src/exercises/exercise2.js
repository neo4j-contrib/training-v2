/*
TODO: rank businesses that are more relevant
 */
export const FETCH_BUSINESSES_QUERY = 
`
CALL db.index.fulltext.queryNodes("BusinessNameIndex", $searchText + "~0.75") YIELD node, score
WITH node AS b ORDER BY score DESC LIMIT 200
MATCH (b)-[:IN_CATEGORY]->(c:Category {name: $category})
OPTIONAL MATCH (b)-[:HAS_PHOTO]->(p:Photo)
WITH b, COLLECT(p)[0] AS p
WITH b,p ORDER BY EXISTS((b)-[:HAS_PHOTO]->()) DESC LIMIT 100
RETURN COLLECT(b {.*, photo: p.id}) AS businesses
`;