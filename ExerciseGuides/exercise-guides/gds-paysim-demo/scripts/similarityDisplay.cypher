MATCH p=(c:Client)-[:SIMILAR_TO]->()
WHERE c.firstPartyFraudGroup IN $bigFirstPartyFraudGroups
RETURN p;
