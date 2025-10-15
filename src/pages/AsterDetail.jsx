import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAsterById, deleteAster } from "../services/AsteriumServices";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import { notification, Modal } from "antd"; 
import "../index.css"

const { confirm } = Modal;

const AsterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [asterium, setAsterium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAsterById(id);
        setAsterium(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "top",
      className: "dark-notification",
      style: {
        backgroundColor: "#1f1f1f", // fondo oscuro
        borderRadius: "6px",
      },
      duration: 4,
    });
  };

  const handleDelete = () => {
    confirm({
      title: "¿Seguro que quieres eliminar este post?",
      content: "Esta acción no se puede deshacer",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      maskClosable: true,
      modalRender: (modal) => (
      <div style={{ backgroundColor: "#1f1f1f", borderRadius: "8px", color: "#fff", padding: "16px" }}>
        {modal}
      </div>
    ),
      onOk: async () => {
        try {
          await deleteAster(id);
          openNotification("success", "Post eliminado", "El post fue eliminado correctamente");
          navigate("/explore");
        } catch (err) {
          console.error(err);
          openNotification("error", "Error", "❌ Error al eliminar el post");
        }
      },
    });
  };

  if (loading) return <div className="text-center text-white mt-10">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error.message}</div>;
  if (!asterium) return <div className="text-center text-white mt-10">El post no existe</div>;

  const canEditOrDelete =
    user &&
    (user.role === "admin" ||
      Number(user.id) === Number(asterium.author_id) ||
      (asterium.author && Number(user.id) === Number(asterium.author.id)));

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      {asterium.image_url && (
        <img
          src={asterium.image_url}
          alt={asterium.title}
          className="w-full max-h-[400px] object-cover rounded mb-6"
        />
      )}

      <h1 className="text-3xl font-bold mb-2">{asterium.title}</h1>

      <p className="text-gray-400 text-sm mb-6">
        {asterium.published_at
          ? new Date(asterium.published_at).toLocaleDateString()
          : new Date(asterium.created_at).toLocaleDateString()}
      </p>

      {asterium.content_md && (
        <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {asterium.content_md}
        </div>
      )}

      <div className="flex justify-end mt-6 gap-3">
        {canEditOrDelete && (
          <>
            <Button title="Editar" action={() => navigate(`/editpost/${id}`)} />
            <Button title="Eliminar" action={handleDelete} />
          </>
        )}

        <Button title="Cancelar" action={() => navigate("/explore")} />
      </div>
    </div>
  );
};

export default AsterDetail;
