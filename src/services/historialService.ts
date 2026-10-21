import type { EntradaHistorial } from "../types/Historial";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//En local, ms-historial corre aparte (8082). Con el API Gateway no hace falta definirla.
const HISTORIAL_URL = import.meta.env.VITE_HISTORIAL_API_BASE_URL ?? API_BASE_URL;

export async function obtenerHistorial(accessToken : string, tipo? : string) : Promise<EntradaHistorial[]> {
    const parametros = tipo ? `?tipo=${encodeURIComponent(tipo)}` : "";

    const response = await fetch(`${HISTORIAL_URL}/api/historial${parametros}`, {
        headers : {
            Authorization : `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error al obtener el historial: ${response.status}`);
    }

    return response.json();
}