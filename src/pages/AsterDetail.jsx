import { useState, useEffect } from "react";
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
        const asterData = await getAsterById(id);
        setAster(asterData);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!aster) return <div>Post doesn't exist</div>;

  return (
    <div className="aster-detail">
      <h1>{aster.title}</h1>
      <p><strong>ID:</strong> {aster.id}</p>
      <p><strong>Author ID:</strong> {aster.author_id}</p>
      <p><strong>Date:</strong> {new Date(aster.published_at).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {aster.status}</p>
      <p><strong>Like Count:</strong> {aster.like_count}</p>
      <p><strong>Created At:</strong> {aster.created_at && new Date(aster.created_at).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {aster.updated_at && new Date(aster.updated_at).toLocaleString()}</p>

      {aster.content_md && (
        <div className="aster-content">
          <p>{aster.content_md}</p>
        </div>
      )}
    </div>
  );
};

export default AsterDetail;
