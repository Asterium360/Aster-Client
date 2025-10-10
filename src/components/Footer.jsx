import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#02060D] py-6 px-4 mt-auto font-sans border-t border-white/10 backdrop-blur-md">
      <div className="max-w-4xl mx-auto text-center">

        <div className="text-xs text-[#d2b84d]">
          © {new Date().getFullYear()} • Creado con ❤️ para Bootcamp Femcoders Madrid. <br></br>
          Todos los contenidos tienen fines educativos y de divulgación.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
