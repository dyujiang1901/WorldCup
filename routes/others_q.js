var oracledb = require('oracledb');

exports.do_work_q = function(req, res) {
// questions -----------
            var question = ['Which club has the most number of players paticipated in the world cup?', 
                            ' Which teams make the most goals in one game?',
                            'Which teams advanced to the second round?',
                            'Which teams advanced to the third round?'];
//----------------------
            oracledb.maxRows = 500;
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

                    getcountries(results);
                    connection.release(
                        function(err) {
                            if (err) {
                                console.error(err.message);
                                return;
                            }
                            console.log("release successful");
                        });
                });


            function getcountries(results) {
                res.render('others_q.jade', {
                question: question,
                title: 'Intersting questions',
                results: results.rows
                });
            }  
    });

};

