const result = document.getElementById("result");

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

function updateBusDisplay() {

    const now = new Date();
now.setHours(9);
now.setMinutes(0);
now.setSeconds(0);

    

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const day = now.getDay();

    if (day === 0 || day === 6) {

    result.innerHTML = `
        ${weatherText}

        <h3>Current Time</h3>
        <p>${now.toLocaleTimeString()}</p>

        <p>
            <strong>📍 Nearest Stop:</strong>
            ${nearestStop || "Location unavailable"}
        </p>

        <h3>📅 Next Service Day</h3>
        <p>${nextServiceDate()}</p>

        <div style="
            background:#fff3cd;
            padding:15px;
            border-radius:10px;
            margin-top:10px;
        ">
            <h2>🌙 Weekend - No Scheduled Service</h2>
            <p>Next service resumes on Monday.</p>
        </div>
    `;

    return;
}

const serviceRunning =
    day >= 1 && day <= 5;

    const upcoming = trips.filter(trip => {
        const [h, m] = trip[0].split(":").map(Number);
        return (h * 60 + m) >= currentMinutes;
    });

    const previousTrips = trips.filter(trip => {

    const [h, m] = trip[0].split(":").map(Number);

    return (h * 60 + m) < currentMinutes;
});

    let html = `
        ${weatherText}

        <h3>Current Time</h3>
        <p>${now.toLocaleTimeString()}</p>
        <p>
    <strong>📍 Nearest Stop:</strong>
    ${nearestStop || "Location unavailable"}
</p>
    `;

    if (serviceRunning && upcoming.length > 0) {

        html += `
            <h3>📅 Today's Service</h3>
            <p>${todayServiceDate()}</p>
        `;

        const stopTrips =
    nearestStop
        ? upcoming.filter(trip => trip[2] === nearestStop)
        : [];

const next =
    stopTrips.length > 0
        ? stopTrips[0]
        : upcoming[0];

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
    Math.floor((safeDiffMs % 60000) / 1000);

    const distanceMeters =
    distanceToNearestStop();

const walkMinutes =
    distanceMeters
        ? Math.max(1, Math.ceil(distanceMeters / 80))
        : null;

const driveMinutes =
    distanceMeters
        ? Math.max(1, Math.ceil(distanceMeters / 500))
        : null;

const walkReachable =
    walkMinutes !== null &&
    walkMinutes <= countdownMinutes;

const driveReachable =
    driveMinutes !== null &&
    driveMinutes <= countdownMinutes;


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
            <p>🚌 Departure: ${next[0]}</p>

${distanceMeters !== null ? `
<p>
🚶 Walk: ${walkMinutes} min
${walkReachable ? "✅" : "❌"}
</p>

<p>
🚗 Drive: ${driveMinutes} min
${driveReachable ? "✅" : "❌"}
</p>

<p>
⏳ Remaining: ${countdownMinutes} min
</p>
` : ""}
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

        upcoming.slice(1).forEach(trip => {

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

        if (previousTrips.length > 0) {

    html += `
<div style="
    background:#f2f2f2;
    padding:15px;
    border-radius:10px;
    margin-top:10px;
">
    <h3>🕒 Previous Trips</h3>
`;

    previousTrips.forEach(trip => {

        const color = "#888888";

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

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(position => {


        userLatitude = position.coords.latitude;
userLongitude = position.coords.longitude;

findClosestStop();

updateBusDisplay();

    });
}

loadWeather();
updateBusDisplay();

setInterval(() => {
    updateBusDisplay();
}, 1000);
