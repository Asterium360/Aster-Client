import React from "react";
import "./css/AuthForm.css";


const AuthForm = ({ mode = "register" }) => {
    const isRegister = mode === "register";

    return (
        <div className="flex justify-center items-center h-screen">
        <form className="form">
            <p className="title">{isRegister ? "Registrate" : "Iniciar Sesión"}</p>
            <p className="message">
                {isRegister
                    ? "Registrate y disfruta de las maravillas del universo."
                    : "Bienvenido de vuelta! Inicia Sesión."}
            </p>

            {/* Campos extra solo para registro */}
            {isRegister && (
                    <label>
                        <input className="input" type="text" placeholder="" required />
                        <span>Name/Username</span>
                    </label>
                
            )}

            <label>
                <input className="input" type="email" placeholder="" required />
                <span>Email</span>
            </label>

            <label>
                <input className="input" type="password" placeholder="" required />
                <span>Password</span>
            </label>

            {/* Confirm password solo en registro */}
            {isRegister && (
                <label>
                    <input className="input" type="password" placeholder="" required />
                    <span>Confirm password</span>
                </label>
            )}

            <button type="submit" className="submit">
                {isRegister ? "Sign Up" : "Login"}
            </button>

            <p className="signin">
                {isRegister ? (
                    <>
                        Ya tienes una cuenta? <a href="/login">Sing In</a>
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
