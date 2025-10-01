import React from "react";
import "./css/AuthForm.css";

const AuthForm = ({ mode = "register" }) => {
    const isRegister = mode === "register";

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
                Tu navegador no soporta video en HTML5.
            </video>

            {/* Overlay oscuro */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

            {/* Formulario encima */}
            <form className="form relative z-10">
                <p className="title">{isRegister ? "REGISTRARSE" : "INICIA SESIÓN"}</p>
                <p className="message">
                    {isRegister
                        ? "Registrate y disfruta de las maravillas del universo."
                        : "Bienvenido de vuelta! Inicia Sesión."}
                </p>

                {/* Campos extra solo para registro */}
                {isRegister && (
                    <label>
                        <input className="input" type="text" required />
                        <span>Nombre</span>
                    </label>
                )}

                <label>
                    <input className="input" type="email" required />
                    <span>Email</span>
                </label>

                <label>
                    <input className="input" type="password" required />
                    <span>Contraseña</span>
                </label>

                {isRegister && (
                    <label>
                        <input className="input" type="password" required />
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
