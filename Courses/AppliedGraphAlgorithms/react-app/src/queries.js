export const FETCH_CATEGORIES_QUERY = 
`
MATCH (c:Category)
WITH c LIMIT 50
RETURN COLLECT(c.name) AS categories 
`;

export const FETCH_BUSINESSES_QUERY = 
`
MATCH (b:Business)-[:IN_CATEGORY]->(c:Category {name: $category})
WHERE toLower(b.name) CONTAINS toLower($searchText)
OPTIONAL MATCH (b)-[:HAS_PHOTO]->(p:Photo)
WITH b, COLLECT(p)[0] AS p
WITH * LIMIT 100
RETURN COLLECT(b {.*, photo: p.id}) AS businesses
`