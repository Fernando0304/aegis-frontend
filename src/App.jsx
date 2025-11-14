import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Sensores from "./pages/Sensores";
import SensorDetalhe from "./pages/SensorDetalhe";
import Alertas from "./pages/Alertas";
import Config from "./pages/Config";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sensores" element={<Sensores />} />
        <Route path="/sensores/:nome" element={<SensorDetalhe />} />
        <Route path="/alertas" element={<Alertas />} /> 
        <Route path="/configuracoes" element={<Config />} />       
        </Routes>
    </BrowserRouter>
  );
}
