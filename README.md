# Encuesta dos de tres por tu futuro

Encuesta de satisfacción CONSAR, publicada en GitHub Pages.

Sitio: https://subdirectoradepconsar.github.io/encuesta_dostresportufuturo/

## Publicación

Cada cambio enviado a `main` publica automáticamente los archivos del sitio mediante GitHub Actions.

## Respuestas

`app.js` envía las respuestas a la aplicación de Google Apps Script configurada en `GOOGLE_SCRIPT_URL`. `Código.gs` contiene el código de referencia para la hoja de cálculo y debe desplegarse por separado en Google Apps Script.

El envío desde GitHub Pages utiliza `no-cors`: el navegador no puede comprobar la respuesta del servidor. Verifica en la hoja que se estén registrando las respuestas.
