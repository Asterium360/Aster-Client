import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAster, getAsterById, updateAster } from "../services/AsteriumServices";
import Button from "./Button";
import validateAsterForm from "../validators/AsterValidator";
import useAuthStore from "../store/authStore";

const AsterForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const { user } = useAuthStore();

    const [form, setForm] = useState({
        title: "",
        content_md: "",
        image_url: "",
        status: "draft",
    });

    const [imageMode, setImageMode] = useState("url"); // "url" o "file"
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Cargar datos si es edición
    useEffect(() => {
        if (!isEdit) return;

        const fetchData = async () => {
            try {
                const data = await getAsterById(id);
                setForm({
                    title: data.title || "",
                    content_md: data.content_md || "",
                    image_url: data.image_url || "",
                    status: data.status || "draft",
                });

                if (data.image_url) {
                    setImagePreview(data.image_url);
                    setImageMode("url");
                }
            } catch {
                setError("Error al cargar el post");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "image_url" && imageMode === "url") setImagePreview(value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        // Limpiar URL del form
        setForm((prev) => ({ ...prev, image_url: "" }));
    };

    const handleImageModeChange = (mode) => {
        setImageMode(mode);
        setImageFile(null);
        setImagePreview("");
        if (mode === "file") setForm((prev) => ({ ...prev, image_url: "" }));
    };

    const handleSubmit = (publishStatus) => async () => {
        if (!user) {
            alert("❌ Debes iniciar sesión para crear un post");
            navigate("/login");
            return;
        }

        // Construir payload según modo de imagen
        const payload =
            imageMode === "file" && imageFile
                ? (() => {
                    const fd = new FormData();
                    fd.append("title", form.title);
                    fd.append("content_md", form.content_md);
                    fd.append("status", publishStatus);
                    fd.append("author_id", user.id);
                    fd.append("image", imageFile);
                    return fd;
                })()
                : {
                    title: form.title,
                    content_md: form.content_md,
                    status: publishStatus,
                    author_id: user.id,
                    ...(imageMode === "url" ? { image_url: form.image_url || "" } : {}),
                };

        // Validación
        const validationErrors = validateAsterForm({
            ...form,
            status: publishStatus,
            author_id: user.id,
            image_url: imageMode === "file" ? "" : form.image,
        });

        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            setTimeout(() => setFormErrors({}), 3000);
            return;
        }

        try {
            let savedPost;
            if (isEdit) {
                savedPost = await updateAster(id, payload);
                alert("✅ Post actualizado correctamente");
            } else {
                savedPost = await createAster(payload);
                alert("✅ Post creado correctamente");
            }

            // Actualizar preview con URL real desde backend
            if (savedPost.image_url) setImagePreview(savedPost.image_url);

            navigate("/explore", { state: { refresh: true } });
        } catch (err) {
            console.error(err);
            alert("❌ Error al guardar el post");
        }
    };

    if (loading) return <p className="text-center mt-10">Cargando post...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 mt-10 rounded-xl shadow-md" style={{ backgroundColor: "#02060D" }}>
            <div className="mb-4">
                <Button
                    title="← Volver"
                    tooltip={isEdit ? "Volver al detalle" : "Volver a la lista"}
                    action={() => navigate(isEdit ? `/viewpost/${id}` : "/explore")}
                />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center text-white">
                {isEdit ? "✏️ Editar Post" : "📝 Crear Nuevo Post"}
            </h2>

            <form className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-white">Título</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 text-white"
                    />
                    {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white">Contenido</label>
                    <textarea
                        name="content_md"
                        value={form.content_md}
                        onChange={handleChange}
                        rows={12}
                        className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 text-white"
                    />
                    {formErrors.content_md && <p className="text-red-500 text-sm mt-1">{formErrors.content_md}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white mb-2">Imagen</label>
                    <div className="flex gap-4 mb-3">
                        <button
                            type="button"
                            onClick={() => handleImageModeChange("url")}
                            className={`px-4 py-2 rounded-md transition-colors ${imageMode === "url" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                        >
                            🔗 URL
                        </button>
                        <button
                            type="button"
                            onClick={() => handleImageModeChange("file")}
                            className={`px-4 py-2 rounded-md transition-colors ${imageMode === "file" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                        >
                            📁 Subir archivo
                        </button>
                    </div>

                    {imageMode === "url" ? (
                        <input
                            type="url"
                            name="image_url"
                            value={form.image_url || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 text-white"
                            placeholder="https://ejemplo.com/imagen.jpg"
                        />
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                    )}

                    {formErrors.image_url && <p className="text-red-500 text-sm mt-1">{formErrors.image_url}</p>}

                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">Vista previa:</p>
                            <img src={imagePreview} alt="Preview" className="rounded-md max-h-64 mx-auto object-cover" />
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-4 gap-3">
                    <Button title="Borrador" action={handleSubmit("draft")} />
                    <Button title="Publicar" action={handleSubmit("published")} />
                </div>
            </form>
        </div>
    );
};

export default AsterForm;
