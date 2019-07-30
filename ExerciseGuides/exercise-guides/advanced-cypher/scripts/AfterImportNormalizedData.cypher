CALL apoc.schema.assert({},{},true);
MATCH (n:Person) DETACH DELETE n;
MATCH (n:Director) DETACH DELETE n;
MATCH (n:Actor) DETACH DELETE n;
MATCH (n:Movie) DETACH DELETE n;
MATCH (n:Genre) DETACH DELETE n;

CREATE CONSTRAINT ON (m:Movie)
ASSERT m.id IS UNIQUE;

CREATE CONSTRAINT ON (p:Person)
ASSERT p.id IS UNIQUE;


LOAD CSV WITH HEADERS FROM
     'https://data.neo4j.com/advanced-cypher/movies1.csv' AS row
MERGE (m:Movie {id:toInteger(row.movieId)})
    ON CREATE SET
          m.title = row.title,
          m.avgVote = toFloat(row.avgVote),
          m.releaseYear = toInteger(row.releaseYear),
          m.genres = split(row.genres,":");

LOAD CSV WITH HEADERS FROM 'https://data.neo4j.com/advanced-cypher/people.csv' as row

MERGE(person:Person {id: toInteger(row.personId)})
ON CREATE SET person.name = row.name,
              person.born = toInteger(row.birthYear),
              person.died = toInteger(row.deathYear);


LOAD CSV WITH HEADERS FROM 'https://data.neo4j.com/advanced-cypher/directors.csv' as row

MATCH (movie:Movie {id:toInteger(row.movieId)})
MATCH (person:Person {id: toInteger(row.personId)})
MERGE (person)-[:DIRECTED]->(movie)
ON CREATE SET person:Director;

LOAD CSV WITH HEADERS FROM 'https://data.neo4j.com/advanced-cypher/roles.csv' AS row

MATCH  (movie:Movie  {id: toInteger(row.movieId) })
MATCH  (person:Person {id: toInteger(row.personId) })
MERGE  (person)-[r:ACTED_IN]->(movie) ON CREATE SET r.roles = split(coalesce(row.characters,""), ":")
ON CREATE SET person:Actor;

CREATE INDEX ON :Person(name);

CREATE INDEX ON :Movie(title);

CREATE CONSTRAINT ON (g:Genre) ASSERT g.name IS UNIQUE;
MATCH (m:Movie)
UNWIND m.genres as name
WITH DISTINCT name, m
SET m.genres = null
MERGE (g:Genre {name:name})
WITH g, m
MERGE (g)<-[:IS_GENRE]-(m)