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
MATCH (p:Photo {id: photoId})
MATCH (recPhoto:Photo {partition: p.partition})<-[:HAS_PHOTO]-(b:Business)
WITH b, COUNT(*) AS num, COLLECT(recPhoto)[0] AS businessPhoto ORDER BY num DESC LIMIT 100
RETURN COLLECT(b {.*, photo: businessPhoto.id}) AS recommendations
`;