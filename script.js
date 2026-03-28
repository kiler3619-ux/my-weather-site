async function getWeather() {
  const city = document.getElementById('city-input').value || 'Moscow';
  // Базовые координаты для нескольких городов (можно расширить)
  const cities = {
    'Moscow': { lat: 55.7558, lon: 37.6173 },
    'Saint Petersburg': { lat: 59.9343, lon: 30.3351 },
    'Kazan': { lat: 55.7887, lon: 49.1221 }
  };

  const { lat, lon } = cities[city] || cities['Moscow']; // по умолчанию — Москва

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,windspeed_10m&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const weatherHTML = `
      <div class="weather-info">
        <h3>Погода в ${city}</h3>
        <p>Температура: ${data.current.temperature_2m}°C</p>
        <p>Влажность: ${data.current.relativehumidity_2m}%</p>
        <p>Ветер: ${data.current.windspeed_10m} м/с</p>
      </div>
    `;
    document.getElementById('weather-result').innerHTML = weatherHTML;
  } catch (error) {
    document.getElementById('weather-result').innerHTML = `<p style="color: red;">Ошибка: ${error.message}</p>`;
  }
}
