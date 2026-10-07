const ID_HOJA_CALCULO = '1b87e7hMNJaVwFXfVYMQ_euY-jtw2sIcYDWPvaxHG_2I';
const ID_HOJA = 0; // Hoja 1, identificada por gid para conservar el destino aunque se renombre.
const ENCABEZADOS = ['Fecha y Hora', 'Satisfacción', 'Comentarios'];

/** Recibe el objeto enviado mediante google.script.run. */
function guardarRespuesta(datos) {
  if (!datos || typeof datos.satisfaccion !== 'string' || !datos.satisfaccion.trim()) {
    throw new Error('Faltan campos obligatorios en la respuesta.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const libro = SpreadsheetApp.openById(ID_HOJA_CALCULO);
    const hoja = libro.getSheets().find(item => item.getSheetId() === ID_HOJA);
    if (!hoja) throw new Error('No se encontró Hoja 1 (gid=0).');

    if (hoja.getLastRow() === 0) {
      hoja.appendRow(ENCABEZADOS);
      hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    } else {
      const actuales = hoja.getRange(1, 1, 1, ENCABEZADOS.length).getValues()[0];
      if (actuales.some((valor, i) => String(valor).trim() !== ENCABEZADOS[i])) {
        throw new Error('Los encabezados de Hoja 1 no coinciden con el formato esperado.');
      }
    }

    hoja.appendRow([
      new Date(),
      textoSeguro(datos.satisfaccion.trim()),
      textoSeguro(String(datos.comentarios || '').slice(0, 1000))
    ]);

    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/** Guarda las respuestas como texto, incluso si comienzan con un signo de fórmula. */
function textoSeguro(texto) {
  return /^[=+@-]/.test(texto) ? "'" + texto : texto;
}

/** Mantiene compatibilidad con el fetch() usado por el sitio externo. */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const resultado = guardarRespuesta(datos);
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
