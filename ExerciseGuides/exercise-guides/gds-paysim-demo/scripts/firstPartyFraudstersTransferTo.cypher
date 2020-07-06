MATCH (c1:Client:FirstPartyFraudster)-[]->(t:Transaction)-[]->(c2:Client)
WHERE NOT c2:FirstPartyFraudster
WITH c1,c2,sum(t.amount) AS totalAmount
SET c2:SecondPartyFraudSuspect
MERGE (c1)-[t:TRANSFER_TO]->(c2)
	ON CREATE SET t.amount=totalAmount;
