import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";
import type { Libro } from "../types/Libro";
import { obtenerLibroPorId } from "../services/libroService";
import { solicitarPrestamo } from "../services/prestamoService";

export function LibroDetallePage() {
    const { id } = useParams();
    const { isAuthenticated, getAccessToken, login } = useAuth();

    const [libro, setLibro] = useState<Libro | null>(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [solicitando, setSolicitando] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    useEffect(() => {
        if(!id) return;

        if(!isAuthenticated) { 
            setCargando(false);
            return;
        }

        getAccessToken()
            .then((token) => obtenerLibroPorId(id,token))
            .then(setLibro)
            .catch((err) => setError(err.mensaje))
            .finally(() => setCargando(false));
    }, [id, isAuthenticated]);

    async function handleSolicitarPrestamo() {
        if(!libro) return;

        setSolicitando(true);
        setMensaje(null);

        try {
            const token = await getAccessToken();
            await solicitarPrestamo(libro.id, token);
            setMensaje('Prestamo solicitado con exito');
            setLibro({...libro, stock : libro.stock - 1, disponible : libro.stock - 1 > 0});
        } catch (error) {
            setMensaje(error instanceof Error ? `Error: ${error.message}` : "Error desconocido");            
        } finally {
            setSolicitando(false);
        }
    }


        if(!isAuthenticated) {
            return (
                <section className="contenedor pagina">
                    <div className="tarjeta detalle">
                        <p className="mensaje">Debes iniciar sesión para ver el detalle del libro.</p>
                        <button type="button" className="boton" onClick={() => void login()}>
                            Iniciar sesión
                        </button>
                    </div>
                </section>
            );
        }

        if (cargando) return <p className="contenedor pagina mensaje">Cargando libro...</p>
        if (error) return <p className="contenedor pagina mensaje-error">Error: {error}</p>
        if (!libro) return <p className="contenedor pagina mensaje">Libro no encontrado.</p>

        return (
            <div className="contenedor pagina">
                <div className="tarjeta detalle">
                    <h1>{libro.titulo}</h1>
                    <dl className="detalle-datos">
                        <dt>Autor</dt>
                        <dd>{libro.autor}</dd>
                        <dt>ISBN</dt>
                        <dd>{libro.isbn}</dd>
                        <dt>Stock</dt>
                        <dd>{libro.stock}</dd>
                    </dl>

                    <button
                        type="button"
                        className="boton"
                        disabled={!libro.disponible || solicitando}
                        onClick={() => void handleSolicitarPrestamo()}
                    >
                        {solicitando ? "Solicitando..." : "Solicitar prestamo"}
                    </button>

                    {mensaje && <p className="mensaje">{mensaje}</p> }
                </div>
            </div>
        );



}