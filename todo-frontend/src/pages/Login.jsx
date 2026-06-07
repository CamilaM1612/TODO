import "../style/Login.css"

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1>To Do List</h1>
        <a href="https://localhost:3000/auth/google">
          <button className="btn-google">
            Iniciar sesión con Google
          </button>
        </a>
      </div>
    </div>
  );
};

export default Login;