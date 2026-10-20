# G3SNKRS

Proyecto Lenguaje de marcas. Página de una tienda de zapatillas realizada con HTML, CSS y JavaScript.

## Qué incluye

- Diseño adaptable a móvil y ordenador.
- Ocho modelos con ficha, descripción, precio de ejemplo y selector de talla.
- Filtros por tipo, búsqueda y ordenación por nombre o precio.
- Bolsa con eliminación de artículos y total. Se guarda en el navegador.
- Enlace de contacto por correo.
- Compra simulada con datos de envío, entrega estándar o exprés, resumen y confirmación.

Es una tienda de demostración: no realiza pedidos ni cobra pagos.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y secciones de la página |
| `styles.css` | Colores, tipografía, distribución y adaptación a pantallas |
| `catalogo.js` | Datos de las zapatillas |
| `app.js` | Búsqueda, filtros, fichas y bolsa |
| `assets/` | Imágenes y favicon |
| `CREDITOS.md` | Procedencia de los recursos |

## Cómo funciona

`catalogo.js` se carga antes de `app.js`. La lista `productos` contiene los datos de cada modelo. La función `mostrarCatalogo()` filtra esa lista según el buscador y la categoría, aplica el orden elegido y crea las tarjetas.

Al abrir una ficha, `abrirFicha()` muestra sus datos. El formulario guarda el identificador del producto y la talla en la lista `bolsa`. `mostrarBolsa()` calcula el total, y `guardarBolsa()` conserva la lista usando `localStorage`.

Los botones y etiquetas están escritos en HTML; CSS controla su apariencia y JavaScript responde a las acciones del usuario.

## Añadir otro modelo

1. Guarda su foto en `assets/`.
2. Copia un objeto de `catalogo.js`.
3. Asigna un `id` distinto y cambia nombre, imagen, precio y descripción.
4. Utiliza una categoría existente: `low`, `high` o `running`.
5. Añade `fotografia: true` si usas una foto con fondo.

El contador se actualiza automáticamente.

## Ver la página

Abre `index.html` o ejecuta desde esta carpeta:

```sh
python3 -m http.server 8000
```

Después abre http://localhost:8000.

## Subir a GitHub Pages

1. Crea un repositorio y sube estos archivos, dejando `index.html` en la raíz.
2. En **Settings → Pages**, elige **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda y espera al enlace que proporciona GitHub.

Antes de publicarlo, comprueba que el correo de contacto sea el tuyo y revisa la procedencia de las imágenes en `CREDITOS.md`.

## Probar una compra

Añade un modelo con su talla y abre la bolsa. Pulsa «Tramitar pedido de prueba», rellena el formulario con datos ficticios y elige la entrega. El envío estándar suma 5 € y el exprés 10 € al total ilustrativo.

El formulario comprueba los campos obligatorios, el formato del correo y las cinco cifras del código postal. Confirma que entiendes que es una simulación y pulsa «Confirmar pedido de prueba». Se muestra una referencia local y se vacía la bolsa. No se procesan pagos, no se envían correos ni se crean pedidos reales.

Los datos del formulario no se guardan en `localStorage` ni se envían a ningún servidor. Se borran al confirmar o cerrar la compra. La bolsa y los favoritos se conservan en el navegador. Los costes están en el objeto `entregas` de `app.js`.

## Otras funciones

Los corazones guardan los modelos favoritos en el navegador. «Ver favoritos» muestra solo esa selección, y el enlace del menú abre los favoritos sin filtros anteriores.

La guía de tallas se abre desde la colección o la ficha. Incluye una tabla orientativa de ejemplo. En móvil, el botón de menú permite abrir y cerrar la navegación; también se cierra con Escape o al elegir un enlace.

«Vaciar bolsa» elimina todos los artículos de la selección y desactiva el botón de compra cuando no queda ninguno.
