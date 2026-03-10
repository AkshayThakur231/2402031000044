// --- PREMIUM PRODUCT DATABASE ---
const products = [
  { id: "bolt-runner-x", name: "Bolt Runner X", category: "Running", price: 159.99, rating: 4.8, reviewsCount: 512, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop", sizes: ["7", "8", "9", "10", "11", "12"] },
  { id: "vantage-high-top", name: "Vantage High-Top", category: "Casual", price: 129.99, rating: 4.7, reviewsCount: 310, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop", sizes: ["6", "7", "8", "9", "10", "11"] },
  { id: "neo-classic-white", name: "Neo Classic White", category: "Sneakers", price: 95.00, rating: 4.5, reviewsCount: 428, image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200&auto=format&fit=crop", sizes: ["7", "8", "9", "10", "11", "12"] },
  { id: "trail-commander", name: "Trail Commander", category: "Boots", price: 185.00, rating: 4.9, reviewsCount: 156, image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200", sizes: ["8", "9", "10", "11", "12"] },
  { id: "urban-racer-pro", name: "Urban Racer Pro", category: "Running", price: 135.99, rating: 4.6, reviewsCount: 221, image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1200", sizes: ["7", "8", "9", "10", "11"] },
  { id: "titan-basketball", name: "Titan Basketball", category: "Basketball", price: 145.00, rating: 4.8, reviewsCount: 187, image: "https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=1200", sizes: ["9", "10", "11", "12", "13"] },
  { id: "zenith-loafer", name: "Zenith Loafer", category: "Formal", price: 110.00, rating: 4.4, reviewsCount: 92, image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1200&auto=format&fit=crop", sizes: ["7", "8", "9", "10", "11"] },
  { id: "starlight-heel", name: "Starlight Heel", category: "Heels", price: 125.00, rating: 4.5, reviewsCount: 134, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1200&auto=format&fit=crop", sizes: ["5", "6", "7", "8", "9"] }
];

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem('stepStyleCart')) || [];

function updateCartBadge() {
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  localStorage.setItem('stepStyleCart', JSON.stringify(cart));
}

// --- NAVIGATION ---
function openProduct(id) {
  // Ensure your file is named exactly product-details.html
  window.location.href = `product-details.html?id=${id}`;
}

// --- RENDERING LOGIC ---
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openProduct('${p.id}')">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-card-body">
        <div class="muted tiny">${p.category}</div>
        <div class="bold">${p.name}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

function renderCart() {
  const listDiv = document.getElementById("cartItemsList");
  const layout = document.getElementById("cartLayout");
  const emptyMsg = document.getElementById("cartEmpty");

  if (!listDiv) return;

  if (cart.length === 0) {
    emptyMsg.classList.remove("hidden");
    layout.classList.add("hidden");
    return;
  }

  emptyMsg.classList.add("hidden");
  layout.classList.remove("hidden");
  
  listDiv.innerHTML = cart.map((item, index) => `
    <div class="cart-item-card">
      <img src="${item.image}" class="cart-item-img">
      <div class="cart-item-details">
        <div style="display:flex; justify-content:space-between;">
           <div class="bold">${item.name}</div>
           <div class="bold">$${item.price.toFixed(2)}</div>
        </div>
        <div class="muted small">Size: ${item.size || '9'} | Color: Black</div>
        <div class="qty-btn-group">
          <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
          <span class="remove-link" onclick="removeItem(${index})">Remove</span>
        </div>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  if(document.getElementById("subtotal")) document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
  if(document.getElementById("tax")) document.getElementById("tax").textContent = "$" + (subtotal * 0.08).toFixed(2);
  if(document.getElementById("total")) document.getElementById("total").textContent = "$" + (subtotal * 1.08).toFixed(2);
}

// --- FIXED CHECKOUT SUMMARY RENDERING ---
function renderCheckoutSummary() {
  const summaryDiv = document.getElementById("checkoutSummary");
  if (!summaryDiv) return;

  if (cart.length === 0) {
    summaryDiv.innerHTML = "<p class='muted small'>Your cart is empty.</p>";
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // Generate HTML for each item in the summary
  const itemsHtml = cart.map(item => `
    <div class="mini-cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div style="flex: 1;">
        <div class="bold small">${item.name}</div>
        <div class="tiny muted">Qty: ${item.qty} | Size: ${item.size || '9'}</div>
      </div>
      <div class="bold small">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  summaryDiv.innerHTML = `
    <h3 class="bold" style="margin-bottom: 20px;">Order Summary</h3>
    <div class="summary-items-list" style="margin-bottom: 20px;">
      ${itemsHtml}
    </div>
    <div class="summary-calculations">
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      <div class="summary-row"><span>Shipping</span><span style="color: #10b981;">FREE</span></div>
      <div class="summary-row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
      <div class="summary-total" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
        <span class="bold">Total</span>
        <span class="bold" style="font-size: 1.2rem;">$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

// Add this to your DOMContentLoaded listener to make sure it runs on load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("checkoutSummary")) {
    renderCheckoutSummary();
  }
});

function updateQty(index, delta) {
  cart[index].qty = Math.max(1, cart[index].qty + delta);
  updateCartBadge();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCartBadge();
  renderCart();
}

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  if (document.getElementById("productGrid")) renderProducts();
  if (document.getElementById("cartItemsList")) renderCart();
  
  const cForm = document.getElementById("checkoutForm");
  if(cForm) {
    cForm.onsubmit = (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(cForm).entries());
      localStorage.setItem('lastOrder', JSON.stringify({id: "ORD-"+Date.now(), shipping: data}));
      cart = []; updateCartBadge(); window.location.href="confirmation.html";
    };
  }
});