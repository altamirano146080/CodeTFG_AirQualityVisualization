// WMS base URLs
const WMS_URLS = {
  europe: "https://apps.ecmwf.int/wms/?token=public",
  global: "https://apps.ecmwf.int/wms/?token=public"
};

// Pollutants by region
const POLLUTANTS = {
  europe: {
    "NO2": "composition_europe_no2_forecast_surface",
    "SO2": "composition_europe_so2_forecast_surface",
    "CO": "composition_europe_co_forecast_surface",
    "O3": "composition_europe_o3_forecast_surface",
    "NH3": "composition_europe_nh3_forecast_surface",
    "PM2.5": "composition_europe_pm2p5_forecast_surface",
    "PM10": "composition_europe_pm10_forecast_surface"
  },
  global: {
    "NO2": "composition_no2_forecast_surface",
    "SO2": "composition_so2_forecast_surface",
    "CO": "composition_co_forecast_surface",
    "O3": "composition_o3_forecast_surface",
    "PM2.5": "composition_pm2p5_forecast_surface",
    "PM10": "composition_pm10_forecast_surface"
  }
};

// Init map
const map = L.map('map').setView([48.8, 2.3], 4);

// Base map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let currentRegion = "europe";
let currentLayer;

// Populate pollutant selector
function updatePollutantOptions() {
  const select = document.getElementById("pollutantSelect");
  select.innerHTML = "";
  Object.keys(POLLUTANTS[currentRegion]).forEach(pollutant => {
    const opt = document.createElement("option");
    opt.value = POLLUTANTS[currentRegion][pollutant];
    opt.textContent = pollutant;
    select.appendChild(opt);
  });
}
updatePollutantOptions();

// Add WMS layer
function updateLayer() {
  if (currentLayer) {
    map.removeLayer(currentLayer);
  }
  const pollutantLayer = document.getElementById("pollutantSelect").value;
  const hour = document.getElementById("timeSlider").value;
  currentLayer = L.tileLayer.wms(WMS_URLS[currentRegion], {
    layers: pollutantLayer,
    format: 'image/png',
    transparent: true,
    time: `2025-08-07T${String(hour).padStart(2, '0')}:00:00Z`,
    attribution: 'CAMS - Copernicus Atmosphere Monitoring Service'
  }).addTo(map);
}
updateLayer();

// Event listeners
document.getElementById("regionSelect").addEventListener("change", e => {
  currentRegion = e.target.value;
  updatePollutantOptions();
  updateLayer();
});

document.getElementById("pollutantSelect").addEventListener("change", updateLayer);

document.getElementById("timeSlider").addEventListener("input", e => {
  document.getElementById("timeLabel").textContent = `Hour ${e.target.value}`;
  updateLayer();
});
