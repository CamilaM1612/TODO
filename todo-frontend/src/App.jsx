import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ToDo from "./pages/ToDo";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/todo" element={<ToDo />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;