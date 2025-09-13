// Global variables
let map;
let minimap;
let markerClusterGroup;
let currentPOIs = [];
let savedPOIs = new Set();
let currentSheetHeight = 'small'; // small, medium, large
let currentTab = 'current';
let isInitialized = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    showLoading();
    
    // Initialize maps
    setTimeout(() => {
        initializeMap();
        initializeMinimap();
        initializeBottomSheet();
        initializeTabs();
        initializeEventListeners();
        
        // Load saved POIs from localStorage
        loadSavedPOIs();
        
        // Initial data load
        updateCurrentPOIs();
        updateAllCountriesList();
        updateSavedPOIsList();
        
        hideLoading();
        isInitialized = true;
    }, 1000);
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Map Initialization
function initializeMap() {
    // Initialize main map with dark theme
    map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: true
    });

    // Add dark theme tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        className: 'dark-tiles'
    }).addTo(map);

    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 50,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let className = 'marker-cluster-small';
            
            if (count > 20) {
                className = 'marker-cluster-large';
            } else if (count > 10) {
                className = 'marker-cluster-medium';
            }
            
            return new L.DivIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster ${className}`,
                iconSize: new L.Point(40, 40)
            });
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });

    map.addLayer(markerClusterGroup);

    // Add POI markers
    addPOIMarkers();

    // Map event listeners
    map.on('moveend', function() {
        updateCurrentPOIs();
        updateMinimapViewport();
    });

    map.on('zoomend', function() {
        updateCurrentPOIs();
        updateMinimapViewport();
    });
}

function initializeMinimap() {
    // Initialize minimap
    minimap = L.map('minimap', {
        center: [20, 0],
        zoom: 1,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
    });

    // Add tile layer to minimap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'dark-tiles'
    }).addTo(minimap);

    // Add viewport indicator
    updateMinimapViewport();
}

function updateMinimapViewport() {
    if (!map || !minimap) return;
    
    // Clear existing viewport indicators
    minimap.eachLayer(function(layer) {
        if (layer.options && layer.options.isViewport) {
            minimap.removeLayer(layer);
        }
    });

    const bounds = map.getBounds();
    const center = map.getCenter();
    
    // Add continent indicator (larger rectangle)
    const continent = getCurrentContinent(center);
    if (continent && CONTINENT_BOUNDS[continent]) {
        const continentBounds = CONTINENT_BOUNDS[continent];
        const continentRect = L.rectangle([
            [continentBounds.south, continentBounds.west],
            [continentBounds.north, continentBounds.east]
        ], {
            color: '#4a9eff',
            weight: 2,
            fillOpacity: 0.1,
            isViewport: true
        }).addTo(minimap);
    }
    
    // Add current viewport indicator (smaller rectangle)
    const viewportRect = L.rectangle(bounds, {
        color: '#ff6b6b',
        weight: 2,
        fillOpacity: 0.2,
        isViewport: true
    }).addTo(minimap);
}

function getCurrentContinent(latlng) {
    const lat = latlng.lat;
    const lng = latlng.lng;
    
    for (const [continent, bounds] of Object.entries(CONTINENT_BOUNDS)) {
        if (lat >= bounds.south && lat <= bounds.north && 
            lng >= bounds.west && lng <= bounds.east) {
            return continent;
        }
    }
    return null;
}

// POI Markers
function addPOIMarkers() {
    markerClusterGroup.clearLayers();
    
    SAMPLE_POIS.forEach(poi => {
        const marker = createPOIMarker(poi);
        markerClusterGroup.addLayer(marker);
    });
}

function createPOIMarker(poi) {
    const icon = L.divIcon({
        className: `poi-marker ${poi.type.id}`,
        html: poi.type.icon,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });

    const marker = L.marker([poi.lat, poi.lng], { icon });
    
    const popupContent = createPopupContent(poi);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'poi-popup-container'
    });

    // Store POI data in marker
    marker.poiData = poi;

    return marker;
}

function createPopupContent(poi) {
    const isSaved = savedPOIs.has(poi.id);
    const heartClass = isSaved ? 'saved' : '';
    const heartIcon = isSaved ? 'fas fa-heart' : 'far fa-heart';

    return `
        <div class="poi-popup">
            <h3>${poi.name}</h3>
            <span class="poi-type">${poi.type.name}</span>
            <div class="poi-location">${poi.city}, ${poi.country}</div>
            <p>${poi.description}</p>
            <div class="poi-rating">⭐ ${poi.rating}/5</div>
            <div class="poi-actions">
                <button class="btn btn-save ${heartClass}" onclick="toggleSavePOI('${poi.id}', this)">
                    <i class="${heartIcon}"></i>
                    ${isSaved ? 'Saved' : 'Save'}
                </button>
                <button class="btn btn-navigate" onclick="navigateToPOI(${poi.lat}, ${poi.lng})">
                    <i class="fas fa-directions"></i>
                    Navigate
                </button>
            </div>
        </div>
    `;
}

// Bottom Sheet Functionality
function initializeBottomSheet() {
    const bottomSheet = document.getElementById('bottom-sheet');
    const handle = document.querySelector('.bottom-sheet-handle');
    
    let startY = 0;
    let startHeight = 0;
    let isDragging = false;

    // Mouse events
    handle.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events
    handle.addEventListener('touchstart', startDragTouch, { passive: false });
    document.addEventListener('touchmove', dragTouch, { passive: false });
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        isDragging = true;
        startY = e.clientY;
        startHeight = getSheetHeightValue();
        document.body.style.userSelect = 'none';
    }

    function startDragTouch(e) {
        e.preventDefault();
        isDragging = true;
        startY = e.touches[0].clientY;
        startHeight = getSheetHeightValue();
        document.body.style.userSelect = 'none';
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentY = e.clientY;
        const deltaY = startY - currentY;
        const newHeight = Math.max(0, Math.min(100, startHeight + (deltaY / window.innerHeight * 100)));
        
        setSheetHeight(newHeight);
    }

    function dragTouch(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        const newHeight = Math.max(0, Math.min(100, startHeight + (deltaY / window.innerHeight * 100)));
        
        setSheetHeight(newHeight);
    }

    function endDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        document.body.style.userSelect = '';
        
        // Snap to nearest height level
        const currentHeight = getSheetHeightValue();
        if (currentHeight < 25) {
            setSheetHeightLevel('small');
        } else if (currentHeight < 75) {
            setSheetHeightLevel('medium');
        } else {
            setSheetHeightLevel('large');
        }
    }

    // Click to cycle through heights
    handle.addEventListener('click', function() {
        if (!isDragging) {
            cycleSheetHeight();
        }
    });
}

function getSheetHeightValue() {
    switch (currentSheetHeight) {
        case 'small': return 10;
        case 'medium': return 50;
        case 'large': return 90;
        default: return 10;
    }
}

function setSheetHeight(percentage) {
    const bottomSheet = document.getElementById('bottom-sheet');
    bottomSheet.style.transform = `translateY(${100 - percentage}%)`;
}

function setSheetHeightLevel(level) {
    currentSheetHeight = level;
    const bottomSheet = document.getElementById('bottom-sheet');
    
    // Remove existing height classes
    bottomSheet.classList.remove('height-small', 'height-medium', 'height-large');
    bottomSheet.classList.add(`height-${level}`);
}

function cycleSheetHeight() {
    const heights = ['small', 'medium', 'large'];
    const currentIndex = heights.indexOf(currentSheetHeight);
    const nextIndex = (currentIndex + 1) % heights.length;
    setSheetHeightLevel(heights[nextIndex]);
}

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });

    // Initialize alphabet index for "All" tab
    initializeAlphabetIndex();
}

function switchTab(tabId) {
    currentTab = tabId;
    
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabId}-tab`).classList.add('active');
    
    // Update content based on tab
    switch (tabId) {
        case 'current':
            updateCurrentPOIs();
            break;
        case 'all':
            updateAllCountriesList();
            break;
        case 'saved':
            updateSavedPOIsList();
            break;
    }
}

// Current POIs Tab
function updateCurrentPOIs() {
    if (!map || !isInitialized) return;
    
    const bounds = map.getBounds();
    const center = map.getCenter();
    
    // Filter POIs within current viewport
    const visiblePOIs = SAMPLE_POIS.filter(poi => {
        return bounds.contains([poi.lat, poi.lng]);
    });
    
    // Sort by distance from center
    visiblePOIs.sort((a, b) => {
        const distA = calculateDistance(center.lat, center.lng, a.lat, a.lng);
        const distB = calculateDistance(center.lat, center.lng, b.lat, b.lng);
        return distA - distB;
    });
    
    currentPOIs = visiblePOIs;
    
    // Update count
    document.getElementById('current-count').textContent = `${visiblePOIs.length} places`;
    
    // Update list
    const listContainer = document.getElementById('current-list');
    listContainer.innerHTML = '';
    
    visiblePOIs.forEach(poi => {
        const distance = calculateDistance(center.lat, center.lng, poi.lat, poi.lng);
        const listItem = createPOIListItem(poi, distance);
        listContainer.appendChild(listItem);
    });
}

function createPOIListItem(poi, distance = null) {
    const item = document.createElement('div');
    item.className = 'poi-item';
    
    const isSaved = savedPOIs.has(poi.id);
    const heartClass = isSaved ? 'saved' : '';
    const heartIcon = isSaved ? 'fas fa-heart' : 'far fa-heart';
    
    item.innerHTML = `
        <h4>
            ${poi.type.icon} ${poi.name}
            <span class="poi-type-badge">${poi.type.name}</span>
        </h4>
        <div class="poi-location">${poi.city}, ${poi.country}</div>
        ${distance ? `<div class="poi-distance">${formatDistance(distance)} away</div>` : ''}
        <div class="poi-actions">
            <button class="btn-heart ${heartClass}" onclick="toggleSavePOI('${poi.id}', this)">
                <i class="${heartIcon}"></i>
            </button>
        </div>
    `;
    
    // Click to zoom to POI
    item.addEventListener('click', function(e) {
        if (!e.target.closest('.poi-actions')) {
            map.setView([poi.lat, poi.lng], 15);
            
            // Find and open the marker popup
            markerClusterGroup.eachLayer(function(layer) {
                if (layer.poiData && layer.poiData.id === poi.id) {
                    layer.openPopup();
                }
            });
        }
    });
    
    return item;
}

// All Countries Tab
function initializeAlphabetIndex() {
    const alphabetContainer = document.getElementById('alphabet-index');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let letter of alphabet) {
        const button = document.createElement('button');
        button.className = 'alphabet-letter';
        button.textContent = letter;
        button.addEventListener('click', function() {
            scrollToAlphabetSection(letter);
        });
        alphabetContainer.appendChild(button);
    }
}

function updateAllCountriesList() {
    const listContainer = document.getElementById('all-list');
    listContainer.innerHTML = '';
    
    const countries = getCountriesSorted();
    let currentLetter = '';
    
    countries.forEach(country => {
        const firstLetter = country.charAt(0).toUpperCase();
        
        // Add section header if needed
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            const sectionHeader = document.createElement('div');
            sectionHeader.className = 'country-section';
            sectionHeader.innerHTML = `<h5 id="section-${firstLetter}">${firstLetter}</h5>`;
            listContainer.appendChild(sectionHeader);
        }
        
        // Add country item
        const countryData = COUNTRIES_DATA[country];
        const countryItem = document.createElement('div');
        countryItem.className = 'country-item';
        countryItem.innerHTML = `
            <div class="country-name">${country}</div>
            <div class="poi-count">${countryData.pois.length} places</div>
        `;
        
        countryItem.addEventListener('click', function() {
            showCountryPOIs(country);
        });
        
        listContainer.appendChild(countryItem);
    });
}

function scrollToAlphabetSection(letter) {
    const section = document.getElementById(`section-${letter}`);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Highlight the letter
        document.querySelectorAll('.alphabet-letter').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

function showCountryPOIs(country) {
    const countryPOIs = getPOIsByCountry(country);
    if (countryPOIs.length > 0) {
        // Calculate bounds for all POIs in the country
        const group = new L.featureGroup(countryPOIs.map(poi => 
            L.marker([poi.lat, poi.lng])
        ));
        map.fitBounds(group.getBounds().pad(0.1));
        
        // Switch to current tab to show the POIs
        switchTab('current');
        setSheetHeightLevel('medium');
    }
}

// Saved POIs Tab
function loadSavedPOIs() {
    const saved = localStorage.getItem('savedPOIs');
    if (saved) {
        savedPOIs = new Set(JSON.parse(saved));
    }
}

function savePOIsToStorage() {
    localStorage.setItem('savedPOIs', JSON.stringify([...savedPOIs]));
}

function updateSavedPOIsList() {
    const listContainer = document.getElementById('saved-list');
    const savedArray = [...savedPOIs].map(id => getPOIById(id)).filter(poi => poi);
    
    // Update count
    document.getElementById('saved-count').textContent = `${savedArray.length} saved`;
    
    listContainer.innerHTML = '';
    
    if (savedArray.length === 0) {
        listContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="far fa-heart" style="font-size: 48px; margin-bottom: 16px;"></i>
                <div>No saved places yet</div>
                <div style="font-size: 14px; margin-top: 8px;">Save places by clicking the heart icon</div>
            </div>
        `;
        return;
    }
    
    savedArray.forEach(poi => {
        const listItem = createPOIListItem(poi);
        listContainer.appendChild(listItem);
    });
}

// Save/Unsave POI functionality
function toggleSavePOI(poiId, buttonElement) {
    if (savedPOIs.has(poiId)) {
        savedPOIs.delete(poiId);
    } else {
        savedPOIs.add(poiId);
    }
    
    savePOIsToStorage();
    
    // Update button appearance
    updateSaveButton(buttonElement, savedPOIs.has(poiId));
    
    // Update saved list if it's currently visible
    if (currentTab === 'saved') {
        updateSavedPOIsList();
    }
    
    // Update all markers' popups
    updateAllMarkerPopups();
}

function updateSaveButton(button, isSaved) {
    const icon = button.querySelector('i');
    
    if (isSaved) {
        button.classList.add('saved');
        icon.className = 'fas fa-heart';
        if (button.classList.contains('btn-save')) {
            button.innerHTML = '<i class="fas fa-heart"></i> Saved';
        }
    } else {
        button.classList.remove('saved');
        icon.className = 'far fa-heart';
        if (button.classList.contains('btn-save')) {
            button.innerHTML = '<i class="far fa-heart"></i> Save';
        }
    }
}

function updateAllMarkerPopups() {
    markerClusterGroup.eachLayer(function(layer) {
        if (layer.poiData) {
            const popupContent = createPopupContent(layer.poiData);
            layer.setPopupContent(popupContent);
        }
    });
}

// Navigation functionality
function navigateToPOI(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// Event Listeners
function initializeEventListeners() {
    // Window resize handler
    window.addEventListener('resize', function() {
        if (map) map.invalidateSize();
        if (minimap) minimap.invalidateSize();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            setSheetHeightLevel('small');
        }
        if (e.key === ' ' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            cycleSheetHeight();
        }
    });
}

// Performance optimizations
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to expensive operations
const debouncedUpdateCurrentPOIs = debounce(updateCurrentPOIs, 300);
const debouncedUpdateMinimap = debounce(updateMinimapViewport, 300);

// Replace direct calls with debounced versions for better performance
if (typeof map !== 'undefined') {
    map.off('moveend').on('moveend', debouncedUpdateCurrentPOIs);
    map.off('zoomend').on('zoomend', debouncedUpdateCurrentPOIs);
}