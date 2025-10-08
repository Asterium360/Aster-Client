
const validateAuth = (data, mode = "register") => {
    const errors = {};

    // Nombre (solo en registro)
    if (mode === "register") {
        const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ ]{3,50}$/;
        if (!data.name.trim()) {
            errors.name = "❗ El nombre es obligatorio.";
        } else if (!namePattern.test(data.name)) {
            errors.name = "❗ El nombre solo puede contener letras y espacios (3-50 caracteres).";
        }
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        errors.email = "❗ El email es obligatorio.";
    } else if (!emailPattern.test(data.email)) {
        errors.email = "❗ Introduce un email válido.";
    }

    // Contraseña
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{8,}$/;
    if (!data.password) {
        errors.password = "❗ La contraseña es obligatoria.";
    } else if (!passwordPattern.test(data.password)) {
        errors.password =
            "❗ La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un carácter especial.";
    }

    // Confirmar contraseña (solo en registro)
    if (mode === "register") {
        if (!data.confirmPassword) {
            errors.confirmPassword = "❗ Debes confirmar tu contraseña.";
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "❗ Las contraseñas no coinciden.";
        }
    }

    return errors;
};

export default validateAuth;
