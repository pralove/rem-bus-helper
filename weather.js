let weatherText = "<h3>🌤 Weather</h3><p>Loading weather...</p>";

async function loadWeather() {

    try {

        const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=45.40&longitude=-74.04&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=weather_code,wind_speed_10m&timezone=America%2FToronto"
        );

        const data = await response.json();
        if (!data.hourly) {
    throw new Error("Weather data unavailable");
}

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