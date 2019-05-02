MATCH (n) DETACH DELETE n;
CALL apoc.schema.assert({},{},true);
CREATE 
  (`0` :Airport {code:'LAS'}) ,
  (`1` :Airport {code:'LAX'}) ,
  (`2` :Airport {code:'ABQ'}) ,
  (`0`)-[:`CONNECTED_TO` {airline:'WN',flightNumber:'82',date:'2019-1-3',departure:'1715',arrival:'1820'}]->(`1`),
  (`0`)-[:`CONNECTED_TO` {airline:'WN',flightNumber:'500',date:'2019-1-3',departure:'1445',arrival:'1710'}]->(`2`)
