import { redirect } from "react-router-dom";
import { getAsterById } from "../services/AsteriumServices";

/**
 * Loader para validar rutas protegidas en React Router v6.14+
 * @param {Object} args - Argumentos que React Router pasa al loader
 * @param {Object} args.params - Los parámetros de la ruta (:id, etc.)
 * @param {Object} args.request - La petición, útil para saber la URL
 */
export const routeValidator = async ({ params, request }) => {
    // 1️⃣ Verificar si el usuario está logueado
    const token = localStorage.getItem("token");
    if (!token) {
        return redirect("/login");
    }

    // 2️⃣ Obtener usuario del localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // 3️⃣ Validación de ID en rutas dinámicas
    if (params.id && isNaN(Number(params.id))) {
        return redirect("/not-found");
    }

    // 4️⃣ Validar permisos de autor para posts
    if (params.id) {
        try {
            const post = await getAsterById(params.id);
            // Solo el autor o admin puede editar
            if (post.authorId !== user.id && user.role !== "admin") {
                return redirect("/explore");
            }
        } catch (error) {
            return redirect("/not-found");
        }
    }

    // 5️⃣ Validar que solo admins puedan acceder al dashboard
    if (request.url.includes("/admin") && user.role !== "admin") {
        return redirect("/"); // Redirige a home si no es admin
    }

    return null;
};

    //  Validaciones adicionales
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