import type { Libro } from "../types/Libro"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function obtenerLibrosPublicos() : Promise<Libro[]> {
    
    const response = await fetch(`${API_BASE_URL}/public/libros`);

    if (!response.ok) {
        throw new Error(`Error al obtener libros: ${response.status}`)
    }

    return response.json();
}

export async function obtenerLibroPorId(id :  string, accessToken : string) : Promise<Libro> {
    const response = await fetch (`${API_BASE_URL}/api/libros/${id}`, {
        headers : {
            Authorization : `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error (`Error al obtener el libro: ${response.status}`)
    }

    return response.json();
}


export interface NuevoLibroRequest {
    titulo : string;
    autor : string;
    isbn : string;
    stock : number;
}

async function leerMensajeError(response : Response) : Promise<string> {
    const respaldo = `No se pudo crear el libro (código ${response.status})`;
    try {
        const cuerpo = await response.json();
        if (typeof cuerpo === "string" && cuerpo) return cuerpo;
        if (cuerpo && typeof cuerpo === "object") {
            for (const clave of ["message", "mensaje", "error", "detail"]) {
                if (typeof cuerpo[clave] === "string" && cuerpo[clave]) return cuerpo[clave];
            }
            const textos = Object.values(cuerpo).flat().filter((v) => typeof v === "string");
            if (textos.length > 0) return textos.join(". ");
        }
    } catch {
        // cuerpo no legible: se usa el mensaje de respaldo
    }
    return respaldo;
}

export async function crearLibro (request : NuevoLibroRequest, accessToken : string) : Promise<Libro> {
    const response = await fetch (`${API_BASE_URL}/api/admin/libros`, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${accessToken}`,
        },
        body : JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(await leerMensajeError(response));
    }

    return response.json();
}

export async function eliminarLibro(id : number, accessToken : string) : Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/admin/libros/${id}`, {
        method : "DELETE",
        headers : {
            Authorization : `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error al eliminar libro: ${response.status}`);
    }
}