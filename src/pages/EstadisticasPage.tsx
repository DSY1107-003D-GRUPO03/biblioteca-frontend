import { useEffect, useState } from "react";
import { BookOpen, CornerDownLeft, Hourglass } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import type { Estadisticas, LibroEstadistica } from "../types/Estadisticas";
import { obtenerEstadisticas } from "../services/analiticaService";

function tituloLibro(libro : LibroEstadistica) {
    return libro.titulo ?? `Libro #${libro.libroId}`;
}

function TarjetaTotal({ etiqueta, valor, Icono } : { etiqueta : string; valor : number; Icono : LucideIcon }) {
    return (
        <div className="tarjeta total">
            <div>
                <p className="total-etiqueta">{etiqueta}</p>
                <p className="total-numero">{valor}</p>
            </div>
            <Icono className="total-icono" size={20} strokeWidth={1.75} aria-hidden="true" />
        </div>
    );
}

export function EstadisticasPage() {

    const { getAccessToken } = useAuth();
    const [ datos, setDatos ] = useState<Estadisticas | null>(null);
    const [ cargando, setCargando ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);
    const [ intento, setIntento ] = useState(0);

    useEffect(() => {
        setCargando(true);
        setError(null);

        getAccessToken()
            .then((token) => obtenerEstadisticas(token))
            .then(setDatos)
            .catch((err) => setError(err.message))
            .finally(() => setCargando(false));
    }, [intento]);

    const vacio = datos !== null
        && datos.totalPrestamos === 0
        && datos.masPrestados.length === 0
        && datos.sinStock.length === 0;

    const maximo = datos ? Math.max(1, ...datos.masPrestados.map((l) => l.prestamos)) : 1;

    return (
        <div className="contenedor pagina">
            <h1>Estadísticas</h1>

            {cargando && (
                <div aria-busy="true" aria-label="Cargando estadísticas">
                    <div className="totales">
                        <div className="tarjeta skeleton skeleton-total"></div>
                        <div className="tarjeta skeleton skeleton-total"></div>
                        <div className="tarjeta skeleton skeleton-total"></div>
                    </div>
                    <div className="tarjeta skeleton skeleton-lista"></div>
                </div>
            )}

            {error && !cargando && (
                <div className="tarjeta aviso-error" role="alert">
                    <p>No pudimos cargar las estadísticas. {error}</p>
                    <button type="button" className="boton" onClick={() => setIntento((n) => n + 1)}>
                        Reintentar
                    </button>
                </div>
            )}

            {!cargando && !error && datos && (
                vacio ? (
                    <div className="tarjeta aviso-vacio">
                        <p>Aún no hay datos para mostrar. Cuando se registren los primeros préstamos, las estadísticas aparecerán aquí.</p>
                    </div>
                ) : (
                    <>
                        <div className="totales">
                            <TarjetaTotal etiqueta="Total préstamos" valor={datos.totalPrestamos} Icono={BookOpen} />
                            <TarjetaTotal etiqueta="Devoluciones" valor={datos.totalDevoluciones} Icono={CornerDownLeft} />
                            <TarjetaTotal etiqueta="Préstamos activos" valor={datos.prestamosActivos} Icono={Hourglass} />
                        </div>

                        <section className="seccion">
                            <h2>Más prestados</h2>
                            {datos.masPrestados.length === 0 ? (
                                <p className="texto-suave">Todavía no hay libros prestados.</p>
                            ) : (
                                <ol className="ranking tarjeta">
                                    {datos.masPrestados.map((libro, i) => (
                                        <li key={libro.libroId} className="ranking-fila">
                                            <span className="ranking-posicion">{i + 1}</span>
                                            <div className="ranking-cuerpo">
                                                <span className="ranking-titulo">{tituloLibro(libro)}</span>
                                                <progress
                                                    className="ranking-barra"
                                                    value={libro.prestamos}
                                                    max={maximo}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <span className="ranking-cantidad">
                                                {libro.prestamos} {libro.prestamos === 1 ? "préstamo" : "préstamos"}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </section>

                        <section className="seccion">
                            <h2>Sin stock</h2>
                            {datos.sinStock.length === 0 ? (
                                <p className="texto-suave">Todos los libros tienen ejemplares disponibles.</p>
                            ) : (
                                <ul className="sin-stock-lista">
                                    {datos.sinStock.map((libro) => (
                                        <li key={libro.libroId} className="tarjeta sin-stock">
                                            <span className="sin-stock-titulo">{tituloLibro(libro)}</span>
                                            <span className="etiqueta etiqueta-alerta">Stock: {libro.stock ?? 0}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </>
                )
            )}
        </div>
    );
}
