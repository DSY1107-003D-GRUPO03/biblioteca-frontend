import { NavLink } from "react-router-dom";
import { BarChart3, BookOpen, History, LogIn, LogOut, Library, Settings } from "lucide-react";
import { useAuth } from "../auth/useAuth";

const enlaces = [
    { to: "/", texto: "Catálogo", icono: BookOpen, end: true },
    { to: "/prestamos", texto: "Mis préstamos", icono: Library, end: false },
    { to: "/admin/libros", texto: "Administrar", icono: Settings, end: false },
    { to: "/historial", texto: "Historial", icono: History, end: false },
    { to: "/estadisticas", texto: "Estadísticas", icono: BarChart3, end: false },
];

export function NavBar() {

    const { isAuthenticated, account, login, logout } = useAuth();
    const correo = account?.username ?? "";

    return (
        <header className="navbar">
            <div className="contenedor navbar-interior">
                <NavLink to="/" className="navbar-marca" aria-label="Biblioteca">
                    <BookOpen size={20} strokeWidth={1.75} aria-hidden="true" />
                    <span className="navbar-marca-texto">Biblioteca</span>
                </NavLink>
                <nav aria-label="Principal" className="navbar-nav">
                    <ul className="navbar-enlaces">
                        {enlaces.map(({ to, texto, icono: Icono, end }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={end}
                                    className="navbar-enlace"
                                    aria-label={texto}
                                    title={texto}
                                >
                                    <Icono size={20} strokeWidth={1.75} aria-hidden="true" />
                                    <span className="navbar-texto">{texto}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="navbar-sesion">
                    { isAuthenticated ? (
                        <>
                            <span className="navbar-usuario" title={correo}>
                                <span className="navbar-inicial" aria-hidden="true">{correo.charAt(0)}</span>
                                <span className="navbar-correo">{correo}</span>
                            </span>
                            <button
                                type="button"
                                className="boton-secundario"
                                aria-label="Cerrar sesión"
                                onClick={() => void logout()}
                            >
                                <LogOut size={18} strokeWidth={1.75} aria-hidden="true" />
                                <span className="navbar-texto">Cerrar sesión</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="boton"
                            aria-label="Iniciar sesión"
                            onClick={() => void login()}
                        >
                            <LogIn size={18} strokeWidth={1.75} aria-hidden="true" />
                            <span className="navbar-texto">Iniciar sesión</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}
