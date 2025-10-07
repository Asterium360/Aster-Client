import { useEffect, useState } from "react";
import { getAllAsters } from "../services/AsteriumServices";

export default function ExplorePage() {
  const [asters, setAsters] = useState([]);
  const [filteredAsters, setFilteredAsters] = useState([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("recent");

  // 🔹 Traer todos los datos desde el service
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAsters();
        setAsters(data);
        setFilteredAsters(data);
      } catch (error) {
        console.error("Error cargando astros:", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filtrar y ordenar cuando cambien los filtros
  useEffect(() => {
    let results = [...asters];

    // 🔎 Búsqueda (en título, resumen, autor y tags)
    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(
        aster =>
          aster.title.toLowerCase().includes(lowerSearch) ||
          aster.summary.toLowerCase().includes(lowerSearch) ||
          aster.author.toLowerCase().includes(lowerSearch) ||
          (aster.tags &&
            aster.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
      );
    }

    // 🏷️ Filtro por tag (categoría/etiqueta)
    if (tag) {
      results = results.filter(
        aster =>
          aster.tags &&
          aster.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    // 🕒 Ordenar por fecha
    results.sort((a, b) => {
      if (sort === "recent") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });

    setFilteredAsters(results);
  }, [search, tag, sort, asters]);

  // 🔹 Obtener lista de tags únicos (para el select de filtros)
  const allTags = Array.from(
    new Set(asters.flatMap(aster => aster.tags || []))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explorar Asters</h1>

      {/* Barra de búsqueda y filtros */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por título, autor, resumen o tags"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />

        <select
          value={tag}
          onChange={e => setTag(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los tags</option>
          {allTags.map((t, idx) => (
            <option key={idx} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="recent">Más recientes</option>
          <option value="oldest">Más antiguos</option>
        </select>
      </div>

      {/* Lista de posts */}
      <div className="grid gap-6">
        {filteredAsters.length > 0 ? (
          filteredAsters.map(aster => (
            <div
              key={aster.id}
              className="border p-4 rounded shadow flex gap-4"
            >
              {/* Imagen */}
              {aster.image_url && (
                <img
                  src={aster.image_url}
                  alt={aster.title}
                  className="w-40 h-28 object-cover rounded"
                />
              )}

              {/* Contenido */}
              <div>
                <h3 className="text-lg font-semibold">{aster.title}</h3>
                <p className="text-sm text-gray-600">{aster.summary}</p>
                <p className="text-sm">
                  <span className="font-medium">Autor:</span> {aster.author}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(aster.created_at).toLocaleDateString()}
                </p>

                {/* Tags */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {aster.tags &&
                    aster.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 text-xs px-2 py-1 rounded"
                      >
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}
