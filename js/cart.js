let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");

// ==========================
// DISPLAY CART
// ==========================
function displayCart() {

  cartItemsContainer.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<h3>Your cart is empty 🛒</h3>";
    totalPriceElement.innerText = 0;
    return;
  }

  cart.forEach((item, index) => {

    total += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <h3>${item.name}</h3>
          <p>$${item.price}</p>
        </div>

        <div>
          <button onclick="decreaseQty(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>

        <div>
          <strong>$${item.price * item.quantity}</strong>
        </div>

        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  totalPriceElement.innerText = total;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// ==========================
// INCREASE QTY
// ==========================
function increaseQty(index) {
  cart[index].quantity += 1;
  displayCart();
}

// ==========================
// DECREASE QTY
// ==========================
function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  displayCart();
}

// ==========================
// REMOVE ITEM
// ==========================
function removeItem(index) {
  cart.splice(index, 1);
  displayCart();
}

// ==========================
// CLEAR CART (optional button)
// ==========================
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  displayCart();
}

// INIT
displayCart();