// FIND PHOTOS OF RELEVANT BUSINESSES
export const FETCH_RECOMMENDED_PHOTOS_QUERY =
`
MATCH (b:Business)-[:HAS_PHOTO]->(p:Photo)
WITH b, p SKIP toInteger(rand() * 30000)-1000 LIMIT 10000
WITH COLLECT(p{photoId: p.id, businessId: b.id}) AS photos
RETURN apoc.coll.shuffle(photos)[..199] AS photos
`;

export const FETCH_PHOTO_RECOMMENDATIONS = 
`
UNWIND $selectedPhotos AS photoId
MATCH (p:Photo {id: photoId})<-[:HAS_PHOTO]-(b:Business)
RETURN COLLECT(b {.*, photo: p.id}) AS recommendations
`;