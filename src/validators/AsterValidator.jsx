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

    // 🔸 Validar imagen (URL, base64 o archivo subido)
    if (typeof data.image_url === "string" && data.image_url.trim() !== "" && data.image_url !== "file") {
        const trimmed = data.image_url.trim();

        // URLs HTTP/HTTPS con o sin query strings
        const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp)(\?.*)?$/i;

        // Base64 (png/jpg/jpeg/webp)
        const base64Regex = /^data:image\/(png|jpg|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i;

        if (!urlRegex.test(trimmed) && !base64Regex.test(trimmed)) {
            errors.image_url = "❗ La imagen debe ser una URL válida, base64 (.jpg/.jpeg/.png/.webp) o un archivo subido.";
        }
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
