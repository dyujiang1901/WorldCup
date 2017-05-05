var oracledb = require('oracledb');
var bodyParser = require("body-parser");
var dbConfig = require('./dbconfig.js');

exports.do_work = function(req, res){
	console.log("ok");
	var userName = JSON.parse(req.body.userData).first_name;
	console.log(userName);
	
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

   			var query = "select * from usertable where username = '" + userName + "'";
            console.log(query);

            connection.execute(query, [],
                function(err, results) {
                    if (err) {
                        console.log(query);
                        console.error(err.message);
                        return;
                    }
                    if (results.rows.length == 0) {
                    	console.log("No record");
                    	count();
                    }
                    else {
                    	res.end("yes");
                    }
                });

            	function count() {
            		var query = "select count(*) from usertable";
            		console.log(query);

            		connection.execute(query,[],
            			function(err, results) {
		                    if (err) {
		                        console.log(query);
		                        console.error(err.message);
		                        return;
		                    }
		                    console.log(results.rows[0][0]);
		                    insert(results.rows[0][0]+1);
		                });
            	}

            	function insert(id) {
            		console.log(id);
            		console.log(userName);
            		var query = "insert into usertable values (:id,:username)";
            		console.log(query);

            		connection.execute(query, [id,userName], { autoCommit: true},
	                function(err, results) {
	                    if (err) {
	                        console.log(query);
	                        console.error(err.message);
	                        return;
	                    }
	                    console.log("Rows inserted: " + results.rowsAffected);
	                    doRelease(connection);
	                    res.end("yes");
	                    
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