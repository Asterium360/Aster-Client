import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAsterById, deleteAster } from "../services/AsteriumServices";
import useAuthStore from "../store/authStore";
import Button from "../components/Button";
import { notification, Modal } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../index.css";

const { confirm } = Modal;

const AsterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [asterium, setAsterium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Likes locales
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [animate, setAnimate] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Ajuste de tema global
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Cargar post
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAsterById(id);
        setAsterium(data);
        setLikes(data.like_count || 0); // inicializamos con like_count
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Notificaciones oscuras
  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "top",
      className: "dark-notification",
      style: {
        backgroundColor: "#1f1f1f",
        color: "#fff",
        borderRadius: "6px",
      },
      duration: 4,
    });
  };

  // Eliminar post con modal oscuro
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
        <div
          style={{
            backgroundColor: "#1f1f1f",
            borderRadius: "8px",
            color: "#fff",
            padding: "16px",
          }}
        >
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

  // Dar like
  const handleLike = () => {
    if (!user) {
      openNotification("error", "No autenticado", "Debes iniciar sesión para dar like");
      return;
    }
    if (hasLiked) {
      openNotification("info", "Ya diste like", "Solo puedes dar like una vez por post");
      return;
    }

    setLikes((prev) => prev + 1);
    setHasLiked(true);
    setAnimate(true); // activar animación
    setTimeout(() => setAnimate(false), 500); // reiniciar animación
    openNotification("success", "❤️ Gracias", "Tu like ha sido registrado");
  };

  if (loading) return <div className="text-center text-white mt-10">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error.message}</div>;
  if (!asterium) return <div className="text-center text-white mt-10">El post no existe</div>;

  // Permisos para editar o eliminar
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

      {/* Markdown render */}
      {asterium.content_md && (
        <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {asterium.content_md}
          </ReactMarkdown>
        </div>
      )}

      {/* Botón de like con animación */}
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white transition-colors ${
            animate ? "animate-like" : ""
          }`}
        >
          {hasLiked ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />}
          {likes}
        </button>
      </div>

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
