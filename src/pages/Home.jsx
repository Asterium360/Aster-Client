import React from "react";

// Mock temporal hasta conectar con el back
const posts = [
  {
    id: 1,
    title: "El misterio perdurable de la materia oscura",
    slug: "misterio-materia-oscura",
    excerpt:
      "Desentrañando los secretos del universo invisible y sus implicaciones para la evolución cósmica.",
    published_at: "2023-12-22T10:00:00.000Z",
    like_count: 128,
    image_url: "/public/materia-oscura.jpg",
  },
  {
    id: 2,
    title: "Descubren una 'Súper-Tierra' en un sistema estelar cercano",
    slug: "super-tierra-sistema-cercano",
    excerpt:
      "Un posible nuevo hogar para la vida más allá de la Tierra ofrece pistas tentadoras en la búsqueda de mundos habitables.",
    published_at: "2023-10-18T08:00:00.000Z",
    like_count: 96,
    image_url: "/public/super-terre.jpg",
  },
  {
    id: 3,
    title: "Comprendiendo los agujeros negros: la gran incógnita de la naturaleza",
    slug: "comprendiendo-agujeros-negros",
    excerpt:
      "Exploramos los gigantes gravitacionales en el corazón de las galaxias y la física que los gobierna.",
    published_at: "2023-10-15T08:00:00.000Z",
    like_count: 173,
    image_url: "/public/agujero-negro.jpg",
  },
];

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
          src={post.image_url}
          alt={post.title}
          className="w-full h-52 object-cover"
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <time className="text-xs text-[#5f5d7b] font-medium">
            {formatFecha(post.published_at)}
          </time>
          <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-[#4f2859] text-[#d2b84d]">
            Cosmology
          </span>
        </div>
        <a href={`/post/${post.slug}`} className="block group">
          <h3 className="text-base font-semibold leading-snug group-hover:text-[#2f4992] transition-colors text-white">
            {post.title}
          </h3>
        </a>
        <p className="text-sm text-[#5f5d7b] leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}

function Home() {
  return (
    <main className="min-h-screen w-full bg-[#02060D]">
      {/* HERO */}
      <section
        className="relative w-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(2,6,13,0.55), rgba(2,6,13,0.85)), url('/public/fondohome.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Explora el universo 
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-[#ede6c7]/90 leading-relaxed">
            Sumérgete en las maravillas del espacio con nuestros últimos descubrimientos, imágenes impresionantes y conocimientos cósmicos.          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="#recientes"
              className="rounded-lg px-7 py-3 text-sm font-semibold bg-[#2f4992] text-white hover:bg-[#3d5bb5] transition-colors"
            >   
              Comienza a explorar
            </a>
            <a
              href="#aprende"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-[#d2b84d] hover:text-[#e5ca5d] transition-colors"
            >
              Más información →
            </a>
          </div>
        </div>
      </section>

      {/* PUBLICACIONES RECIENTES */}
      <section
        id="recientes"
        className="mx-auto max-w-6xl px-6 pb-24 pt-16"
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Publicaciones recientes
          </h2>
          <a href="#" className="text-sm font-medium text-[#d2b84d] hover:text-[#e5ca5d] transition-colors">
            Ver todo →
          </a>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Card key={p.id} post={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;