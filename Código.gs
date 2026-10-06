const ID_HOJA_CALCULO = '1Li8QcCz2n_ugcjOWfic2mJx0qeijrn1DHU8cuWq2ag0';
const NOMBRE_HOJA = 'Respuestas';
const ENCABEZADOS = ['Fecha y hora', 'Público', 'Satisfacción', 'Comentarios'];

/** Recibe el objeto enviado mediante google.script.run. */
function guardarRespuesta(datos) {
  if (!datos || !datos.publico || !datos.satisfaccion) {
    throw new Error('Faltan campos obligatorios en la respuesta.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const libro = SpreadsheetApp.openById(ID_HOJA_CALCULO);
    let hoja = libro.getSheetByName(NOMBRE_HOJA);

    if (!hoja) {
      hoja = libro.insertSheet(NOMBRE_HOJA);
    }

    if (hoja.getLastRow() === 0) {
      hoja.appendRow(ENCABEZADOS);
      hoja.getRange(1, 1, 1, ENCABEZADOS.length).setFontWeight('bold');
      hoja.setFrozenRows(1);
    }

    hoja.appendRow([
      new Date(),
      datos.publico,
      datos.satisfaccion,
      datos.comentarios || ''
    ]);

    return { ok: true };
  } finally {
    lock.releaseLock();
  }
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
