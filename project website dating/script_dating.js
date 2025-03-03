// script_dating.js - DateSpot Indonesia Application

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const budgetOptions = document.querySelectorAll('.budget-option');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const searchButton = document.getElementById('searchButton');
    const loadingIndicator = document.getElementById('loading');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const sortDropdown = document.getElementById('sortDropdown');
    const mapContainer = document.getElementById('mapContainer');
    const geoButton = document.getElementById('geoButton');
    const locationInput = document.getElementById('location');
    const placeModal = document.getElementById('placeModal');
    const closeModal = document.getElementById('closeModal');
    const starRating = document.querySelectorAll('.star-rating i');
    
    let map;
    let markers = [];
    let userLocation = null;
    let selectedBudget = null;
    let selectedCategory = 'all';
    let currentResults = [];
    
    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (isDarkMode) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
        
        // Update map style if map is initialized
        if (map) {
            updateMapStyle(isDarkMode);
        }
    });
    
    // Load saved theme preference
    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Budget Option Selection
    budgetOptions.forEach(option => {
        option.addEventListener('click', function() {
            budgetOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedBudget = this.getAttribute('data-budget');
        });
    });
    
    // Category Filter Selection
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            categoryFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.getAttribute('data-category');
        });
    });
    
    // Geolocation Button
    geoButton.addEventListener('click', function() {
        if (navigator.geolocation) {
            loadingIndicator.classList.add('active');
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    
                    // Get address from coordinates
                    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`)
                        .then(response => response.json())
                        .then(data => {
                            locationInput.value = data.display_name;
                            loadingIndicator.classList.remove('active');
                            showToast('Lokasi ditemukan!', 'success');
                        })
                        .catch(error => {
                            console.error('Error fetching address:', error);
                            locationInput.value = `${userLocation.lat}, ${userLocation.lng}`;
                            loadingIndicator.classList.remove('active');
                        });
                },
                function(error) {
                    console.error('Geolocation error:', error);
                    loadingIndicator.classList.remove('active');
                    showToast('Gagal mendapatkan lokasi. Pastikan GPS Anda aktif.', 'error');
                }
            );
        } else {
            showToast('Browser Anda tidak mendukung geolocation.', 'error');
        }
    });
    
    // Search Button
    searchButton.addEventListener('click', function() {
        if (!locationInput.value) {
            showToast('Silakan masukkan lokasi Anda.', 'error');
            return;
        }
        
        loadingIndicator.classList.add('active');
        
        // Simulate API call with timeout
        setTimeout(() => {
            searchDateSpots();
        }, 1500);
    });
    
    // Search for date spots
    function searchDateSpots() {
        // Here you would typically fetch data from an API
        // For demonstration, we'll use mock data
        const mockData = getMockDateSpots();
        
        // Filter results based on selected criteria
        let filteredResults = mockData;
        
        if (selectedBudget) {
            filteredResults = filteredResults.filter(spot => spot.budget === selectedBudget);
        }
        
        if (selectedCategory !== 'all') {
            filteredResults = filteredResults.filter(spot => spot.category === selectedCategory);
        }
        
        // Sort results by distance (this would be calculated based on user location)
        filteredResults.sort((a, b) => a.distance - b.distance);
        
        currentResults = filteredResults;
        displayResults(filteredResults);
        
        loadingIndicator.classList.remove('active');
        resultsContainer.classList.add('active');
        mapContainer.classList.add('active');
        
        // Initialize map after results are displayed
        initMap();
    }
    
    // Display results in the grid
    function displayResults(results) {
        resultsGrid.innerHTML = '';
        resultsCount.textContent = results.length;
        
        if (results.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 1rem;"></i>
                    <h3>Tidak ada tempat kencan ditemukan</h3>
                    <p>Coba ubah filter pencarian Anda</p>
                </div>
            `;
            return;
        }
        
        results.forEach((spot, index) => {
            const card = createDateCard(spot, index);
            resultsGrid.appendChild(card);
            
            // Add delay for animation
            setTimeout(() => {
                card.style.animationDelay = `${index * 0.1}s`;
            }, 0);
        });
    }
    
    // Create a date card element
    function createDateCard(spot, index) {
        const card = document.createElement('div');
        card.className = 'date-card';
        card.setAttribute('data-index', index);
        
        let budgetLabel = '';
        switch(spot.budget) {
            case 'low': budgetLabel = 'Budget'; break;
            case 'medium': budgetLabel = 'Medium'; break;
            case 'high': budgetLabel = 'Premium'; break;
        }
        
        let categoryLabel = spot.category.charAt(0).toUpperCase() + spot.category.slice(1);
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${spot.image}" alt="${spot.name}">
                <div class="card-budget">${budgetLabel}</div>
                <div class="card-category">${categoryLabel}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${spot.name}</h3>
                <div class="card-location">
                    <i class="fas fa-map-marker-alt"></i> ${spot.location}
                </div>
                <div class="card-details">
                    <div class="card-rating">
                        <i class="fas fa-star"></i> ${spot.rating.toFixed(1)}
                    </div>
                    <div class="card-distance">${spot.distance.toFixed(1)} km</div>
                </div>
                <div class="card-action">
                    <button class="view-button" data-index="${index}">Lihat Detail</button>
                    <button class="share-button" data-index="${index}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener for the view button
        card.querySelector('.view-button').addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            openPlaceModal(currentResults[index]);
        });
        
        // Add event listener for the share button
        card.querySelector('.share-button').addEventListener('click', function(e) {
            e.stopPropagation();
            const index = this.getAttribute('data-index');
            sharePlace(currentResults[index]);
        });
        
        return card;
    }
    
    // Sort results
    sortDropdown.addEventListener('change', function() {
        const sortBy = this.value;
        
        switch(sortBy) {
            case 'distance':
                currentResults.sort((a, b) => a.distance - b.distance);
                break;
            case 'rating':
                currentResults.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                const budgetOrder = { 'low': 1, 'medium': 2, 'high': 3 };
                currentResults.sort((a, b) => budgetOrder[a.budget] - budgetOrder[b.budget]);
                break;
            case 'price-high':
                const budgetOrderReverse = { 'low': 3, 'medium': 2, 'high': 1 };
                currentResults.sort((a, b) => budgetOrderReverse[a.budget] - budgetOrderReverse[b.budget]);
                break;
        }
        
        displayResults(currentResults);
        updateMapMarkers();
    });
    
    // Initialize map
    function initMap() {
        if (map) {
            map.remove();
        }
        
        map = L.map('map').setView([-6.2088, 106.8456], 12); // Default to Jakarta
        
        // Check if dark mode is active
        const isDarkMode = document.body.classList.contains('dark-mode');
        updateMapStyle(isDarkMode);
        
        // Add markers for each result
        addMapMarkers();
        
        // If user location is available, center map on it
        if (userLocation) {
            map.setView([userLocation.lat, userLocation.lng], 13);
            
            // Add user location marker
            L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                    className: 'user-location-marker',
                    html: '<i class="fas fa-map-marker-alt" style="color: #ff4b7a; font-size: 2rem;"></i>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map)
            .bindPopup('Lokasi Anda')
            .openPopup();
        }
    }
    
    // Update map style based on theme
    function updateMapStyle(isDarkMode) {
        if (!map) return;
        
        // Remove existing tile layers
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                map.removeLayer(layer);
            }
        });
        
        // Add appropriate tile layer based on theme
        if (isDarkMode) {
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }).addTo(map);
        } else {
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        }
    }
    
    // Add markers to the map
    function addMapMarkers() {
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Add new markers
        currentResults.forEach((spot, index) => {
            const marker = L.marker([spot.latitude, spot.longitude], {
                icon: L.divIcon({
                    className: 'date-spot-marker',
                    html: `<div class="map-marker" style="background-color: var(--primary-color);">${index + 1}</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                })
            }).addTo(map);
            
            marker.bindPopup(`
                <div class="map-popup">
                    <h3>${spot.name}</h3>
                    <p>${spot.location}</p>
                    <div class="popup-rating">
                        <i class="fas fa-star"></i> ${spot.rating.toFixed(1)}
                    </div>
                    <button class="popup-button" onclick="openModalFromMap(${index})">Lihat Detail</button>
                </div>
            `);
            
            markers.push(marker);
        });
    }
    
    // Update map markers after sorting
    function updateMapMarkers() {
        // Clear existing markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        
        // Add updated markers
        addMapMarkers();
    }
    
    // Open place modal from map
    window.openModalFromMap = function(index) {
        openPlaceModal(currentResults[index]);
    };
    
    // Open place modal
    function openPlaceModal(place) {
        const modalPlaceTitle = document.getElementById('modalPlaceTitle');
        const placeGallery = document.getElementById('placeGallery');
        const modalPlaceLocation = document.getElementById('modalPlaceLocation');
        const modalPlacePrice = document.getElementById('modalPlacePrice');
        const modalPlaceHours = document.getElementById('modalPlaceHours');
        const modalPlaceContact = document.getElementById('modalPlaceContact');
        const modalPlaceWebsite = document.getElementById('modalPlaceWebsite');
        const modalPlaceDescription = document.getElementById('modalPlaceDescription');
        const reviewsContainer = document.getElementById('reviewsContainer');
        
        // Set modal content
        modalPlaceTitle.textContent = place.name;
        modalPlaceLocation.textContent = place.location;
        
        let priceRange = '';
        switch(place.budget) {
            case 'low': priceRange = '< Rp100.000'; break;
            case 'medium': priceRange = 'Rp100.000 - Rp500.000'; break;
            case 'high': priceRange = '> Rp500.000'; break;
        }
        modalPlacePrice.textContent = priceRange;
        
        modalPlaceHours.textContent = place.hours || 'Tidak tersedia';
        modalPlaceContact.textContent = place.contact || 'Tidak tersedia';
        
        if (place.website) {
            modalPlaceWebsite.innerHTML = `<a href="${place.website}" target="_blank">${place.website}</a>`;
        } else {
            modalPlaceWebsite.textContent = 'Tidak tersedia';
        }
        
        modalPlaceDescription.textContent = place.description || 'Tidak ada deskripsi tersedia.';
        
        // Setup gallery
        placeGallery.innerHTML = '';
        const gallery = place.gallery || [place.image];
        gallery.forEach(img => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${img}" alt="${place.name}">`;
            placeGallery.appendChild(galleryItem);
        });
        
        // Setup reviews
        reviewsContainer.innerHTML = '';
        if (place.reviews && place.reviews.length > 0) {
            place.reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.className = 'review-item';
                
                // Generate stars
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    stars += `<i class="fas fa-star${i <= review.rating ? '' : '-o'}"></i>`;
                }
                
                reviewItem.innerHTML = `
                    <div class="review-header">
                        <div class="reviewer">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                    <div class="review-rating">${stars}</div>
                    <div class="review-text">${review.text}</div>
                `;
                
                reviewsContainer.appendChild(reviewItem);
            });
        } else {
            reviewsContainer.innerHTML = '<p>Belum ada ulasan untuk tempat ini.</p>';
        }
        
        // Show modal
        placeModal.classList.add('active');
    }
    
    // Close modal
    closeModal.addEventListener('click', function() {
        placeModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === placeModal) {
            placeModal.classList.remove('active');
        }
    });
    
    // Star rating functionality
    let currentRating = 0;
    
    starRating.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('mouseout', function() {
            highlightStars(currentRating);
        });
        
        star.addEventListener('click', function() {
            currentRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(currentRating);
        });
    });
    
    function highlightStars(count) {
        starRating.forEach(star => {
            const rating = parseInt(star.getAttribute('data-rating'));
            if (rating <= count) {
                star.classList.remove('far');
                star.classList.add('fas');
                star.classList.add('active');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
                star.classList.remove('active');
            }
        });
    }
    
    // Share functionality
    function sharePlace(place) {
        // Here you would implement sharing functionality
        // For demonstration, we'll just show a toast
        showToast(`Bagikan: ${place.name}`, 'success');
        
        // You could implement a proper share modal or use the Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: place.name,
                text: `Tempat kencan di ${place.location}`,
                url: window.location.href
            })
            .then(() => console.log('Shared successfully'))
            .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback for browsers that don't support the Web Share API
            // You could show a custom share modal here
            showToast('Fitur berbagi belum tersedia di browser Anda.', 'error');
        }
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('active');
        }, 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    // Back to top button
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Mock data function
    function getMockDateSpots() {
        return [
            {
                id: 1,
                name: 'Kafe Bunga Rampai',
                location: 'Menteng, Jakarta Pusat',
                category: 'cafe',
                budget: 'medium',
                rating: 4.7,
                distance: 2.3,
                latitude: -6.1956,
                longitude: 106.8372,
                image: '/api/placeholder/600/400',
                gallery: [
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400'
                ],
                hours: 'Senin - Minggu: 10:00 - 22:00',
                contact: '+62-21-31926757',
                website: 'https://kafebungarampai.com',
                description: 'Kafe dengan suasana kolonial yang romantis, cocok untuk kencan santai dengan hidangan Indonesia dan Eropa yang lezat.',
                reviews: [
                    {
                        name: 'Dian Sastro',
                        date: '20 Februari 2025',
                        rating: 5,
                        text: 'Tempat yang sangat romantis dengan makanan lezat. Suasananya nostalgik dan pelayanannya ramah. Sangat direkomendasikan untuk kencan spesial!'
                    },
                    {
                        name: 'Reza Rahadian',
                        date: '15 Februari 2025',
                        rating: 4,
                        text: 'Ambience-nya cozy dan makanannya enak. Sedikit ramai di akhir pekan, jadi lebih baik reservasi dulu.'
                    }
                ]
            },
            {
                id: 2,
                name: 'Pantai Ancol',
                location: 'Jakarta Utara',
                category: 'beach',
                budget: 'low',
                rating: 4.2,
                distance: 5.7,
                latitude: -6.1145,
                longitude: 106.8450,
                image: '/api/placeholder/600/400',
                gallery: [
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400'
                ],
                hours: 'Setiap hari: 06:00 - 18:00',
                contact: '+62-21-29222222',
                website: 'https://ancol.com',
                description: 'Nikmati sunset romantis di pinggir pantai, dengan berbagai aktivitas pantai dan kuliner seafood yang lezat.',
                reviews: [
                    {
                        name: 'Raisa Andriana',
                        date: '10 Februari 2025',
                        rating: 4,
                        text: 'Tempatnya bagus untuk kencan saat sunset. Jangan lupa bawa kamera untuk mengabadikan momen spesial!'
                    }
                ]
            },
            {
                id: 3,
                name: 'Restoran Plataran Menteng',
                location: 'Menteng, Jakarta Pusat',
                category: 'restaurant',
                budget: 'high',
                rating: 4.8,
                distance: 3.1,
                latitude: -6.2010,
                longitude: 106.8391,
                image: '/api/placeholder/600/400',
                gallery: [
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400'
                ],
                hours: 'Senin - Minggu: 11:00 - 23:00',
                contact: '+62-21-29962864',
                website: 'https://plataran.com',
                description: 'Restoran mewah dengan sentuhan arsitektur tradisional Indonesia. Sajian kuliner khas nusantara dengan tampilan modern.',
                reviews: [
                    {
                        name: 'Nicholas Saputra',
                        date: '5 Februari 2025',
                        rating: 5,
                        text: 'Tempat yang sempurna untuk kencan spesial. Makanan luar biasa dan suasana yang elegan. Layak untuk harganya.'
                    }
                ]
            },
            {
                id: 4,
                name: 'Taman Suropati',
                location: 'Menteng, Jakarta Pusat',
                category: 'park',
                budget: 'low',
                rating: 4.5,
                distance: 2.8,
                latitude: -6.2039,
                longitude: 106.8350,
                image: '/api/placeholder/600/400',
                gallery: [
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400'
                ],
                hours: 'Setiap hari: 06:00 - 18:00',
                contact: 'Tidak tersedia',
                website: '',
                description: 'Taman kota yang asri dan romantis dengan banyak spot foto menarik. Ideal untuk kencan piknik santai di sore hari.',
                reviews: [
                    {
                        name: 'Putri Marino',
                        date: '1 Februari 2025',
                        rating: 4,
                        text: 'Taman yang tenang dan bersih, cocok untuk mengobrol santai dan mengenal pasangan lebih dekat.'
                    }
                ]
            },
            {
                id: 5,
                name: 'Grand Indonesia Shopping Town',
                location: 'Thamrin, Jakarta Pusat',
                category: 'mall',
                budget: 'medium',
                rating: 4.6,
                distance: 1.9,
                latitude: -6.1951,
                longitude: 106.8210,
                image: '/api/placeholder/600/400',
                gallery: [
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400'
                ],
                hours: 'Senin - Minggu: 10:00 - 22:00',
                contact: '+62-21-23581999',
                website: 'https://grand-indonesia.com',
                description: 'Pusat perbelanjaan mewah dengan berbagai pilihan restoran, bioskop, dan area permainan untuk kencan seru.',
                reviews: [
                    {
                        name: 'Adipati Dolken',
                        date: '25 Januari 2025',
                        rating: 5,
                        text: 'Banyak opsi untuk kencan, mulai dari nonton film, makan di restoran bagus, sampai shopping bareng. Recommended!'
                    }
                ]
            },
            {
                id: 6,
                name: 'Escape Room Jakarta',
                location: 'Kemang, Jakarta Selatan',
                category: 'activity',
                budget: 'medium',
                rating: 4.7,
                distance: 6.2,
                latitude: -6.2604,
                longitude: 106.8131,
                image: '/api/placeholder/600/400',
                gallery: [
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400',
                    '/api/placeholder/600/400'
                ],
                hours: 'Senin - Minggu: 10:00 - 22:00',
                contact: '+62-21-27090175',
                website: 'https://escaperoomjakarta.com',
                description: 'Aktivitas seru memecahkan teka-teki dan kabur dari ruangan dalam batas waktu tertentu. Cocok untuk menguji kekompakan pasangan.',
                reviews: [
                    {
                        name: 'Deva Mahenra',
                        date: '20 Januari 2025',
                        rating: 5,
                        text: 'Pengalaman seru untuk kencan! Kamu bisa melihat bagaimana pasanganmu berpikir dan bekerja sama. Sangat menyenangkan!'
                    }
                ]
            }
        ];
    }
    
    // Initialize the application
    loadThemePreference();
    
    // Add active state to the first category button by default
    categoryFilters[0].classList.add('active');
});