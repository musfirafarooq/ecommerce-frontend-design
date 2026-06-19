/* =============================================
   NOVANODE — Product Detail Page Logic
   Renders product info, size selector, reviews,
   and related products for the selected item.
============================================= */

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Containers
const container = document.getElementById("productContainer");
const reviewsSection = document.getElementById("reviewsSection");
const reviewsContainer = document.getElementById("reviewsContainer");
const relatedContainer = document.getElementById("relatedProducts");
const breadcrumbName = document.getElementById("breadcrumbName");

// Find product
const product = products.find(p => p.id === productId);

// Categories where a size selector makes sense
const SIZED_CATEGORIES = ["Apparel", "Clothing", "Footwear"];

// ================= SIZE DROPDOWN =================
function sizeDropdownHtml(p) {
  if (!SIZED_CATEGORIES.includes(p.category)) return "";
  return `
    <div class="size-select-wrap">
      <label for="sizeSelect">Size</label>
      <select id="sizeSelect">
        <option value="S">Small</option>
        <option value="M" selected>Medium</option>
        <option value="L">Large</option>
        <option value="XL">X-Large</option>
      </select>
    </div>
  `;
}

// ================= MAIN PRODUCT DISPLAY =================
function showProduct() {
  if (!product) {
    container.innerHTML = `
      <div style="text-align:center;padding:80px 20px">
        <i class="fa-solid fa-box-open" style="font-size:60px;color:#D8E5E0;margin-bottom:20px;display:block"></i>
        <h2>Product not found</h2>
        <p style="color:#6B7A74;margin-top:8px">The item you're looking for doesn't exist or was removed.</p>
        <a href="products.html" class="btn-primary" style="display:inline-flex;margin-top:24px">
          <i class="fa-solid fa-store"></i> Browse Products
        </a>
      </div>`;
    reviewsSection.style.display = "none";
    return;
  }

  if (breadcrumbName) breadcrumbName.textContent = product.name;
  document.title = `${product.name} | NovaNode`;

  const oldPrice = product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : "";
  const badge = product.badge ? `<span class="product-badge ${badgeClass(product.badge)}">${product.badge}</span>` : "";

  container.innerHTML = `
    <div class="detail-card">
      <div class="detail-img-wrap">
        ${badge}
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="info">
        <h1>${product.name}</h1>

        <div class="product-rating">
          <span class="stars">${starsHtml(product.rating)}</span>
          <span class="review-count">${product.rating.toFixed(1)} · ${product.reviews} reviews</span>
        </div>

        <div class="price">
          $${product.price}
          ${oldPrice}
        </div>

        <p class="detail-description">${product.description}</p>

        ${sizeDropdownHtml(product)}

        <button class="btn-primary" onclick="addToCart(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;
}

// ================= REVIEWS (SAMPLE, GENERATED FROM PRODUCT RATING) =================
const REVIEW_TEMPLATES = [
  { name: "Sarah M.", text: "Exactly as described and arrived faster than expected. Build quality feels premium for the price." },
  { name: "James T.", text: "Solid purchase. Does everything I needed it to do, no complaints after a few weeks of use." },
  { name: "Aisha K.", text: "Really happy with this. Packaging was great and customer support was responsive when I had questions." },
  { name: "David R.", text: "Good value overall. A couple of minor quirks but nothing that affects day-to-day use." }
];

function reviewCardHtml(review, rating) {
  return `
    <div class="review-card">
      <div class="review-top">
        <div class="review-avatar">${review.name.charAt(0)}</div>
        <div>
          <h4>${review.name}</h4>
          <div class="stars">${starsHtml(rating)}</div>
        </div>
      </div>
      <p>${review.text}</p>
    </div>
  `;
}

function showReviews() {
  if (!product) return;
  reviewsContainer.innerHTML = REVIEW_TEMPLATES.map(r => reviewCardHtml(r, product.rating)).join("");
}

// ================= RELATED PRODUCTS =================
function showRelatedProducts() {
  if (!product) {
    relatedContainer.innerHTML = "";
    return;
  }
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const fallback = related.length > 0
    ? related
    : products.filter(p => p.id !== product.id).slice(0, 4);

  relatedContainer.innerHTML = fallback.map(productCardHtml).join("");
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  showProduct();
  showReviews();
  showRelatedProducts();
  updateCartCount();
});
