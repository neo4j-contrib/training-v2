1. Cloned the repository:

	git clone https://github.com/neo4j-contrib/sandbox-guides.git
	cd sandbox-guides
	git submodule init
	git submodule update    (this adds content to neo4j-guides)


2. In order to have the test python server start in the correct folder when I was building the sandbox guides, I needed to add "cd .." In the render.sh file just before python starts. This enables the browser guide to be accessed using its directory.

3. To render:

	cd {USE-CASE}
	./render.sh 

4. In order to play a guide that has dashes in it, turn off Enable multi-statement query editor

TO DO:

- all render.sh files should be modified to do a cd .. before starting python
- modify the README.md