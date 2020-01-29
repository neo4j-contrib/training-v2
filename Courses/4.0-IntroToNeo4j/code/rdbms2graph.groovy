@GrabConfig( systemClassLoader=true )
@Grapes([
  @Grab(group='org.postgresql', module='postgresql', version='42.0.0'),
  @Grab(group='org.neo4j.driver', module='neo4j-java-driver', version='4.0.0')
])

import org.neo4j.driver.*;
import java.sql.*;
Class.forName("org.postgresql.Driver");

table = "products";
JDBC = [url:"jdbc:postgresql://db-examples.cmlvojdj5cci.us-east-1.rds.amazonaws.com/northwind", user:"n4examples", pass:"36gdOVABr3Ex"];
NEO4J=[url:"bolt://localhost:7687", user:"neo4j",pass:"training-helps"];

// see https://neo4j.com/docs/api/java-driver/current/
GraphDatabase.driver(NEO4J.url, AuthTokens.basic(NEO4J.user, NEO4J.pass)).withCloseable{ neo4j -> 
DriverManager.getConnection(JDBC.url, JDBC.user, JDBC.pass).withCloseable { rdbms ->

stmt = rdbms.prepareStatement("SELECT * FROM ${table}");

neo4j.session(SessionConfig.builder().withDatabase("products").build()).withCloseable{ session ->
  session.writeTransaction { tx -> 
   stmt.executeQuery().withCloseable{ rs ->   
     meta = rs.getMetaData();
     cols = meta.getColumnCount();
     while (rs.next()) {
        params = [:];
        for (int i=0;i<cols;i++) {
           params[meta.getColumnName(i+1)]=rs.getObject(i+1);
        }      
        println(params);
        tx.run("CREATE (n:${table}) SET n += \$props", Values.value([props:params])).consume();
     }
   }
}}}}
