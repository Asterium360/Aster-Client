import React, { useState } from "react";
import { login, register } from "../services/AuthServices";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import validateAuth from "../validators/AuthValidator";
import "./css/AuthForm.css";

const AuthForm = ({ mode = "register" }) => {
    const isRegister = mode === "register";
    const navigate = useNavigate();
    const { login: loginToStore } = useAuthStore();

    // Estados del formulario
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1️⃣ Validación
        const validationErrors = validateAuth(
            { name, email, password, confirmPassword },
            mode
        );
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            if (isRegister) {
                // 2️⃣ Registro
                const newUser = {
                    username: name,
                    email,
                    password,
                    display_name: name, 
                };

                const data = await register(newUser);

                // 3️⃣ Guardar token y usuario si el backend devuelve ambos
                if (data.token && data.user) {
                    loginToStore(data.user, data.token);
                    navigate("/explore");
                } else {
                    alert("❗ Registro completado, pero no se recibió token. Por favor inicia sesión.");
                    navigate("/login");
                }
            } else {
                // 4️⃣ Login
                const credentials = { email, password };
                await login(credentials);

                if (data.token && data.user) {
                    loginToStore(data.user, data.token);
                    navigate("/explore");
                } else {
                    alert("❌ Error en login: token no recibido");
                }
            }
        } catch (error) {
            console.error("Error en AuthForm:", error);
            if (error.response && error.response.status === 409) {
                setErrors({ general: "❗ El email ya está en uso" });
            } else if (error.response && error.response.status === 400) {
                setErrors({ general: "❌ Datos incorrectos. Revisa el formulario." });
            } else {
                setErrors({ general: "❌ Error de autenticación. Intenta de nuevo." });
            }
        }
    };

    return (
        <div className="relative flex justify-center items-center h-screen">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source
                    src="https://res.cloudinary.com/dmwvw798z/video/upload/v1759238520/169951-842348732_medium_xuls22.mp4"
                    type="video/mp4"
                />
            </video>

            <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

            <form className="form relative z-10" onSubmit={handleSubmit}>
                <p className="title">{isRegister ? "REGISTRARSE" : "INICIA SESIÓN"}</p>
                <p className="message">
                    {isRegister
                        ? "Regístrate y disfruta de las maravillas del universo."
                        : "Bienvenido de vuelta! Inicia Sesión."}
                </p>

                {errors.general && <p className="error text-center mb-2">{errors.general}</p>}

                {isRegister && (
                    <label>
                        <input
                            className="input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <span>Nombre</span>
                        {errors.name && <p className="error">{errors.name}</p>}
                    </label>
                )}

                <label>
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <span>Email</span>
                    {errors.email && <p className="error">{errors.email}</p>}
                </label>

                <label>
                    <input
                        className="input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span>Contraseña</span>
                    {errors.password && <p className="error">{errors.password}</p>}
                </label>

                {isRegister && (
                    <label>
                        <input
                            className="input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span>Confirmar Contraseña</span>
                        {errors.confirmPassword && (
                            <p className="error">{errors.confirmPassword}</p>
                        )}
                    </label>
                )}

                <button type="submit" className="submit">
                    {isRegister ? "Registrar" : "Iniciar"}
                </button>

                <p className="signin">
                    {isRegister ? (
                        <>
                            Ya tienes una cuenta? <a href="/login">Iniciar Sesión</a>
                        </>
                    ) : (
                        <>
                            No tienes una cuenta? <a href="/register">Registro</a>
                        </>
                    )}
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
