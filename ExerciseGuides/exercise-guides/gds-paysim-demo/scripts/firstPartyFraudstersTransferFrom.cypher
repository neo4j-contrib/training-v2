MATCH (c1:Client:FirstPartyFraudster)<-[]-(t:Transaction)<-[]-(c2:Client)
WITH c1,c2,sum(t.amount) AS totalAmount
MERGE (c1)<-[t:TRANSFER_TO]-(c2)
	ON CREATE SET t.amount=totalAmount;
