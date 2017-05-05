var oracledb = require('oracledb');
var question = ['Which club has the most number of players paticipated in the world cup?', 
                'Which teams make the most goals in one game?',
                'Which teams advanced to the second round?',
                'Which teams advanced to the third round?'];
exports.do_work_a1 = function(req, res) {
    var ques = req.query.ques;
    
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

            var query1 = "With ClubCount AS (Select Club, count(*) as num From Player Group by Club) Select Club From ClubCount Where num >= ALL(select num from ClubCount)";
            var query2 = "(Select distinct (ATeam) Nation From Match Where (AGoal >= ALL (Select AGoal from Match) AND AGoal >= ALL (Select HGoal from Match))) UNION (Select distinct (HTeam) Nation From Match Where (HGoal >= ALL (Select AGoal from Match) AND HGoal >= ALL (Select HGoal from Match)))";
            var query3 = "SELECT ATEAM FROM MATCH WHERE ID > 48 UNION SELECT HTEAM FROM MATCH WHERE ID > 48";
            var query4 = "SELECT ATEAM FROM MATCH WHERE ID > 56 UNION SELECT HTEAM FROM MATCH WHERE ID > 56";
            if(ques == question[0]) query = query1; 
            if(ques == question[1]) query = query2;
            if(ques == question[2]) query = query3;
            if(ques == question[3]) query = query4;
            var r = {};
                  
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log(results.rows[0]);
                    console.log(results.rows.length);
                    r.res = results.rows;
                    showCountry();
                });
                
                function showCountry(){
                    var query = "select distinct hteam from match order by hteam";
                    console.log(query);
                    connection.execute(query, [],
                		function(err, results) {
                    		if (err) {
                        		console.error(err.message);
                        		return;
                    		}
                    		console.log(results.rows[0]);
                    		console.log(results.rows.length);
                    		
                    		r.country = results.rows;
                
                    		searchplayer(r);
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


            function searchplayer(r) {
                res.render('others_a1.jade', {
                ques1: ques,
                question: question,
                results1: r.res,
                results: r.country,
                title0: 'Which players got a specific number of goals? (please input number only)',
                title1: 'Please select the question you are interested in',
                title2: 'Which players got a specific number of yellow cards? (please input number only)',
                title3: 'The total scores lost for a certain team in World Cup? (please select team)',
                title4: 'Which clubs have a specific number of players participated in world cup? (please input number only)'                
                });
            }  
    });

};

exports.do_work_a2 = function(req, res) {
    var number = req.query.number;
    var r = {};
//    oracledb.maxRows = 50;
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

            var query = "With T AS (Select Player, Type From event Where Type like 'yellow%') Select nationality, player From (Select Player, count(*) as num From T Group by Player) R inner join PLAYER ON PLAYER.FULLNAME = R.Player Where num = ";
            if(number) {
                query = query + number + " order by nationality";        
            }
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    
                    var x = results.rows;
                    if (results.rows[0] == null) x = [['None', '']];
                    console.log(x);

                    for(var i = 1; i < x.length; i++){
                        if(x[i][0] == x[i-1][0]){
                        	x[i-1][1] = x[i-1][1] + ', ' + x[i][1];
                        	x.splice(i, 1);
                        	i--;
                        }
                    }
                    console.log(x);

                    r.res = x;
                    console.log(r);
                    showCountry();
                });
                
                function showCountry(){
                    var query = "select distinct hteam from match order by hteam";
                    console.log(query);
                    connection.execute(query, [],
                		function(err, results) {
                    		if (err) {
                        		console.error(err.message);
                        		return;
                    		}
                    		console.log(results.rows[0]);
                    		console.log(results.rows.length);
                    		
                    		r.country = results.rows;
                    		console.log(r);
                
                    		yellow(r);
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


            function yellow(r) {
                res.render('others_a2.jade', {
                ques2: "Which players got " + number + " yellow cards?",
                question: question,
                results2: r.res,
                title0: 'Which players got a specific number of goals? (please input number only)',
                title1: 'Please select the question you are interested in',
                title2: 'Which players got a specific number of yellow cards? (please input number only)',
                title3: 'The total scores lost for a certain team in World Cup? (please select team)',
                title4: 'Which clubs have a specific number of players participated in world cup? (please input number only)',
                results: r.country
                });
            }  
    });

};

exports.do_work_a3 = function(req, res) {
    var nation = req.query.country;
    var r = {};
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

            var query = "SELECT A.SumAway+B.SumHome AS TotalLost FROM (SELECT SUM(HGoal) AS SumAway FROM  Match M1 WHERE M1.ATeam = '";
            if(nation) {
                query = query + nation + "') A, (SELECT SUM(AGoal) AS SumHome FROM  Match M2 WHERE M2.HTeam = '" + nation + "' ) B";        
            }
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log(results.rows[0]);
                    console.log(results.rows.length);
                    
                    r.res = results.rows;
                    
                    showCountry();
                });
                
                function showCountry(){
                    var query = "select distinct hteam from match order by hteam";
                    console.log(query);
                    connection.execute(query, [],
                		function(err, results) {
                    		if (err) {
                        		console.error(err.message);
                        		return;
                    		}
                    		console.log(results.rows[0]);
                    		console.log(results.rows.length);
                    		
                    		r.country = results.rows;
                
                    		findscore(r);
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

            function findscore(r) {
                res.render('others_a3.jade', {
                ques3: "The total scores lost for " + nation + " is:",
                question: question,
                results3: r.res,
                title0: 'Which players got a specific number of goals? (please input number only)',
                title1: 'Please select the question you are interested in',
                title2: 'Which players got a specific number of yellow cards? (please input number only)',
                title3: 'The total scores lost for a certain team in World Cup? (please select team)',
                title4: 'Which clubs have a specific number of players participated in world cup? (please input number only)',                
                results: r.country
                });
            }  
    });

};

exports.do_work_a4 = function(req, res) {
    var number = req.query.number;
    var r = {};
//    oracledb.maxRows = 50;
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

            var query = "With ClubCount AS (Select Club, count(*) as num From Player Group by Club) Select Club From ClubCount Where num = ";
            if(number) {
                query = query + number;        
            }
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    var x = results.rows;
                    if (results.rows[0] == null) x = [['None', '']];
                    console.log(x);

//                    for(var i = 1; i < x.length; i++){
//                        x[i-1][0] = x[i-1][0] + ', ' + x[i][0];
//                        x.splice(i, 1);
//                        i--;
//                    }
//                    console.log(x);

                    r.res = x;
                    console.log(r);
                    showCountry();
                });
                
                function showCountry(){
                    var query = "select distinct hteam from match order by hteam";
                    console.log(query);
                    connection.execute(query, [],
                		function(err, results) {
                    		if (err) {
                        		console.error(err.message);
                        		return;
                    		}
                    		console.log(results.rows[0]);
                    		console.log(results.rows.length);
                    		
                    		r.country = results.rows;
                    		console.log(r);
                
                    		yellow(r);
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


            function yellow(r) {
                res.render('others_a4.jade', {
                ques4: "Which clubs had " + number + " players participated in world cup?",
                question: question,
                results4: r.res,
                title0: 'Which players got a specific number of goals? (please input number only)',
                title1: 'Please select the question you are interested in',
                title2: 'Which players got a specific number of yellow cards? (please input number only)',
                title3: 'The total scores lost for a certain team in World Cup? (please select team)',
                title4: 'Which clubs have a specific number of players participated in world cup? (please input number only)',
                results: r.country
                });
            }  
    });

};

exports.do_work_a0 = function(req, res) {
    var number = req.query.number;
    var r = {};
//    oracledb.maxRows = 50;
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

            var query = "With T AS (Select Player, Type From event Where Type like 'goal%') Select nationality, player From (Select Player, count(*) as num From T Group by Player) R inner join PLAYER ON PLAYER.FULLNAME = R.Player Where num = ";
            if(number) {
                query = query + number + " order by nationality";        
            }
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    var x = results.rows;
                    if (results.rows[0] == null) x = [['None', '']];
                    console.log(x);

                    for(var i = 1; i < x.length; i++){
                        if(x[i][0] == x[i-1][0]){
                        	x[i-1][1] = x[i-1][1] + ', ' + x[i][1];
                        	x.splice(i, 1);
                        	i--;
                        }
                    }
                    console.log(x);

                    r.res = x;
                    console.log(r);
                    showCountry();
                });
                
                function showCountry(){
                    var query = "select distinct hteam from match order by hteam";
                    console.log(query);
                    connection.execute(query, [],
                		function(err, results) {
                    		if (err) {
                        		console.error(err.message);
                        		return;
                    		}
                    		console.log(results.rows[0]);
                    		console.log(results.rows.length);
                    		
                    		r.country = results.rows;
                    		console.log(r);
                
                    		yellow(r);
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


            function yellow(r) {
                res.render('others_a0.jade', {
                ques0: "Which players got " + number + " goals?",
                question: question,
                results0: r.res,
                title: 'Intersting questions',
                results: r.country
                });
            }  
    });

};

