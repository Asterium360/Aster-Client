import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAster, getAsterById, updateAster } from "../services/AsteriumServices";
import { PhotoIcon } from "@heroicons/react/24/solid";
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
        coverImageFile: null,
        coverImageUrl: "",
        status: "draft",
    });

    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Cargar post si es edición
    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                try {
                    const data = await getAsterById(id);
                    setForm({
                        title: data.title || "",
                        content_md: data.content_md || "",
                        coverImageFile: null,
                        coverImageUrl: data.image_url || "",
                        status: data.status || "draft",
                    });
                } catch (err) {
                    setError("Error al cargar el post");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [id, isEdit]);

    // Previsualización de imagen
    useEffect(() => {
        if (form.coverImageFile) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(form.coverImageFile);
        } else if (form.coverImageUrl) {
            setPreviewImage(form.coverImageUrl);
        } else {
            setPreviewImage("");
        }
    }, [form.coverImageFile, form.coverImageUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("❌ Solo se permiten imágenes JPG, PNG o WEBP");
                return;
            }
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                alert("❌ El tamaño máximo permitido es 5MB");
                return;
            }
            setForm(prev => ({ ...prev, coverImageFile: file, coverImageUrl: "" }));
        }
    };

    const handleUrlChange = (e) => {
        setForm(prev => ({ ...prev, coverImageUrl: e.target.value, coverImageFile: null }));
    };

    const handleSubmit = (publishStatus) => async (e) => {
        e.preventDefault();
        if (!user) {
            alert("❌ Debes estar logueado para crear un post");
            return;
        }

        const payload = {
            title: form.title,
            content_md: form.content_md,
            status: publishStatus,
            image_url: form.coverImageUrl || null,
            author_id: user.id,
        };

        const validationErrors = validateAsterForm(payload);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }

        try {
            if (isEdit) {
                await updateAster(id, payload);
                alert("✅ Post actualizado correctamente");
            } else {
                await createAster(payload);
                alert("✅ Post creado correctamente");
            }
            navigate("/explore");
        } catch (err) {
            console.error(err);
            alert("❌ Error al guardar el post");
        }
    };

    if (loading) return <p className="text-center mt-10">Cargando post...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-4xl mx-auto p-6 mt-10 rounded-xl shadow-md" style={{ backgroundColor: "#02060D" }}>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">{isEdit ? "✏️ Editar Post" : "📝 Crear Nuevo Post"}</h2>
            <form className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white">Título</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            required
                        />
                        {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Imagen</label>
                        <div className="mt-1 flex items-center gap-3">
                            <PhotoIcon className="h-10 w-10 text-gray-400" />
                            <label className="cursor-pointer bg-gray-800/70 px-3 py-2 rounded-md hover:bg-gray-700/70 text-white">
                                Subir Archivo
                                <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                type="url"
                                name="coverImageUrl"
                                placeholder="O copia una URL aquí"
                                value={form.coverImageUrl}
                                onChange={handleUrlChange}
                                className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            />
                        </div>
                        {previewImage && <img src={previewImage} alt="Preview" className="mt-4 w-full rounded-md object-cover max-h-64 border border-gray-700" />}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Contenido</label>
                        <textarea
                            name="content_md"
                            value={form.content_md}
                            onChange={handleChange}
                            rows={12}
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            required
                        />
                        {formErrors.content_md && <p className="text-red-500 text-sm mt-1">{formErrors.content_md}</p>}
                    </div>

                    <div className="flex justify-end mt-4 gap-3">
                        <button type="button" onClick={handleSubmit("draft")} className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-500 text-white">Borrador</button>
                        <button type="button" onClick={handleSubmit("published")} className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 text-white">Publicar</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AsterForm;
