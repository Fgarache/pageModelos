/**
 * DATA.JS - Configuración de API y Documentación de Endpoints
 * * Este archivo centraliza las llamadas a la Web App de Google Apps Script.
 * La Web App actúa como un puente (Bridge) entre el Frontend y las hojas de Google Sheets.
 */

// URL de ejecución de tu Google Apps Script (Versión estable)
const BASE_URL = "https://script.google.com/macros/s/AKfycbwsGzPVtLw08_uTp6fxyHzskecYsz_kZpYB4T8ptcuX8bsX52DSTHBxKVnB6339wBQlzA/exec";

export const API_ENDPOINTS = {

  /**
   * ACCIÓN: getAllUsers
   * GS: infoTodosUsuarios.gs -> getAllUsers()
   * DESCRIPCIÓN: Lee la hoja 'user' y filtra a todos los que tienen la columna 'disponible' en TRUE.
   * DEVUELVE: Un Array de Objetos.
   * [
   * { "id": 0, "user": "nombre", "nombre": "Nombre Real", "disponibleLugar": "Sede", ... },
   * ...
   * ]
   */
  getAllUsers: () => `${BASE_URL}?action=getAllUsers`,

  /**
   * ACCIÓN: getUserInfo
   * GS: infoUser.gs -> getUserInfoById(userId)
   * DESCRIPCIÓN: Busca un ID específico en la hoja 'user' y devuelve toda su fila de datos.
   * DEVUELVE: Un Objeto único (Single Object).
   * {
   * "id": 0, "user": "lindagt", "numero": 12345678, "nombre": "Linda", 
   * "info": "Bio...", "metodosPago": "Efectivo...", "lugarTours": "..."
   * }
   */
  getUserInfo: (userId) => `${BASE_URL}?action=getUserInfo&userId=${userId}`,

  /**
   * ACCIÓN: getTours
   * GS: InfoTours.gs -> getToursByUserId(idUser)
   * DESCRIPCIÓN: Filtra en la hoja 'tour' todos los registros que coincidan con idUser y tengan 'estado' TRUE.
   * DEVUELVE: Un Array de Objetos (Tours del usuario).
   * [
   * { "id": 1, "Lugar": "Coban", "deposito": 100, "fecha": "02/05/2026", "estado": true },
   * ...
   * ]
   */
  getTours: (idUser) => `${BASE_URL}?action=getTours&idUser=${idUser}`,

  /**
   * ACCIÓN: getHorarios
   * GS: infohorarioTour.gs -> getHorariosByTourId(idTour)
   * DESCRIPCIÓN: Busca en 'agendaTour' los horarios de un Tour donde 'estado' es TRUE (libre).
   * DEVUELVE: Un Array de Objetos (Horas disponibles).
   * [
   * { "hora": 10, "idTours": 0, "estado": true },
   * { "hora": 12, "idTours": 0, "estado": true }
   * ]
   */
  getHorarios: (idTour) => `${BASE_URL}?action=getHorarios&idTour=${idTour}`,

  /**
   * ACCIÓN: getRifas
   * GS: infoRifa.gs -> getRifasDisponibles(idUser)
   * DESCRIPCIÓN: Cruza la hoja 'rifa' con 'compraRifa'. Calcula 'numeros' (total) 
   * menos los ya registrados en compras para ese idRifa.
   * DEVUELVE: Un Array de Objetos (Rifas con cálculo dinámico).
   * [
   * {
   * "idRifa": 0,
   * "titulo": "Gran Rifa",
   * "numerosDisponibles": [1, 3, 4, 5...], // Excluye los ya comprados
   * "cantidadLibre": 17
   * }
   * ]
   */
  getRifas: (idUser) => `${BASE_URL}?action=getRifas&idUser=${idUser}`,
};