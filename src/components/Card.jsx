import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAsterById } from "../services/AsteriumServices";

/**
 * AsterCard: muestra una tarjeta tipo "post".
 * - Recibe solo `id`.
 * - Hace fetch con getAsterById(id).
 * - Usa image_url, title, excerpt o genera excerpt desde content_md.
 * - Navega al detalle (ruta: /viewpost/:id). Ajusta si tu ruta es otra.
 */
const AsterCard = ({ id }) => {
  const [asterium, setAsterium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const fetchAster = async () => {
      setLoading(true);
      try {
        const data = await getAsterById(id);
        if (mounted) setAsterium(data);
      } catch (err) {
        console.error(`Error cargando post ${id}:`, err);
        if (mounted) setError("No se pudo cargar el post");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAster();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Quita Markdown básico y etiquetas para generar excerpt legible
  const stripMarkdown = (md = "") => {
    return md
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")   // links [text](url) -> text
      .replace(/(^|\s)#+\s*/g, "$1")             // headings
      .replace(/(\*\*|__|\*|_|`|~~)/g, "")       // emphasis, code, strike
      .replace(/<\/?[^>]+(>|$)/g, "")            // HTML tags
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const makeExcerpt = (a, wordCount = 30) => {
    if (!a) return "";
    if (a.excerpt && a.excerpt.trim().length > 0) return a.excerpt;
    const body = stripMarkdown(a.content_md || "");
    const words = body.split(/\s+/);
    const excerpt = words.slice(0, wordCount).join(" ");
    return words.length > wordCount ? excerpt + "..." : excerpt;
  };

  const formatDate = (d) => {
    const dateStr = d || asterium?.published_at || asterium?.created_at || asterium?.updated_at;
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div
        className="w-full h-56 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center"
        aria-busy="true"
      >
        <span className="text-gray-400">Cargando...</span>
      </div>
    );
  }

  if (error || !asterium) {
    return (
      <div className="w-full h-56 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
        <span className="text-red-400">Error al cargar</span>
      </div>
    );
  }

  const excerpt = makeExcerpt(asterium, 30);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Ver ${asterium.title}`}
      onClick={() => navigate(`/viewpost/${id}`)} 
      onKeyDown={(e) => e.key === "Enter" && navigate(`/viewpost/${id}`)}
      className="cursor-pointer rounded-xl overflow-hidden backdrop-blur-md bg-white/6 border border-white/10 hover:border-white/20 shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5"
    >
      {asterium.image_url && (
        <div className="w-full h-40 md:h-48 overflow-hidden">
          <img
            src={asterium.image_url}
            alt={asterium.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder-image.png"
            }}
          />
        </div>
      )}

      <div className="p-4 flex flex-col gap-2">
        <p className="text-gray-300 text-sm">{formatDate(asterium.published_at || asterium.created_at)}</p>
        <h3 className="text-white font-semibold text-lg line-clamp-2">{asterium.title}</h3>
        <p className="text-gray-200 text-sm mt-1 line-clamp-3">{excerpt}</p>
      </div>
    </article>
  );
};

export default AsterCard;
