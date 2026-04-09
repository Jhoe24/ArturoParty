# EverestParty — ¡TOCA LA PUERTA!

Pequeña página web / PWA para una invitación interactiva llamada "¡TOCA LA PUERTA! - Fiesta Everest".

## 📝 Descripción

Proyecto estático que muestra una puerta interactiva, una animación de transición (video), un temporizador de cuenta regresiva, confetti y audio de fondo. Pensado como una invitación digital que se puede instalar como PWA.

## ⭐ Características

- Interacción principal: hacer clic en la puerta o presionar `Enter`/`Space` para abrir la invitación.
- Animación de video de transición antes de mostrar la invitación.
- Temporizador (countdown) hasta la fecha del evento (configurable en `js/main.js`).
- Sonido de fondo con control de encendido/apagado (`🔇` / `🔊`).
- Efectos visuales: estrellas dinámicas, parallax con el mouse, confetti al mostrar la invitación.
- PWA básica con `manifest.json` y `sw.js` (Service Worker simple).

## Estructura del proyecto

Raíz del proyecto:

- `index.html` — página principal.
- `manifest.json` — metadatos PWA.
- `sw.js` — service worker (caché simple).
- `robots.txt` — reglas para rastreadores (actualmente `Disallow: /`).
- `css/style.css` — estilos.
- `js/main.js` — lógica interactiva (temporizador, apertura de puerta, audio, video, confetti, etc.).
- `assets/` — recursos multimedia:
  - `assets/img/` — imágenes de la invitación.
  - `assets/video/origin.mp4` — video de transición.
  - `assets/sound/Intro.mp3` — audio de fondo.
- `icons/` — iconos de la PWA.

## Requisitos

Nada más allá de un navegador moderno. Para probar el Service Worker y la PWA se recomienda servir el sitio desde `http://localhost` (no desde `file://`).

## Servir localmente (Windows / PowerShell)

Usa una de estas opciones desde la raíz del proyecto:

Usando Python 3 (incluido en muchas instalaciones de Windows):

```powershell
python -m http.server 8000
# Abrir en el navegador: http://localhost:8000
```

Usando `serve` (Node):

```powershell
npx serve -s . -l 8000
# Abrir en el navegador: http://localhost:8000
```

Nota: el Service Worker (`sw.js`) sólo se registrará correctamente si el sitio se sirve por `http(s)` o `localhost`.

## Notas importantes para desarrolladores

- Fecha del evento: la variable `eventDate` está definida en `js/main.js` como `new Date('2025-08-30T17:00:00')`. Modifica esa cadena si quieres cambiar la fecha/hora.
- `robots.txt` contiene `Disallow: /` lo que evita que buscadores indexen el sitio. Si el objetivo es publicar y permitir indexación, edita o elimina esa línea.
- `sw.js` es muy simple y actualmente cachea sólo `/` e `/index.html`. Si añades rutas o quieres cachear assets estáticos, actualiza la lista en `sw.js`.
- Los sonidos están en `assets/sound/`. El autoplay de audio puede requerir interacción del usuario en algunos navegadores; el botón `sound-toggle` permite activarlo.

## Cómo contribuir

- Abrir un _issue_ con la propuesta o bug.
- Enviar un _pull request_ con cambios claros y descriptivos.

## Licencia

Este repositorio no incluye una licencia explícita por defecto. Se sugiere usar MIT si quieres permitir uso libre con atribución. Para agregarla, añade un archivo `LICENSE` con el texto de la licencia deseada.

---

Si quieres, puedo:

- Actualizar `sw.js` para cachear assets estáticos automáticamente.
- Ajustar `robots.txt` o agregar un `LICENSE` (p. ej. MIT).
- Ejecutar una prueba local y verificar que la PWA y el audio funcionan en `localhost`.

Dime qué prefieres que haga a continuación.
