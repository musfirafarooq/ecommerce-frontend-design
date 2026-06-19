/* =============================================
   NOVANODE — Core App Logic
   Cart, UI helpers, homepage product loader
============================================= */

// ===== CART HELPERS =====
function getCart() {
  return JSON.parse(localStorage.getItem("nn_cart")) || [];
}
function saveCart(cart) {
  localStorage.setItem("nn_cart", JSON.stringify(cart));
}

// ===== ADD TO CART =====
function addToCart(id) {
  let cart = getCart();
  let product = products.find(p => p.id === id);
  if (!product) return;
  let existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  showToast(`<i class="fa-solid fa-circle-check"></i> ${product.name} added to cart`);
}

// ===== CART COUNT =====
function updateCartCount() {
  let cart = getCart();
  let count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ===== STAR RATING HTML =====
function starsHtml(rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<i class="fa-solid fa-star"></i>';
    else if (i === Math.ceil(rating) && rating % 1 >= 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

// ===== BADGE CLASS =====
function badgeClass(badge) {
  if (!badge) return "";
  const map = { "New": "new", "Hot": "hot", "Best Seller": "best", "Top Pick": "best" };
  return map[badge] || "";
}

// ===== PRODUCT CARD HTML =====
function productCardHtml(p) {
  const badge = p.badge ? `<span class="product-badge ${badgeClass(p.badge)}">${p.badge}</span>` : "";
  const oldPrice = p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : "";
  return `
    <div class="product-card" onclick="window.location='product.html?id=${p.id}'">
      <div class="product-img-wrap">
        ${badge}
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-actions">
          <button class="action-btn" onclick="event.stopPropagation();addToWishlist(${p.id})" title="Wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
          <button class="action-btn" onclick="event.stopPropagation();quickView(${p.id})" title="Quick View">
            <i class="fa-regular fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-rating">
          <div class="stars">${starsHtml(p.rating)}</div>
          <span class="review-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">$${p.price}</span>
          ${oldPrice}
        </div>
        <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

// ===== WISHLIST (stub) =====
function addToWishlist(id) {
  let p = products.find(x => x.id === id);
  if (p) showToast(`<i class="fa-solid fa-heart" style="color:#ef4444"></i> ${p.name} added to wishlist`);
}

// ===== QUICK VIEW (stub) =====
function quickView(id) {
  window.location = `product.html?id=${id}`;
}

// ===== LOAD HOME PRODUCTS =====
function loadHomeProducts() {
  const featuredEl = document.getElementById("featured");
  const trendingEl = document.getElementById("trending");
  if (featuredEl) {
    featuredEl.innerHTML = products.slice(0, 4).map(productCardHtml).join("");
  }
  if (trendingEl) {
    trendingEl.innerHTML = products.slice(4, 8).map(productCardHtml).join("");
  }
}

// ===== SCROLL TO TOP =====
function initScrollTop() {
  const btn = document.getElementById("topBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// ===== COUNTDOWN TIMER (Deals) =====
function initCountdown() {
  const end = new Date();
  end.setHours(end.getHours() + 23, end.getMinutes() + 47, end.getSeconds() + 33);
  function tick() {
    const now = new Date();
    let diff = Math.max(0, end - now);
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    const fmt = n => String(n).padStart(2,"0");
    const el = id => document.getElementById(id);
    if (el("t-hours")) el("t-hours").textContent = fmt(h);
    if (el("t-mins"))  el("t-mins").textContent  = fmt(m);
    if (el("t-secs"))  el("t-secs").textContent  = fmt(s);
  }
  tick();
  setInterval(tick, 1000);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadHomeProducts();
  initScrollTop();
  initCountdown();
});

window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.quickView = quickView;