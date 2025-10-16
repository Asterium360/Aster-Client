import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedAsters } from "../services/AsteriumServices";
import GalaxyBackground from "../components/GalaxyBackground";


const formatFecha = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Card({ post }) {
  return (
    <article className="rounded-xl overflow-hidden bg-[#0b1118] transition-all duration-300 hover:-translate-y-1 border border-[#1a2332]">
      <div className="relative">
        <img
          src={post.image_url || "/fallback.jpg"}
          alt={post.title}
          className="w-full h-52 object-cover"
          onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <time className="text-xs text-[#5f5d7b] font-medium">
            {formatFecha(post.published_at)}
          </time>
          {/* <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-[#4f2859] text-[#d2b84d]">
            Cosmology
          </span> */}
        </div>

        
        <Link to={`/viewpost/${post.id}`} className="block group">
          <h3 className="text-base font-semibold leading-snug group-hover:text-[#2f4992] transition-colors text-white">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-[#5f5d7b] leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPublishedAsters(3); // ← solo 3 publicadas
        setPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    
    <main className="min-h-screen w-full">
      <GalaxyBackground>
      {/* HERO */}
      {/* <section
        className="relative w-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,13,0.55), rgba(2,6,13,0.85)), url('/fondohome.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} 
      >*/}
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Explora el universo
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-[#fffff]/90 font-bold leading-relaxed">
            Sumérgete en las maravillas del espacio con nuestros últimos descubrimientos, imágenes impresionantes y conocimientos cósmicos.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/explore"
              className="rounded-lg px-7 py-3 text-sm font-semibold bg-[#2f4992] text-white hover:bg-[#3d5bb5] transition-colors"
            >
              Comienza a explorar
            </Link>
            <a
              href="#recientes"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-[#d2b84d] hover:text-[#e5ca5d] transition-colors"
            >
              Más información →
            </a>
          </div>
        </div>
      {/*</section>*/}

      {/* PUBLICACIONES RECIENTES */}
      <section id="recientes" className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Publicaciones recientes
          </h2>
          <Link to="/explore" className="text-sm font-medium text-[#d2b84d] hover:text-[#e5ca5d] transition-colors">
            Ver todo →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <Card key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
      </GalaxyBackground>
    </main>
  
  );
}

export default Home;
