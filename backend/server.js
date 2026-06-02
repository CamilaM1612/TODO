const express = require("express");
require("dotenv").config();
const cors = require("cors");
const db = require("./db");
const app = express();
const multer = require("multer");
//oauth
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use ("/Archivos", express.static("Archivos"))
app.use(express.json());

// iniciar sesion con google
app.use(session({
  secret: "secreto",
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:"http://localhost:3000/auth/google/callback"
},
(accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null,user);
});

app.get("/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account" // obligar a elegir cunta
  })
);

app.get("/auth/google/callback", 
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req,res) => {
    res.redirect("http://localhost:5173/todo");
  }
);

app.use((req, res, next) => {
    // res.setHeader("Content-Type", "application/json");
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
  const { descripcion, archivo } = req.body;

  const query = "INSERT INTO tareas (descripcion, archivo) VALUES (?,?)";

  db.query(query, [descripcion, archivo], (err, results) => {
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
          archivo
        },
      });
    }
  });
});

// subir un archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Archivos/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const subir = multer({ storage });

app.get("/download/:nombre", (req,res) => {
  const nombreArchivo = req.params.nombre;
  res.download(`Archivos/${nombreArchivo}`);
})

//agregar archivo
app.post("/archivos", subir.single("archivo"), (req, res) => {
  res.json({
    mensaje: "Archivo Subido",
    archivo: req.file,
  });
});

// borrar tarea
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

//editar una tarea
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

//editr el estaod
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

//obtener info de una tarea
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

// logout
app.get("/logout", (req, res) =>{
  req.logout((err) =>{
    if(err){
      return res.status(500).json({
        success: false,
        mensaje: "Error al cerrar sesion"
      });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json ({
        success: true,
        mensaje: "Sesion cerrada"
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("servidor funcionando");
});
