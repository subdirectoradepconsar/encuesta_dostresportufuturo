/**
 * CONSAR - Encuesta de Satisfacción (JavaScript)
 * Lógica interactiva, validación y envío de datos a Google Sheets vía Google Apps Script.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const submitBtn = document.getElementById('submitBtn');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const likertOptions = document.querySelectorAll('.likert-option');
  const textareaQ2 = document.getElementById('textarea-q2');
  const charCount = document.getElementById('charCount');

  // URL del Web App de Google Apps Script
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby48auBrEWt_V6SZ7qPg5nBx-cJYQg-yjx_s8xzBC75D56mBISYq9sJJemOtUnEtbrxow/exec';

  /**
   * Contador de caracteres en tiempo real para Pregunta 2
   */
  if (textareaQ2 && charCount) {
    textareaQ2.addEventListener('input', () => {
      const currentLength = textareaQ2.value.length;
      charCount.textContent = `${currentLength} / 1000`;
    });
  }

  /**
   * Sincronización visual de estado para radios Likert
   */
  likertOptions.forEach(option => {
    const radio = option.querySelector('input[type="radio"]');

    // Selección al dar clic
    option.addEventListener('click', () => {
      if (radio) {
        radio.checked = true;
        const groupName = radio.name;
        
        // Quitar clase error del card padre
        const card = option.closest('.question-card');
        if (card) card.classList.remove('error-state');
        
        // Quitar selección previa en el mismo grupo
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
          const parent = r.closest('.likert-option');
          if (parent) {
            parent.classList.remove('selected');
            parent.removeAttribute('data-value');
          }
        });

        // Marcar la opción seleccionada
        option.classList.add('selected');
        option.setAttribute('data-value', radio.value);
      }
    });

    // Accesibilidad por teclado (Teclas Enter o Espacio)
    option.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        option.click();
      }
    });
  });

  /**
   * Envío del formulario y registro en Google Sheets
   */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (submitBtn.disabled || successModal.classList.contains('active')) return;

    const cardQ1 = document.getElementById('card-q1');
    const selectedRadio = form.querySelector('input[name="q1"]:checked');
    const feedbackText = textareaQ2 ? textareaQ2.value.trim() : '';

    // Validación de respuesta obligatoria (Pregunta 1)
    if (!selectedRadio) {
      if (cardQ1) {
        cardQ1.classList.add('error-state');
        cardQ1.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (cardQ1) cardQ1.classList.remove('error-state');

    const valorSeleccionado = selectedRadio.value.replace(/^\d+\s*-\s*/, '');
    const originalBtnContent = submitBtn.innerHTML;

    // Estado de carga y deshabilitar botón para evitar envíos duplicados
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span>Registrando respuestas...</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin-icon">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
    `;

    try {
      const payload = {
        // Mantener compatibilidad con el Apps Script publicado, que requiere público.
        publico: 'A dos de tres por tu futuro',
        satisfaccion: valorSeleccionado,
        comentarios: feedbackText
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      // La respuesta no-cors es opaca; no permite confirmar la escritura en Sheets.
      // Mostrar modal de éxito
      successModal.classList.add('active');
      successModal.setAttribute('aria-hidden', 'false');
      form.inert = true;
      closeModalBtn.focus();
    } catch (error) {
      console.error('Error al registrar la respuesta en Google Sheets:', error);
      alert('Ocurrió un error al registrar tu respuesta. Por favor, verifica tu conexión e inténtalo de nuevo.');
    } finally {
      // Restaurar estado del botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });

  /**
   * Reinicio del formulario desde el modal de éxito
   */
  closeModalBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');

    // Limpiar formulario y selección visual
    form.inert = false;
    form.reset();
    const firstRadio = form.querySelector('input[name="q1"]');
    if (firstRadio) firstRadio.focus({ preventScroll: true });
    likertOptions.forEach(option => {
      option.classList.remove('selected');
      option.removeAttribute('data-value');
    });

    if (charCount) {
      charCount.textContent = '0 / 1000';
    }

    // Limpiar posibles estados de error
    document.querySelectorAll('.question-card').forEach(card => {
      card.classList.remove('error-state');
    });

    // Desplazamiento suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
