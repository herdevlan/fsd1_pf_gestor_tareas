import { useState } from "react";
import API from "../services/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { nombre, email, password });
      alert("Registrado correctamente");
      navigate("/login");
    } catch {
      alert("Error al registrar");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#15446A",  
      backgroundImage: "url(/images/fondoregister.jpg)", // Imagen de fondo
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="card p-4 shadow w-100" style={{ maxWidth: 400 }}>

      <div className="text-center mb-4">
          <i className="bi bi-person-lines-fill" style={{ fontSize: '4rem', color: '#198754' }}></i>
          <h2 className="text-center mb-4">Registro</h2>
        </div>

        
        <form onSubmit={handleRegister}>
        <input type="text" className="form-control mb-3" placeholder="Nombre"
            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="email" className="form-control mb-3" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="form-control mb-3" placeholder="Contraseña"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn btn-success w-100">Registrarse</button>
          

          
        </form>

        <div className="text-center mt-3">
            <span>¿Ya tienes cuenta? </span>
            <a href="/login">Inicia sesión</a>
          </div>
      </div>
    </div>
  );
}
