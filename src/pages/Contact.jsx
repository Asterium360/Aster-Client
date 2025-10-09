import React, { useState } from 'react';


/**
 * Contact.jsx
 * Página de Contacto estilo "Asterium" usando Tailwind.
 * - FAQ acordeón a la izquierda
 * - Formulario a la derecha
 * - Envío POST a /api/contact
 */

const FAQ_ITEMS = [
  {
    q: "¿Cómo puedo publicar una observación?",
    a:
      "Para publicar una observación, dirígete a la sección 'Publicaciones' y haz clic en el botón 'Nueva publicación'. Luego, sigue las instrucciones en pantalla para redactar y compartir tus observaciones o pensamientos astronómicos."
  },
  {
    q: "¿Cuáles son las normas para publicar?",
    a:
      "Sé respetuoso, cita tus fuentes cuando sea necesario, evita el contenido spam y sigue las reglas de la comunidad. Las publicaciones que no cumplan las normas podrán ser eliminadas por los moderadores."
  },
  {
    q: "¿Cómo puedo reportar contenido inapropiado?",
    a:
      "Utiliza la opción de reportar que aparece en la publicación o contacta con el equipo de moderación mediante este formulario. Incluye una breve descripción y el enlace al contenido."
  }
];


const Contact = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // FAQ accordion state
  const [openIndex, setOpenIndex] = useState(0);

  // Validación simple
  const validate = () => {
    if (!name.trim()) return "Por favor ingresa tu nombre.";
    if (!email.trim()) return "Por favor ingresa tu correo.";
    // email básico
    // NOTE: para validación más sólida usar una librería o regex más completa
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Por favor ingresa un correo válido.";
    if (!message.trim() || message.trim().length < 10) return "El mensaje debe tener al menos 10 caracteres.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    const error = validate();
    if (error) {
      setStatus({ type: "error", message: error });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "Error al enviar el mensaje.");
      }

      setStatus({ type: "success", message: "Mensaje enviado. ¡Gracias!" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Error desconocido." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d10] text-slate-200 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold">Ayuda y Comentarios</h1>
          <p className="text-slate-400 mt-2">Encuentra respuestas a las preguntas más comunes o envíanos un
            mensaje.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: FAQ */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Preguntas Frecuentes
</h2>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const open = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-[#0f1114] border border-[#1b1e22] rounded-xl p-5 shadow-sm"
                  >
                    <button
                      onClick={() => setOpenIndex(open ? null : idx)}
                      aria-expanded={open}
                      className="w-full text-left flex items-center justify-between"
                    >
                      <span className="font-medium">{item.q}</span>
                      <span className="ml-4 transform">{open ? "▴" : "▾"}</span>
                    </button>
                    {open && (
                      <div className="mt-3 text-slate-400 text-sm leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right: Contact Form */}
          <aside>
            <h2 className="text-2xl font-semibold mb-6">Contáctanos</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm text-slate-300">
                <span className="block text-xs text-slate-400 mb-2">Tu nombre</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Carl Sagan"
                  className="w-full bg-[#0b0f13] border border-[#22252a] rounded-lg px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-700"
                  aria-label="Tu nombre"
                />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="block text-xs text-slate-400 mb-2">Tu correo electrónico</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carl@cosmos.com"
                  className="w-full bg-[#0b0f13] border border-[#22252a] rounded-lg px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-700"
                  aria-label="Tu correo"
                />
              </label>

              <label className="block text-sm text-slate-300">
                <span className="block text-xs text-slate-400 mb-2">Tu mensaje</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the pale blue dot..."
                  rows={5}
                  className="w-full bg-[#0b0f13] border border-[#22252a] rounded-lg px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-700 resize-none"
                  aria-label="Tu mensaje"
                />
              </label>

              {status && (
                <div
                  role="status"
                  className={`text-sm py-2 px-3 rounded ${status.type === "success" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}
                >
                  {status.message}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white shadow-md"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <span>Enviar mensaje</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;