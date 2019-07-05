#  Exercises Browser Guides

# Generate the Browser Guides for for the course Advanced Cypher 



1. Clone this repo `git clone git@github.com:neo4j-contrib/training-v2/BrowserGuides.git`
2. `cd advanced-cypher`
3. `git submodule init`
4. `git submodule update`
5. Edit the *.adoc files
6. `./render.sh            to test locally :play http://localhost:8001/advanced-cypher
7. `./render.sh [publish]` to publish



Guide HTML and image files in `{COURSE}/img` will be pushed to S3 `guides.neo4j.com/exercise` once pushed to GitHub using CircleCI.
