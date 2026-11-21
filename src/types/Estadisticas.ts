export interface LibroEstadistica {
    libroId : number;
    titulo : string | null;
    prestamos : number;
    devoluciones : number;
    stock : number | null;
}

export interface Estadisticas {
    totalPrestamos : number;
    totalDevoluciones : number;
    prestamosActivos : number;
    masPrestados : LibroEstadistica[];
    sinStock : LibroEstadistica[];
}