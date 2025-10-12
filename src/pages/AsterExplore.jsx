import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAsters } from "../services/AsteriumServices";
import AsterCard from "../components/Card";
import Button from "../components/Button"; // Ajusta la ruta según tu proyecto

const ExplorePage =() => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("recent");

  const navigate = useNavigate();

  // Debounce simple para la búsqueda (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Traer todos los posts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllAsters();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando astros:", err);
        setError("No se pudieron cargar los posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrado + orden → ids para renderizar
  const filteredIds = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const q = (debouncedSearch || "").toLowerCase();

    let results = posts.filter((p) => {
      if (q) {
        const inTitle = String(p.title || "").toLowerCase().includes(q);
        const inExcerpt = String(p.excerpt || "").toLowerCase().includes(q);
        const inContent = String(p.content_md || "").toLowerCase().includes(q);
        const inAuthor = String(p.author || "").toLowerCase().includes(q);
        if (!(inTitle || inExcerpt || inContent || inAuthor)) return false;
      }
      return true;
    });

    results.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at || a.updated_at || 0).getTime();
      const dateB = new Date(b.published_at || b.created_at || b.updated_at || 0).getTime();
      return sort === "recent" ? dateB - dateA : dateA - dateB;
    });

    return results.map((r) => r.id);
  }, [posts, debouncedSearch, sort]);

  return (
    <div style={{ backgroundColor: "#02060D", minHeight: "100vh" }} className="p-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header con botón a la derecha */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Explorar</h1>
            <p className="text-gray-300">Busca, filtra y ordena publicaciones.</p>
          </div>

          {/* Botón crear post */}
          <Button
            title="+ Crear nuevo post"
            tooltip="Ir a crear un nuevo post"
            action={() => navigate("/newpost")}
          />
        </header>

        {/* Controles: búsqueda y orden */}
        <section className="mb-6">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Buscar por título, excerpt, contenido o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] p-2 rounded bg-white/5 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-2 rounded bg-white/5 text-white"
            >
              <option className="bg-[#02060D] text-white" value="recent">Más recientes</option>
              <option className="bg-[#02060D] text-white" value="oldest">Más antiguos</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setSort("recent");
              }}
              className="px-3 py-2 rounded bg-white/6 text-white hover:bg-white/10"
            >
              Limpiar
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-300">
            {loading ? (
              "Cargando publicaciones..."
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <span>{filteredIds.length} resultados</span>
            )}
          </div>
        </section>

        {/* Grid de cards */}
        <main>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredIds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIds.map((id) => (
                <AsterCard key={id} id={id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No se encontraron resultados.</p>
          )}
        </main>
      </div>
    </div>
  );
}
export default ExplorePage;