var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : 'PA19981031',       
  port: '3306',                   
  database: 'znzl' 
}); 
 
connection.connect();
 
var  addSql = 'INSERT INTO location_record(longitude, latitude) VALUES(?, ?)';
var  addSqlParams = ['12.234', '23.456'];
//增
connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
 
       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');  
});
 
connection.end();