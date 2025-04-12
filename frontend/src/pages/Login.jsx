
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/axios";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.token);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#15446A",  // Fondo claro
      backgroundImage: "url(/images/fondologin.jpg)", // Imagen de fondo
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="card p-4 shadow w-100" style={{ maxWidth: 400 }}>
        
      <div className="text-center mb-4">
          <i className="bi bi-person-fill" style={{ fontSize: '6rem', color: '#0d6efd' }}></i>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
        </div>


        
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100">Entrar</button>
        </form>

        <div className="text-center mt-3">
          <span>¿No tienes cuenta? </span>
          <Link to="/register">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}