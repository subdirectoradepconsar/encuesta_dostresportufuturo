# Encuesta dos de tres por tu futuro

Encuesta de satisfacción CONSAR, publicada en GitHub Pages.

Sitio: https://subdirectoradepconsar.github.io/encuesta_dostresportufuturo/

## Publicación

Cada cambio enviado a `main` publica automáticamente los archivos del sitio mediante GitHub Actions.

## Respuestas

`app.js` envía las respuestas a la aplicación de Google Apps Script configurada en `GOOGLE_SCRIPT_URL`. `Código.gs` contiene el código de referencia para la hoja de cálculo y debe desplegarse por separado en Google Apps Script.

Destino: [Encuesta Stand Tres Por Mi](https://docs.google.com/spreadsheets/d/1b87e7hMNJaVwFXfVYMQ_euY-jtw2sIcYDWPvaxHG_2I/edit?gid=0#gid=0), pestaña **Hoja 1** (`gid=0`). Cada respuesta ocupa tres columnas: **Fecha y Hora**, **Satisfacción** y **Comentarios**.

El proyecto de Apps Script vinculado a este archivo es `1XvVEqR-LFbmous5gkdwLLQi5G49PPDIA9rCGKNHpToRT4b_m3NLopj-e`. Los cambios a `Código.gs` requieren guardar e implementar una nueva versión en Google Apps Script; el push a GitHub solo publica el sitio.

El envío desde GitHub Pages utiliza `no-cors`: el navegador no puede comprobar la respuesta del servidor. Verifica en la hoja que se estén registrando las respuestas.
