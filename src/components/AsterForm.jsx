import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAster, getAsterById, updateAster } from "../services/AsteriumServices";
import { PhotoIcon } from "@heroicons/react/24/solid";
import validateAsterForm from "../validators/AsterValidator";


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

const AsterForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        content: "",
        category: categories[0],
        coverImageFile: null,
        coverImageUrl: "",
        status: "draft",
    });

    const [previewImage, setPreviewImage] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (isEdit) {
            const fetchData = async () => {
                try {
                    const data = await getAsterById(id);
                    setForm({
                        title: data.title || "",
                        slug: data.slug || (data.title || "").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
                        content: data.content || "",
                        category: data.category || categories[0],
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
        if (name === "title") {
            setForm((prev) => ({
                ...prev,
                title: value,
                slug: prev.isEdit
                    ? prev.slug
                    : value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validación de tipo de archivo
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("❌ Solo se permiten imágenes JPG, PNG o WEBP");
                return;
            }

            // Validación de tamaño máximo (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert("❌ El tamaño máximo permitido es 5MB");
                return;
            }

            // Si pasa validaciones, actualizar estado
            setForm(prev => ({ ...prev, coverImageFile: file, coverImageUrl: "" }));
        }
    };

    const handleUrlChange = (e) => {
        setForm((prev) => ({ ...prev, coverImageUrl: e.target.value, coverImageFile: null }));
    };

    const handleSubmit = (publishStatus) => async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            status: publishStatus,
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
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Columna 1 */}
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
                        <label className="block text-sm font-medium text-white">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            readOnly
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 text-gray-300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Categoría</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>}
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
                        {formErrors.coverImageUrl && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.coverImageUrl}</p>
                        )}
                        {previewImage && (
                            <img src={previewImage} alt="Preview" className="mt-4 w-full rounded-md object-cover max-h-64 border border-gray-700" />
                        )}
                    </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-4">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-white">Contenido</label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            rows={12}
                            className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                            required
                        />
                        {formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                    </div>

                    <div className="flex justify-end mt-4 col-span-full gap-3">
                        <button type="button" onClick={handleSubmit("draft")} className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-500 text-white">
                            Borrador
                        </button>
                        <button type="button" onClick={handleSubmit("published")} className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-500 text-white">
                            Publicar
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AsterForm;
