const TOTAL_ROUNDS = 5;
const $ = (id) => document.getElementById(id);

let round = 0;
let total = 0;
let seen = [];
let roundId = null;

async function loadRound() {
  round += 1;
  $('roundNum').textContent = round;
  $('result').hidden = true;
  $('photoError').hidden = true;
  $('guessBtn').hidden = false;
  $('guessBtn').disabled = true;
  $('guessBtn').textContent = 'Haz clic en el mapa para elegir';
  GeoMap.reset();

  const res = await fetch('/api/round?seen=' + seen.join(','));
  const data = await res.json();
  roundId = data.roundId;
  seen.push(data.placeId);
  $('photo').src = data.image;
  GeoMap.enable();
}

GeoMap.onPick(() => {
  $('guessBtn').disabled = false;
  $('guessBtn').textContent = 'Adivinar';
});

$('photo').addEventListener('error', () => { $('photoError').hidden = false; });

$('guessBtn').addEventListener('click', async () => {
  const g = GeoMap.getGuess();
  if (!g) return;
  GeoMap.disable();
  $('guessBtn').hidden = true;

  const res = await fetch('/api/guess', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roundId, lat: g.lat, lng: g.lng })
  });
  const data = await res.json();

  total += data.points;
  $('total').textContent = total;
  $('distance').textContent = data.distanceKm.toLocaleString('es-PE') + ' km';
  $('points').textContent = data.points.toLocaleString('es-PE');
  $('country').textContent = data.country;
  $('fact').textContent = data.fact;
  $('nextBtn').textContent = round >= TOTAL_ROUNDS ? 'Ver resultado final' : 'Siguiente ronda';
  $('result').hidden = false;
  GeoMap.showResult(data.actual);
});

$('nextBtn').addEventListener('click', () => {
  if (round >= TOTAL_ROUNDS) {
    document.querySelector('.game').hidden = true;
    $('finalScore').textContent = total.toLocaleString('es-PE');
    $('final').hidden = false;
  } else {
    loadRound();
  }
});

$('againBtn').addEventListener('click', () => {
  round = 0; total = 0; seen = [];
  $('total').textContent = 0;
  $('final').hidden = true;
  document.querySelector('.game').hidden = false;
  loadRound();
});

loadRound();
