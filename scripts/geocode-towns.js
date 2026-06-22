#!/usr/bin/env node

/**
 * Geocodes UK towns without coordinates and adds center/bounds to uk_towns.json
 * Uses Nominatim API for geocoding
 */

const fs = require('fs');
const path = require('path');

const UK_TOWNS_FILE = path.join(__dirname, '..', 'uk_towns.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'uk_towns_geocoded.json');

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';
const RATE_LIMIT_MS = 1100; // Nominatim requires 1 second between requests

// Sleep function for rate limiting
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Geocode a town using Nominatim
async function geocodeTown(townName) {
  try {
    const query = `${townName}, UK`;
    const url = `${NOMINATIM_API}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=gb`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Foodshare-Town-Geocoder/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      
      // Generate bounds - approximately 0.04 degrees (~4.4km) for smaller towns, ~0.08 for cities
      const isLargeTown = townName.length > 15 || townName.includes('London') || 
                          townName.includes('Manchester') || townName.includes('Birmingham') ||
                          townName.includes('Leeds') || townName.includes('Glasgow') ||
                          townName.includes('Edinburgh') || townName.includes('Bristol');
      
      const bufferLat = isLargeTown ? 0.04 : 0.02;
      const bufferLng = isLargeTown ? 0.05 : 0.025;
      
      return {
        center: [lat, lng],
        bounds: {
          north: lat + bufferLat,
          south: lat - bufferLat,
          east: lng + bufferLng,
          west: lng - bufferLng
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error(`  Error geocoding ${townName}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('Loading uk_towns.json...');
  const rawData = fs.readFileSync(UK_TOWNS_FILE, 'utf8');
  const data = JSON.parse(rawData);
  
  const towns = data.towns;
  const townsNeedingGeocoding = towns.filter(town => !town.center || !town.bounds);
  
  console.log(`Found ${townsNeedingGeocoding.length} towns needing geocoding out of ${towns.length} total`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < townsNeedingGeocoding.length; i++) {
    const town = townsNeedingGeocoding[i];
    const progress = `[${i + 1}/${townsNeedingGeocoding.length}]`;
    
    console.log(`${progress} Geocoding: ${town.name}`);
    
    const coords = await geocodeTown(town.name);
    
    if (coords) {
      town.center = coords.center;
      town.bounds = coords.bounds;
      successCount++;
      console.log(`  ✓ Found: ${coords.center[0].toFixed(4)}, ${coords.center[1].toFixed(4)}`);
    } else {
      failCount++;
      console.log(`  ✗ Failed to geocode`);
    }
    
    // Rate limiting
    if (i < townsNeedingGeocoding.length - 1) {
      await sleep(RATE_LIMIT_MS);
    }
  }
  
  // Update metadata
  data.metadata.townsWithCoordinates = towns.filter(t => t.center && t.bounds).length;
  data.metadata.lastUpdated = new Date().toISOString().split('T')[0];
  
  console.log(`\nGeocoding complete: ${successCount} successful, ${failCount} failed`);
  console.log(`Total towns with coordinates: ${data.metadata.townsWithCoordinates}`);
  
  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`\nOutput written to: ${OUTPUT_FILE}`);
  
  // Also update the original file if requested
  if (process.argv.includes('--update-original')) {
    fs.writeFileSync(UK_TOWNS_FILE, JSON.stringify(data, null, 2));
    console.log('Original uk_towns.json updated');
  }
}

main().catch(console.error);