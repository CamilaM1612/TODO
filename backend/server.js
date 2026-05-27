const express = require("express")
const cors = require("cors")
const db = require("./db")
const app = express()
const multer = require("multer");

app.use(cors())
app.use(express.json())

// archivo
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "Archivos/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const subir = multer ({ storage });


// mostrar tareas
app.get("/tareas",(req, res) => {
    db.query(
        "SELECT* FROM tareas", (err, results) =>{
            if(err){
                res.status(500).send({
                    error: 'Error al obtener las tareas'
                })
            }else{
                res.json(results)
            }
        })
})

// agregar tarea
app.post("/tareas", (req, res) => {
    const {descripcion} = req.body

    const query = 'INSERT INTO tareas (descripcion) VALUES (?)'

    db.query(query, [descripcion], (err,results)=> {
        if (err){
            res.status(500).send({
                error: 'Error al crear la tarea'
            })
        }else{
            res.status (201).json({
                id: results.insertId,
                descripcion
            })
            
        }
    })
})

//agregar archivo
app.post("/archivos", subir.single("archivo"), (req,res)=>{
    res.json({
        mensaje: "Archivo Subido",
        archivo: req.file
    });
});

app.delete("/tareas/:id", (req, res) => {
    const { id } = req.params

    const query = 'DELETE FROM tareas WHERE id = ?'

    db.query(query, [id], (err,results)=> {
        if (err){
            res.status(500).send({
                error: 'Error al eliminar la tarea'
            })
        }else{
            res.status (204).send()
            
        }
    })
})

app.put("/tareas/:id", (req, res) => {
    const {id} = req.params
    const {descripcion} = req.body

    const query = 'UPDATE tareas SET descripcion = ? WHERE id = ?'
    db.query(query, [descripcion,id], (err, results) => {
        if (err){
            res.status(500).send({
                error: 'Error al actualizar'
            })
        }else{
            res.json({
                id,
                descripcion
            })
        }
    })
})


app.put("/tareas/estado/:id", (req, res) => {
    const {id} = req.params
    const {estado} = req.body

    const query = 'UPDATE tareas SET estado = ? WHERE id = ?'
    db.query(query, [estado,id], (err, results) => {
        if (err){
            res.status(500).send({
                error: 'Error al actualizar estado'
            })
        }else{
            res.json({
                id,
                estado
            })
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("servidor funcionando")
})