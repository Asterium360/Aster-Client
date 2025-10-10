import { redirect } from "react-router-dom";
import { getAsterById } from "../services/AsteriumServices";

/**
 * Loader para validar rutas protegidas en React Router v6.14+
 * @param {Object} args - Argumentos que React Router pasa al loader
 * @param {Object} args.params - Los parámetros de la ruta (:id, etc.)
 */
export const routeValidator = async ({ params }) => {
    // 1️⃣ Verificar si el usuario está logueado
    const token = localStorage.getItem("token");
    if (!token) {
        // No hay token → redirigir al login
        return redirect("/login");
    }

    // 2️⃣ Validación de ID en rutas dinámicas
    if (params.id && isNaN(Number(params.id))) {
        // ID no es numérico → redirigir a Not Found
        return redirect("/not-found");
    }

    // 3️⃣ Validar permisos (solo autor puede editar)
    const user = JSON.parse(localStorage.getItem("user"));
    if (params.id) {
        try {
            const post = await getAsterById(params.id); 
            if (post.authorId !== user.id) {
                // No tiene permisos → redirigir a explore
                return redirect("/explore");
            }
        } catch (error) {
            // Si no existe el post o hubo error → redirigir a not found
            return redirect("/not-found");
        }
    }
}
    // 4️⃣ Validaciones adicionales
    // Por ejemplo, aquí podrías verificar que el token siga siendo válido haciendo ping a tu backend
    //const tokenValid = await checkTokenValidity(token);
    //if (!tokenValid) {
     //   return redirect("/login");
    //}
   // return null;}


/*
 * Función ejemplo para validar token
 * Ajusta según tu endpoint de backend

async function checkTokenValidity(token) {
    try {
        const res = await fetch("https://localhost:4000/auth/validate-token", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok;
    } catch {
        return false;
    }
}
*/