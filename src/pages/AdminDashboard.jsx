// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../services/UserServices";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      console.log("Usuarios recibidos desde la API:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await updateUser(id, { role });
      loadUsers();
    } catch (error) {
      console.error("Error actualizando rol:", error);
    }
  };

  if (loading) return <p className="p-6">Cargando usuarios...</p>;

  return (
  
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 p-6 mt-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard - Gestión de Usuarios</h1>

            <div className="overflow-x">
                <table className="w-full border border-gray rounded-lg">
                    <thead >
                        <tr>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Nombre</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Rol</th>
                            <th className="p-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3">{u.id}</td>
                                    <td className="p-3">{u.username || u.name}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">
                                        <select
                                            value={u.role || (u.role_id === 1 ? "admin" : "user")}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className="border rounded px-2 py-1"
                                        >
                                            <option className="bg-[#02060D] text-white" value="user">User</option>
                                            <option className="bg-[#02060D] text-white" value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4">
                                    No hay usuarios disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    
  );
};

export default AdminDashboard;
