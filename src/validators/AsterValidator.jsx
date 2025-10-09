const validateAsterForm = (data) => {
    const errors = {};

    // 🔸 Validar título
    const titlePattern = /^[A-Za-zÁÉÍÓÚáéíóúüÜñÑ0-9() ,.\-:;'"!?¿¡]{5,100}$/;
    const wordCount = data.title?.trim().split(/\s+/).length || 0;

    if (!data.title || !data.title.trim()) {
        errors.title = "❗ El título es obligatorio.";
    } else if (!titlePattern.test(data.title)) {
        errors.title = "❗ El título debe tener entre 5 y 100 caracteres y solo letras, números y signos básicos.";
    } else if (wordCount < 2) {
        errors.title = "❗ El título debe tener al menos 2 palabras.";
    }

    // 🔸 Validar slug (aunque se genera automáticamente, evitamos enviar vacío)
    if (!data.slug || !data.slug.trim()) {
        errors.slug = "❗ El slug no puede estar vacío.";
    }

    // 🔸 Validar excerpt (resumen)
    if (data.excerpt && data.excerpt.trim().length > 0) {
        if (data.excerpt.length < 10) {
            errors.excerpt = "❗ El resumen debe tener al menos 10 caracteres.";
        } else if (data.excerpt.length > 300) {
            errors.excerpt = "❗ El resumen no puede superar los 300 caracteres.";
        }
    }

    // 🔸 Validar contenido (content_md)
    if (!data.content_md || data.content_md.trim().length < 50) {
        errors.content_md = "❗ El contenido debe tener al menos 50 caracteres.";
    } else if (data.content_md.length > 5000) {
        errors.content_md = "❗ El contenido no puede superar los 5000 caracteres.";
    }

    // 🔸 Validar imagen URL (opcional)
    if (
        data.coverImageUrl &&
        !/^https?:\/\/.*\.(jpg|jpeg|png|webp|gif)$/i.test(data.coverImageUrl)
    ) {
        errors.coverImageUrl = "❗ La URL de la imagen no es válida.";
    }

    // 🔸 Validar autor (oculto)
    if (!data.author_id) {
        errors.author_id = "❗ El ID del autor es obligatorio.";
    }

    return errors;
};

export default validateAsterForm;
