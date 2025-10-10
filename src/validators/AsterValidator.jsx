const validateAsterForm = (data) => {
    const errors = {};

    // 🔸 Validar título
    if (!data.title || data.title.trim().length < 5) {
        errors.title = "❗ El título es obligatorio y debe tener al menos 5 caracteres.";
    } else if (data.title.trim().length > 200) {
        errors.title = "❗ El título no puede superar los 200 caracteres.";
    }

    // 🔸 Validar contenido
    if (!data.content_md || data.content_md.trim().length < 50) {
        errors.content_md = "❗ El contenido debe tener al menos 50 caracteres.";
    } else if (data.content_md.length > 5000) {
        errors.content_md = "❗ El contenido no puede superar los 5000 caracteres.";
    }

    // 🔸 Validar imagen URL (opcional)
    if (
        data.image_url &&
        !/^https?:\/\/.*\.(jpg|jpeg|png)$/i.test(data.image_url)
    ) {
        errors.image_url = "❗ La URL de la imagen no es válida. Solo jpg o png.";
    }

    // 🔸 Validar estado
    const validStatuses = ["draft", "published", "archived"];
    if (!data.status || !validStatuses.includes(data.status)) {
        errors.status = "❗ El estado del post no es válido.";
    }

    // 🔸 Validar autor
    if (!data.author_id) {
        errors.author_id = "❗ El ID del autor es obligatorio.";
    }

    return errors;
};

export default validateAsterForm;
