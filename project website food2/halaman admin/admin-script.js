// Toggle active class for sidebar navigation
document.querySelectorAll('.admin-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        document.querySelector('.admin-nav a.active').classList.remove('active');
        this.classList.add('active');
    });
});

// Sample data for demonstration
const orders = [
    {
        id: '#ORD001',
        customer: 'John Doe',
        items: 'Caesar Salad, Pasta',
        total: 'Rp 150.000',
        status: 'pending'
    },
    // Add more orders as needed
];

// Function to update orders table
function updateOrdersTable() {
    const tbody = document.querySelector('.recent-orders table tbody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td>${order.total}</td>
            <td><span class="status ${order.status}">${order.status}</span></td>
            <td>
                <button class="action-btn" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn" onclick="editOrder('${order.id}')">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// View order details
function viewOrder(orderId) {
    console.log(`Viewing order ${orderId}`);
    // Implement view order functionality
}

// Edit order
function editOrder(orderId) {
    console.log(`Editing order ${orderId}`);
    // Implement edit order functionality
}

// Fungsi untuk mengelola pesanan
function updateOrderStatus(orderId, status) {
    // Update status pesanan
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        refreshOrdersTable();
    }
}

function filterOrders() {
    const status = document.getElementById('statusFilter').value;
    const date = document.getElementById('dateFilter').value;
    
    let filteredOrders = [...orders];
    
    if (status !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (date) {
        filteredOrders = filteredOrders.filter(order => 
            order.date.startsWith(date)
        );
    }
    
    refreshOrdersTable(filteredOrders);
}

// Fungsi untuk mengelola menu
function showAddMenuForm() {
    const modal = document.getElementById('menuFormModal');
    modal.style.display = 'block';
}

function handleMenuSubmit(event) {
    event.preventDefault();
    
    const menuData = {
        name: document.getElementById('menuName').value,
        price: document.getElementById('menuPrice').value,
        category: document.getElementById('menuCategory').value,
        description: document.getElementById('menuDescription').value,
        // Handle image upload
    };
    
    // Simpan menu baru
    menus.push(menuData);
    refreshMenuGrid();
    closeMenuForm();
}

// Fungsi untuk mengelola promo
function showAddPromoForm() {
    const modal = document.getElementById('promoFormModal');
    modal.style.display = 'block';
}

function handlePromoSubmit(event) {
    event.preventDefault();
    
    const promoData = {
        name: document.getElementById('promoName').value,
        code: document.getElementById('promoCode').value,
        discount: document.getElementById('promoDiscount').value,
        startDate: document.getElementById('promoStart').value,
        endDate: document.getElementById('promoEnd').value
    };
    
    // Simpan promo baru
    promos.push(promoData);
    refreshPromoList();
    closePromoForm();
}

// Fungsi untuk navigasi
function navigateTo(page) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to clicked nav item
    event.currentTarget.classList.add('active');

    // Clear current content
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    // Load content based on page
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'menu':
            loadMenuList();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'new-orders':
            loadNewOrders();
            break;
        case 'processing-orders':
            loadProcessingOrders();
            break;
        case 'completed-orders':
            loadCompletedOrders();
            break;
        case 'active-promos':
            loadActivePromos();
            break;
        case 'scheduled-promos':
            loadScheduledPromos();
            break;
        // ... tambahkan case lain sesuai kebutuhan
    }
}

// Fungsi untuk Dashboard
function loadDashboard() {
    const content = `
        <div class="dashboard-stats">
            <div class="stat-card">
                <i class="fas fa-shopping-cart"></i>
                <h3>Total Pesanan</h3>
                <p>150</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-users"></i>
                <h3>Total Pelanggan</h3>
                <p>1,250</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-utensils"></i>
                <h3>Total Menu</h3>
                <p>75</p>
            </div>
            <div class="stat-card">
                <i class="fas fa-money-bill-wave"></i>
                <h3>Pendapatan</h3>
                <p>Rp 20,000,000</p>
            </div>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
}

// Fungsi untuk Menu Management
function loadMenuList() {
    const content = `
        <div class="section-header">
            <h2>Daftar Menu</h2>
            <button class="add-btn" onclick="showAddMenuModal()">
                <i class="fas fa-plus"></i> Tambah Menu
            </button>
        </div>
        <div class="menu-filters">
            <select id="menuCategory" onchange="filterMenu()">
                <option value="all">Semua Kategori</option>
                <option value="makanan">Makanan</option>
                <option value="minuman">Minuman</option>
                <option value="dessert">Dessert</option>
            </select>
            <input type="text" id="menuSearch" placeholder="Cari menu...">
        </div>
        <div class="menu-grid" id="menuGrid">
            ${generateMenuItems()}
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
}

// Fungsi untuk Pesanan Baru
function loadNewOrders() {
    const content = `
        <div class="section-header">
            <h2>Pesanan Baru</h2>
            <div class="order-filters">
                <input type="date" id="orderDate">
                <select id="orderStatus">
                    <option value="all">Semua Status</option>
                    <option value="pending">Menunggu Konfirmasi</option>
                    <option value="confirmed">Terkonfirmasi</option>
                </select>
            </div>
        </div>
        <div class="orders-table">
            <table>
                <thead>
                    <tr>
                        <th>ID Pesanan</th>
                        <th>Pelanggan</th>
                        <th>Menu</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody id="ordersList">
                    ${generateOrderItems()}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
}

// Fungsi untuk Promo
function loadActivePromos() {
    const content = `
        <div class="section-header">
            <h2>Promo Aktif</h2>
            <button class="add-btn" onclick="showAddPromoModal()">
                <i class="fas fa-plus"></i> Tambah Promo
            </button>
        </div>
        <div class="promo-grid">
            ${generateActivePromos()}
        </div>
    `;
    document.getElementById('content-area').innerHTML = content;
}

// Helper Functions
function generateMenuItems() {
    // Contoh data menu
    const menus = [
        {
            id: 1,
            name: "Nasi Goreng Spesial",
            price: 45000,
            image: "https://www.sugarspicenmore.com/wp-content/uploads/2022/08/Nasi-Goreng-3-rotated.jpg",
            description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
            category: "main-course"
        },
        {
            id: 2,
            name: "Spaghetti Carbonara",
            price: 55000,
            image: "https://www.tastingtable.com/img/gallery/simple-spaghetti-carbonara-recipe/l-intro-1670253292.jpg",
            description: "Pasta dengan saus krim dan bacon",
            category: "main-course"
        },
        {
            id: 3,
            name: "Caesar Salad",
            price: 35000,
            image: "https://www.thespruceeats.com/thmb/Z6IWF7c9zywuU9maSIimGLbHoI4=/3000x2000/filters:fill(auto,1)/classic-caesar-salad-recipe-996054-Hero_01-33c94cc8b8e841ee8f2a815816a0af95.jpg",
            description: "Salad segar dengan saus caesar",
            category: "appetizer"
        },
        {
            id: 4,
            name: "Chocolate Lava Cake",
            price: 30000,
            image: "https://www.tasteitpresents.com/wp-content/uploads/2019/06/lava-cake.png",
            description: "Kue coklat dengan lelehan coklat di dalamnya",
            category: "dessert"
        },
        {
            id: 5,
            name: "Ice Lemon Tea",
            price: 15000,
            image: "https://cdnimg.webstaurantstore.com/images/products/xxl/441169/1769710.jpg",
            description: "Teh segar dengan perasan lemon",
            category: "beverages"
        },
        // Tambahkan menu lainnya
        {
            id: 6 ,
            name: 'Mango Smoothie',
            price: 16000,
            category: 'beverages',
            image: 'https://plantbasedonabudget.com/wp-content/uploads/2021/07/citrus-smoothie-14.jpg',
            description: 'Fresh mango blended with yogurt',
        },
        {
            id: 7,
            name: "Iced Coffee",
            category: "beverages",
            price: 18000,
            image: "https://plus.unsplash.com/premium_photo-1663933534262-5de49eb4f59f?q=80&w=1964&auto=format&fit=crop",
            description: "Cold brew coffee with milk",
        },
        {
            id: 8,
            name: "Cheese Burger",
            category: "main-course",
            price: 20000,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            description: "Juicy beef patty with melted cheese",
        },
    ];

    return menus.map(menu => `
        <div class="menu-item">
            <img src="../images/menu/${menu.image}" alt="${menu.name}">
            <h3>${menu.name}</h3>
            <p>Rp ${menu.price.toLocaleString()}</p>
            <div class="menu-actions">
                <button onclick="editMenu(${menu.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteMenu(${menu.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function generateOrderItems() {
    // Contoh data pesanan
    const orders = [
        { id: 'ORD001', customer: 'John Doe', items: 'Nasi Goreng x2', total: 50000, status: 'pending' },
        { id: 'ORD002', customer: 'Dexter', items: 'Cheese Burger', total: 40000, status: 'pending' },
        // ... tambahkan pesanan lainnya
    ];

    return orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items}</td>
            <td>Rp ${order.total.toLocaleString()}</td>
            <td><span class="status-${order.status}">${order.status}</span></td>
            <td>
                <button onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="processOrder('${order.id}')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components based on current page
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('admin-orders.html')) {
        refreshOrdersTable();
        document.getElementById('statusFilter').addEventListener('change', filterOrders);
        document.getElementById('dateFilter').addEventListener('change', filterOrders);
    }
    
    if (currentPage.includes('admin-menu.html')) {
        refreshMenuGrid();
        document.getElementById('menuForm').addEventListener('submit', handleMenuSubmit);
    }
    
    if (currentPage.includes('admin-promo.html')) {
        refreshPromoList();
        document.getElementById('promoForm').addEventListener('submit', handlePromoSubmit);
    }

    // Load dashboard by default
    loadDashboard();
});