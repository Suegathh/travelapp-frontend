import { useState } from "react";
import Password from "./password";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utilis/helper";
import axiosInstance from "../utilis/axiosInstance";
import loginBgImage from "../assets/images/login-background.webp";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      console.log("Server Response:", response.data);
      if (response.data && response.data.accessToken) {
        console.log("Access Token:", response.data.accessToken); // Log the token to the console
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error Details:", error); // Log the complete error object
      
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message); // Display the error message from the backend
      } else if (error.message) {
        setError(error.message); // Display general Axios error messages (e.g., network issues)
      } else {
        setError("An unexpected error occurred. Please try again later!");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative">
      <div className="login-ui-box right-10 -top-40" />
      <div className="login-ui-box bg-cyan-200 -bottom-40 -right-1/2" />
      <div className="container h-screen flex items-center justify-center px-20 mx-auto">
        <div 
          className="w-2/4 h-[90vh] flex items-end bg-cover bg-center rounded-lg p-10 z-50"
          style={{ backgroundImage: `url(${loginBgImage})` }}
        >
          <div>
            <h4 className="text-5xl text-white font-semibold leading-[50px]">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-[15px] text-white leading-6 pr-7 mt-4">
              Record your travel experience and memories in your personal travel journal.
            </p>
          </div>
        </div>
        <div className="w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            
            <Password
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            
            <button type="submit" className="btn-primary">Login</button>
            <p className="text-xs text-slate-500 text-center my-4">Or</p>
            <button
              type="button"
              className="btn-primary btn-light"
              onClick={() => navigate("/signup")}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;