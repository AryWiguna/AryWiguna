// Data menu
const menuItems = [
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

// Search functionality
const searchInput = document.getElementById('search-input');
const menuGrid = document.getElementById('menuGrid');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredMenu = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    
    if (filteredMenu.length === 0) {
        menuGrid.innerHTML = `
            <div class="no-results">
                <p>Tidak ada menu yang sesuai dengan pencarian "${e.target.value}"</p>
            </div>
        `;
    } else {
        displayMenu('all', filteredMenu);
    }
});

// Modifikasi fungsi displayMenu untuk mendukung pencarian
function displayMenu(category = 'all', items = menuItems) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    const filteredMenu = category === 'all' 
        ? items 
        : items.filter(item => item.category === category);

    filteredMenu.forEach(item => {
        const menuCard = `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="price">Rp ${item.price.toLocaleString()}</span>
                        <button class="order-btn" onclick="addToCart(${item.id})">
                            Pesan
                        </button>
                    </div>
                </div>
            </div>
        `;
        menuGrid.innerHTML += menuCard;
    });

    // Tambahkan animasi setelah menu ditampilkan
    animateMenuItems();
}

// Event listener untuk filter menu
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        e.target.classList.add('active');
        displayMenu(e.target.dataset.category);
    });
});

// Inisialisasi tampilan menu
document.addEventListener('DOMContentLoaded', () => {
    displayMenu();
});

// Cart functionality
let cart = [];
let isCartVisible = false;

// Toggle cart visibility dengan perbaikan
function toggleCart(event) {
    if (event) {
        event.stopPropagation();
    }
    isCartVisible = !isCartVisible;
    const cartModal = document.querySelector('.cart-modal');
    cartModal.style.display = isCartVisible ? 'block' : 'none';
}

// Event listener untuk icon keranjang
document.querySelector('.cart-icon').addEventListener('click', toggleCart);

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    const cartModal = document.querySelector('.cart-modal');
    if (isCartVisible && !e.target.closest('.cart-modal') && !e.target.closest('.cart-icon')) {
        isCartVisible = false;
        cartModal.style.display = 'none';
    }
});

// Cart Modal dengan kontrol quantity yang diperbaiki
const cartModal = document.createElement('div');
cartModal.className = 'cart-modal';
cartModal.innerHTML = `
    <div class="cart-content">
        <div class="cart-header">
            <h2>Keranjang Belanja</h2>
        </div>
        <div id="cart-items"></div>
        <div class="cart-footer">
            <div id="cart-total" class="cart-total">Total: Rp 0</div>
            <button class="order-btn checkout-btn" onclick="showOrderForm()">
                <i class="fas fa-shopping-bag"></i>
                Pesan Sekarang
            </button>
        </div>
    </div>
`;

// Tambahkan cart modal ke dalam cart container
document.querySelector('.cart-container').appendChild(cartModal);

// Prevent cart closing when clicking inside cart
cartModal.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Update fungsi updateCartDisplay untuk menampilkan kontrol quantity
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
        cartTotal.innerHTML = 'Total: Rp 0';
        document.querySelector('.checkout-btn').style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="item-price">Rp ${item.price.toLocaleString()}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, 'decrease')">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 'increase')">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `Total: Rp ${total.toLocaleString()}`;
    document.querySelector('.checkout-btn').style.display = 'block';
}

function addToCart(id) {
    const item = menuItems.find(item => item.id === id);
    const existingItem = cart.find(cartItem => cartItem.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function updateQuantity(id, action) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity === 0) {
                removeFromCart(id);
            } else {
                updateCartCount();
                updateCartDisplay();
            }
        } else if (action === 'increase') {
            item.quantity += 1;
            updateCartCount();
            updateCartDisplay();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    updateCartDisplay();
}

// Tambahkan event listener untuk tombol Pesan Online di keranjang
document.querySelector('.cart-content').addEventListener('click', (e) => {
    if (e.target.closest('.checkout-btn')) {
        showOrderForm();
    }
});

// Fungsi untuk menampilkan form pemesanan
function showOrderForm() {
    if (cart.length === 0) {
        alert('Keranjang belanja masih kosong!');
        return;
    }

    const orderFormModal = document.createElement('div');
    orderFormModal.className = 'order-form-modal';
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 10000;
    
    orderFormModal.innerHTML = `
        <div class="order-form-content">
            <div class="order-form-header">
                <h2>Form Pemesanan</h2>
                <button class="close-form-btn" onclick="closeOrderForm(this)">&times;</button>
            </div>
            
            <div class="order-summary">
                <h3>Ringkasan Pesanan</h3>
                <div class="order-items">
                    ${cart.map(item => `
                        <div class="summary-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="summary-total">
                    <div class="subtotal">
                        <span>Subtotal</span>
                        <span>Rp ${total.toLocaleString()}</span>
                    </div>
                    <div class="delivery-fee">
                        <span>Biaya Pengiriman</span>
                        <span>Rp ${deliveryFee.toLocaleString()}</span>
                    </div>
                    <div class="final-total">
                        <span>Total</span>
                        <span>Rp ${(total + deliveryFee).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <form id="orderForm" onsubmit="submitOrder(event)">
                <div class="form-section">
                    <h3>Data Pemesan</h3>
                    <div class="form-group">
                        <label for="name">Nama Lengkap*</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Nomor Telepon*</label>
                        <input type="tel" id="phone" required pattern="[0-9]{10,13}">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Alamat Pengiriman</h3>
                    <div class="form-group">
                        <label for="address">Alamat Lengkap*</label>
                        <textarea id="address" required></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="district">Kecamatan*</label>
                            <input type="text" id="district" required>
                        </div>
                        <div class="form-group">
                            <label for="postalCode">Kode Pos*</label>
                            <input type="text" id="postalCode" required pattern="[0-9]{5}">
                        </div>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Metode Pembayaran</h3>
                    <div class="payment-options">
                        <label class="payment-option">
                            <input type="radio" name="payment" value="cash" required>
                            <span class="payment-label">
                                <i class="fas fa-money-bill-wave"></i>
                                Tunai
                            </span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="transfer">
                            <span class="payment-label">
                                <i class="fas fa-university"></i>
                                Transfer Bank
                            </span>
                        </label>
                        <label class="payment-option">
                            <input type="radio" name="payment" value="ewallet">
                            <span class="payment-label">
                                <i class="fas fa-wallet"></i>
                                E-Wallet
                            </span>
                        </label>
                    </div>
                </div>

                <div class="form-section">
                    <h3>Catatan Tambahan</h3>
                    <div class="form-group">
                        <textarea id="notes" placeholder="Tambahkan catatan untuk pesanan Anda (opsional)"></textarea>
                    </div>
                </div>

                <button type="submit" class="submit-order-btn">
                    <i class="fas fa-check"></i>
                    Konfirmasi Pesanan
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(orderFormModal);
    
    // Show modal with animation
    requestAnimationFrame(() => {
        orderFormModal.classList.add('show');
    });
}

// Fungsi untuk menutup form pemesanan
function closeOrderForm(button) {
    const orderFormModal = button.closest('.order-form-modal');
    orderFormModal.classList.remove('show');
    
    // Tampilkan kembali cart modal
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.style.display = 'block';
        isCartVisible = true;
    }
    
    // Hapus form modal setelah animasi selesai
    setTimeout(() => {
        orderFormModal.remove();
    }, 300);
}

// Fungsi untuk submit pesanan
function submitOrder(event) {
    event.preventDefault();
    
    const formData = {
        customerInfo: {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
        },
        shippingAddress: {
            address: document.getElementById('address').value,
            district: document.getElementById('district').value,
            postalCode: document.getElementById('postalCode').value,
        },
        paymentMethod: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('notes').value,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10000
    };

    // Tampilkan pesan sukses
    showOrderSuccess(formData);

    // Reset cart dan form
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();
    updateCartDisplay();
    
    // Tutup form modal
    const orderFormModal = document.querySelector('.order-form-modal');
    if (orderFormModal) {
        closeOrderForm(orderFormModal.querySelector('.close-form-btn'));
    }
}

// Fungsi untuk menampilkan pesan sukses
function showOrderSuccess(orderData) {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Pesanan Berhasil!</h2>
            <p>Terima kasih, ${orderData.customerInfo.name}!</p>
            <p>Pesanan Anda sedang diproses.</p>
            <div class="order-details">
                <p>Nomor Pesanan: #${Date.now().toString().slice(-6)}</p>
                <p>Total Pembayaran: Rp ${orderData.total.toLocaleString()}</p>
            </div>
            <button onclick="this.closest('.success-modal').remove()" class="close-success-btn">
                Tutup
            </button>
        </div>
    `;

    document.body.appendChild(successModal);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll dan animasi navigasi
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Hapus kelas active dari semua link
        document.querySelectorAll('.nav-links a').forEach(el => {
            el.classList.remove('active');
        });
        
        // Tambah kelas active ke link yang diklik
        this.classList.add('active');
        
        // Smooth scroll ke section
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Deteksi section yang sedang dilihat
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Animasi section saat scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-animate');
    observer.observe(section);
});

// Animasi untuk menu items
function animateMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    updateCartDisplay();
});

// Google Maps initialization
function initMap() {
    // Koordinat lokasi restoran Anda
    const restaurantLocation = { lat: -6.123456, lng: 106.789012 }; // Sesuaikan dengan lokasi Anda

    const map = new google.maps.Map(document.getElementById('map'), {
        center: restaurantLocation,
        zoom: 15,
        styles: [
            {
                "featureType": "poi.business",
                "elementType": "labels",
                "stylers": [{"visibility": "on"}]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{"lightness": 100}]
            }
        ]
    });

    // Marker untuk lokasi restoran
    const marker = new google.maps.Marker({
        position: restaurantLocation,
        map: map,
        title: 'TastyBites Restaurant',
        animation: google.maps.Animation.DROP
    });

    // Info Window untuk marker
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="map-info">
                <h3>TastyBites Restaurant</h3>
                <p>Jl. Contoh No. 123</p>
                <p>Jakarta Selatan</p>
                <p><a href="https://www.google.co.id/maps/place/Bali/@-8.4553335,114.7419106,10z/data=!3m1!4b1!4m6!3m5!1s0x2dd141d3e8100fa1:0x24910fb14b24e690!8m2!3d-8.4095178!4d115.188916!16s%2Fg%2F121hxh1j?entry=ttu&g_ep=EgoyMDI1MDIwNC4wIKXMDSoASAFQAw%3D%3D" target="_blank">Petunjuk Arah</a></p>
            </div>
        `
    });

    // Event listener untuk marker
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Tambahkan CSS untuk styling
const style = document.createElement('style');
style.textContent = `
    .cart-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #eee;
        position: relative;
    }

    .cart-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 1rem;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
    }

    .item-price {
        color: var(--primary-color);
        font-weight: 600;
        margin: 0.2rem 0;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        margin-top: 0.5rem;
    }

    .quantity-controls button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: var(--light-bg);
        color: var(--text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .quantity-controls button:hover {
        background: var(--primary-color);
        color: var(--white);
    }

    .quantity {
        font-weight: 600;
        min-width: 20px;
        text-align: center;
    }

    .remove-item {
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        padding: 0.5rem;
        transition: all 0.2s ease;
    }

    .remove-item:hover {
        color: #ff0000;
        transform: scale(1.1);
    }

    .cart-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        margin-top: auto;
    }

    .cart-total {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .checkout-btn {
        width: 100%;
        padding: 1rem;
        background: var(--primary-color);
        color: var(--white);
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }

    .checkout-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 75, 43, 0.3);
    }

    .empty-cart {
        text-align: center;
        padding: 2rem;
        color: #666;
    }

    .close-form-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        color: #666;
        transition: all 0.3s ease;
    }

    .close-form-btn:hover {
        color: var(--primary-color);
        transform: scale(1.1);
    }

    .order-form-modal {
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .order-form-modal.show {
        opacity: 1;
        visibility: visible;
    }

    .order-form-content {
        transform: translateY(20px);
        transition: all 0.3s ease;
    }

    .order-form-modal.show .order-form-content {
        transform: translateY(0);
    }
`;

document.head.appendChild(style);

// Admin Login Functions
function showAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    modal.style.display = 'flex';
}

function closeAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    modal.style.display = 'none';
}

function handleAdminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Contoh kredensial admin sederhana
    if (username === 'admin' && password === 'admin123') {
        // Update path ke lokasi file admin.html yang benar
        window.location.href = 'halaman admin/admin.html';
    } else {
        alert('Username atau password salah!');
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('adminLoginModal');
    if (e.target === modal) {
        closeAdminLogin();
    }
});

// Prevent modal close when clicking inside modal content
document.querySelector('.admin-login-content').addEventListener('click', (e) => {
    e.stopPropagation();
});
