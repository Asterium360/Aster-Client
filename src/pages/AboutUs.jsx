import React from "react";

const TeamMember = ({ name, role, imgSrc, githubLink = "#", linkedinLink = "#" }) => (
  <div className="group text-center transform transition-transform duration-300 hover:scale-105">
    <div className="relative mx-auto h-40 w-40 sm:h-48 sm:w-48 md:h-40 md:w-40">
      <img
        alt={name}
        className="h-full w-full rounded-full object-cover"
        src={imgSrc}
      />
      <div className="absolute inset-0 rounded-full border-2 border-accent-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>
    <h4 className="mt-4 text-lg sm:text-xl font-bold text-text-primary">{name}</h4>
    <p className="text-text-secondary text-sm sm:text-base">{role}</p>
    <div className="mt-3 flex justify-center gap-4">
      <a href={githubLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.262.82-.582 0-.288-.012-1.243-.018-2.255-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.304.762-1.603-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.468-2.38 1.236-3.22-.124-.304-.536-1.524.116-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.045.138 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.654 1.652.242 2.872.118 3.176.77.84 1.236 1.91 1.236 3.22 0 4.61-2.804 5.625-5.475 5.922.43.37.814 1.096.814 2.21 0 1.595-.014 2.88-.014 3.27 0 .322.216.698.825.58C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.966 0-1.75-.783-1.75-1.75s.784-1.75 1.75-1.75 1.75.783 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.378-1.122-2.5-2.5-2.5s-2.5 1.122-2.5 2.5v5.5h-3v-10h3v1.359c.709-1.02 2.022-1.359 3.5-1.359 2.481 0 4.5 2.019 4.5 4.5v5.5z"/>
        </svg>
      </a>
    </div>
  </div>
);

function AboutUs() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">

            {/* Hero Section */}
            <section className="mb-16 text-center">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary">
                Sobre nosotras
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-text-secondary">
                Trazando un rumbo para los descubrimientos espaciales
              </p>
            </section>

            {/* Mission Section */}
            <section className="mb-16">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-accent-secondary">
                    Nuestra misión
                  </h3>
                  <p className="mt-4 text-text-primary text-base sm:text-lg">
                    Asterium se dedica a acercar las maravillas del universo a todos. 
                    Nuestra misión es inspirar la curiosidad y la comprensión de la astronomía 
                    mediante contenido atractivo, imágenes cautivadoras y recursos educativos. 
                    Creemos que el espacio es de todos y nos apasiona hacerlo accesible.
                  </p>
                </div>
                <div className="relative h-64 sm:h-80 md:h-80 rounded-lg bg-accent-additional p-4">
                  <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="src/assets/img/AsterLogo.png"
                      alt="space"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="mb-16">
              <h3 className="text-center text-3xl sm:text-4xl font-bold text-accent-secondary">
                Conozca al equipo
              </h3>

              {/* Первая линия команды */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <TeamMember
                  name="Michelle Gelves"
                  role="Team Lead / Frontend"
                  imgSrc="src/assets/img/Michelle.png"
                  githubLink="https://github.com/MichelleGel"
                  linkedinLink="https://www.linkedin.com/in/michelle-gelves/"
                />
                <TeamMember
                  name="Larysa Ambartsumian"
                  role="Scrum Master / Frontend"
                  imgSrc="src/assets/img/Larysa.png"
                  githubLink="https://github.com/ambalari"
                  linkedinLink="https://www.linkedin.com/in/larysa-ambartsumian/"
                />
                <TeamMember
                  name="Angelica Pereira"
                  role="Desarrolladora Fullstack"
                  imgSrc="src/assets/img/Anngy.png"
                  githubLink="https://github.com/angiepereir"
                  linkedinLink="https://www.linkedin.com/in/anngy-pereira-094aa026a/"
                />
              </div>

              {/* Вторая линия команды */}
              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-32">
                <TeamMember
                  name="Maryori Cruz"
                  role="Desarrolladora Backend"
                  imgSrc="src/assets/img/Maryori.png"
                  githubLink="https://github.com/MaryoriCruz"
                  linkedinLink="https://www.linkedin.com/in/maryori-cruz-6b440116b/"
                />
                <TeamMember
                  name="Sofia Reyes"
                  role="Desarrolladora Backend"
                  imgSrc="src/assets/img/Sofia.png"
                  githubLink="https://github.com/Sofiareyes12"
                  linkedinLink="https://www.linkedin.com/in/sofiareyes12/"
                />
              </div>
            </section>

            {/* Contact Section */}
            <section className="rounded-lg bg-accent-additional/20 p-8 text-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-accent-secondary">
                Contáctanos
              </h3>
              <p className="mt-4 text-text-primary text-base sm:text-lg">
                Para consultas, colaboraciones o simplemente para compartir tu
                última aventura astronómica, contáctanos. ¡Siempre nos alegra
                saber de otros entusiastas de la astronomía!
              </p>
              <a
                className="mt-6 inline-block rounded-full bg-accent-primary px-6 sm:px-8 py-2 sm:py-3 font-bold text-white transition-transform duration-300 hover:scale-105"
                href="mailto:equipoasterium@gmail.com"
              >
                equipoasterium@gmail.com
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AboutUs;
