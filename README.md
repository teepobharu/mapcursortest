# Interactive Travel Destinations Map

A comprehensive interactive map application showcasing popular travel destinations around the world with a dark theme and mobile-friendly interface.

## Features

### 🗺️ Interactive Map
- **Dark Theme**: Minimal dark theme with custom styling
- **Clustering**: POI markers automatically group into bubbles showing count when zooming out
- **Multiple POI Types**: Different marker styles for restaurants, hotels, attractions, museums, parks, shopping, beaches, and temples
- **Interactive Popups**: Click markers to see detailed information with save and navigation options

### 📱 Bottom Sheet Interface
- **3 Height Levels**: Draggable bottom sheet with 10%, 50%, and 100% height levels
- **Touch-Friendly**: Optimized for mobile devices with touch events
- **Smooth Animations**: Fluid transitions between height levels

### 🏷️ Three Main Tabs

#### 1. Current Tab
- Lists POIs within the current map viewport
- Sorted by proximity to map center
- Real-time updates when panning/zooming
- Distance indicators for each POI

#### 2. All Tab
- Complete list of countries in alphabetical order
- Alphabetical index for quick navigation
- Section headers for each letter
- POI count per country
- Click country to zoom to its POIs

#### 3. Saved Tab
- Personal favorites list with heart icon
- Persistent storage using localStorage
- Easy save/unsave functionality
- Empty state with helpful instructions

### 🌍 Minimap
- **World Overview**: Small minimap showing current viewport location
- **Continent Indicator**: Larger rectangle showing current continent
- **Viewport Indicator**: Smaller rectangle showing exact current view
- **Real-time Updates**: Automatically updates when main map moves

### 💾 Save Functionality
- **Heart Button**: Save/unsave POIs with heart icon in popups and lists
- **Persistent Storage**: Saved POIs persist across browser sessions
- **Visual Feedback**: Different heart states (filled/outlined) for saved status

### 🧭 Navigation Integration
- **Google Maps Integration**: "Navigate" button opens Google Maps with directions
- **External Navigation**: Opens in new tab for seamless experience

## Technical Implementation

### Performance Optimizations
- **Debounced Updates**: Expensive operations are debounced to prevent excessive calls
- **Efficient Clustering**: Uses Leaflet.markercluster for optimal marker management
- **Lazy Loading**: Content updates only when necessary
- **Memory Management**: Proper cleanup of map layers and event listeners

### Mobile-First Design
- **Touch Events**: Full touch support for dragging and interactions
- **Responsive Layout**: Adapts to different screen sizes
- **Touch-Friendly Targets**: Larger touch targets for mobile devices
- **Smooth Scrolling**: Optimized scrolling for lists and content

### Data Structure
- **Modular POI Types**: Extensible POI type system with icons and colors
- **Geographic Organization**: Countries organized by continents
- **Distance Calculations**: Haversine formula for accurate distance measurements
- **Efficient Filtering**: Fast viewport-based POI filtering

## Usage

1. **Explore the Map**: Pan and zoom to explore different regions
2. **View POIs**: Click markers to see detailed information
3. **Save Favorites**: Use heart buttons to save interesting places
4. **Browse Lists**: Use the bottom sheet tabs to browse POIs
5. **Navigate**: Click "Navigate" to get directions in Google Maps
6. **Quick Access**: Use the minimap to understand your current location context

## Browser Compatibility

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Dependencies

- **Leaflet.js**: Core mapping functionality
- **Leaflet.markercluster**: Marker clustering
- **Font Awesome**: Icons for UI elements
- **OpenStreetMap**: Map tiles (with dark theme styling)

## Local Development

1. Open `index.html` in a web browser, or
2. Serve from a local web server:
   ```bash
   python3 -m http.server 8000
   ```
   Then visit `http://localhost:8000`

## Sample Data

The application includes sample POI data for popular destinations across:
- **Europe**: Paris, London, Rome, Barcelona
- **Asia**: Tokyo, Bangkok, Dubai
- **North America**: New York
- **South America**: Rio de Janeiro
- **Oceania**: Sydney

Each POI includes:
- Name and description
- Geographic coordinates
- POI type and rating
- City and country information