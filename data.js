// POI Data Structure and Sample Data
const POI_TYPES = {
    RESTAURANT: { id: 'restaurant', name: 'Restaurant', icon: '🍽️', color: '#ff6b6b' },
    HOTEL: { id: 'hotel', name: 'Hotel', icon: '🏨', color: '#4ecdc4' },
    ATTRACTION: { id: 'attraction', name: 'Attraction', icon: '🎯', color: '#ffe66d' },
    MUSEUM: { id: 'museum', name: 'Museum', icon: '🏛️', color: '#a8e6cf' },
    PARK: { id: 'park', name: 'Park', icon: '🌳', color: '#88d8b0' },
    SHOPPING: { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#dda0dd' },
    BEACH: { id: 'beach', name: 'Beach', icon: '🏖️', color: '#87ceeb' },
    TEMPLE: { id: 'temple', name: 'Temple', icon: '⛩️', color: '#f0e68c' }
};

// Sample POI data with popular travel destinations
const SAMPLE_POIS = [
    // Paris, France
    {
        id: 'eiffel-tower',
        name: 'Eiffel Tower',
        type: POI_TYPES.ATTRACTION,
        lat: 48.8584,
        lng: 2.2945,
        country: 'France',
        city: 'Paris',
        description: 'Iconic iron lattice tower and symbol of Paris',
        rating: 4.6
    },
    {
        id: 'louvre-museum',
        name: 'Louvre Museum',
        type: POI_TYPES.MUSEUM,
        lat: 48.8606,
        lng: 2.3376,
        country: 'France',
        city: 'Paris',
        description: 'World\'s largest art museum and historic monument',
        rating: 4.5
    },
    {
        id: 'notre-dame',
        name: 'Notre-Dame Cathedral',
        type: POI_TYPES.ATTRACTION,
        lat: 48.8530,
        lng: 2.3499,
        country: 'France',
        city: 'Paris',
        description: 'Medieval Catholic cathedral on the Île de la Cité',
        rating: 4.4
    },
    
    // Tokyo, Japan
    {
        id: 'senso-ji',
        name: 'Senso-ji Temple',
        type: POI_TYPES.TEMPLE,
        lat: 35.7148,
        lng: 139.7967,
        country: 'Japan',
        city: 'Tokyo',
        description: 'Ancient Buddhist temple in Asakusa district',
        rating: 4.3
    },
    {
        id: 'tokyo-skytree',
        name: 'Tokyo Skytree',
        type: POI_TYPES.ATTRACTION,
        lat: 35.7101,
        lng: 139.8107,
        country: 'Japan',
        city: 'Tokyo',
        description: 'Broadcasting and observation tower',
        rating: 4.2
    },
    {
        id: 'shibuya-crossing',
        name: 'Shibuya Crossing',
        type: POI_TYPES.ATTRACTION,
        lat: 35.6598,
        lng: 139.7006,
        country: 'Japan',
        city: 'Tokyo',
        description: 'Famous scramble crossing and shopping district',
        rating: 4.1
    },
    
    // New York, USA
    {
        id: 'statue-of-liberty',
        name: 'Statue of Liberty',
        type: POI_TYPES.ATTRACTION,
        lat: 40.6892,
        lng: -74.0445,
        country: 'United States',
        city: 'New York',
        description: 'Colossal neoclassical sculpture on Liberty Island',
        rating: 4.5
    },
    {
        id: 'central-park',
        name: 'Central Park',
        type: POI_TYPES.PARK,
        lat: 40.7829,
        lng: -73.9654,
        country: 'United States',
        city: 'New York',
        description: 'Urban park in Manhattan',
        rating: 4.7
    },
    {
        id: 'empire-state-building',
        name: 'Empire State Building',
        type: POI_TYPES.ATTRACTION,
        lat: 40.7484,
        lng: -73.9857,
        country: 'United States',
        city: 'New York',
        description: 'Art Deco skyscraper in Midtown Manhattan',
        rating: 4.3
    },
    
    // London, UK
    {
        id: 'big-ben',
        name: 'Big Ben',
        type: POI_TYPES.ATTRACTION,
        lat: 51.4994,
        lng: -0.1245,
        country: 'United Kingdom',
        city: 'London',
        description: 'Iconic clock tower at the Palace of Westminster',
        rating: 4.5
    },
    {
        id: 'british-museum',
        name: 'British Museum',
        type: POI_TYPES.MUSEUM,
        lat: 51.5194,
        lng: -0.1270,
        country: 'United Kingdom',
        city: 'London',
        description: 'World-famous museum of human history and culture',
        rating: 4.6
    },
    {
        id: 'tower-bridge',
        name: 'Tower Bridge',
        type: POI_TYPES.ATTRACTION,
        lat: 51.5055,
        lng: -0.0754,
        country: 'United Kingdom',
        city: 'London',
        description: 'Combined bascule and suspension bridge',
        rating: 4.4
    },
    
    // Rome, Italy
    {
        id: 'colosseum',
        name: 'Colosseum',
        type: POI_TYPES.ATTRACTION,
        lat: 41.8902,
        lng: 12.4922,
        country: 'Italy',
        city: 'Rome',
        description: 'Ancient amphitheatre and iconic symbol of Rome',
        rating: 4.6
    },
    {
        id: 'vatican-museums',
        name: 'Vatican Museums',
        type: POI_TYPES.MUSEUM,
        lat: 41.9065,
        lng: 12.4536,
        country: 'Italy',
        city: 'Rome',
        description: 'Museums of the Vatican City',
        rating: 4.5
    },
    {
        id: 'trevi-fountain',
        name: 'Trevi Fountain',
        type: POI_TYPES.ATTRACTION,
        lat: 41.9009,
        lng: 12.4833,
        country: 'Italy',
        city: 'Rome',
        description: 'Baroque fountain and one of the most famous fountains in the world',
        rating: 4.4
    },
    
    // Sydney, Australia
    {
        id: 'sydney-opera-house',
        name: 'Sydney Opera House',
        type: POI_TYPES.ATTRACTION,
        lat: -33.8568,
        lng: 151.2153,
        country: 'Australia',
        city: 'Sydney',
        description: 'Multi-venue performing arts centre',
        rating: 4.5
    },
    {
        id: 'bondi-beach',
        name: 'Bondi Beach',
        type: POI_TYPES.BEACH,
        lat: -33.8915,
        lng: 151.2767,
        country: 'Australia',
        city: 'Sydney',
        description: 'Popular beach known for surfing',
        rating: 4.3
    },
    {
        id: 'harbour-bridge',
        name: 'Sydney Harbour Bridge',
        type: POI_TYPES.ATTRACTION,
        lat: -33.8523,
        lng: 151.2108,
        country: 'Australia',
        city: 'Sydney',
        description: 'Steel through arch bridge',
        rating: 4.6
    },
    
    // Dubai, UAE
    {
        id: 'burj-khalifa',
        name: 'Burj Khalifa',
        type: POI_TYPES.ATTRACTION,
        lat: 25.1972,
        lng: 55.2744,
        country: 'United Arab Emirates',
        city: 'Dubai',
        description: 'Tallest building in the world',
        rating: 4.7
    },
    {
        id: 'dubai-mall',
        name: 'Dubai Mall',
        type: POI_TYPES.SHOPPING,
        lat: 25.1975,
        lng: 55.2796,
        country: 'United Arab Emirates',
        city: 'Dubai',
        description: 'One of the world\'s largest shopping malls',
        rating: 4.5
    },
    {
        id: 'palm-jumeirah',
        name: 'Palm Jumeirah',
        type: POI_TYPES.ATTRACTION,
        lat: 25.1124,
        lng: 55.1390,
        country: 'United Arab Emirates',
        city: 'Dubai',
        description: 'Artificial archipelago in the shape of a palm tree',
        rating: 4.4
    },
    
    // Bangkok, Thailand
    {
        id: 'grand-palace',
        name: 'Grand Palace',
        type: POI_TYPES.ATTRACTION,
        lat: 13.7500,
        lng: 100.4915,
        country: 'Thailand',
        city: 'Bangkok',
        description: 'Complex of buildings at the heart of Bangkok',
        rating: 4.4
    },
    {
        id: 'wat-pho',
        name: 'Wat Pho Temple',
        type: POI_TYPES.TEMPLE,
        lat: 13.7468,
        lng: 100.4929,
        country: 'Thailand',
        city: 'Bangkok',
        description: 'Buddhist temple complex famous for the giant reclining Buddha',
        rating: 4.5
    },
    {
        id: 'chatuchak-market',
        name: 'Chatuchak Weekend Market',
        type: POI_TYPES.SHOPPING,
        lat: 13.7998,
        lng: 100.5501,
        country: 'Thailand',
        city: 'Bangkok',
        description: 'One of the largest markets in the world',
        rating: 4.3
    },
    
    // Barcelona, Spain
    {
        id: 'sagrada-familia',
        name: 'Sagrada Familia',
        type: POI_TYPES.ATTRACTION,
        lat: 41.4036,
        lng: 2.1744,
        country: 'Spain',
        city: 'Barcelona',
        description: 'Unfinished Roman Catholic minor basilica designed by Antoni Gaudí',
        rating: 4.7
    },
    {
        id: 'park-guell',
        name: 'Park Güell',
        type: POI_TYPES.PARK,
        lat: 41.4145,
        lng: 2.1527,
        country: 'Spain',
        city: 'Barcelona',
        description: 'Public park system composed of gardens and architectural elements',
        rating: 4.4
    },
    {
        id: 'casa-batllo',
        name: 'Casa Batlló',
        type: POI_TYPES.ATTRACTION,
        lat: 41.3916,
        lng: 2.1649,
        country: 'Spain',
        city: 'Barcelona',
        description: 'Renowned building designed by Antoni Gaudí',
        rating: 4.5
    },
    
    // Rio de Janeiro, Brazil
    {
        id: 'christ-redeemer',
        name: 'Christ the Redeemer',
        type: POI_TYPES.ATTRACTION,
        lat: -22.9519,
        lng: -43.2105,
        country: 'Brazil',
        city: 'Rio de Janeiro',
        description: 'Art Deco statue of Jesus Christ',
        rating: 4.6
    },
    {
        id: 'copacabana-beach',
        name: 'Copacabana Beach',
        type: POI_TYPES.BEACH,
        lat: -22.9711,
        lng: -43.1822,
        country: 'Brazil',
        city: 'Rio de Janeiro',
        description: 'Famous beach in the Copacabana district',
        rating: 4.3
    },
    {
        id: 'sugarloaf-mountain',
        name: 'Sugarloaf Mountain',
        type: POI_TYPES.ATTRACTION,
        lat: -22.9488,
        lng: -43.1566,
        country: 'Brazil',
        city: 'Rio de Janeiro',
        description: 'Peak situated in Rio de Janeiro at the mouth of Guanabara Bay',
        rating: 4.5
    }
];

// Country data for the "All" tab
const COUNTRIES_DATA = {
    'Australia': { pois: ['sydney-opera-house', 'bondi-beach', 'harbour-bridge'], continent: 'Oceania' },
    'Brazil': { pois: ['christ-redeemer', 'copacabana-beach', 'sugarloaf-mountain'], continent: 'South America' },
    'France': { pois: ['eiffel-tower', 'louvre-museum', 'notre-dame'], continent: 'Europe' },
    'Italy': { pois: ['colosseum', 'vatican-museums', 'trevi-fountain'], continent: 'Europe' },
    'Japan': { pois: ['senso-ji', 'tokyo-skytree', 'shibuya-crossing'], continent: 'Asia' },
    'Spain': { pois: ['sagrada-familia', 'park-guell', 'casa-batllo'], continent: 'Europe' },
    'Thailand': { pois: ['grand-palace', 'wat-pho', 'chatuchak-market'], continent: 'Asia' },
    'United Arab Emirates': { pois: ['burj-khalifa', 'dubai-mall', 'palm-jumeirah'], continent: 'Asia' },
    'United Kingdom': { pois: ['big-ben', 'british-museum', 'tower-bridge'], continent: 'Europe' },
    'United States': { pois: ['statue-of-liberty', 'central-park', 'empire-state-building'], continent: 'North America' }
};

// Continent boundaries for minimap
const CONTINENT_BOUNDS = {
    'Asia': { north: 81, south: -11, east: 180, west: 26 },
    'Europe': { north: 81, south: 27, east: 40, west: -31 },
    'North America': { north: 83, south: 5, east: -52, west: -168 },
    'South America': { north: 13, south: -56, east: -34, west: -82 },
    'Africa': { north: 37, south: -35, east: 51, west: -18 },
    'Oceania': { north: -10, south: -47, east: 180, west: 110 }
};

// Utility functions
function getPOIById(id) {
    return SAMPLE_POIS.find(poi => poi.id === id);
}

function getPOIsByCountry(country) {
    return SAMPLE_POIS.filter(poi => poi.country === country);
}

function getPOIsByType(type) {
    return SAMPLE_POIS.filter(poi => poi.type.id === type);
}

function getCountriesSorted() {
    return Object.keys(COUNTRIES_DATA).sort();
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function formatDistance(distance) {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    } else if (distance < 10) {
        return `${distance.toFixed(1)}km`;
    } else {
        return `${Math.round(distance)}km`;
    }
}