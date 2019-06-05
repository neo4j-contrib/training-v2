CREATE CONSTRAINT ON (l:Label) ASSERT l.id IS UNIQUE;

USING PERIODIC COMMIT
LOAD CSV WITH HEADERS FROM "file:///output.csv" AS row
MATCH (p:Photo {id: row.photo_id})
MERGE (l:Label {id: row.mid})
ON CREATE SET l.description = row.description
MERGE (p)-[r:HAS_LABEL]->(l)
ON CREATE SET r.score = toFloat(row.score);