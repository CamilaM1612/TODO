const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
const multer = require("multer");

app.use(cors());
app.use(express.json());

// archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Archivos/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const subir = multer({ storage });

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Autor","Camila");
    res.setHeader("Version", "1.0");

    next();
})


// mostrar tareas
app.get("/tareas", (req, res) => {
  db.query("SELECT* FROM tareas", (err, results) => {
    if (err) {
      res.status(500).send({
        success:false,
        mensaje: "Error al obtener tareas",
        error: err.message
      });
    } 
    if(results.length === 0){
        return res.status(200).json({
            success:true,
            mensaje: "empty",
            data: []
        });
    }
    res.status(200).json({
        success:true,
        cantidad: results.length,
        data: results
    });
  });
});

// agregar tarea
app.post("/tareas", (req, res) => {
  const { descripcion } = req.body;

  const query = "INSERT INTO tareas (descripcion) VALUES (?)";

  db.query(query, [descripcion], (err, results) => {
    if (err) {
      res.status(500).send({
        mensaje: "Error al crear tareas",
        error:err.message
      });
    } else {
      res.status(201).json({
        success: true,
        mensaje: "Tarea creada",
        data: {
          id: results.insertId,
          descripcion,
        },
      });
    }
  });
});

//agregar archivo
app.post("/archivos", subir.single("archivo"), (req, res) => {
  res.json({
    mensaje: "Archivo Subido",
    archivo: req.file,
  });
});

app.delete("/tareas/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM tareas WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send({
        mensaje: "Error al eliminar la tarea",
        error: err.message
      });
    } else {
      res.status(200).json({
        success: true,
        mensaje: "Tarea eliminada"
      });
    }
  });
});

app.put("/tareas/:id", (req, res) => {
  const { id } = req.params;
  const { descripcion } = req.body;

  const query = "UPDATE tareas SET descripcion = ? WHERE id = ?";
  db.query(query, [descripcion, id], (err, results) => {
    if (err) {
      res.status(500).send({
        mensaje: "Error al actualizar la tarea",
        error: err.message
      });
    } else {
      res.json({
        success: true,
        mensaje: "Tarea actualizada",
        data:{
            id,
            descripcion
        }
    
      });
    }
  });
});

app.put("/tareas/estado/:id", (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const query = "UPDATE tareas SET estado = ? WHERE id = ?";
  db.query(query, [estado, id], (err, results) => {
    if (err) {
      res.status(500).send({
        mensaje: "Error al actualizar el estado",
        error: err.message
      });
    } else {
      res.json({
        id,
        estado,
      });
    }
  });
});

app.get("/tareas/:id", (req, res) => {
    const {id} = req.params;

    const query = "SELECT * FROM tareas WHERE id = ?";

    db.query (query, [id], (err, results) => {
        if (err) {
           return res.status(500).json ({
            success: false,
            mensaje: "Error al obtener la tarea",
            error: err.message
           });
        }
        if (results.length === 0 ) {
            return res.status(404).json({
                success:false,
                mensaje: "Tarea no encontrada"
            });
        }
        res.status(200).json({
            success:true,
            data: results[0]
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("servidor funcionando");
});
