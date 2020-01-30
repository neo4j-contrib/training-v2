#  Exercises Browser Guides

# Generate the Browser Guides for for the course Introduction to Neo4j 



1. Clone this repo `git clone git@github.com:neo4j-contrib/training-v2/BrowserGuides.git`
2. `cd 4.0-intro-neo4j-exercises`
3. `git submodule init`
4. `git submodule update`
5. Edit the *.adoc files
6. `./render.sh            to test locally :play http://localhost:8001/4.0-intro-neo4j-exercises
7. `./render.sh [publish]` to publish



Guide HTML and image files in `{COURSE}/img` will be pushed to S3 `guides.neo4j.com/exercise` once pushed to GitHub using CircleCI.
