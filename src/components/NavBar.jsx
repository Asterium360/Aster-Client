import { useState, useEffect } from "react"; 
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Logo from "../assets/Logo.svg";
import Button from "./Button"; 
import { UserCircleIcon } from "@heroicons/react/24/solid";

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
  const location = useLocation(); 
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Filtra acciones para no mostrar botón si ya estás en esa ruta
  const visibleActions = actions.filter(btn => location.pathname !== btn.to);

  return (
    <nav style={{ backgroundColor: "#02060D" }} className="text-white px-4 py-4">
      <div className="flex items-center">
        {/* Logo izquierdo */}
        <div className="flex items-center gap-2 flex-1">
          <NavLink to="/"> 
          <img src={logo} alt="Logo" className="h-9 w-9 object-contain" />
          </NavLink>
          <NavLink to="/" className="font-bold text-lg">
            ASTERIUM
          </NavLink>
        </div>

        {/* Links centrados */}
        {isAuthenticated && (
          <div className="hidden sm:flex gap-7 items-center justify-center flex-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-2 py-1 rounded-md hover:bg-gray-700 ${
                    isActive ? "bg-gray-900 font-bold" : ""}`
                  }
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        {/* Acciones derecha */}
        <div className="hidden sm:flex gap-3">
          {!isAuthenticated ? (
            visibleActions.map(btn => (
              <NavLink key={btn.to} to={btn.to} data-testid={`${btn.label.toLowerCase()}-button`}>
                <Button title={btn.label} />
              </NavLink>
            ))
          ) : (
          <div className="flex items-center gap-2">
              {/* Icono de usuario o avatar */}
              <button onClick={() => navigate("/asterprofile")} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-full h-full text-white" />
                )}
              </button>
              {/* Logout */}
              <Button title="Logout" action={logout} data-testid="logout-button" />
            </div>
          )}
        </div>

        {/* Botón hamburguesa mobile */}
        <button
          className="sm:hidden p-2 rounded-md focus:outline-none bg-gray-700"
          onClick={handleToggleMenu}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú móvil */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        } flex flex-col gap-2`}
      >
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-2 py-2 rounded-md hover:bg-gray-700 ${
                isActive ? "bg-gray-900 font-bold" : ""
              }`
            }
            data-testid={`mobile-link-${link.label.toLowerCase()}`}
          >
            {link.label}
          </NavLink>
        ))}

        {!isAuthenticated
          ? (visibleActions.map(btn => (
              <NavLink key={btn.to} to={btn.to} data-testid={`mobile-${btn.label.toLowerCase()}-button`}>
                <Button title={btn.label} />
              </NavLink>
            ))
          ) : (
          <div className="flex items-center gap-2">
            {/* Avatar en mobile */}
            <button onClick={() => navigate("/myprofile")} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <UserCircleIcon className="w-full h-full text-white" />}
            </button>
            <Button title="Logout" action={logout} data-testid="mobile-logout-button" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
