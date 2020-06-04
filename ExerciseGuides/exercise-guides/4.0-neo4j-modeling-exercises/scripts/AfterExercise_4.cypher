MATCH (n) DETACH DELETE n;
CALL apoc.schema.assert({},{},true);
MERGE (a1:Airport {code: 'LAS'})
MERGE (a2:Airport {code:'LAX'})
MERGE (a3:Airport {code:'ABQ'})
MERGE (a1)-[:CONNECTED_TO {airline:'WN',flightNumber:'82',date:'2019-1-3',departure:'1715',arrival:'1820'}]->(a2)
MERGE (a1)-[:CONNECTED_TO {airline:'WN',flightNumber:'500',date:'2019-1-3',departure:'1445',arrival:'1710'}]->(a3);
LOAD CSV WITH HEADERS FROM 'https://r.neo4j.com/flights_2019_1k' AS row
MERGE (origin:Airport {code: row.Origin})
MERGE (destination:Airport {code: row.Dest})
MERGE (origin)-[connection:CONNECTED_TO {
  airline: row.UniqueCarrier,
  flightNumber: row.FlightNum,
  date: toInteger(row.Year) + '-' + toInteger(row.Month) + '-' + toInteger(row.DayofMonth)}]->(destination)
ON CREATE SET connection.departure = toInteger(row.CRSDepTime), connection.arrival = toInteger(row.CRSArrTime);
CREATE INDEX Airport_code_index FOR (a:Airport) ON (a.code);
CREATE CONSTRAINT Flight_flightId_constraint ON (f:Flight)
ASSERT f.flightId IS UNIQUE;
CREATE INDEX Flight_number_index FOR (f:Flight) ON (f.number);
MATCH (origin:Airport)-[connection:CONNECTED_TO]->(destination:Airport)
MERGE (newFlight:Flight { flightId: connection.airline +  connection.flightNumber + 
       '_' + connection.date +  '_' + origin.code + '_' + destination.code })
ON CREATE SET newFlight.date = connection.date,
              newFlight.airline = connection.airline,
              newFlight.number = connection.flightNumber,
              newFlight.departure = connection.departure,
              newFlight.arrival = connection.arrival
MERGE (origin)<-[:ORIGINATES_FROM]-(newFlight)
MERGE (newFlight)-[:LANDS_IN]->(destination);
MATCH ()-[connection:CONNECTED_TO]->()
DELETE connection


