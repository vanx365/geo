const express = require('express');
const path = require('path');
const crypto = require('crypto');
const places = require('./data/places.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// roundId -> lugar. Las coordenadas se quedan en el servidor hasta que se adivina.
const rounds = new Map();

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function scoreFromKm(km) {
  return Math.round(5000 * Math.exp(-km / 1500));
}

// Nueva ronda: devuelve solo la imagen, nunca las coordenadas
app.get('/api/round', (req, res) => {
  const seen = (req.query.seen || '').split(',').filter(Boolean).map(Number);
  let pool = places.filter((p) => !seen.includes(p.id));
  if (pool.length === 0) pool = places;
  const place = pool[Math.floor(Math.random() * pool.length)];
  const roundId = crypto.randomUUID();
  rounds.set(roundId, place);
  res.json({ roundId, placeId: place.id, image: place.image });
});

// Recibe la adivinanza y revela la ubicación real
app.post('/api/guess', (req, res) => {
  const { roundId, lat, lng } = req.body || {};
  const place = rounds.get(roundId);
  if (!place || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Ronda o coordenadas inválidas.' });
  }
  rounds.delete(roundId);
  const distanceKm = haversineKm(lat, lng, place.lat, place.lng);
  res.json({
    distanceKm: Math.round(distanceKm),
    points: scoreFromKm(distanceKm),
    actual: { lat: place.lat, lng: place.lng },
    country: place.country,
    fact: place.fact,
  });
});

app.listen(PORT, () => console.log(`GeoLogika en http://localhost:${PORT}`));

  require('dotenv').config();