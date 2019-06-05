
// TODO: 
export const FETCH_REVIEWS_QUERY = 
`
MATCH (b:Business {id: $businessId})
MATCH (b)<-[:REVIEWS]-(r:Review)<-[:WROTE]-(u:User)
WITH r{.text, stars: toFloat(r.stars), name: u.name, date: toString(r.date)} AS review
ORDER BY r.date DESC LIMIT 1000
RETURN COLLECT(review) AS reviews
`