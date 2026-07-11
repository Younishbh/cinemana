// Main Application Logic - منطق التطبيق الرئيسي

// DOM Elements
const trendingGrid = document.getElementById('trendingGrid');
const moviesGrid = document.getElementById('moviesGrid');
const seriesGrid = document.getElementById('seriesGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('detailsModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close');

// State
let currentFilter = 'all';
let filteredContent = contentData;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    displayAllContent();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn));
    });

    // Search
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Modal
    closeBtn.addEventListener('click', () => closeModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Filter Handler
function handleFilterChange(btn) {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    displayAllContent();
}

// Display All Content
function displayAllContent() {
    let toDisplay = contentData;

    if (currentFilter !== 'all') {
        if (currentFilter === 'trending') {
            toDisplay = contentData.filter(item => item.trending === true);
        } else {
            toDisplay = contentData.filter(item => item.type === currentFilter);
        }
    }

    // Display Trending
    const trending = contentData.filter(item => item.trending === true);
    displayCards(trendingGrid, trending);

    // Display Movies
    const movies = contentData.filter(item => item.type === 'movie');
    displayCards(moviesGrid, movies);

    // Display Series
    const series = contentData.filter(item => item.type === 'series');
    displayCards(seriesGrid, series);
}

// Display Cards in Grid
function displayCards(gridElement, items) {
    gridElement.innerHTML = '';

    items.forEach(item => {
        const card = createCard(item);
        gridElement.appendChild(card);
    });

    if (items.length === 0) {
        gridElement.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0;">لا توجد نتائج</p>';
    }
}

// Create Card Element
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';

    const typeLabel = item.type === 'movie' ? '🎬 فيلم' : '📺 مسلسل';

    card.innerHTML = `
        <div class="card-image">
            ${item.image}
            <div class="card-overlay">
                <span>👁️</span>
            </div>
        </div>
        <div class="card-body">
            <span class="card-type">${typeLabel}</span>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-info">
                <strong>السنة:</strong> ${item.year}
            </div>
            <div class="card-info">
                <strong>النوع:</strong> ${item.genre}
            </div>
            <div class="card-rating">
                <span class="stars">★★★★★</span>
                <span class="rating-text">${item.rating}/10</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => showDetails(item));
    return card;
}

// Show Details Modal
function showDetails(item) {
    let detailsHTML = `
        <h2>${item.title}</h2>
        <div class="detail-item">
            <span class="detail-label">النوع:</span> ${item.type === 'movie' ? '🎬 فيلم' : '📺 مسلسل'}
        </div>
        <div class="detail-item">
            <span class="detail-label">الوصف:</span> ${item.description}
        </div>
        <div class="detail-item">
            <span class="detail-label">سنة الإصدار:</span> ${item.year}
        </div>
        <div class="detail-item">
            <span class="detail-label">النوع الفني:</span> ${item.genre}
        </div>
        <div class="detail-item">
            <span class="detail-label">التقييم:</span> ⭐ ${item.rating}/10
        </div>
        <div class="detail-item">
            <span class="detail-label">المخرج:</span> ${item.director}
        </div>
        <div class="detail-item">
            <span class="detail-label">الممثلون:</span> ${item.cast}
        </div>
    `;

    if (item.type === 'movie') {
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">مدة العرض:</span> ${item.duration}
            </div>
        `;
    } else {
        detailsHTML += `
            <div class="detail-item">
                <span class="detail-label">عدد المواسم:</span> ${item.seasons}
            </div>
            <div class="detail-item">
                <span class="detail-label">عدد الحلقات:</span> ${item.episodes}
            </div>
        `;
    }

    modalBody.innerHTML = detailsHTML;
    modal.classList.add('show');
}

// Close Modal
function closeModal() {
    modal.classList.remove('show');
}

// Search Handler
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm === '') {
        displayAllContent();
        return;
    }

    filteredContent = contentData.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.genre.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );

    // Display search results in trending grid (for simplicity)
    trendingGrid.innerHTML = '<h3 style="grid-column: 1/-1;">نتائج البحث:</h3>';
    displayCards(trendingGrid, filteredContent);
    
    // Clear other grids when searching
    moviesGrid.innerHTML = '';
    seriesGrid.innerHTML = '';

    if (filteredContent.length === 0) {
        trendingGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0;">لا توجد نتائج بحث</p>';
    }

    searchInput.value = '';
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
