CALL apoc.schema.assert({},{},true);
MATCH (:Flight)-[rel:ORIGINATES_FROM]-(:Airport)  DELETE rel;
MATCH (:Flight)-[rel:LANDS_IN]-(:Airport) DELETE rel;
MATCH (:Flight)-[rel:ORIGINATES_FROM]-(:AirportDay)  DELETE rel;
MATCH (:Flight)-[rel:LANDS_IN]-(:AirportDay) DELETE rel;
MATCH (n) DETACH DELETE n;
CREATE 
  (`0` :Airport {code:'LAS'}) ,
  (`1` :Airport {code:'LAX'}) ,
  (`2` :Airport {code:'ABQ'}) ,
  (`0`)-[:`CONNECTED_TO` {airline:'WN',flightNumber:'82',date:'2019-1-3',departure:'1715',arrival:'1820'}]->(`1`),
  (`0`)-[:`CONNECTED_TO` {airline:'WN',flightNumber:'500',date:'2019-1-3',departure:'1445',arrival:'1710'}]->(`2`);
LOAD CSV WITH HEADERS FROM 'https://r.neo4j.com/flights_2019_1k' AS row
MERGE (origin:Airport {code: row.Origin})
MERGE (destination:Airport {code: row.Dest})
MERGE (origin)-[connection:CONNECTED_TO {
  airline: row.UniqueCarrier,
  flightNumber: row.FlightNum,
  date: toInteger(row.Year) + '-' + toInteger(row.Month) + '-' + toInteger(row.DayofMonth)}]->(destination)
ON CREATE SET connection.departure = toInteger(row.CRSDepTime), connection.arrival = toInteger(row.CRSArrTime);
CREATE CONSTRAINT ON (f:Flight)
ASSERT f.flightId IS UNIQUE;
CREATE INDEX ON :Flight(number);
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
DELETE connection;
CREATE INDEX ON :Airport(code);
LOAD CSV WITH HEADERS FROM 'https://r.neo4j.com/flights_2019_10k' AS row
MERGE (origin:Airport {code: row.Origin})
MERGE (destination:Airport {code: row.Dest})
MERGE (newFlight:Flight { flightId: row.UniqueCarrier + row.FlightNum + '_' + row.Year + '-' + row.Month + '-' + row.DayofMonth + '_' + row.Origin + '_' + row.Dest }   )
ON CREATE SET newFlight.date = toInteger(row.Year) + '-' + toInteger(row.Month) + '-' + toInteger(row.DayofMonth),
              newFlight.airline = row.UniqueCarrier,
              newFlight.number = row.FlightNum,
              newFlight.departure = toInteger(row.CRSDepTime),
              newFlight.arrival = toInteger(row.CRSArrTime)
MERGE (newFlight)-[:ORIGINATES_FROM]->(origin)
MERGE (newFlight)-[:LANDS_IN]->(destination);
CREATE CONSTRAINT ON (a:AirportDay)
ASSERT a.airportDayId IS UNIQUE;
MATCH (origin:Airport)<-[:ORIGINATES_FROM]-(flight:Flight)-
       [:LANDS_IN]->(destination:Airport)
MERGE (originAirportDay:AirportDay 
      {airportDayId: origin.code + '_' + flight.date})
SET originAirportDay.date = flight.date
MERGE (destinationAirportDay:AirportDay 
       {airportDayId: destination.code + '_' + flight.date})
SET destinationAirportDay.date = flight.date
MERGE (origin)-[:HAS_DAY]->(originAirportDay)
MERGE (flight)-[:ORIGINATES_FROM]->(originAirportDay)
MERGE (flight)-[:LANDS_IN]->(destinationAirportDay)
MERGE (destination)-[:HAS_DAY]->(destinationAirportDay);
MATCH (origin:Airport)-[hasDay:HAS_DAY]->(ad:AirportDay)
CALL apoc.create.relationship(startNode(hasDay), 
                              'ON_' + ad.date,
                              {},
                              endNode(hasDay) ) YIELD rel
RETURN COUNT(*);

LOAD CSV WITH HEADERS FROM "https://r.neo4j.com/flights_2019_100k" AS row
UNWIND [row.Origin, row.Dest] AS airport
WITH DISTINCT airport
MERGE (:Airport {code: airport});

USING PERIODIC COMMIT 10000
LOAD CSV WITH HEADERS FROM "https://r.neo4j.com/flights_2019_100k" AS row
MATCH (origin:Airport {code: row.Origin})
MATCH (destination:Airport {code: row.Dest})
MERGE (newFlight:Flight { flightId: row.UniqueCarrier + row.FlightNum + "_" + row.Year + "-" + row.Month + "-" + row.DayofMonth + "_" + row.Origin + "_" + row.Dest }   )
ON CREATE SET newFlight.date = toInteger(row.Year) + "-" + toInteger(row.Month) + "-" + toInteger(row.DayofMonth),
              newFlight.airline = row.UniqueCarrier,
              newFlight.number = row.FlightNum,
              newFlight.departure = toInteger(row.CRSDepTime),
              newFlight.arrival = toInteger(row.CRSArrTime)
MERGE (origin)<-[:ORIGINATES_FROM]-(newFlight)
MERGE (newFlight)-[:LANDS_IN]->(destination);

MATCH (f:Flight)
SET f:Process;

call apoc.periodic.commit('
MATCH (flight:Process)
WITH flight LIMIT {limit}

MATCH (origin:Airport)<-[:ORIGINATES_FROM]-(flight)-[:LANDS_IN]->(destination:Airport)

MERGE (originAirportDay:AirportDay {airportDayId: origin.code + "_" + flight.date})
ON CREATE SET originAirportDay.date = flight.date

MERGE (destinationAirportDay:AirportDay {airportDayId: destination.code + "_" + flight.date})
ON CREATE SET destinationAirportDay.date = flight.date

MERGE (origin)-[:HAS_DAY]->(originAirportDay)
MERGE (originAirportDay)<-[:ORIGINATES_FROM]-(flight)
MERGE (flight)-[:LANDS_IN]-(destinationAirportDay)
MERGE (destination)-[:HAS_DAY]->(destinationAirportDay)

REMOVE flight:Process
RETURN COUNT(*)

',{limit:500}
);

MATCH (ad:AirportDay)
SET ad:Process;

MATCH (airport:Airport)-[r]->(:AirportDay)
WHERE NOT TYPE(r) = "HAS_DAY"
DELETE r;

call apoc.periodic.commit('
  MATCH (ad:Process)
  WITH ad LIMIT {limit}

  MATCH (origin:Airport)-[hasDay:HAS_DAY]->(ad:AirportDay)
  CALL apoc.create.relationship(startNode(hasDay), "ON_" + ad.date, {}, endNode(hasDay) ) YIELD rel

  REMOVE ad:Process
  RETURN COUNT(*)
',{limit:500})






