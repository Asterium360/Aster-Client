import { Navigate } from "react-router-dom";
import useAuthStore from "./authStore";

const ProtectedRoute = ({ children }) => {
    // Obtenemos el estado global de auth desde Zustand
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Si NO está autenticado, mandamos al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, mostramos la ruta normal
    return children;
};

export default ProtectedRoute;
