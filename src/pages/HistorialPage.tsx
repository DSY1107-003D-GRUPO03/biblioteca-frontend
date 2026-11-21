import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import type { EntradaHistorial } from "../types/Historial";
import { obtenerHistorial } from "../services/historialService";

const TIPOS = [
    "prestamo.creado",
    "prestamo.devuelto",
    "libro.creado",
    "libro.eliminado",
];

export function HistorialPage() {

    const { getAccessToken } = useAuth();
    const [ entradas, setEntradas ] = useState<EntradaHistorial[]>([]);
    const [ tipo, setTipo ] = useState("");
    const [ cargando, setCargando ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(() => {
        setCargando(true);
        setError(null);

        getAccessToken()
            .then((token) => obtenerHistorial(token, tipo || undefined))
            .then(setEntradas)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }, [tipo]);

    return (
        <div className="contenedor pagina">
            <h1>Historial de eventos</h1>

            <div className="tarjeta filtro">
                <label className="campo">
                    <span className="campo-etiqueta">Filtrar por tipo</span>
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                        <option value="">Todos</option>
                        {TIPOS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </label>
            </div>

            {cargando && <p className="mensaje">Cargando historial...</p>}
            {error && <p className="mensaje-error">Error : {error}</p>}

            {!cargando && !error && (
                entradas.length === 0 ? (
                    <p className="mensaje">No hay eventos registrados.</p>
                ) : (
                    <div className="tarjeta tabla-contenedor">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Libro</th>
                                    <th>Préstamo</th>
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entradas.map((e) => (
                                    <tr key={e.id}>
                                        <td>{new Date(e.recibidoEn).toLocaleString()}</td>
                                        <td><span className="etiqueta">{e.tipo}</span></td>
                                        <td>{e.libroId ?? "-"}</td>
                                        <td>{e.prestamoId ?? "-"}</td>
                                        <td>{e.usuario ? `${e.usuario.slice(0, 8)}...` : "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
}