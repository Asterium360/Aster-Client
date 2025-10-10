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
                        content_md: data.content_md || "",
                        image_url: data.image_url || "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (publishStatus) => async () => {
        if (!user) {
            alert("❌ Debes iniciar sesión para crear un post");
            navigate("/login");
            return;
        }

        const payload = {
            ...form,
            status: publishStatus,
            author_id: user.id, // ✅ autor directo desde el store
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
                        required
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
                        required
                    />
                    {formErrors.content_md && <p className="text-red-500 text-sm mt-1">{formErrors.content_md}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-white">Imagen (URL)</label>
                    <input
                        type="url"
                        name="image_url"
                        value={form.image_url}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-800/70 p-2 text-white"
                        placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {formErrors.image_url && <p className="text-red-500 text-sm mt-1">{formErrors.image_url}</p>}
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
