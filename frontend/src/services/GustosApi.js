import { makeProtectedRequest } from './api';

const ETIQUETAS_ENDPOINT = '/etiquetas/';
const PREFERENCIAS_ENDPOINT = '/usuario/etiquetas-favoritas/crear/';

export async function listarEtiquetas() {
  return await makeProtectedRequest(ETIQUETAS_ENDPOINT);
}

export async function guardarPreferencias(etiquetas_ids) {
  return await makeProtectedRequest(PREFERENCIAS_ENDPOINT, 'POST', { etiquetas_ids });
}
