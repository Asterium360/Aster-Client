import { useState, useEffect } from "react"; 
import { NavLink } from "react-router-dom";
import Logo from "../assets/Logo.svg";

const NavBar = ({
  logo = Logo,
  links = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ],
  actions = [
    { label: "Login", to: "/login" },
    { label: "SignUp", to: "/register" },
  ],
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav style={{ backgroundColor: "#02060D" }} className="text-white px-4 py-4">
      {/* Contenedor principal */}
      <div className="flex items-center justify-between">
        {/* Logo y nombre */}
        <div className="flex items-center gap-2">
          <NavLink to="/">
            <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          </NavLink>
          <NavLink to="/" className="font-bold text-lg">
            ASTERIUM
          </NavLink>
        </div>

        {/* Botón hamburguesa mobile */}
        <button
          className="sm:hidden p-2 rounded-md focus:outline-none bg-gray-700"
          onClick={handleToggleMenu}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Links de escritorio */}
        <div className="hidden sm:flex gap-7 items-center">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-2 py-1 rounded-md hover:bg-gray-700 ${
                  isActive ? "bg-gray-900 font-bold" : ""
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {actions.map((btn) => (
            <NavLink
              key={btn.to}
              to={btn.to}
              style={{ backgroundColor: "#2f4992" }}
              className="px-3 py-1 rounded-md hover:bg-purple-700"
            >
              {btn.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Menú desplegable móvil con animación */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        } flex flex-col gap-2`}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-2 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? "bg-gray-900 font-bold" : ""
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}

        {actions.map((btn) => (
          <NavLink
            key={btn.to}
            to={btn.to}
            style={{ backgroundColor: "#2f4992" }}
            className="px-3 py-2 rounded-md hover:bg-purple-700"
          >
            {btn.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
