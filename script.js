let products = [];
let cart = [];
let currentView = "home";

// 初始化：從 PHP 獲取 MySQL 資料
async function init() {
  const res = await fetch("products.php");
  products = await res.json();
  switchView("home");
}

function switchView(view) {
  currentView = view;
  const container = document.getElementById("view-container");
  container.className = "fade-in";

  if (view === "home") renderHome();
  else if (view === "cart") renderCart();
  else if (view === "success") renderSuccess();
  else if (view === "dashboard") renderDashboard();

  lucide.createIcons();
}

function renderHome() {
  const container = document.getElementById("view-container");
  container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${products
              .map(
                (p) => `
                <div class="product-card p-6 rounded-[2rem] border border-slate-800">
                    <img src="${p.image}" class="w-full h-40 object-cover rounded-2xl mb-4">
                    <h3 class="font-bold text-xl mb-2">${p.name}</h3>
                    <div class="flex justify-between items-center">
                        <span class="text-cyan-400 font-black">NT$ ${parseInt(p.price).toLocaleString()}</span>
                        <button onclick="addToCart(${p.id})" class="bg-white text-black p-2 rounded-lg hover:bg-cyan-400 transition">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `;
}

function addToCart(id) {
  const product = products.find((p) => p.id == id);
  const item = cart.find((i) => i.id == id);
  if (item) item.quantity++;
  else cart.push({ ...product, quantity: 1 });
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const badge = document.getElementById("cart-count");
  badge.innerText = count;
  badge.classList.toggle("hidden", count === 0);
}

function renderCart() {
  const container = document.getElementById("view-container");
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (cart.length === 0) {
    container.innerHTML = `<div class="text-center py-20 text-slate-500">購物車是空的</div>`;
    return;
  }

  container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-800">
            <h2 class="text-2xl font-bold mb-6">您的購物籃</h2>
            ${cart
              .map(
                (item) => `
                <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-800">
                    <div>
                        <p class="font-bold">${item.name}</p>
                        <p class="text-cyan-400 text-sm">NT$ ${item.price} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="updateQty(${item.id}, -1)" class="p-1 hover:text-cyan-400"><i data-lucide="minus"></i></button>
                        <button onclick="updateQty(${item.id}, 1)" class="p-1 hover:text-cyan-400"><i data-lucide="plus"></i></button>
                        <button onclick="removeItem(${item.id})" class="text-red-500 ml-4"><i data-lucide="trash-2"></i></button>
                    </div>
                </div>
            `,
              )
              .join("")}
            <div class="mt-8 flex justify-between items-center">
                <span class="text-xl font-bold">總計: NT$ ${total.toLocaleString()}</span>
                <button onclick="dbCheckout(${total})" class="bg-cyan-500 px-8 py-3 rounded-xl font-black">確認結帳</button>
            </div>
        </div>
    `;
  lucide.createIcons();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id == id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) removeItem(id);
    else renderCart();
  }
}

function removeItem(id) {
  cart = cart.filter((i) => i.id != id);
  renderCart();
  updateCartUI();
}

async function dbCheckout(total) {
  const orderId = "ORD-" + Date.now();
  const res = await fetch("checkout.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, total }),
  });
  const result = await res.json();
  if (result.success) {
    window.lastOrder = { id: orderId, total };
    cart = [];
    updateCartUI();
    switchView("success");
  }
}

function renderSuccess() {
  document.getElementById("view-container").innerHTML = `
        <div class="text-center">
            <div class="bg-white p-6 rounded-3xl inline-block mb-6">
                <div class="w-40 h-40 bg-slate-200 flex items-center justify-center text-black font-bold">QR CODE</div>
            </div>
            <h2 class="text-3xl font-black text-cyan-400 mb-2">付款成功！</h2>
            <p class="text-slate-400 mb-8">訂單號：${window.lastOrder.id}</p>
            <button onclick="switchView('home')" class="bg-slate-800 px-10 py-3 rounded-xl">返回首頁</button>
        </div>
    `;
}

init(); // 啟動程式
