Neo4j Training Courses

This repository will include newly-developed training courses which includes course content and browser guides. Course content will be the same for online courses and classroom courses with the exception that we produce slides and a PDF for the classroom version, where the online version is strictly html.

The hands-on exercises for the Introduction to Neo4j course will use a browser guide.  https://guides.neo4j.com/intro-neo4j-exercises

The hands-on exercises for the Neo4j Admin course are inline (html) or are in the pdf for classroom use.

Some hints:

Courses:
use ./preview.sh to preview the course locally
For Intro course: use ./build_publish.sh to publish the course GraphAcademy (requires S3 authorization)
For Admin course: use ./build_publish.sh to publish the course to the "dev" staging area (requires S3 authorization)

Browser guide:
use ./render.sh to test locally :play http://localhost:8001/intro-neo4j-exercises 
use ./render.sh publish to publish to S3 (requires S3 authorization)
