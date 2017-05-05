// Connect string to MySQL
var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://cis550group33:cis550projectgroup33@cluster0-shard-00-00-t40bc.mongodb.net:27017,cluster0-shard-00-01-t40bc.mongodb.net:27017,cluster0-shard-00-02-t40bc.mongodb.net:27017/rank?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';


/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
// Get a non-pooled connection
exports.do_work = function(req, res){
    console.log('At teamsearch');
    var team = req.query.name;
    var output = {};
    console.log(team);

    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log("mongodb connection error");
      } 
      else {
        console.log("mongodb connection success");
        var rank = db.collection('rank');
        var result = rank.find({team:team}).sort({Date:1}).toArray(function (err, result) {
        if (err) {
            console.log(err);
          } 
          else if (result.length) {
            var timeline = [];
            var rankline = [];
            for (i = 0; i < result.length; i++) {
              timeline.push(result[i].Date.toString());
              rankline.push(result[i].Rank);
            }
            output.timeline = timeline;
            output.rankline = rankline;
            output.rank = result;
            console.log(output.rank);
          } 
          else {
            console.log('No document(s) found with defined "find" criteria! (mongodb)');
          }
          //Close connection
          db.close();
        });
        /////

        oracledb.getConnection(
          {
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString
          },
          function(err, connection)
          {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log('oracledb connection was successful!');
            
            var query = "Select * From Team INNER JOIN Player on Team.nation = Player.nationality"
            if (team) {
              query = query + " where nation = '" + team + "'"+"Order by Player.pnumber";
            }

            console.log(query);

            connection.execute(query, [],

              // Optional execute options argument, such as the query result format
              // or whether to get extra metadata
              // { outFormat: oracledb.OBJECT, extendedMetaData: true },

              // The callback function handles the SQL execution results
              function(err, results)
              {
                if (err) {
                  console.error(err.message);
                  doRelease(connection);
                  return;
                }
                for (var i=0;i<23;i++){
                  var temp = results.rows[i][10].toString();
                  temp = temp.split(" ");
                  temp = [temp[3],temp[1],temp[2]];
                  results.rows[i][10] = 2014-temp[0];
              }
                console.log(results); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
                //console.log(result.rows[0].num);     // [ [ 180, 'Construction' ] ]
                //output_teams(res, result.rows); //line team.jade


                output.team = results;
                //console.log(output.rank);
                console.log('before release');
                //match information
                match();

                
                //doRelease(connection);
              });

              function match() {
                var query = "select * from match where Hteam = '"+team+"' or Ateam = '"+team+"'";
                console.log(query)
                connection.execute(query, [],
                    function(err, results) {
                        if (err) {
                            console.log('lala');
                            console.error(err.message);
                            return;
                        }
                        console.log(results);
                        output.matches = results;
                        output_teams(res, output);
                        doRelease(connection);

                        // connection.release(
                        //     function(err) {
                        //         if (err) {
                        //             console.error(err.message);
                        //             return;
                        //         }
                        //         console.log("release successful");
                        //     });
                    });                

              }




              function doRelease(connection)
              {
                connection.close(
                  function(err) {
                    if (err) {
                      console.error(err.message);
                    }
                  });
              }

              function output_teams(res, results) {
                //console.log(results);
                console.log('beforejade');
                //console.log(results.rank);
                //console.log(results.rankline.length);
                //console.log(results.timeline.length);
                //console.log(results.rankline);
                //console.log(results.timeline);
                //console.log(results.team);
                //console.log(results.matches);
                res.render('teamDetail.jade',{ 
                  title: "Team detail ",
                  country: returnCountry(),
                  results: results }
                );
              }

              function returnCountry(){
                var myMap = new Map();
                myMap.set("Brazil","images/br.png");
                myMap.set("Mexico","images/mx.png");
          myMap.set("Croatia","images/hr.png");
                myMap.set("Cameroon","images/cm.png");
                myMap.set("Netherlands","images/nl.png");
                myMap.set("Chile","images/cl.png");
          myMap.set("Spain","images/es.png");
                myMap.set("Australia","images/au.png");
                myMap.set("Colombia","images/co.png");
                myMap.set("Greece","images/gr.png");
          myMap.set("Ivory Coast","images/ci.png");
                myMap.set("Japan","images/jp.png");
                myMap.set("Costa Rica","images/cr.png");
                myMap.set("Uruguay","images/uy.png");
          myMap.set("Italy","images/it.png");
                myMap.set("England","images/en.gif");
                myMap.set("France","images/fr.png");
                myMap.set("Switzerland","images/sw.png");
          myMap.set("Ecuador","images/ec.png");
                myMap.set("Honduras","images/hn.png");
                myMap.set("Argentina","images/ar.png");
                myMap.set("Nigeria","images/ng.png");
          myMap.set("Bosnia and Herzegovina","images/ba.png");
                myMap.set("Iran","images/ir.png");
                myMap.set("Germany","images/de.png");
                myMap.set("United States","images/us.png");
          myMap.set("Portugal","images/pt.png");
                myMap.set("Ghana","images/gh.png");
                myMap.set("Belgium","images/be.png");
                myMap.set("Algeria","images/al.png");
          myMap.set("Russia","images/ru.png");
                myMap.set("South Korea","images/kr.png");                       
                return myMap.get(team);
              } 
          });
        //////
      }
    });




    };


    // Note: connections should always be released when not needed



    // ///
    // Given a set of query results, output a table
    //
    // res = HTTP result object sent back to the client
    // name = Name to query for
    // results = List object of query results


/////
// This is what's called by the main app 


