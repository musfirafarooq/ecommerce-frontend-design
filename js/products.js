// ================= STATE =================
let filteredProducts = [];
let selectedCategory = "All";
let maxPrice = 1000;
let sortMode = "default";
const PER_PAGE = 8;
let currentPage = 1;

// ================= RENDER PRODUCT CARD =================
function renderCard(p) {
  const badgeClass = p.badge ? p.badge.toLowerCase() : '';
  const badgeLabel = p.badge || '';
  const stars = renderStars(p.rating);
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${badgeLabel ? `<span class="product-badge ${badgeClass}">${badgeLabel}</span>` : ''}
        <div class="product-actions">
          <button class="action-btn" title="Wishlist"><i class="fa-regular fa-heart"></i></button>
          <button class="action-btn" onclick="window.location='product.html?id=${p.id}'" title="Quick View"><i class="fa-regular fa-eye"></i></button>
        </div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="review-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">$${p.price}</span>
          ${p.oldPrice ? `<span class="old-price">$${p.oldPrice}</span>` : ''}
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>`;
}

function renderStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fa-solid fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    else html += '<i class="fa-regular fa-star"></i>';
  }
  return html;
}

// ================= DISPLAY PRODUCTS =================
function displayProducts(list) {
  const grid = document.getElementById("productGrid");
  const resultsBar = document.getElementById("results-bar");
  if (!grid) return;

  if (!list || list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#6B7A74">
        <i class="fa-solid fa-box-open" style="font-size:52px;color:#D8E5E0;margin-bottom:16px;display:block"></i>
        <h3 style="font-size:20px;color:#1A2420;margin-bottom:8px">No products found</h3>
        <p>Try adjusting your filters.</p>
      </div>`;
    if (resultsBar) resultsBar.textContent = '';
    renderPagination(0);
    return;
  }

  // Pagination
  const total = list.length;
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = list.slice(start, start + PER_PAGE);

  if (resultsBar) resultsBar.innerHTML = `Showing <strong>${pageItems.length}</strong> of <strong>${total}</strong> products`;

  grid.innerHTML = pageItems.map(renderCard).join('');
  renderPagination(total);
}

// ================= PAGINATION =================
function renderPagination(total) {
  const container = document.getElementById("pagination");
  if (!container) return;
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button onclick="goPage(${i})" style="${i === currentPage ? 'background:#0A5940' : ''}">${i}</button>`;
  }
  container.innerHTML = html;
}

function goPage(n) {
  currentPage = n;
  displayProducts(filteredProducts);
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

// ================= FILTER + SORT =================
function applyFilters() {
  if (!products) return;
  const searchText = (document.getElementById("searchInput")?.value || "").toLowerCase();

  filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchPrice = p.price <= maxPrice;
    const matchSearch = p.name.toLowerCase().includes(searchText);
    return matchCat && matchPrice && matchSearch;
  });

  // Sort
  if (sortMode === "price-asc") filteredProducts.sort((a, b) => a.price - b.price);
  else if (sortMode === "price-desc") filteredProducts.sort((a, b) => b.price - a.price);
  else if (sortMode === "rating") filteredProducts.sort((a, b) => b.rating - a.rating);

  currentPage = 1;
  displayProducts(filteredProducts);
}

// ================= EVENTS =================
document.getElementById("searchInput")?.addEventListener("input", applyFilters);

document.querySelectorAll("#categoryList li").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll("#categoryList li").forEach(l => l.classList.remove("active-filter"));
    item.classList.add("active-filter");
    selectedCategory = item.dataset.category || "All";
    applyFilters();
  });
});

document.getElementById("priceRange")?.addEventListener("input", e => {
  maxPrice = parseInt(e.target.value);
  const el = document.getElementById("priceValue");
  if (el) el.textContent = maxPrice;
  applyFilters();
});

document.getElementById("sortSelect")?.addEventListener("change", e => {
  sortMode = e.target.value;
  applyFilters();
});

// ================= URL CATEGORY PARAM =================
function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("cat") || "All";
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  selectedCategory = getCategoryFromURL();
  // Highlight correct category in sidebar
  document.querySelectorAll("#categoryList li").forEach(li => {
    li.classList.toggle("active-filter", li.dataset.category === selectedCategory);
  });
  applyFilters();
  updateCartCount();
});
