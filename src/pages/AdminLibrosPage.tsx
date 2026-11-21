import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../auth/useAuth";
import type { Libro } from "../types/Libro";
import { crearLibro, eliminarLibro, obtenerLibrosPublicos, type NuevoLibroRequest } from "../services/libroService";

export function AdminLibrosPage() {
    const { isAuthenticated, tieneRolAdmin, getAccessToken, login } = useAuth();

    const [libros, setLibros] = useState<Libro[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [esAdmin, setEsAdmin] = useState<boolean | null>(null);

    const [form, setForm] = useState<NuevoLibroRequest>({
        titulo : "",
        autor : "",
        isbn : "",
        stock : 1,
    });

    useEffect(() => {
        if(!isAuthenticated) {
            setEsAdmin(false);
            return;
        }
        tieneRolAdmin().then(setEsAdmin);
    }, [isAuthenticated]);

    function cargarLibros() {
        setCargando(true);
        obtenerLibrosPublicos()
            .then(setLibros)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }

    useEffect(() => {
        cargarLibros();
    }, []);

    async function handleCrear(e : FormEvent) {
        e.preventDefault();
        setError(null);
    
        try {
            const token = await getAccessToken();
            await crearLibro(form, token);
            setForm({ titulo : "", autor : "", isbn : "", stock : 1});
            cargarLibros();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al crear libro");
        }
        
    }

    async function handleEliminar(id : number) {
        try {
            const token = await getAccessToken();
            await eliminarLibro(id, token);
            cargarLibros();
        } catch (error) {
            setError(error instanceof Error ? error.message : "Error al eliminar el libro");            
        }
    }

    if (!isAuthenticated) {
        return (
            <section className="contenedor pagina">
                <div className="tarjeta detalle">
                    <p className="mensaje">Debes iniciar sesion para administrar el catálogo</p>
                    <button type="button" className="boton" onClick={() => void login()}>
                        Iniciar sesión
                    </button>
                </div>
            </section>
        );
    }

    if (esAdmin === null) return <p className="contenedor pagina mensaje">Verificando permisos...</p>
    if (!esAdmin) return <p className="contenedor pagina mensaje-error">No tiene permisos de administrador para ver esta pagina.</p>

    return (
        <div className="contenedor pagina">
            <h1>Administrar catálogo</h1>

            <form className="tarjeta formulario" onSubmit={(e) => void handleCrear(e)}>
                <div className="formulario-campos">
                    <label className="campo">
                        <span className="campo-etiqueta">Título</span>
                        <input
                            placeholder="Titulo"
                            value={form.titulo}
                            onChange={(e) => setForm({...form, titulo : e.target.value})}
                            required
                        />
                    </label>
                    <label className="campo">
                        <span className="campo-etiqueta">Autor</span>
                        <input
                            placeholder="Autor"
                            value={form.autor}
                            onChange={(e) => setForm({...form, autor : e.target.value})}
                            required
                        />
                    </label>
                    <label className="campo">
                        <span className="campo-etiqueta">ISBN</span>
                        <input
                            placeholder="ISBN"
                            pattern="[0-9\-]{10,17}"
                            title="Solo dígitos y guiones, entre 10 y 17 caracteres (ej. 978-0-00-000000-1)"
                            value={form.isbn}
                            onChange={(e) => setForm({...form, isbn : e.target.value})}
                            required
                        />
                    </label>
                    <label className="campo">
                        <span className="campo-etiqueta">Stock</span>
                        <input
                            type="number"
                            min={0}
                            value={form.stock}
                            onChange={(e) => setForm({...form, stock : Number(e.target.value)})}
                            required
                        />
                    </label>
                </div>
                <div className="formulario-acciones">
                    <button type="submit" className="boton">Agregar Libro</button>
                </div>
            </form>

                {error && <p className="mensaje-error">{error}</p> }
                {cargando ? (
                    <p className="mensaje">Cargano...</p>
                ) : (
                    <div className="tarjeta tabla-contenedor">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Stock</th>
                                    <th className="tabla-acciones">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {libros.map((libro) => (
                                    <tr key={libro.id}>
                                        <td>{libro.titulo}</td>
                                        <td>{libro.stock}</td>
                                        <td className="tabla-acciones">
                                            <button type="button" className="boton-peligro" onClick={() => void handleEliminar(libro.id)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    )

}