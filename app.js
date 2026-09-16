const trips = [

["08:00","490","Gare Vaudreuil","08:21"],
["08:07","490","Bourget / Saint-Charles","08:21"],

["08:10","491","Gare Vaudreuil","08:29"],
["08:14","491","Plaza Vaudreuil","08:29"],

["08:27","490","Gare Vaudreuil","08:48"],
["08:34","490","Bourget / Saint-Charles","08:48"],

["08:41","491","Gare Vaudreuil","09:00"],
["08:45","491","Plaza Vaudreuil","09:00"],

["09:00","490","Gare Vaudreuil","09:21"],
["09:07","490","Bourget / Saint-Charles","09:21"],

["09:15","491","Gare Vaudreuil","09:34"],
["09:19","491","Plaza Vaudreuil","09:34"],

["09:35","490","Gare Vaudreuil","09:56"],
["09:42","490","Bourget / Saint-Charles","09:56"],

["10:06","491","Gare Vaudreuil","10:25"],
["10:10","491","Plaza Vaudreuil","10:25"],

["10:45","490","Gare Vaudreuil","11:06"],
["10:52","490","Bourget / Saint-Charles","11:06"],

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

function updateBusDisplay() {

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const upcoming = trips.filter(trip => {
        const [h, m] = trip[0].split(":").map(Number);
        return (h * 60 + m) >= currentMinutes;
    });

    let html = `
        <h3>Current Time</h3>
        <p>${now.toLocaleTimeString()}</p>
    `;

    if (upcoming.length > 0) {

        const next = upcoming[0];

        const [h, m] = next[0].split(":").map(Number);
        const waitBus = (h * 60 + m) - currentMinutes;

        html += `
        <div style="
            background:#dff6dd;
            padding:15px;
            border-radius:10px;
            margin-top:10px;
        ">
            <h2>✅ Recommended Trip</h2>

            <p><strong>Bus:</strong> ${next[1]}</p>
            <p><strong>Stop:</strong> ${next[2]}</p>
            <p><strong>Bus Departure:</strong> ${next[0]}</p>
            <p><strong>Arrive REM:</strong> ${next[3]}</p>
            <p><strong>Catch REM:</strong> ${nextREM(next[3])}</p>
            <p><strong>Wait at REM:</strong> ${waitTime(next[3])} min</p>
            <p><strong>Leaves In:</strong> ${waitBus} min</p>
        </div>

        <h3>All Remaining Trips Today</h3>
        `;

        upcoming.forEach(trip => {

            html += `
            <p>
                <strong>${trip[0]}</strong> |
                Bus ${trip[1]} |
                ${trip[2]} |
                Arrive REM ${trip[3]} |
                Catch REM ${nextREM(trip[3])}
            </p>
            `;
        });

    } else {

        html += `
        <div style="
            background:#fff3cd;
            padding:15px;
            border-radius:10px;
            margin-top:10px;
        ">
            <h2>🌙 Tomorrow (8 AM Start)</h2>
        `;

        trips.forEach(trip => {

            html += `
            <p>
                <strong>${trip
