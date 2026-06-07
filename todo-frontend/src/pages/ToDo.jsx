import { useState, useEffect } from "react";
import axios from "axios";
import "../style/ToDo.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Base_url = "https://localhost:3000/tareas";

const App = () => {
  const [items, setItems] = useState([]);
  const [newDescripcion, setNewDescripcion] = useState("");
  const [archivo, setArchivo] = useState("");

  useEffect(() => {
    axios
      .get(`${Base_url}`)
      .then((response) => {
        setItems(response.data.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error zl obtener los items:", error);
      });
  }, []);
  // emy
  const handleCreate = () => {
    if (newDescripcion.trim()) {
      axios
        .post(`${Base_url}/`, {
          descripcion: newDescripcion,
          archivo:archivo
        })
        .then((response) => {
          setItems((prevItems) => [...prevItems, response.data.data]);
          setNewDescripcion("");
        })
        .catch((error) => {
          console.error("Error al crear el item", error);
        });
    }
  };

  const handleFile = async (e) => {
    const formData = new FormData();
    formData.append("archivo", e.target.files[0]);

    const response = await axios.post(
      "https://localhost:3000/archivos", 
      formData);
      setArchivo(response.data.archivo.filename);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${Base_url}/${id}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar el item", error);
      });
  };
  const handleUpdate = (id, descripcion) => {
    const newDescripcion = prompt("Nueva Descripcion: ", descripcion);
    if (newDescripcion !== descripcion) {
      axios
        .put(`${Base_url}/${id}`, {
          descripcion: newDescripcion,
        })
        .then(() => {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, descripcion: newDescripcion } : item,
            ),
          );
        })
        .catch((error) => {
          console.error("Error al actualizar la tarea", error);
        });
    }
  };

  const handleEstado = (id, estado) => {
    axios
      .put(`${Base_url}/estado/${id}`, {
        estado: !estado,
      })
      .then(() => {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, estado: !estado } : item,
          ),
        );
      })
      .catch((error) => {
        console.error("Error al actualizar el estado", error);
      });
  };

  const handleLogout = async () => {
    try {
      await axios.get("https://localhost:3000/logout", {
        withCredentials:true
      });
      window.location.href = "/";
    } catch (error){
      console.error("Error al cerrar sesion", error);
    }
  };

  return (
    <div className="contenedor">
      
      <div className="boton">
        <button onClick={handleLogout} className="btn-logout">
          <i className="bi bi-box-arrow-right"></i>
          Cerrar sesion
        </button>
      </div>
      <div className="card">
        <h1>To Do List</h1>

        <div className="formulario">
          <input
            type="text"
            className="descripcion"
            value={newDescripcion}
            onChange={(e) => setNewDescripcion(e.target.value)}
            placeholder="Descripcion"
          />

          <input className="archivo" type="file" onChange={handleFile} />

          <button onClick={handleCreate} className="btn-add">
            <i className="bi bi-plus-circle"></i>
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descripcion</th>
              <th>Estado</th>
              <th>Documento</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(items) && items.map((item) => (
              <tr key={item.id}>
                <td className={item.estado ? "completada" : "descrip"}>{item.descripcion}</td>
                <td>
                <input
                    type="checkbox"
                    checked={item.estado}
                    onChange={() => handleEstado(item.id, item.estado)}
                  />
                </td>
                <td>
                  {item.archivo && (
                    <button onClick={() => window.open (`https://localhost:3000/download/${item.archivo}`)}>
                      Descargar
                    </button>
                  )}
                
                </td>
                <td className="acciones">
                  <button
                    onClick={() => handleUpdate(item.id, item.descripcion)}
                    className="btn-update"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default App;
