var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');


/////
// This is what's called by the main app 
exports.init = function(req, res){

	oracledb.maxRows = 300;
	oracledb.getConnection({
		    user          : dbConfig.user,
		    password      : dbConfig.password,
		    connectString : dbConfig.connectString
  		},
  		function(err, connection) {
    		if (err) {
      			console.error(err.message);
      			return;
    		}
   			console.log('Connection was successful!');

   			var searchfields = {};

   			var query = "select distinct(nationality) from player order by nationality";
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.log(query);
                        console.error(err.message);
                        return;
                    }
                    console.log(results.rows[0]);
                    console.log(results.rows.length);
    			    searchfields.nation = results.rows;

                    postion();
                });

                function postion(){
                    var query = "select distinct(position) from player order by position";
                    console.log(query);

                    connection.execute(query, [],
                        function(err, results) {
                            if (err) {
                                console.log(query);
                                console.error(err.message);
                                return;
                            }
                            console.log(results.rows[0]);
                            console.log(results.rows.length);
                            searchfields.position = results.rows;

                            number();
                        });

                        function number(){
                            var query = "select distinct(pnumber) from player order by pnumber";
                            console.log(query);

                            connection.execute(query, [],
                                function(err, results) {
                                    if (err) {
                                        console.log(query);
                                        console.error(err.message);
                                        return;
                                    }
                                    console.log(results.rows[0]);
                                    console.log(results.rows.length);
                                    searchfields.pnumber = results.rows;
                                    club();
                                });
                                function club(){
                                    var query = "select distinct(club) from player order by club";
                                    console.log(query);

                                    connection.execute(query, [],
                                        function(err, results) {
                                            if (err) {
                                                console.log(query);
                                                console.error(err.message);
                                                return;
                                            }
                                            console.log(results.rows[0]);
                                            console.log(results.rows.length);
                                            searchfields.club = results.rows;
                                            captain();
                                        }); 
                                        function captain(){
                                            var query = "select distinct(isCaptain) from player order by isCaptain";
                                            console.log(query);

                                            connection.execute(query, [],
                                                function(err, results) {
                                                    if (err) {
                                                        console.log(query);
                                                        console.error(err.message);
                                                        return;
                                                    }
                                                    console.log(results.rows[0]);
                                                    console.log(results.rows.length);
                                                    searchfields.isCaptain = results.rows;
                                                    searchplayer();
                                                    doRelease(connection);
                                        });                                             
                                        }

                                }
                        }

                    
                }

                function searchplayer(){
                    res.render('searchplayer.jade', {
            			title: "All players",
            			results: searchfields
            		});
            }  
  	});

};


exports.do_work = function(req, res) {
    var nation = req.query.nation;
    var position = req.query.position;
    var number = req.query.pnumber;
    var club = req.query.club;
    var captain = req.query.isCaptain;
    oracledb.maxRows = 50;
    oracledb.getConnection({
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString
        },
        function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Connection was successful!');

            var query = "select fullname from player";
            if(nation || position||number||club||captain) {
                query = query + " where ";
                var flag = 0;
                if(nation) {
                    query = query + "nationality = '" + nation + "'";
                    flag = 1;
                }
                if(position) {
                    if (flag) query = query + " and ";
                    query = query + "position = '" + position + "'";
                    flag = 1;
                }
                if(number) {
                    if (flag) query = query + " and ";
                    query = query + "pnumber = '" + number + "'";
                    flag = 1;
                }
                if(club) {
                    if (flag) query = query + " and ";
                    query = query + "club = '" + club + "'";
                    flag = 1;
                }
                if(captain) {
                    if (flag) query = query + " and ";
                    query = query + "iscaptain = '" + captain + "'";
                    flag = 1;
                }
                query = query + " order by fullname";
            }
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    //console.log(results.rows[0]);
                    //console.log(results.rows.length);

                    searchplayer(results);
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


            function searchplayer(results) {
                res.render('players.jade', {
                title: "All players",
                results: results.rows
                });
            }  
    });

};


exports.details = function(req, res) {
    var fullname = req.query.fullname;
    oracledb.maxRows = 50;
    oracledb.getConnection({
            user          : dbConfig.user,
            password      : dbConfig.password,
            connectString : dbConfig.connectString
        },
        function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Connection was successful!');

            var output = {};

            var query = "select * from player where fullname = '" + fullname + "'";
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    var temp = results.rows[0][8].toString();
                    temp = temp.split(" ");
                    temp = [temp[3],temp[1],temp[2]];
                    results.rows[0][8] = temp.join("-");
                    
                    console.log(results.rows[0]);
                    console.log(results.rows.length);

                    output.thisplayer = results.rows[0];

                    otherplayer();
                    
                    
                });

            function otherplayer() {
                var query1 = "select fullname from player where nationality = '" + output.thisplayer[2] + "'";
                var query2 = "select fullname from player where club = '" + output.thisplayer[6] + "'";
                var query = "(" + query1 + ") UNION (" + query2 + ")";
                console.log(query)

                connection.execute(query, [],
                    function(err, results) {
                        if (err) {
                            console.error(err.message);
                            return;
                        }
                        output.otherplayer = results.rows;
                        searchplayer();

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


            function searchplayer() {
                res.render('playerdetail.jade', {
                    title: "Players",
                    results: output
                    });
            }  
    });

};


function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}