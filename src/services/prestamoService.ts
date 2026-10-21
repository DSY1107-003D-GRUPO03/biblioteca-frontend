import type { Prestamo } from "../types/Prestamo";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//En local, ms-prestamo corre aparte (8081). Con el API Gateway no hace falta definirla.
const PRESTAMOS_URL = import.meta.env.VITE_PRESTAMOS_API_BASE_URL ?? API_BASE_URL;

export async function obtenerMisPrestamos(accessToken:string) : Promise<Prestamo[]> {
    
    const response = await fetch(`${PRESTAMOS_URL}/api/prestamos`, {
        headers : {
            Authorization : `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error al obtener prestamos: ${response.status}`)
    }

    return response.json();
}

export async function solicitarPrestamo(libroId : number, accessToken : string) : Promise<Prestamo> {
    
    const response = await fetch(`${PRESTAMOS_URL}/api/write/prestamos`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${accessToken}`,
        },
        body : JSON.stringify({libroId}),
    });

    if (!response.ok) {
        throw new Error(`Error al solicitar el prestamo: ${response.status}`);
    }

    return response.json();
    
}

export async function devolverPrestamo(id : number, accessToken : string) : Promise<Prestamo> {
    const response = await fetch(`${PRESTAMOS_URL}/api/write/prestamos/${id}/devolucion`, {
        method : "POST",
        headers : {
            Authorization : `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error al devolver el prestamo: ${response.status}`);
    }

    return response.json();
}