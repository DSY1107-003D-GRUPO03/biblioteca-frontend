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

    return (
        <nav className="navbar" aria-label="Principal">
            <div className="contenedor navbar-interior">
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
                <div className="navbar-sesion">
                    { isAuthenticated ? (
                        <>
                            <span className="navbar-usuario">{account?.username}</span>
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
        </nav>
    )
}
