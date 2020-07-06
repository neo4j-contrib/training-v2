CALL gds.graph.create.cypher.estimate(
'MATCH (c:Client) RETURN id(c) AS id',
'MATCH (c1:Client)
-[:HAS_EMAIL|:HAS_PHONE|:HAS_SSN]->(info)
<-[:HAS_EMAIL|:HAS_PHONE|:HAS_SSN]
-(c2:Client)
WHERE c1.id<>c2.id
RETURN id(c1) AS source,id(c2) AS target,count(*) AS weight') 
YIELD requiredMemory,nodeCount,relationshipCount;
