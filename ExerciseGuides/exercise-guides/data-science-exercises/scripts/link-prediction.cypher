// tag::initial[]
UNWIND [["A", "C"], ["A", "B"], ["B", "D"],
        ["B", "C"], ["B", "E"], ["C", "D"]] AS pair
MERGE (n1:Node {name: pair[0]})
MERGE (n2:Node {name: pair[1]})
MERGE (n1)-[:FRIENDS]-(n2)
// end::initial[]

// tag::common-neighbors[]
MATCH (a:Node {name: 'A'})
MATCH (d:Node {name: 'D'})
RETURN algo.linkprediction.commonNeighbors(a, d) AS score
// end::common-neighbors[]

// tag::common-neighbors-exercise[]
MATCH (a:Node {name: 'A'})
MATCH (d:Node {name: 'E'})
RETURN algo.linkprediction.commonNeighbors(a, d) AS score
// end::common-neighbors-exercise[]


// tag::adamic-adar[]
MATCH (a:Node), (b:Node)
WHERE a <> b AND a.name < b.name AND not((a)-[:FRIENDS]-(b))
RETURN a.name, b.name, algo.linkprediction.adamicAdar(a, b) AS score
ORDER BY score DESC
// end::adamic-adar[]

// tag::preferential-attachment-exercise[]
MATCH (a:Node {name: 'C'})
MATCH (d:Node {name: 'E'})
RETURN algo.linkprediction.preferentialAttachment(a, d) AS score
// tag::preferential-attachment-exercise[]
