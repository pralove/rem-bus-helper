const stopLocations = {
    "Gare Vaudreuil": {
        lat: 45.399491,
        lon: -74.050285
    },
    "Plaza Vaudreuil": {
        lat: 45.407207,
        lon: -74.036385
    },
    "St. Charles": {
        lat: 45.404542,
        lon: -74.030554
    }
};
const trips = [

["08:00","490","Gare Vaudreuil","08:21"],
["08:07","490","St. Charles","08:21"],

["08:10","491","Gare Vaudreuil","08:29"],
["08:14","491","Plaza Vaudreuil","08:29"],

["08:27","490","Gare Vaudreuil","08:48"],
["08:34","490","St. Charles","08:48"],

["08:41","491","Gare Vaudreuil","09:00"],
["08:45","491","Plaza Vaudreuil","09:00"],

["09:00","490","Gare Vaudreuil","09:21"],
["09:07","490","St. Charles","09:21"],

["09:15","491","Gare Vaudreuil","09:34"],
["09:19","491","Plaza Vaudreuil","09:34"],

["09:35","490","Gare Vaudreuil","09:56"],
["09:42","490","St. Charles","09:56"],

["10:06","491","Gare Vaudreuil","10:25"],
["10:10","491","Plaza Vaudreuil","10:25"],

["10:45","490","Gare Vaudreuil","11:06"],
["10:52","490","St. Charles","11:06"],

["11:15","491","Gare Vaudreuil","11:34"],
["11:19","491","Plaza Vaudreuil","11:34"]

];

const remDepartures = [
"08:10","08:24","08:38","08:52",
"09:06","09:20","09:34","09:48",
"10:02","10:16","10:30","10:44",
"10:58","11:12","11:26","11:40"
];

const result = document.getElementById("result");

let weatherText = "<h3>🌤 Weather</h3><p>Loading weather...</p>";
let userLatitude = null;
let userLongitude = null;
let nearestStop = null;


function nextREM(arrivalTime) {

    const [ah, am] = arrivalTime.split(":").map(Number);
    const arrivalMinutes = ah * 60 + am;

    for (const rem of remDepartures) {

        const [rh, rm] = rem.split(":").map(Number);
        const remMinutes = rh * 60 + rm;

        if (remMinutes >= arrivalMinutes) {
            return rem;
        }
    }

    return "No REM";
}

function waitTime(arrivalTime) {

    const rem = nextREM(arrivalTime);

    if (rem === "No REM") {
        return "-";
    }

    const [ah, am] = arrivalTime.split(":").map(Number);
    const [rh, rm] = rem.split(":").map(Number);

    return (rh * 60 + rm) - (ah * 60 + am);
}

function mcGillArrival(remDeparture) {

    if (remDeparture === "No REM") {
        return "-";
    }

    const [h, m] = remDeparture.split(":").map(Number);

    const total = h * 60 + m + 35;

    const hh = Math.floor(total / 60);
    const mm = total % 60;

    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function nextServiceDate() {

    const d = new Date();

    if (d.getDay() === 5) {
        d.setDate(d.getDate() + 3);
    } else if (d.getDay() === 6) {
        d.setDate(d.getDate() + 2);
    } else if (d.getDay() === 0) {
        d.setDate(d.getDate() + 1);
    } else {
        d.setDate(d.getDate() + 1);
    }

    return d.toLocaleDateString("en-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function todayServiceDate() {

    return new Date().toLocaleDateString("en-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

async function loadWeather() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=45.40&longitude=-74.04&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=weather_code,wind_speed_10m&timezone=America%2FToronto"
        );

        const data = await response.json();

        const times = data.hourly.time;

        const todayDate = times[0].split("T")[0];

const tomorrowDate = new Date(times[0]);
tomorrowDate.setDate(tomorrowDate.getDate() + 1);

const tomorrowDateString =
    tomorrowDate.toISOString().split("T")[0];

        const hourlyCodes = data.hourly.weather_code;
        const hourlyWind = data.hourly.wind_speed_10m;


        const todayHigh = Math.round(data.daily.temperature_2m_max[0]);
        const todayLow = Math.round(data.daily.temperature_2m_min[0]);

        const tomorrowHigh = Math.round(data.daily.temperature_2m_max[1]);
        const tomorrowLow = Math.round(data.daily.temperature_2m_min[1]);

        function weatherDescription(code) {

            if (code === 0) return "☀️ Sunny";
            if (code <= 3) return "⛅ Partly Cloudy";
            if (code <= 48) return "☁️ Cloudy";
            if (code <= 67) return "🌧 Rain";
            if (code <= 77) return "🌨 Snow";
            if (code <= 99) return "⛈ Storm";

            return "Unknown";
        }

        const todayWeather =
            weatherDescription(data.daily.weather_code[0]);

        const tomorrowWeather =
            weatherDescription(data.daily.weather_code[1]);

        const rainPeriods =
            findWeatherPeriods(times, hourlyCodes, "rain");

        const snowPeriods =
            findWeatherPeriods(times, hourlyCodes, "snow");

        const stormPeriods =
            findWeatherPeriods(times, hourlyCodes, "storm");

        const windPeriods =
            findWindPeriods(times, hourlyWind);

const todayRain =
    periodsForDate(rainPeriods, todayDate);

const tomorrowRain =
    periodsForDate(rainPeriods, tomorrowDateString);

const todaySnow =
    periodsForDate(snowPeriods, todayDate);

const tomorrowSnow =
    periodsForDate(snowPeriods, tomorrowDateString);

const todayStorm =
    periodsForDate(stormPeriods, todayDate);

const tomorrowStorm =
    periodsForDate(stormPeriods, tomorrowDateString);

const todayWind =
    periodsForDate(windPeriods, todayDate);

const tomorrowWind =
    periodsForDate(windPeriods, tomorrowDateString);




        const snowstormPeriods = [];

            hourlyCodes.forEach((code, i) => {

    if (code === 85 || code === 86) {

        snowstormPeriods.push(
            new Date(times[i]).toLocaleTimeString([], {
                hour: 'numeric'
            })
        );
    }
});

const todaySnowstorm =
    periodsForDate(snowstormPeriods, todayDate);

const tomorrowSnowstorm =
    periodsForDate(snowstormPeriods, tomorrowDateString);


weatherText = `
    <h3>🌤 Weather</h3>

    <p>
        <strong>Today</strong> ${todayWeather}<br>
        High ${todayHigh}°C | Low ${todayLow}°C
    </p>

    ${todayRain.map(p => `<p>☔ Rain: ${p}</p>`).join("")}
${todaySnow.map(p => `<p>❄️ Snow: ${p}</p>`).join("")}
${todayStorm.map(p => `<p>⛈ Storm: ${p}</p>`).join("")}
${todayWind.map(p => `<p>💨 Strong Wind: ${p}</p>`).join("")}
${todaySnowstorm.map(p => `<p>🌨 Snowstorm: ${p}</p>`).join("")}

    <p>
        <strong>Tomorrow</strong> ${tomorrowWeather}<br>
        High ${tomorrowHigh}°C | Low ${tomorrowLow}°C
    </p>

    ${tomorrowRain.map(p => `<p>☔ Rain: ${p}</p>`).join("")}
${tomorrowSnow.map(p => `<p>❄️ Snow: ${p}</p>`).join("")}
${tomorrowStorm.map(p => `<p>⛈ Storm: ${p}</p>`).join("")}
${tomorrowWind.map(p => `<p>💨 Strong Wind: ${p}</p>`).join("")}
${tomorrowSnowstorm.map(p => `<p>🌨 Snowstorm: ${p}</p>`).join("")}
`;

function findClosestStop() {

    alert("findClosestStop started");

    if (userLatitude === null || userLongitude === null) {
        return;
    }

    alert("Lat: " + userLatitude);
alert("Lon: " + userLongitude);

    let closest = null;
    let closestDistance = Number.MAX_VALUE;

    alert("About to loop stops");
    Object.entries(stopLocations).forEach(([name, stop]) => {
        alert("Loop running");
        
        alert(name);

        const distance =
            Math.sqrt(
                Math.pow(userLatitude - stop.lat, 2) +
                Math.pow(userLongitude - stop.lon, 2)
            );

        if (distance < closestDistance) {
            closestDistance = distance;
            closest = name;
        }
    });
alert("Closest stop: " + closest);
alert("Found: " + closest);
    nearestStop = closest;
}

        updateBusDisplay();

    } catch (error) {

    console.error("Weather error:", error);

    weatherText = `
        <h3>🌤 Weather</h3>
        <p>Unable to load weather.</p>
    `;

    

        updateBusDisplay();
    }
}


function updateBusDisplay() {

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const upcoming = trips.filter(trip => {
        const [h, m] = trip[0].split(":").map(Number);
        return (h * 60 + m) >= currentMinutes;
    });

    let html = `
        ${weatherText}

        <h3>Current Time</h3>
        <p>${now.toLocaleTimeString()}</p>
        ${nearestStop ? `
<p><strong>📍 Nearest Stop:</strong> ${nearestStop}</p>
` : ""}
    `;

    if (upcoming.length > 0) {

        html += `
            <h3>📅 Today's Service</h3>
            <p>${todayServiceDate()}</p>
        `;

        const next = upcoming[0];

        const [h, m] = next[0].split(":").map(Number);
        const waitBus = (h * 60 + m) - currentMinutes;

      const departureTime = new Date();

departureTime.setHours(h);
departureTime.setMinutes(m);
departureTime.setSeconds(0);

const diffMs = departureTime - now;
const safeDiffMs = Math.max(0, diffMs);

const countdownMinutes =
    Math.floor(safeDiffMs / 60000);

const countdownSeconds =
    Math.floor((safeDiffMs % 60000) / 1000)

        const color = next[1] === "490"
            ? "#0066cc"
            : "#00aa44";

        html += `
        <div style="
            background:#dff6dd;
            padding:15px;
            border-radius:10px;
            margin-top:10px;
        ">
            <h2>✅ Recommended Trip</h2>

            <p style="color:${color};font-weight:bold;font-size:20px;">
                Bus ${next[1]}
            </p>

            <p><strong>Stop:</strong> ${next[2]}</p>
            <p><strong>Bus Departure:</strong> ${next[0]}</p>
            <p><strong>Arrive REM:</strong> ${next[3]}</p>
            <p><strong>Catch REM:</strong> ${nextREM(next[3])}</p>
            <p><strong>Arrive McGill:</strong> ${mcGillArrival(nextREM(next[3]))}</p>
            <p><strong>Wait at REM:</strong> ${waitTime(next[3])} min</p>

${safeDiffMs > 0 ? `
<p>
    <strong>⏳ Bus leaves in:</strong>
    ${countdownMinutes}:${String(countdownSeconds).padStart(2, "0")}
</p>
` : ""}
        </div>

        <h3>All Remaining Trips Today</h3>
        `;

        upcoming.forEach(trip => {

            const color = trip[1] === "490"
                ? "#0066cc"
                : "#00aa44";

            html += `
            <p style="
                color:${color};
                font-weight:bold;
            ">
                ${trip[0]} |
                Bus ${trip[1]} |
                ${trip[2]} |
                Arrive REM ${trip[3]} |
                Catch REM ${nextREM(trip[3])}
            </p>
            `;
        });

    } else {

        html += `
            <h3>📅 Next Service Day</h3>
            <p>${nextServiceDate()}</p>
        `;

        html += `
        <div style="
            background:#fff3cd;
            padding:15px;
            border-radius:10px;
            margin-top:10px;
        ">
            <h2>🌙 Next Service Day</h2>
        `;

        trips.forEach(trip => {

            const color = trip[1] === "490"
                ? "#0066cc"
                : "#00aa44";

            html += `
            <p style="
                color:${color};
                font-weight:bold;
            ">
                ${trip[0]} |
                Bus ${trip[1]} |
                ${trip[2]} |
                Arrive REM ${trip[3]} |
                Catch REM ${nextREM(trip[3])}
            </p>
            `;
        });

        html += `</div>`;
    }

    result.innerHTML = html;
}
function findWeatherPeriods(times, codes, type) {

    const periods = [];

    let start = null;

    for (let i = 0; i < codes.length; i++) {

        let matches = false;

        if (type === "rain") {
            matches = codes[i] >= 51 && codes[i] <= 67;
        }

        if (type === "snow") {
            matches = codes[i] >= 71 && codes[i] <= 77;
        }

        if (type === "storm") {
            matches = codes[i] >= 95;
        }

        if (matches && start === null) {
            start = i;
        }

        if ((!matches || i === codes.length - 1) && start !== null) {

            const end = matches ? i : i - 1;

            const startTime =
    new Date(times[start]).toLocaleTimeString([], {hour:'numeric'});

const endTime =
    new Date(times[end]).toLocaleTimeString([], {hour:'numeric'});

const date =
    times[start].split("T")[0];

if (start === end) {

    periods.push({
        date: date,
        text: startTime
    });

} else {

    periods.push({
        date: date,
        text: `${startTime} - ${endTime}`
    });
}

            start = null;
        }
    }

        return periods;
}

function findWindPeriods(times, winds) {

    const periods = [];

    let start = null;

    for (let i = 0; i < winds.length; i++) {

        const windy = winds[i] >= 25;

        if (windy && start === null) {
            start = i;
        }

        if ((!windy || i === winds.length - 1) && start !== null) {

            const end = windy ? i : i - 1;

            const date =
    times[start].split("T")[0];

const startTime =
    new Date(times[start]).toLocaleTimeString([], {hour:'numeric'});

const endTime =
    new Date(times[end]).toLocaleTimeString([], {hour:'numeric'});

if (start === end) {

    periods.push({
        date: date,
        text: startTime
    });

} else {

    periods.push({
        date: date,
        text: `${startTime} - ${endTime}`
    });
}
            start = null;
        }
    }

    return periods;
}

function periodsForDate(periods, date) {

    return periods
        .filter(p => p.date === date)
        .map(p => p.text);
}

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(position => {

        alert("GPS Success");

        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;

        alert("Before findClosestStop");

try {

    findClosestStop();

    alert("After findClosestStop");

} catch (error) {

    alert("GPS ERROR: " + error);

}

alert("After findClosestStop");

updateBusDisplay();

    });
}

loadWeather();
updateBusDisplay();

setInterval(() => {
    updateBusDisplay();
}, 1000);
