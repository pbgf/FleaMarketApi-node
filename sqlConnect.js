let mysql = require('mysql')
let connection = mysql.createConnection({
  host     : '120.79.46.144',
  user     : 'root',
  password : 'z681121110',
  database : 'FleaMarket'
})


connection.connect()

let  sql = 'SELECT * FROM user'
//查
connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       console.log('--------------------------connect success----------------------------\n\n');
});
 
connection.end()

export default connection