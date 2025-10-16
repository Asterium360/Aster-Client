// src/pages/AsterProfile.jsx
import React, { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import API from "../services/axiosInstance";

export default function AsterProfile({ headerImageUrl }) {
  const userId = useAuthStore((s) => s.user?.id);   // ← id desde zustand
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // reset page si cambia de usuario
  useEffect(() => { setPage(1); }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const ac = new AbortController();
    setLoading(true);

    API.get(`/users/${userId}/profile`, {
      params: { includePosts: true, page },
      signal: ac.signal,
    })
      .then(({ data }) => {
        setUser(data.user ?? null);
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setPagination(data.pagination ?? null);
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("[perfil]", err?.response?.data || err.message);
        }
      })
      .finally(() => !ac.signal.aborted && setLoading(false));

    return () => ac.abort();
  }, [userId, page]);

  const displayName = (u) =>
    u?.display_name || u?.username || u?.email?.split("@")[0] || "Usuario";

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#070814] text-slate-200 flex items-center justify-center p-6">
        <div className="text-slate-400">Debes iniciar sesión para ver tu perfil.</div>
      </div>
    );
  }

  const totalPages = pagination?.totalPages ?? undefined;
  const canPrev = page > 1;
  const canNext = typeof totalPages === "number" ? page < totalPages : true;

  return (
    <div className="min-h-screen bg-[#070814] text-slate-200 flex justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-2 ring-indigo-700 shadow-lg bg-slate-900">
              <img
                src={headerImageUrl ?? `http://localhost:4000/users/${userId}/avatar`}
                alt="avatar"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center text-xl font-medium select-none">
                {!headerImageUrl && !user && "U"}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold">{displayName(user)}</h1>
                <p className="text-sm text-slate-400">{user?.username ? `@${user.username}` : "@usuario"}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {user?.created_at ? `Joined ${new Date(user.created_at).getFullYear()}` : ""}
                </p>
              </div>
              <div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-2xl shadow-sm text-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-8 space-y-4">
          {loading && <div className="text-sm text-slate-500">Cargando publicaciones...</div>}

          <div className="space-y-4">
            {posts.length === 0 && !loading ? (
              <div className="text-slate-500">No hay publicaciones para mostrar.</div>
            ) : (
              posts.map((p) => (
                <article key={p.id} className="bg-[#0a0b11] p-4 rounded-2xl shadow-md flex gap-4 items-center">
                  <div className="flex-1">
                    <div className="text-xs text-amber-300 font-medium">{p.category ?? "General"}</div>
                    <h3 className="font-semibold text-lg mt-1">{p.title}</h3>
                    <p className="text-sm text-slate-400 mt-2 line-clamp-3">{p.excerpt}</p>
                  </div>
                  <div className="w-36 h-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">No image</div>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Paginación */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => canPrev && setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
              className={`px-3 py-1 rounded-full ${canPrev ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-800/40 cursor-not-allowed"}`}
            >
              ‹
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">{page}</div>
              {typeof totalPages === "number" && (
                <span className="text-xs text-slate-500">de {totalPages}</span>
              )}
            </div>
            <button
              onClick={() => canNext && setPage((p) => p + 1)}
              disabled={!canNext}
              className={`px-3 py-1 rounded-full ${canNext ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-800/40 cursor-not-allowed"}`}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
