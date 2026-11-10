
document.addEventListener("DOMContentLoaded", () => {
  try {
    const carrito = JSON.parse(localStorage.getItem("trajes_inglesa_carrito")) || [];
    const cantidadCarrito = carrito.reduce((total, producto) => total + Number(producto.quantity || 1), 0);
    document.querySelectorAll("#contador-carrito").forEach(elemento => {
      elemento.textContent = cantidadCarrito;
    });
  } catch (error) {
    document.querySelectorAll("#contador-carrito").forEach(elemento => {
      elemento.textContent = "0";
    });
  }
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.textContent = "↑";
  backToTop.setAttribute("aria-label", "Volver arriba");
  document.body.appendChild(backToTop);
  const updateBackToTop = () => {
    backToTop.classList.toggle("visible", window.scrollY > 350);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
  const revealItems = document.querySelectorAll(".card, .panel");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });
    revealItems.forEach(item => {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }
  const listaUsuarios = document.getElementById("lista-usuarios");
  if (listaUsuarios) {
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuarios = usuarios.map(usuario => {
      if (typeof usuario === "string") {
        return {
          nombre: usuario,
          correo: ""
        };
      }
      return usuario;
    });
    function mostrarUsuarios() {
      listaUsuarios.innerHTML = "";
      usuarios.forEach(usuario => {
        const elemento = document.createElement("li");
        elemento.textContent = usuario.correo
          ? `${usuario.nombre} - ${usuario.correo}`
          : usuario.nombre;
        listaUsuarios.appendChild(elemento);
      });
    }
    const formulario = document.querySelector("form");
    if (formulario) {
      formulario.addEventListener("submit", event => {
        event.preventDefault();
        if (!formulario.reportValidity()) {
          return;
        }
        const campoNombre = formulario.querySelector('input[type="text"]');
        const campoCorreo = formulario.querySelector('input[type="email"]');
        if (!campoNombre || !campoCorreo) {
          return;
        }
        const nombre = campoNombre.value.trim();
        const correo = campoCorreo.value.trim();
        if (!nombre || !correo) {
          return;
        }
        usuarios.push({
          nombre: nombre,
          correo: correo
        });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        mostrarUsuarios();
        formulario.reset();
      });
    }
    mostrarUsuarios();
  }
  const year = document.querySelector("[data-current-year]");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
