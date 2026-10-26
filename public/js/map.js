// Mapa con Leaflet + OpenStreetMap (sin API key)
const GeoMap = (() => {
  const map = L.map('map', { worldCopyJump: true, minZoom: 2 }).setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  let enabled = false;
  let guess = null;
  let guessMarker = null;
  let extra = [];
  let onPick = () => {};

  map.on('click', (e) => {
    if (!enabled) return;
    guess = e.latlng;
    if (guessMarker) guessMarker.setLatLng(guess);
    else guessMarker = L.circleMarker(guess, { radius: 9, color: '#0e7c86', fillColor: '#0e7c86', fillOpacity: 0.9 }).addTo(map);
    onPick(guess);
  });

  return {
    onPick(fn) { onPick = fn; },
    enable() { enabled = true; },
    disable() { enabled = false; },
    getGuess() { return guess; },
    showResult(actual) {
      const real = L.circleMarker(actual, { radius: 9, color: '#f2a541', fillColor: '#f2a541', fillOpacity: 0.95 }).addTo(map);
      const line = L.polyline([guess, actual], { color: '#10262b', dashArray: '6 6' }).addTo(map);
      extra.push(real, line);
      map.fitBounds(L.latLngBounds([guess, actual]).pad(0.4));
    },
    reset() {
      extra.forEach((l) => map.removeLayer(l));
      extra = [];
      if (guessMarker) { map.removeLayer(guessMarker); guessMarker = null; }
      guess = null;
      map.setView([20, 0], 2);
      map.invalidateSize();
    }
  };
})();
