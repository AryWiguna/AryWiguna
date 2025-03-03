// Data
const diamondPackages = [
    { id: 1, diamonds: 86, price: 19000, bonus: "0" },
    { id: 2, diamonds: 172, price: 38000, bonus: "0" },
    { id: 3, diamonds: 257, price: 57000, bonus: "0" },
    { id: 4, diamonds: 344, price: 76000, bonus: "0" },
    { id: 5, diamonds: 429, price: 95000, bonus: "0" },
    { id: 6, diamonds: 514, price: 114000, bonus: "0" },
    { id: 7, diamonds: 706, price: 152000, bonus: "14" },
    { id: 8, diamonds: 878, price: 190000, bonus: "44" },
    { id: 9, diamonds: 1050, price: 228000, bonus: "73" },
    { id: 10, diamonds: 2195, price: 456000, bonus: "180" },
    { id: 11, diamonds: 3688, price: 760000, bonus: "410" },
    { id: 12, diamonds: 5532, price: 1140000, bonus: "615" },
  ];
  
  const rankBoostPackages = [
    { id: 1, from: "Warrior", to: "Elite", price: 50000 },
    { id: 2, from: "Elite", to: "Master", price: 100000 },
    { id: 3, from: "Master", to: "Grandmaster", price: 150000 },
    { id: 4, from: "Grandmaster", to: "Epic", price: 200000 },
    { id: 5, from: "Epic", to: "Legend", price: 300000 },
    { id: 6, from: "Legend", to: "Mythic", price: 500000 },
    { id: 7, from: "Mythic", to: "Mythical Glory", price: 1000000 },
  ];
  
  // Update array joki packages dengan paket Mythic
  const jokiPackages = [
    // ... existing packages ...
    {
        id: 7,
        name: "Mythic Grading (10x Win)",
        price: 250000,
        estimasi: "2-3 hari",
        type: "mythic"
    },
    {
        id: 8,
        name: "Mythic → Mythic Honor",
        price: 400000,
        estimasi: "4-5 hari",
        type: "mythic_honor"
    },
    {
        id: 9,
        name: "Mythic Honor → Mythic Glory",
        price: 600000,
        estimasi: "5-7 hari",
        type: "mythic_glory"
    },
    {
        id: 10,
        name: "Mythic Glory → Mythic Immortal",
        price: 1000000,
        estimasi: "7-10 hari",
        type: "mythic_immortal"
    }
  ];
  
  // DOM Elements
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const navButtons = document.querySelectorAll('[data-tab]');
  const sections = document.querySelectorAll('.section');
  const diamondPackagesContainer = document.getElementById('diamond-packages');
  const boostPackagesContainer = document.getElementById('boost-packages');
  
  // Toggle mobile menu
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const menuIcon = mobileMenuButton.querySelector('svg');
    if (mobileMenu.classList.contains('hidden')) {
      menuIcon.innerHTML = '<line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/>';
    } else {
      menuIcon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';
    }
  });
  
  // Tab switching
  function switchTab(tabId) {
    // Update active tab button
    navButtons.forEach(button => {
      if (button.dataset.tab === tabId) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  
    // Show active section
    sections.forEach(section => {
      if (section.id === `${tabId}-section`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
  
    // Close mobile menu if open
    mobileMenu.classList.add('hidden');
  }
  
  // Add click handlers to all tab buttons
  navButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
  });
  
  // Format price
  function formatPrice(price) {
    return price.toLocaleString('id-ID');
  }
  
  // Render diamond packages
  function renderDiamondPackages() {
    diamondPackagesContainer.innerHTML = diamondPackages.map(pkg => `
      <div class="card">
        <div class="card-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"></path></svg>
          <span class="bonus">Bonus: ${pkg.bonus}</span>
        </div>
        <div class="diamonds">${pkg.diamonds} Diamonds</div>
        <div class="price">Rp ${formatPrice(pkg.price)}</div>
        <button class="buy-button">Beli Sekarang</button>
      </div>
    `).join('');
  }
  
  // Render boost packages
  function renderBoostPackages() {
    boostPackagesContainer.innerHTML = rankBoostPackages.map(pkg => `
      <div class="card">
        <div class="card-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <div class="diamonds">${pkg.from} → ${pkg.to}</div>
        <div class="price">Rp ${formatPrice(pkg.price)}</div>
        <button class="buy-button">Pesan Sekarang</button>
      </div>
    `).join('');
  }
  
  // Initialize
  renderDiamondPackages();
  renderBoostPackages();

document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const cartCount = document.querySelector('.cart-count');

    // Function to update cart count badge
    function updateCartCount() {
        if (cart.length > 0) {
            cartCount.textContent = cart.length;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
    }

    // Update cart display with animation
    function updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Keranjang kosong</div>';
            totalAmount.textContent = 'Rp 0';
            return;
        }

        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">Rp ${formatPrice(item.price)} / item</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1, event)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1, event)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="cart-item-subtotal">
                        Rp ${formatPrice(item.price * (item.quantity || 1))}
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index}, event)" title="Hapus item">×</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        totalAmount.textContent = `Rp ${formatPrice(total)}`;
    }

    // Ambil elemen yang diperlukan
    const cartButton = document.querySelector('.cart-button');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const closeCart = document.querySelector('.close-cart');
    const checkoutButton = document.querySelector('.checkout-button');

    // Toggle cart dropdown saat cart button diklik
    cartButton.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('hidden');
        updateCartDisplay();
    });

    // Tutup cart saat tombol close diklik
    closeCart.addEventListener('click', () => {
        cartDropdown.classList.add('hidden');
    });

    // Tutup cart saat klik di luar cart
    document.addEventListener('click', (e) => {
        if (!cartDropdown.contains(e.target) && !cartButton.contains(e.target)) {
            cartDropdown.classList.add('hidden');
        }
    });

    // Update removeFromCart function
    window.removeFromCart = function(index, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        cart.splice(index, 1);
        updateCartDisplay();
        updateCartCount();
        
        if (cart.length === 0) {
            const cartDropdown = document.querySelector('.cart-dropdown');
            cartDropdown.classList.add('hidden');
        }
    };

    // Update addToCart function
    window.addToCart = function(item) {
        const existingItemIndex = cart.findIndex(i => 
            i.name === item.name && 
            i.price === item.price && 
            i.type === item.type
        );

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        } else {
            cart.push({
                ...item,
                quantity: 1
            });
        }

        updateCartDisplay();
        updateCartCount();
        
        const cartDropdown = document.querySelector('.cart-dropdown');
        cartDropdown.classList.remove('hidden');
    };

    // Update updateQuantity function
    window.updateQuantity = function(index, change, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (!cart[index].quantity) {
            cart[index].quantity = 1;
        }
        
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity < 1) {
            removeFromCart(index, event);
            return;
        }
        
        cart[index].quantity = newQuantity;
        updateCartDisplay();
        updateCartCount();
    };

    // Event listener untuk tombol buy
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const name = card.querySelector('.diamonds').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            
            addToCart({
                name,
                price,
                type: 'diamond'
            });
        });
    });

    // Event listener untuk tombol checkout
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang masih kosong!');
            return;
        }
        checkoutModal.classList.remove('hidden');
        checkoutModal.classList.add('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle active section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const targetSection = link.textContent.toLowerCase().includes('joki') 
                ? document.getElementById('joki-section')
                : document.getElementById('diamond-section');
                
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Add to cart functionality for joki services
    const jokiButtons = document.querySelectorAll('#joki-section .buy-button');
    jokiButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.joki-card');
            const name = card.querySelector('.rank-details h3').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            
            addToCart({
                name,
                price,
                type: 'joki'
            });
        });
    });

    

    // Tambahkan animasi saat scroll ke card Mythic
    const mythicCards = document.querySelectorAll('.mythic-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    mythicCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });

    // Handle checkout process
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    const emptyCartModal = document.getElementById('emptyCartModal');
    const checkoutForm = document.getElementById('checkoutForm');
    
    // Close modals
    document.querySelectorAll('.close-modal, .close-success').forEach(button => {
        button.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            successModal.classList.remove('active');
            setTimeout(() => {
                checkoutModal.classList.add('hidden');
                successModal.classList.add('hidden');
            }, 300);
        });
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            userID: document.getElementById('userID').value,
            serverID: document.getElementById('serverID').value,
            nickname: document.getElementById('nickname').value,
            whatsapp: document.getElementById('whatsapp').value,
            payment: document.getElementById('payment').value
        };

        // Validate WhatsApp number
        const whatsappRegex = /^08[1-9][0-9]{7,11}$/;
        if (!whatsappRegex.test(formData.whatsapp)) {
            alert('Nomor WhatsApp tidak valid!');
            return;
        }

        // Close checkout modal and show success modal
        checkoutModal.classList.remove('active');
        setTimeout(() => {
            checkoutModal.classList.add('hidden');
            successModal.classList.remove('hidden');
            successModal.classList.add('active');
            
            // Reset cart
            cart = [];
            updateCartDisplay();
            
            // Reset form
            checkoutForm.reset();
        }, 300);
    });

    // Show appropriate modal on checkout button click
    document.querySelector('.checkout-button').addEventListener('click', () => {
        if (cart.length === 0) {
            // Show empty cart modal
            emptyCartModal.classList.remove('hidden');
            setTimeout(() => {
                emptyCartModal.classList.add('active');
            }, 10);
        } else {
            // Show checkout modal
            checkoutModal.classList.remove('hidden');
            setTimeout(() => {
                checkoutModal.classList.add('active');
            }, 10);
        }
    });

    // Close empty cart modal
    document.querySelector('.close-empty-cart').addEventListener('click', () => {
        emptyCartModal.classList.remove('active');
        setTimeout(() => {
            emptyCartModal.classList.add('hidden');
        }, 300);
    });

    // Close all modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            const modal = e.target;
            modal.classList.remove('active');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
    });

    // Prevent modal close when clicking modal content
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // Add animation when showing modals
    function showModal(modal) {
        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }

    // Add animation when hiding modals
    function hideModal(modal) {
        modal.classList.remove('active');
        modal.addEventListener('transitionend', () => {
            modal.classList.add('hidden');
        }, { once: true });
    }

    // Initial cart count update
    updateCartCount();

    // Perbaiki event handler untuk quantity buttons
    document.addEventListener('click', function(e) {
        // Mencegah event bubbling untuk quantity buttons
        if (e.target.closest('.quantity-btn') || e.target.closest('.remove-item')) {
            e.stopPropagation();
            return;
        }

        // Mencegah cart dropdown tertutup saat klik di dalam cart
        if (e.target.closest('.cart-dropdown')) {
            e.stopPropagation();
        }
    });

    // Detect touch capability
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    document.body.classList.toggle('touch-device', isTouchDevice);

    // Handle viewport height for mobile browsers
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    setVH();

    // Debounced window resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });

    // Lazy loading images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle network status
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    function updateNetworkStatus() {
        if (navigator.onLine) {
            document.body.classList.remove('offline');
        } else {
            document.body.classList.add('offline');
            alert('Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi.');
        }
    }

    // Add loading states to buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('quantity-btn')) {
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 500);
            }
        });
    });

    // Prevent double-tap zoom on touch devices
    if (isTouchDevice) {
        document.addEventListener('touchend', function(event) {
            const now = Date.now();
            const DOUBLE_TAP_THRESHOLD = 300;
            
            if (now - lastTap < DOUBLE_TAP_THRESHOLD) {
                event.preventDefault();
            }
            
            lastTap = now;
        }, false);
    }

    // Cart functionality
    const cartBackdrop = document.querySelector('.cart-backdrop');
    const closeCartButton = document.querySelector('.close-cart');

    // Fungsi toggle keranjang
    function toggleCart(event) {
        if (event) {
            event.stopPropagation();
        }
        
        const isOpen = cartDropdown.classList.contains('active');
        
        if (!isOpen) {
            // Buka keranjang
            cartDropdown.classList.add('active');
            cartBackdrop.classList.add('active');
            document.body.classList.add('cart-open');
        } else {
            // Tutup keranjang
            cartDropdown.classList.remove('active');
            cartBackdrop.classList.remove('active');
            document.body.classList.remove('cart-open');
        }
    }

    // Event listener untuk tombol keranjang
    cartButton.addEventListener('click', toggleCart);

    // Event listener untuk tombol tutup
    if (closeCartButton) {
        closeCartButton.addEventListener('click', toggleCart);
    }

    // Tutup keranjang saat klik backdrop
    cartBackdrop.addEventListener('click', toggleCart);

    // Tutup keranjang saat tekan ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartDropdown.classList.contains('active')) {
            toggleCart();
        }
    });

    // Mencegah keranjang tertutup saat klik di dalam keranjang
    cartDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// Add error handling
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
    // You could add user-friendly error notifications here
});

// Performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Defer non-critical operations
    setTimeout(() => {
        // Add any non-critical initialization here
    }, 1000);
});

// Reset cart count after checkout
function handleCheckout() {
    // Reset cart count to 0
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = '0';
        cartCount.style.display = 'none';
    }

    // Close cart dropdown
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartBackdrop = document.querySelector('.cart-backdrop');
    
    if (cartDropdown && cartBackdrop) {
        cartDropdown.classList.remove('active');
        cartBackdrop.classList.remove('active');
    }
}

// Add event listener to checkout button
document.querySelector('.checkout-button')?.addEventListener('click', handleCheckout);