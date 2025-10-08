
const categories = [
    "Astronomía General",
    "Sistema Solar",
    "Estrellas",
    "Evolución Estelar",
    "Galaxias",
    "Estructura Cósmica",
    "Cosmología",
    "Astrobiología",
    "Exploración Espacial",
    "Astronomía Observacional",
    "Astrofísica",
];

const validateAsterForm = (data) => {
    const errors = {};

    // 🔸 Validar título
    const titlePattern = /^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ0-9() ,.\-:;'"!?¿¡]{5,100}$/;
    const wordCount = data.title.trim().split(/\s+/).length;

    if (!data.title.trim()) {
        errors.title = "❗ El título es obligatorio.";
    } else if (!titlePattern.test(data.title)) {
        errors.title = "❗ El título debe tener entre 5 y 100 caracteres y solo letras, números y signos básicos.";
    } else if (wordCount < 2) {
        errors.title = "❗ El título debe tener al menos 2 palabras.";
    }

    // 🔸 Validar categoría
    if (!data.category || !categories.includes(data.category)) {
        errors.category = "❗ Debes seleccionar una categoría válida.";
    }

    // 🔸 Validar contenido
    if (!data.content || data.content.trim().length < 50) {
        errors.content = "❗ El contenido debe tener al menos 50 caracteres.";
    } else if (data.content.length > 5000) {
        errors.content = "❗ El contenido no puede superar los 5000 caracteres.";
    }

    // 🔸 Validar imagen URL (opcional)
    if (
        data.coverImageUrl &&
        !/^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/i.test(data.coverImageUrl)
    ) {
        errors.coverImageUrl = "❗ La URL de la imagen no es válida.";
    }

    return errors;
};

export default validateAsterForm;