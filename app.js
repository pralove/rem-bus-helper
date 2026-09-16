const buses = [
  ["08:00", "490", "Gare Vaudreuil"],
  ["08:07", "490", "Bourget / Saint-Charles"],

  ["08:10", "491", "Gare Vaudreuil"],
  ["08:14", "491", "Plaza Vaudreuil"],

  ["08:27", "490", "Gare Vaudreuil"],
  ["08:34", "490", "Bourget / Saint-Charles"],

  ["08:41", "491", "Gare Vaudreuil"],
  ["08:45", "491", "Plaza Vaudreuil"],

  ["09:00", "490", "Gare Vaudreuil"],
  ["09:07", "490", "Bourget / Saint-Charles"],

  ["09:15", "491", "Gare Vaudreuil"],
  ["09:19", "491", "Plaza Vaudreuil"],

  ["09:35", "490", "Gare Vaudreuil"],
  ["09:42", "490", "Bourget / Saint-Charles"],

  ["10:06", "491", "Gare Vaudreuil"],
  ["10:10", "491", "Plaza Vaudreuil"],

  ["10:45", "490", "Gare Vaudreuil"],
  ["10:52", "490", "Bourget / Saint-Charles"],

  ["11:15", "491", "Gare Vaudreuil"],
  ["11:19", "491", "Plaza Vaudreuil"],

  ["11:45", "490", "Gare Vaudreuil"],
  ["11:52", "490", "Bourget / Saint-Charles"]
];

const remTimes = [
  "08:10","08:24","08:38","08:52",
  "09:06","09:20","09:34","09:48",
  "10:02","10:16","10:30","10:44","10:58",
  "11:12","11:26"
];

const result = document.getElementById("result");

function nextREM(busTime) {

    const [busH, busM] = busTime.split(":").map(Number);
    const busMinutes = busH * 60 + busM;

    for (const rem of remTimes) {

        const [remH, remM] = rem.split(":").map(Number);
        const remMinutes = remH * 60 + remM;

        if (remMinutes >= busMinutes) {
            return rem;
        }
    }

    return "-";
}

function updateBusDisplay() {

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const upcoming = buses.filter(bus => {
        const [h, m] = bus[0].split(":").map(Number);
        return (h * 60 + m) >= currentMinutes;
    });

    let html = `
        <h3>Current Time</h3>
        <p>${now.toLocaleTimeString()}</p>
    `;

    if (upcoming.length > 0) {

        const next = upcoming[0];

        const [h, m] = next[0].split(":").map(Number);
        const wait = (h * 60 + m) - currentMinutes;

        html += `
            <div style="
                background:#dff6dd;
                padding:15px;
                border-radius:10px;
                margin-top:10px;
            ">
                <h2>✅ Recommended Trip</h2>

                <p><strong>Bus Departure:</strong> ${next[0]}</p>
                <p><strong>Bus:</strong> ${next[1]}</p>
                <p><strong>Stop:</strong> ${next[2]}</p>
                <p><strong>Next REM:</strong> ${nextREM(next[0])}</p>
                <p><strong>Leaves In:</strong> ${wait} minute(s)</p>
            </div>

            <h3>All Remaining Buses Today</h3>
        `;

        upcoming.forEach(bus => {

            html += `
                <p>
                    <strong>${bus[0]}</strong> |
                    Bus ${bus[1]} |
                    ${bus[2]} |
                    REM ${nextREM(bus[0])}
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

        buses.forEach(bus => {

            html += `
                <p>
                    <strong>${bus[0]}</strong> |
                    Bus ${bus[1]} |
                    ${bus[2]} |
                    REM ${nextREM(bus[0])}
                </p>
            `;
        });

        html += `</div>`;
    }

    result.innerHTML = html;
}

updateBusDisplay();

setInterval(() => {
    updateBusDisplay();
}, 30000);
