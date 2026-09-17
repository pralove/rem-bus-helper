const trips = [

["08:00","490","Gare Vaudreuil","08:21"],
["08:07","490","Bourget / St. Charles","08:21"],

["08:10","491","Gare Vaudreuil","08:29"],
["08:14","491","Plaza Vaudreuil","08:29"],

["08:27","490","Gare Vaudreuil","08:48"],
["08:34","490","Bourget / St. Charles","08:48"],

["08:41","491","Gare Vaudreuil","09:00"],
["08:45","491","Plaza Vaudreuil","09:00"],

["09:00","490","Gare Vaudreuil","09:21"],
["09:07","490","Bourget / St. Charles","09:21"],

["09:15","491","Gare Vaudreuil","09:34"],
["09:19","491","Plaza Vaudreuil","09:34"],

["09:35","490","Gare Vaudreuil","09:56"],
["09:42","490","Bourget / St. Charles","09:56"],

["10:06","491","Gare Vaudreuil","10:25"],
["10:10","491","Plaza Vaudreuil","10:25"],

["10:45","490","Gare Vaudreuil","11:06"],
["10:52","490","Bourget / St. Charles","11:06"],

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

let closestStopText = "Finding nearest stop...";

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

function findClosestStop() {

    const stops = [
{
    name: "Gare Vaudreuil",
    lat: 45.399530,
    lon: -74.050311
},
{
    name: "Bourget / St. Charles",
    lat: 45.403441,
    lon: -74.032237
},
{
    name: "Plaza Vaudreuil",
    lat: 45.406870,
    lon: -74.036366
}
];

function distanceKm(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}

function findClosestStop() {

    if (!navigator.geolocation) {

        closestStopText = "GPS not supported";
        updateBusDisplay();
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;

            let bestStop = null;
            let shortest = 999999;

            stops.forEach(stop => {

                const dist = distanceKm(
                    userLat,
                    userLon,
                    stop.lat,
                    stop.lon
                );

                if (dist < shortest) {
                    shortest = dist;
                    bestStop = stop;
                }
            });

            closestStopText =
                bestStop.name +
                "<br>" +
                shortest.toFixed(1) +
                " km away";

            updateBusDisplay();
        },

        function() {

            closestStopText =
                "Location permission denied";

            updateBusDisplay();
        }

    );
}


    );
}

function updateBusDisplay() {

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const upcoming = trips.filter(trip => {
        const [h, m] = trip[0].split(":").map(Number);
        return (h * 60 + m) >= currentMinutes;
    });

    let html = `
    <h3>📍 Closest Stop</h3>
    <p>${closestStopText}</p>

    <h3>Current Time</h3>
        <p>${now.toLocaleTimeString()}</p>
    `;

    if (upcoming.length > 0) {

        html += `
            <h3>📅 Today's Service</h3>
            <p>${todayServiceDate()}</p>
        `;

        const next = upcoming[0];

        const [h, m] = next[0].split(":").map(Number);
        const waitBus = (h * 60 + m) - currentMinutes;

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
            <p><strong>Leaves In:</strong> ${waitBus} min</p>
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

findClosestStop();
updateBusDisplay();

setInterval(() => {
    updateBusDisplay();
}, 30000);
