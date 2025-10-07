import {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { getAsterById } from "../services/AsteriumServices";

const AsterDetail = () => {
  const { id } = useParams();
  const [aster, setAster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const asterData = await getAsterById (id);
        setAster(asterData);
        setError(null);
        console.log (aster)
        console.log (asterData)
      } catch (error) {
        setError(`Error cargando el post: ${error.message}`);

        errorAlert({
          title: "Error de carga",
          message: `No se pudo cargar el post: ${error.message}`
        });

      } finally {
        setLoading(false);
      }
    };

    fetchData()
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!aster) return <div>Post doesn't exist</div>;

  return (
  <div className="aster-detail">
      <h1>{aster.title}</h1>
      <p><strong>Author:</strong> {aster.author}</p>
      <p><strong>Date:</strong> {new Date(aster.date).toLocaleDateString()}</p>

      {/* Description or content */}
      <div className="aster-content">
        <p>{aster.content}</p>
      </div>

      {/* Optional: Image */}
      {aster.image && (
        <img
          src={aster.image}
          alt={aster.title}
          style={{ maxWidth: "100%", borderRadius: "10px", marginTop: "1rem" }}
        />
      )}
    </div>
  );
};

  export default AsterDetail;