from flask import Flask
from flask import render_template
import neo4j

app = Flask(__name__)
driver = neo4j.Driver("bolt://localhost", auth=("neo4j", "neo"))


@app.route("/")
def photos():
    with driver.session() as session:
        rows = session.run("""
        MATCH (p1:Photo)-[r:SIMILAR]->(p2:Photo)
        RETURN p1.id AS p1, r.score AS score, p2.id AS p2,
               [(p1)-[:HAS_LABEL]->(label) | label.description] AS p1Labels,
               [(p2)-[:HAS_LABEL]->(label) | label.description] AS p2Labels
        ORDER BY score
        LIMIT 100
        """)

        photos = [row for row in rows]

    return render_template('photos.html', photos=photos)

@app.route("/clusters/")
def all_clusters():
    with driver.session() as session:
        rows = session.run("""
        MATCH (p:Photo)
        RETURN p.community AS community, count(*) AS c
        ORDER BY c DESC
        LIMIT 50
        """)
        clusters = [cluster for cluster in rows]
        return render_template('all_clusters.html', clusters=clusters)

@app.route("/clusters/<cluster_id>")
def clusters(cluster_id):
    with driver.session() as session:
        rows = session.run("""
        MATCH (p:Photo {community: {clusterId}})
        RETURN p.id AS p1,
               [(p)<-[:HAS_PHOTO]-(business) | business.name][0] AS business,
               [(p)-[:HAS_LABEL]->(label) | label.description] AS labels
        """, {"clusterId": int(cluster_id)})

        photos = [row for row in rows]

    return render_template('clusters.html', photos=photos)
