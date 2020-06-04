MATCH (n) DETACH DELETE n;
MERGE (a1:Airport {code: 'LAS'})
MERGE (a2:Airport {code:'LAX'})
MERGE (a3:Airport {code:'ABQ'})
MERGE (a1)-[:CONNECTED_TO {airline:'WN',flightNumber:'82',date:'2019-1-3',departure:'1715',arrival:'1820'}]->(a2)
MERGE (a1)-[:CONNECTED_TO {airline:'WN',flightNumber:'500',date:'2019-1-3',departure:'1445',arrival:'1710'}]->(a3)