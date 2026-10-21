export interface EntradaHistorial {
    id : number;
    eventId : string;
    tipo : string;
    usuario : string | null;
    libroId : number | null;
    prestamoId : number | null;
    recibidoEn : string;
}