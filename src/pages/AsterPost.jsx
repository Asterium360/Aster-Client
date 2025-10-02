import React from "react";

export default function AsterPost() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-primary-light dark:text-text-primary-dark">
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <article>
            <header className="mb-8">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight md:leading-none mb-4 text-center">
                La enigmática danza de los cuerpos celestes
              </h1>
              <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Por la Dra. Evelyn Reed | Publicado el {" "}
                <time dateTime="2024-10-26">2 de octubre de 2025</time>
              </p>
            </header>

            <div className="mb-8 md:mb-12 sm:mx-0">
              <img
                className="w-full h-auto rounded-lg shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6GTO0B6H8kymY_DuD0ssnGNrgT1ni3lKBuRVLGof74Uv7-Eqpk9fTWJ4v09fNmONB4wHJKQfXTwg4Y846ll7GSkP6u_hPTiEj5UmPX9-qhxVcaj4AswEtuO25o5gTNEI_A-4Adym5LqtmMlPU6GY2aEdgzcu_5qXOQUpR6I2c8r3KhX1oeNldf1-TEP3WC0iU814rDr7hUHAHp5RXvYFTa9Xfekj2hmr7ecrTjGViIvUIUPQppW3Sc0gqZjPbQnBqO4zfGSRTSVY"
                alt="A beautiful nebula in space"
              />
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none text-text-primary-light dark:text-text-primary-dark/90 leading-relaxed space-y-6">
              <p>
                En la vasta extensión del cosmos, los cuerpos celestes se sumergen en una danza fascinante, cuyos movimientos están dictados por las leyes de la gravedad y el paso del tiempo. Desde las elegantes órbitas de los planetas alrededor de las estrellas hasta las intrincadas interacciones dentro de las galaxias, el universo es el escenario de un gran ballet de proporciones cósmicas. Este artículo profundiza en la enigmática danza de los cuerpos celestes, explorando las fuerzas que rigen sus movimientos y las profundas implicaciones de sus interacciones.
              </p>
              <p>
                En el corazón de esta danza cósmica se encuentra la gravedad, la fuerza fundamental que configura la estructura y la evolución del universo.
La gravedad actúa como coreógrafa, orquestando los movimientos de los cuerpos celestes y dictando sus trayectorias a través del espacio. Desde los asteroides más pequeños hasta las galaxias más grandes,
todo objeto del universo está sujeto a la fuerza de la gravedad, lo que influye en su movimiento y sus interacciones con otros cuerpos.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary-light dark:text-text-secondary-dark">
                "El cosmos está dentro de nosotros. Estamos hechos de materia estelar. Somos una vía para que el universo se conozca a sí mismo." - Carl Sagan
              </blockquote>
              <p>
                Uno de los aspectos más fascinantes de la danza celestial es el fenómeno de la resonancia orbital, donde las interacciones gravitacionales entre dos o más cuerpos crean patrones estables y repetitivos en sus órbitas. Estas resonancias pueden conducir a la formación de estructuras complejas, como las brechas de Kirkwood en el cinturón de asteroides o la División de Cassini en los anillos de Saturno, donde la influencia gravitacional de cuerpos más grandes esculpe la distribución de objetos más pequeños.
              </p>
              <p>
                La danza de los cuerpos celestes no se limita a estrellas y planetas individuales; se extiende a la gran escala de galaxias y cúmulos de galaxias. Las galaxias, vastas acumulaciones de estrellas, gas y polvo, interactúan entre sí a través de la gravedad, fusionándose, colisionando e intercambiando material en un ballet cósmico que abarca miles de millones de años. Estas interacciones moldean la evolución de las galaxias, desencadenando la formación estelar, alterando sus estructuras e impulsando el crecimiento de agujeros negros supermasivos en sus centros.
              </p>
              <p>
                El estudio de la danza celestial proporciona una profunda comprensión del funcionamiento del universo, revelando la intrincada interacción de fuerzas que rigen el movimiento de los cuerpos celestes. Al observar y modelar estas interacciones, los astrónomos pueden desentrañar los misterios del cosmos, desde la formación de los sistemas planetarios hasta la evolución de las galaxias y la estructura a gran escala del universo. La enigmática danza de los cuerpos celestes continúa cautivando e inspirando, ofreciendo una visión de la grandeza y complejidad del cosmos.
              </p>
            </div>
          </article>

          <hr className="border-primary/20 my-12" />

          <section id="comments">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-text-primary-light dark:text-text-primary-dark">
              Comentarios
            </h2>
            <div className="space-y-8">
              {/* Comment 1 */}
              <div className="flex items-start gap-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuChnq-5huR8RDmNViNbMdyHWMmA6tzmAGWi8uvsakR-8gwQR354HAgLAUHmSDF1-9HkSS-pJ3M1bccitL-qtz_2MWAQ8ehkW4XvxL1M6h0wblP4yS38l69aA65pQJltGLc-PpXwYVN3k4MSR-aZh109HoJFXMC65YlSVL3bHyU4e561Fo7nNvP7nwhNm48YDeRqyDepzlru5xXrmZi1g8WZAnY2SlwoR9vhjrL2BV6ZxBFyePAI5MIqlPaYZwcL6ncMGH_wESocVzI"
                  alt="Liam Carter's avatar"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                      Liam Carter
                    </h3>
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      Hace 2 días
                    </span>
                  </div>
                  <p className="text-sm text-text-primary-light dark:text-text-primary-dark/90">
                    ¡Este artículo es fascinante! Siempre me han intrigado los movimientos de los cuerpos celestes. ¡Gracias por compartirlo!
                  </p>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="flex items-start gap-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkF8nyHqTRPYIut181oNsnn3KnzlHHStGLZOdfaQ5cwdbNnci5QG9Dlu8hXKwgz0bGMzxJpBYRSuxwkychGcUWFsePXxC_FnCopP3w7FQ8X5ncDFz-yQSiHhQs5dE3ryjOGI2BTYxAs4mylS_wiiyx8VrloNC3mOyI2uD6kJAbClVLgwG611b4gNoDI3C0r0Jb8RR2rUrHQZEXoJn4"
                  alt="Sophia Bennett's avatar"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                      Sophia Bennett
                    </h3>
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      Hace 3 días
                    </span>
                  </div>
                  <p className="text-sm text-text-primary-light dark:text-text-primary-dark/90">
                    Estoy de acuerdo, el universo es realmente un escenario para un gran ballet.
El concepto de resonancia orbital es particularmente interesante.
                  </p>
                </div>
              </div>

              {/* Comment 3 */}
              <div className="flex items-start gap-4">
                <img
                  className="w-12 h-12 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJip1oIrcdpqTWGVahyHwAcHYnyNMDBJOXeW5MaEi9RWtT5kfP9d48cRdmRucy1SrmiEDQrnFGLRRtkuyEWmJUn16s2s7TQpMMev1aBQ_lasoMv8y2VyAvJAkI9CT6vAbPrt6x9Io_7_EBR6E56sIE0I-n6nRMWHi4JGCTtH4MstRHKIa2MHraAVcLxzKR74q_ko-bXTSzsWT69380PhwVQvD6VLOYORh_aqG6bKLpDlhchqtbgKV0ab_jt3OjGkZD9A3loKCSsx4"
                  alt="Ethan Walker's avatar"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">
                      Ethan Walker
                    </h3>
                    <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                      Hace 12 horas
                    </span>
                  </div>
                  <p className="text-sm text-text-primary-light dark:text-text-primary-dark/90">
                    Me interesa el papel de la materia oscura en la danza de las galaxias. ¿Influye en sus interacciones?
                  </p>
                </div>
              </div>

              {/* Comment Form */}
              <form className="mt-8">
                <textarea
                  className="w-full rounded border border-primary/30 bg-background-light dark:bg-background-dark/50 p-3 text-sm focus:border-primary focus:ring-primary transition-colors"
                  placeholder="Join the conversation..."
                  rows={4}
                />
                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition-colors"
                >
                  Publicar comentario
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

