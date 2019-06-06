export const FETCH_REVIEWS_QUERY = 
`
MATCH (b:Business {id: $businessId}), (me:User {id: $userId})
MATCH (b)<-[:REVIEWS]-(r:Review)<-[:WROTE]-(u:User)
OPTIONAL MATCH (u)<-[t:TRUSTS]-(me)
WITH r {.text, stars: toFloat(r.stars), name: u.name, date: toString(r.date)} AS review
ORDER BY coalesce(t.score, 0.0) DESC, r.date DESC LIMIT 1000
RETURN COLLECT(review) AS reviews
`