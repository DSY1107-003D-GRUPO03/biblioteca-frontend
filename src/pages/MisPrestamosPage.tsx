import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import type { Prestamo } from "../types/Prestamo";
import { devolverPrestamo, obtenerMisPrestamos } from "../services/prestamoService";

export function MisPrestamosPage() {

    const { getAccessToken } = useAuth();
    const [ prestamos, setPrestamos ] = useState<Prestamo[]>([]);
    const [ cargando, setCargando ] = useState(true);
    const [ error, setError] = useState<string | null>(null);
    const [ devolviendoId, setDevolviendoId ] = useState<number | null>(null);
    const [ mensaje, setMensaje ] = useState<string | null>(null);

    useEffect(() => {
        getAccessToken()
            .then(obtenerMisPrestamos)
            .then(setPrestamos)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }, []);

    async function handleDevolver(id : number) {
        setDevolviendoId(id);
        setMensaje(null);

        try {
            const token = await getAccessToken();
            const actualizado = await devolverPrestamo(id, token);
            setPrestamos((lista) => lista.map((p) => (p.id === id ? actualizado : p)));
            setMensaje("Préstamo devuelto con éxito");
        } catch (err) {
            setMensaje(err instanceof Error ? `Error: ${err.message}` : "Error desconocido");
        } finally {
            setDevolviendoId(null);
        }
    }

    if (cargando) return <p className="contenedor pagina mensaje">Cargando tus préstamos...</p>;
    if (error) return <p className="contenedor pagina mensaje-error">Error : {error}</p>

    return (
        <div className="contenedor pagina">
            <h1>Mis préstamos</h1>
            {mensaje && <p className="mensaje">{mensaje}</p>}
            {prestamos.length === 0 ?(
                <p className="mensaje">No tienes préstamos.</p>
            ) : (
                <ul className="prestamos">
                    {prestamos.map((p) => (
                        <li key={p.id} className="tarjeta prestamo">
                            <div className="prestamo-datos">
                                <span className="prestamo-titulo">{p.titulo}</span>
                                <span className="texto-suave">
                                    Desde {new Date(p.fechaPrestamo).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="prestamo-acciones">
                                <span className={p.estado === "ACTIVO" ? "etiqueta etiqueta-laton" : "etiqueta"}>
                                    {p.estado}
                                </span>
                                {p.estado === "ACTIVO" && (
                                    <button
                                        type="button"
                                        className="boton-secundario"
                                        disabled={devolviendoId === p.id}
                                        onClick={() => void handleDevolver(p.id)}
                                    >
                                        {devolviendoId === p.id ? "Devolviendo..." : "Devolver"}
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

}