const express = require("express")
const cors = require("cors")
const db = require("./db")
const app = express()

app.use(cors())
app.use(express.json())

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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("servidor funcionando")
})