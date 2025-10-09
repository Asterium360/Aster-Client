import React, { useState } from "react";
import { login, register } from "../services/AuthServices"; // 👈 Importa tus servicios
import { useNavigate } from "react-router-dom";
import "./css/AuthForm.css";

const AuthForm = ({ mode = "register" }) => {
    const isRegister = mode === "register";
    const navigate = useNavigate();

    // Estados para los inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isRegister) {
                // Verificar contraseñas iguales
                if (password !== confirmPassword) {
                    alert("Las contraseñas no coinciden");
                    return;
                }

                const newUser = { username: name, email, password };
                await register(newUser);

                alert("Usuario registrado con éxito");
                navigate("/login"); // Redirigir a login
            } else {
                const credentials = { email, password };
                const data = await login(credentials);

                // Guardar token y usuario
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/explore"); // Redirigir a página protegida
            }
        } catch (error) {
            console.error("Error en AuthForm:", error);
            alert("Hubo un error en la autenticación");
        }
    };

    return (
        <div className="relative flex justify-center items-center h-screen">
            {/* 🎥 Video de fondo */}
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

            {/* Overlay oscuro */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

            {/* Formulario */}
            <form className="form relative z-10" onSubmit={handleSubmit}>
                <p className="title">{isRegister ? "REGISTRARSE" : "INICIA SESIÓN"}</p>
                <p className="message">
                    {isRegister
                        ? "Registrate y disfruta de las maravillas del universo."
                        : "Bienvenido de vuelta! Inicia Sesión."}
                </p>

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
