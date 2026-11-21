import type { Estadisticas } from "../types/Estadisticas";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//En local, ms-analitica corre aparte (8085). Con el API Gateway no hace falta definirla.
const ANALITICA_URL = import.meta.env.VITE_ANALITICA_API_BASE_URL ?? API_BASE_URL;

export async function obtenerEstadisticas(accessToken : string) : Promise<Estadisticas> {
    const response = await fetch(`${ANALITICA_URL}/api/estadisticas`, {
        headers : {
            Authorization : `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error al obtener las estadísticas: ${response.status}`);
    }

    return response.json();
}