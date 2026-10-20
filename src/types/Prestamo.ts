export interface Prestamo {
    id : number;
    libroId : number;
    titulo : string;
    usuario : string;
    fechaPrestamo : string;
    fechaDevolucionEstimada : string;
    fechaDevolucionReal : string | null;
    estado : "ACTIVO" | "DEVUELTO";
}