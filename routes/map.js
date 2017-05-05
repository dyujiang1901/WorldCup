var oracledb = require('oracledb');
var m = require('./iso.js');

exports.do_work = function(req, res) {
    oracledb.maxRows = 50;
    oracledb.getConnection({
            user: "cis550group33",
            password: "cis550projectgroup33",
            connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)\
(HOST=cis550project.cqsfkugmmyy9.us-east-1.rds.amazonaws.com)(PORT=1521))\
(CONNECT_DATA=(SID=worldcup)))"
        },
        function(err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('Connection was successful!');

            var result = {};
            var query = "select HTEAM, HGOAL + AGOAL AS GOAL from (select HTEAM, sum(HGOAL) AS HGOAL from match group by HTEAM) M1, (select ATEAM, sum(AGOAL) AS AGOAL from match group by ATEAM) M2 where M1.HTEAM = M2.ATEAM order by goal desc";
                  
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    for (var i = 0; i < results.rows.length; i++)
                    	results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                    
                    console.log(results.rows);
                    console.log(results.rows.length);
                    
                    result.goal = results.rows;
                    lost();
                    


                });

                function lost(){
                    var query2 = "select HTEAM, HGOAL + AGOAL AS GOAL from (select HTEAM, sum(AGOAL) AS HGOAL from match group by HTEAM) M1, (select ATEAM, sum(HGOAL) AS AGOAL from match group by ATEAM) M2 where M1.HTEAM = M2.ATEAM order by goal desc";
                    console.log(query2);

                    connection.execute(query2, [],
                        function(err, results) {
                            if (err) {
                                console.log(query2);
                                console.error(err.message);
                                return;
                            }
                            for (var i = 0; i < results.rows.length; i++)
                    	        results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                            console.log(results.rows);
                            console.log(results.rows.length);
                            
                            result.lost = results.rows;
                            yellow();
                        });      
                }
                
                

                function yellow(){
                    var query3 = "SELECT TEAM.NATION, YELLOW FROM (select TEAM, COUNT(*) AS YELLOW from EVENT WHERE TYPE LIKE 'yellow%' GROUP BY TEAM) Y, TEAM WHERE Y.TEAM = TEAM.FIFACODE ORDER BY YELLOW DESC";
                    console.log(query3);

                    connection.execute(query3, [],
                        function(err, results) {
                            if (err) {
                                console.log(query3);
                                console.error(err.message);
                                return;
                            }
                            for (var i = 0; i < results.rows.length; i++)
                    	        results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                            console.log(results.rows);
                            console.log(results.rows.length);
                            
                            result.yellow = results.rows;
                            red();
                        });      
                }
                
                

                function red(){
                    var query4 = "SELECT HTEAM, COALESCE(RED, 0) FROM (SELECT NATION, RED FROM (select TEAM, COUNT(*) AS RED from EVENT WHERE TYPE LIKE 'red%' GROUP BY TEAM) Y INNER JOIN TEAM ON Y.TEAM = TEAM.FIFACODE) X1 RIGHT OUTER JOIN (SELECT DISTINCT HTEAM FROM MATCH) X2 ON X1.NATION  = X2.HTEAM";
                    console.log(query4);

                    connection.execute(query4, [],
                        function(err, results) {
                            if (err) {
                                console.log(query4);
                                console.error(err.message);
                                return;
                            }
                            for (var i = 0; i < results.rows.length; i++)
                    	        results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                            console.log(results.rows);
                            console.log(results.rows.length);
                            
                            result.red = results.rows;
                            console.log(result);
                            goalClub();
                            

                        });      
                }


                function goalClub() {
                    var query = "SELECT T.NATION, COUNT(*) AS goal FROM (SELECT Player FROM EVENT WHERE type LIKE 'goal%') G INNER JOIN PLAYER P ON P.FULLNAME = G.Player INNER JOIN TEAM T ON P.CLUBCOUNTRY = T.FIFACODE GROUP BY T.NATION ORDER BY goal DESC";
                    console.log(query);

                    connection.execute(query, [],
                        function(err, results) {
                            if (err) {
                                console.log(query);
                                console.error(err.message);
                                return;
                            }
                            for (var i = 0; i < results.rows.length; i++)
                                results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                            console.log(results.rows);
                            console.log(results.rows.length);
                            
                            result.goalClub = results.rows;
                            console.log(result);
                            
                            playerClub();

                        });
                }

                function playerClub() {
                    var query = "select T.NATION, count(*) as num from PLAYER P inner join TEAM T on P.CLUBCOUNTRY = T.FIFACODE group by T.NATION order by num desc";
                    console.log(query);

                    connection.execute(query, [],
                        function(err, results) {
                            if (err) {
                                console.log(query);
                                console.error(err.message);
                                return;
                            }
                            for (var i = 0; i < results.rows.length; i++)
                                results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                            console.log(results.rows);
                            console.log(results.rows.length);
                            
                            result.playerClub = results.rows;
                            console.log(result);
                            
                            yellowClub();

                        });
                }

                function yellowClub() {
                    var query = "select T.NATION, count(*) as yellow from (select Player from EVENT where type like 'yellow%') G inner join PLAYER P on P.FULLNAME = G.Player inner join TEAM T on P.CLUBCOUNTRY = T.FIFACODE group by T.NATION order by yellow desc";
                    console.log(query);

                    connection.execute(query, [],
                        function(err, results) {
                            if (err) {
                                console.log(query);
                                console.error(err.message);
                                return;
                            }
                            for (var i = 0; i < results.rows.length; i++)
                                results.rows[i][0] = m.getMap.get(results.rows[i][0]);
                            console.log(results.rows);
                            console.log(results.rows.length);
                            
                            result.yellowClub = results.rows;
                            console.log(result);
                            
                            showmap(result);
                            
                            connection.release(
                            function(err) {
                                if (err) {
                                    console.error(err.message);
                                    return;
                                }
                                console.log("release successful");
                            });

                        });
                }


            function showmap(result) {
                var final_result = {};
                final_result.goal = {};
                final_result.lost = {};
                final_result.red = {};
                final_result.yellow = {};
                final_result.goalClub = {};
                final_result.playerClub = {};
                final_result.yellowClub = {};
                console.log(result.goalClub.length);
                var color = ['first class','second class','third class','fourth class','fifth class','sixth class','seventh class','eighth class'];
                for (var j = 0; j < 8; j++)
                    for (var i = 0; i < 4; i++){
                        final_result.goal[result.goal[i + 4*j][0]] = {};
                        final_result.lost[result.lost[i + 4*j][0]] = {};
                        final_result.yellow[result.yellow[i + 4*j][0]] = {};
                        final_result.red[result.red[i + 4*j][0]] = {};
                        
                    	final_result.goal[result.goal[i + 4*j][0]].fillKey = color[j];
                    	final_result.goal[result.goal[i + 4*j][0]].numberOfThings = result.goal[i+ 4*j][1];
                    	final_result.lost[result.lost[i + 4*j][0]].fillKey = color[j];
                    	final_result.lost[result.lost[i + 4*j][0]].numberOfThings = result.lost[i+ 4*j][1];
                    	final_result.yellow[result.yellow[i + 4*j][0]].fillKey = color[j];
                    	final_result.yellow[result.yellow[i + 4*j][0]].numberOfThings = result.yellow[i+ 4*j][1];
                    	final_result.red[result.red[i + 4*j][0]].fillKey = color[j];
                    	final_result.red[result.red[i + 4*j][0]].numberOfThings = result.red[i+ 4*j][1];
                	}
                
                for (var i = 0; i < result.goalClub.length; i++) {
                    if (final_result.goalClub[result.goalClub[i][0]])
                        final_result.goalClub[result.goalClub[i][0]].numberOfThings += result.goalClub[i][1];
                    else {
                        final_result.goalClub[result.goalClub[i][0]] = {};
                        final_result.goalClub[result.goalClub[i][0]].fillKey = color[Math.floor(i/4)];
                        final_result.goalClub[result.goalClub[i][0]].numberOfThings = result.goalClub[i][1];
                    }
                }

                var bin = Math.ceil(result.playerClub.length/8);
                for (var i = 0; i < result.playerClub.length; i++) {
                    if (final_result.playerClub[result.playerClub[i][0]])
                        final_result.playerClub[result.playerClub[i][0]].numberOfThings += result.playerClub[i][1];
                    else {
                        final_result.playerClub[result.playerClub[i][0]] = {};
                        final_result.playerClub[result.playerClub[i][0]].fillKey = color[Math.floor(i/bin)];
                        final_result.playerClub[result.playerClub[i][0]].numberOfThings = result.playerClub[i][1];
                    }
                }

                bin = Math.ceil(result.yellowClub.length/8);
                for (var i = 0; i < result.yellowClub.length; i++) {
                    if (final_result.yellowClub[result.yellowClub[i][0]])
                        final_result.yellowClub[result.yellowClub[i][0]].numberOfThings += result.yellowClub[i][1];
                    else {
                        final_result.yellowClub[result.yellowClub[i][0]] = {};
                        final_result.yellowClub[result.yellowClub[i][0]].fillKey = color[Math.floor(i/bin)];
                        final_result.yellowClub[result.yellowClub[i][0]].numberOfThings = result.yellowClub[i][1];
                    }
                }


                console.log(final_result);
                // console.log(result.goalClub[1][1]);
                res.render('map.jade', {
                data_sum: final_result,
                title:'World Map'
                });
            }  
    });

};


