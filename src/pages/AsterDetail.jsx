import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAsterById } from "../services/AsteriumServices";

const AsterDetail = () => {
  const { id } = useParams();
  const [asterium, setAsterium] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="text-center text-white mt-10">Cargando...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">Error: {error.message}</div>;
  if (!asterium) return <div className="text-center text-white mt-10">El post no existe</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      {/* Imagen destacada */}
      {asterium.image_url && (
        <img
          src={asterium.image_url}
          alt={asterium.title}
          className="w-full max-h-[400px] object-cover rounded mb-6"
        />
      )}

      {/* Título */}
      <h1 className="text-3xl font-bold mb-2">{asterium.title}</h1>

      {/* Fecha */}
      <p className="text-gray-400 text-sm mb-6">
        {asterium.published_at
          ? new Date(asterium.published_at).toLocaleDateString()
          : new Date(asterium.created_at).toLocaleDateString()}
      </p>

      {/* Contenido */}
      {asterium.content_md && (
        <div className="prose prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
          {asterium.content_md}
        </div>
      )}
    </div>
  );
};

export default AsterDetail;
