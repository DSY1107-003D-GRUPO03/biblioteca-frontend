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
        <div>
            <h1>Historial de eventos</h1>

            <label>
                Filtrar por tipo:{" "}
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="">Todos</option>
                    {TIPOS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </label>

            {cargando && <p>Cargando historial...</p>}
            {error && <p>Error : {error}</p>}

            {!cargando && !error && (
                entradas.length === 0 ? (
                    <p>No hay eventos registrados.</p>
                ) : (
                    <table style={{ marginTop : "1rem", borderCollapse : "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ padding : "0.25rem 0.75rem" }}>Fecha</th>
                                <th style={{ padding : "0.25rem 0.75rem" }}>Tipo</th>
                                <th style={{ padding : "0.25rem 0.75rem" }}>Libro</th>
                                <th style={{ padding : "0.25rem 0.75rem" }}>Préstamo</th>
                                <th style={{ padding : "0.25rem 0.75rem" }}>Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entradas.map((e) => (
                                <tr key={e.id}>
                                    <td style={{ padding : "0.25rem 0.75rem" }}>{new Date(e.recibidoEn).toLocaleString()}</td>
                                    <td style={{ padding : "0.25rem 0.75rem" }}>{e.tipo}</td>
                                    <td style={{ padding : "0.25rem 0.75rem" }}>{e.libroId ?? "-"}</td>
                                    <td style={{ padding : "0.25rem 0.75rem" }}>{e.prestamoId ?? "-"}</td>
                                    <td style={{ padding : "0.25rem 0.75rem" }}>{e.usuario ? `${e.usuario.slice(0, 8)}...` : "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}