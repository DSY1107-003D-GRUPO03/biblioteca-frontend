import { useEffect, useState } from "react";
import type { Libro } from "../types/Libro";
import { obtenerLibrosPublicos } from "../services/libroService";
import { Link } from "react-router-dom";



export function CatalogoPage() {
    
    const [libros, setLibros] = useState<Libro[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerLibrosPublicos()
        .then(setLibros)
        .catch((err) => setError(err.mesagge))
        .finally(() => setCargando(false));
    }, []);

    if (cargando) return <p className="contenedor pagina mensaje">Cargando catalogo...</p>;
    if (error) return <p className="contenedor pagina mensaje-error">Error: {error}</p>;

    return (
        <div className="contenedor pagina">
            <h1>Catálogo de libros</h1>
            <ul className="catalogo">
                {libros.map((libro) => (
                    <li key={libro.id} className="tarjeta libro-tarjeta">
                        <h2 className="libro-titulo">
                            <Link to={`/libros/${libro.id}`}>{libro.titulo}</Link>
                        </h2>
                        <p className="libro-autor">{libro.autor}</p>
                        <span className={libro.disponible ? "etiqueta" : "etiqueta etiqueta-alerta"}>
                            {libro.disponible ? "Disponible" : "Sin stock"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )

}