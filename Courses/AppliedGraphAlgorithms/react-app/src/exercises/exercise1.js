
export const FETCH_CATEGORIES_QUERY =
`
MATCH (c:Category)
WITH c ORDER BY c.name LIMIT 500
RETURN COLLECT(c.name) AS categories
`;