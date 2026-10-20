"use strict";

const claveBolsa = "g3snkrs-bag-v1";
const tallas = ["38", "39", "40", "41", "42", "43", "44", "45"];
const formatoEuro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const rejilla = document.querySelector("#product-grid");
const buscador = document.querySelector("#search");
const orden = document.querySelector("#sort");
const ficha = document.querySelector("#product-dialog");
const ventanaBolsa = document.querySelector("#bag-dialog");
const formulario = document.querySelector("#add-form");
const ventanaCompra = document.querySelector("#checkout-dialog");
const formularioCompra = document.querySelector("#checkout-form");
const botonCompra = document.querySelector("#start-checkout");
const entregas = { estandar: 5, express: 10 };

let filtroActual = "all";
let productoSeleccionado;
let bolsa = cargarBolsa();
let temporizador;
let favoritos = cargarFavoritos();
let soloFavoritos = false;
const ventanaTallas = document.querySelector("#size-dialog");
const botonMenu = document.querySelector("#menu-toggle");
const menuPrincipal = document.querySelector("#main-nav");

function buscarProducto(id) {
  return productos.find((producto) => producto.id === id);
}
function cargarBolsa() {
  try {
    const guardado = JSON.parse(localStorage.getItem(claveBolsa) || "[]");
    if (!Array.isArray(guardado)) return [];
    return guardado
      .filter(
        (item) => item && buscarProducto(item.id) && tallas.includes(item.size),
      )
      .slice(0, 100);
  } catch {
    return [];
  }
}

function mostrarCatalogo() {
  const texto = buscador.value.trim().toLocaleLowerCase("es");
  const visibles = productos.filter((producto) => {
    const coincideCategoria =
      filtroActual === "all" || producto.categoria === filtroActual;
    const nombre = `${producto.nombre} ${producto.tipo}`.toLocaleLowerCase(
      "es",
    );
    return (
      coincideCategoria &&
      nombre.includes(texto) &&
      (!soloFavoritos || favoritos.includes(producto.id))
    );
  });

  if (orden.value === "precio-asc") {
    visibles.sort((a, b) => a.precio - b.precio);
  } else if (orden.value === "precio-desc") {
    visibles.sort((a, b) => b.precio - a.precio);
  } else if (orden.value === "nombre") {
    visibles.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }

  rejilla.innerHTML = visibles
    .map(
      (producto) => `
    <article class="product-card">
      <button class="favorite-button ${favoritos.includes(producto.id) ? "selected" : ""}" data-favorite="${producto.id}" aria-label="Favorito: ${producto.nombre}" aria-pressed="${favoritos.includes(producto.id)}">${favoritos.includes(producto.id) ? "♥" : "♡"}</button>
      <button class="product-visual ${producto.fotografia ? "photo" : ""}"
        data-product="${producto.id}" aria-label="Ver ${producto.nombre}">
        <span class="product-tag">${producto.tipo.toUpperCase()}</span>
        <img src="${producto.imagen}" alt="Zapatilla ${producto.nombre}"
          width="900" height="650" loading="lazy">
        <span class="product-arrow" aria-hidden="true">↗</span>
      </button>
      <div class="product-info">
        <div>
          <h3>${producto.nombre}</h3>
          <p>${producto.tipo} · Colección de ejemplo</p>
        </div>
        <strong>${formatoEuro.format(producto.precio)}</strong>
      </div>
    </article>
  `,
    )
    .join("");

  document.querySelector("#empty-search").hidden = visibles.length > 0;
  document.querySelector("#empty-search").textContent = soloFavoritos
    ? "No hay favoritos que coincidan. Marca un corazón o cambia los filtros."
    : "No hay coincidencias. Prueba otro nombre o cambia los filtros.";
  document.querySelector("#results-count").textContent =
    `${visibles.length} de ${productos.length} modelos`;
}

function abrirFicha(id) {
  productoSeleccionado = buscarProducto(id);
  if (!productoSeleccionado) return;

  document.querySelector("#dialog-name").textContent =
    productoSeleccionado.nombre;
  document.querySelector("#dialog-description").textContent =
    productoSeleccionado.descripcion;
  document.querySelector("#dialog-price").textContent = formatoEuro.format(
    productoSeleccionado.precio,
  );
  const imagen = document.querySelector("#dialog-image");
  imagen.src = productoSeleccionado.imagen;
  imagen.alt = `Zapatilla ${productoSeleccionado.nombre}`;
  imagen.parentElement.classList.toggle(
    "photo",
    Boolean(productoSeleccionado.fotografia),
  );
  formulario.reset();
  ficha.showModal();
}

function mostrarBolsa() {
  document.querySelector("#bag-count").textContent = bolsa.length;
  botonCompra.disabled = bolsa.length === 0;
  document.querySelector("#empty-bag").disabled = bolsa.length === 0;
  const lista = document.querySelector("#bag-items");
  let total = 0;

  lista.innerHTML = bolsa
    .map((item, indice) => {
      const producto = buscarProducto(item.id);
      total += producto.precio;
      return `
      <article class="bag-line">
        <img src="${producto.imagen}" alt="">
        <div>
          <h3>${producto.nombre}</h3>
          <p>EU ${item.size} · ${formatoEuro.format(producto.precio)}</p>
        </div>
        <button data-remove="${indice}"
          aria-label="Eliminar ${producto.nombre}, talla ${item.size}">Eliminar</button>
      </article>
    `;
    })
    .join("");

  if (bolsa.length === 0) {
    lista.innerHTML =
      '<p class="demo-note">Tu bolsa está vacía. Elige un modelo de la colección.</p>';
  }
  document.querySelector("#bag-total").textContent = formatoEuro.format(total);
}

function guardarBolsa() {
  try {
    localStorage.setItem(claveBolsa, JSON.stringify(bolsa));
  } catch {}
  mostrarBolsa();
}

function mostrarAviso(mensaje) {
  const aviso = document.querySelector("#toast");
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  clearTimeout(temporizador);
  temporizador = setTimeout(() => aviso.classList.remove("visible"), 3000);
}
document.addEventListener("click", (evento) => {
  const tarjeta = evento.target.closest("[data-product]");
  if (tarjeta) abrirFicha(tarjeta.dataset.product);

  const cerrar = evento.target.closest("[data-close]");
  if (cerrar) cerrar.closest("dialog").close();

  const eliminar = evento.target.closest("[data-remove]");
  if (eliminar) {
    bolsa.splice(Number(eliminar.dataset.remove), 1);
    guardarBolsa();
    mostrarAviso("Producto eliminado de la bolsa");
  }
});

document.querySelectorAll("[data-filter]").forEach((boton) => {
  boton.addEventListener("click", () => {
    filtroActual = boton.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((opcion) => {
      const activo = opcion === boton;
      opcion.classList.toggle("active", activo);
      opcion.setAttribute("aria-pressed", String(activo));
    });
    mostrarCatalogo();
  });
});

buscador.addEventListener("input", mostrarCatalogo);
orden.addEventListener("change", mostrarCatalogo);

document.querySelector("#open-bag").addEventListener("click", () => {
  mostrarBolsa();
  ventanaBolsa.showModal();
});

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const talla = document.querySelector("#size").value;
  if (!productoSeleccionado || !tallas.includes(talla)) return;
  if (bolsa.length >= 100) {
    mostrarAviso("La bolsa admite hasta 100 artículos.");
    return;
  }
  bolsa.push({ id: productoSeleccionado.id, size: talla });
  guardarBolsa();
  ficha.close();
  mostrarAviso("Producto añadido a la bolsa");
});
[ficha, ventanaBolsa, ventanaCompra, ventanaTallas].forEach((ventana) => {
  ventana.addEventListener("click", (evento) => {
    if (evento.target !== ventana) return;
    const limites = ventana.getBoundingClientRect();
    if (
      evento.clientX < limites.left ||
      evento.clientX > limites.right ||
      evento.clientY < limites.top ||
      evento.clientY > limites.bottom
    ) {
      ventana.close();
    }
  });
});

document.querySelector("#catalog-total").textContent = productos.length
  .toString()
  .padStart(2, "0");
mostrarCatalogo();
mostrarBolsa();
function calcularPedido() {
  const subtotal = bolsa.reduce((total, item) => {
    return total + buscarProducto(item.id).precio;
  }, 0);
  const metodo = formularioCompra.elements.envio.value;
  const envio = entregas[metodo];
  return { subtotal, envio, total: subtotal + envio };
}

function mostrarResumenPedido() {
  document.querySelector("#checkout-items").innerHTML = bolsa
    .map((item) => {
      const producto = buscarProducto(item.id);
      return `
      <div class="summary-item">
        <img src="${producto.imagen}" alt="" width="60" height="55">
        <div><strong>${producto.nombre}</strong><span>Talla EU ${item.size}</span></div>
        <span>${formatoEuro.format(producto.precio)}</span>
      </div>
    `;
    })
    .join("");
  const pedido = calcularPedido();
  document.querySelector("#checkout-subtotal").textContent = formatoEuro.format(
    pedido.subtotal,
  );
  document.querySelector("#checkout-shipping").textContent = formatoEuro.format(
    pedido.envio,
  );
  document.querySelector("#checkout-total").textContent = formatoEuro.format(
    pedido.total,
  );
}

botonCompra.addEventListener("click", () => {
  if (bolsa.length === 0) return;
  document.querySelector("#checkout-content").hidden = false;
  document.querySelector("#order-confirmation").hidden = true;
  mostrarResumenPedido();
  ventanaBolsa.close();
  ventanaCompra.showModal();
});

formularioCompra.addEventListener("change", mostrarResumenPedido);
document.querySelector("#back-to-bag").addEventListener("click", () => {
  ventanaCompra.close();
  ventanaBolsa.showModal();
});

formularioCompra.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (bolsa.length === 0 || !formularioCompra.reportValidity()) return;
  for (const nombre of ["nombre", "direccion", "ciudad"]) {
    const campo = formularioCompra.elements[nombre];
    if (!campo.value.trim()) {
      campo.setCustomValidity("Escribe un valor que no esté vacío.");
      campo.reportValidity();
      return;
    }
  }

  const pedido = calcularPedido();
  const nombre = formularioCompra.elements.nombre.value.trim();
  document.querySelector("#confirmation-message").textContent =
    `${nombre}, has completado el recorrido de compra de G3SNKRS en modo demostración.`;
  document.querySelector("#order-reference").textContent =
    `DEMO-${Date.now().toString(36).toUpperCase()}`;
  document.querySelector("#confirmed-total").textContent = formatoEuro.format(
    pedido.total,
  );

  bolsa = [];
  guardarBolsa();
  formularioCompra.reset();
  document.querySelector("#checkout-content").hidden = true;
  document.querySelector("#order-confirmation").hidden = false;
  document.querySelector("#confirmation-title").focus();
});

formularioCompra.addEventListener("input", (evento) => {
  evento.target.setCustomValidity("");
});

ventanaCompra.addEventListener("close", () => {
  formularioCompra.reset();
  formularioCompra
    .querySelectorAll("input")
    .forEach((campo) => campo.setCustomValidity(""));
  document.querySelector("#confirmation-message").textContent = "";
});

function cargarFavoritos() {
  try {
    const guardado = JSON.parse(
      localStorage.getItem("g3snkrs-favoritos") || "[]",
    );
    if (!Array.isArray(guardado)) return [];
    return [...new Set(guardado.filter((id) => buscarProducto(id)))];
  } catch {
    return [];
  }
}

function actualizarFavoritos() {
  document.querySelector("#favorites-count").textContent = favoritos.length;
  const boton = document.querySelector("#show-favorites");
  boton.setAttribute("aria-pressed", String(soloFavoritos));
  boton.textContent = soloFavoritos
    ? "♥ Favoritos seleccionados"
    : "♡ Ver favoritos";
  mostrarCatalogo();
}

function cerrarMenu() {
  menuPrincipal.classList.remove("open");
  botonMenu.setAttribute("aria-expanded", "false");
  botonMenu.setAttribute("aria-label", "Abrir menú");
  botonMenu.textContent = "☰";
}

document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-favorite]");
  if (boton) {
    const id = boton.dataset.favorite;
    const posicion = favoritos.indexOf(id);
    if (posicion === -1) favoritos.push(id);
    else favoritos.splice(posicion, 1);
    try {
      localStorage.setItem("g3snkrs-favoritos", JSON.stringify(favoritos));
    } catch {}
    actualizarFavoritos();
    const siguiente = document.querySelector(`[data-favorite="${id}"]`);
    if (siguiente) siguiente.focus({ preventScroll: true });
    else
      document.querySelector("#show-favorites").focus({ preventScroll: true });
  }
  if (evento.target.closest("[data-size-guide]")) ventanaTallas.showModal();
  if (!evento.target.closest(".navigation")) cerrarMenu();
});

document.querySelector("#show-favorites").addEventListener("click", () => {
  soloFavoritos = !soloFavoritos;
  actualizarFavoritos();
});

document.querySelector("#nav-favorites").addEventListener("click", () => {
  soloFavoritos = true;
  filtroActual = "all";
  buscador.value = "";
  document.querySelectorAll("[data-filter]").forEach((boton) => {
    const activo = boton.dataset.filter === "all";
    boton.classList.toggle("active", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });
  actualizarFavoritos();
});

botonMenu.addEventListener("click", () => {
  const abierto = botonMenu.getAttribute("aria-expanded") === "true";
  if (abierto) cerrarMenu();
  else {
    menuPrincipal.classList.add("open");
    botonMenu.setAttribute("aria-expanded", "true");
    botonMenu.setAttribute("aria-label", "Cerrar menú");
    botonMenu.textContent = "×";
  }
});

menuPrincipal.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", cerrarMenu);
});

document.addEventListener("keydown", (evento) => {
  if (
    evento.key === "Escape" &&
    botonMenu.getAttribute("aria-expanded") === "true"
  ) {
    cerrarMenu();
    botonMenu.focus();
  }
});

window.matchMedia("(min-width: 601px)").addEventListener("change", cerrarMenu);

document.querySelector("#empty-bag").addEventListener("click", () => {
  bolsa = [];
  guardarBolsa();
  mostrarAviso("Bolsa vaciada");
  document.querySelector("#bag-dialog [data-close]").focus();
});

actualizarFavoritos();
