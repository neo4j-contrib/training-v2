CREATE INDEX ON :User(id);
CREATE INDEX ON :Photo(id);
CREATE INDEX ON :Photo(partition);

CALL db.index.fulltext.createNodeIndex("BusinessNameIndex", ["Business"], ["name"]);