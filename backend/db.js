const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql1612",
    database: "todo_db"
});
db.connect(err =>{
    if(err){
        console.error('Error de conexion'+err.stack)
        return
    }
    console.log('Conecta a la base')
})
module.exports = db;