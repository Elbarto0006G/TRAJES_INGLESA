const CART_STORAGE_KEY = "trajes_inglesa_carrito";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
}
function money(amount) {
    return "Bs. " + Number(amount).toLocaleString("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function updateCartBadge() {
    const totalItems = getCart().reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    document.querySelectorAll("#contador-carrito").forEach(badge => {
        badge.textContent = totalItems;
    });
}
function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });
    }
    saveCart(cart);
    alert(name + " se agregó al carrito.");
}
function renderCartPage() {
    const container = document.getElementById("cart-items");
    if (!container) return;
    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <h3>Tu carrito está vacío</h3>
                <p>Visita nuestra galería y agrega los trajes que te interesan.</p>
                <a class="btn" href="galeria.html">VER GALERÍA</a>
            </div>`;
        updateCartSummary([]);
        return;
    }
    cart.forEach((item, index) => {
        const row = document.createElement("article");
        row.className = "cart-row";
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        img.onerror = () => { img.style.visibility = "hidden"; };
        const info = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = item.name;
        const unitPrice = document.createElement("p");
        unitPrice.className = "cart-unit";
        unitPrice.textContent = money(item.price);
        const quantity = document.createElement("div");
        quantity.className = "cart-quantity";
        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Disminuir cantidad");
        minus.addEventListener("click", () => changeCartQuantity(index, -1));
        const amount = document.createElement("span");
        amount.textContent = item.quantity;
        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Aumentar cantidad");
        plus.addEventListener("click", () => changeCartQuantity(index, 1));
        quantity.append(minus, amount, plus);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "cart-remove";
        remove.textContent = "Eliminar";
        remove.addEventListener("click", () => removeCartItem(index));
        info.append(title, unitPrice, quantity, remove);
        const lineTotal = document.createElement("strong");
        lineTotal.className = "cart-line-total";
        lineTotal.textContent = money(item.price * item.quantity);
        row.append(img, info, lineTotal);
        container.appendChild(row);
    });
    updateCartSummary(cart);
}
function changeCartQuantity(index, change) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCartPage();
}
function removeCartItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartPage();
}
function updateCartSummary(cart) {
    const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cart-quantity").textContent = quantity;
    document.getElementById("cart-subtotal").textContent = money(subtotal);
    document.getElementById("cart-total").textContent = money(subtotal);
}
document.addEventListener("DOMContentLoaded", () => {
    updateCartBadge();
    document.querySelectorAll(".add-cart-btn").forEach(button => {
        button.addEventListener("click", () => {
            addToCart(
                button.dataset.id,
                button.dataset.name,
                button.dataset.price,
                button.dataset.image
            );
        });
    });
    renderCartPage();
    const showCheckout = document.getElementById("show-checkout");
    const checkoutForm = document.getElementById("checkout-form");
    if (showCheckout && checkoutForm) {
        showCheckout.addEventListener("click", () => {
            if (getCart().length === 0) {
                alert("Agrega al menos un producto antes de realizar el pedido.");
                return;
            }
            checkoutForm.hidden = false;
            checkoutForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
        checkoutForm.addEventListener("submit", event => {
            event.preventDefault();
            if (!checkoutForm.reportValidity()) return;
            const cart = getCart();
            if (!cart.length) {
                alert("Tu carrito está vacío.");
                return;
            }
            const buyer = document.getElementById("buyer-name").value.trim();
            const phone = document.getElementById("buyer-phone").value.trim();
            const notes = document.getElementById("buyer-notes").value.trim();
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const details = cart.map(item =>
                `${item.name} x ${item.quantity} = ${money(item.price * item.quantity)}`
            ).join("\\n");
            alert(
                "PEDIDO PREPARADO\\n\\n" +
                "Cliente: " + buyer + "\\nTeléfono: " + phone +
                "\\n\\n" + details +
                "\\n\\nTOTAL: " + money(total) +
                (notes ? "\\nObservaciones: " + notes : "") +
                "\\n\\nEste sitio muestra el resumen, pero todavía no envía el pedido ni procesa pagos. Contacta con la tienda para confirmar disponibilidad y entrega."
            );
        });
    }
});