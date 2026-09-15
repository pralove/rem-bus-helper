const buses = [
["05:27","491","Gare Vaudreuil"],
["05:31","491","Plaza Vaudreuil"],
["05:45","491","Gare Vaudreuil"],
["05:49","491","Plaza Vaudreuil"],
["06:05","490","Gare Vaudreuil"],
["06:12","490","Bourget / Saint-Charles"],
["06:25","491","Gare Vaudreuil"],
["06:29","491","Plaza Vaudreuil"],
["06:35","490","Gare Vaudreuil"],
["06:42","490","Bourget / Saint-Charles"],
["06:45","491","Gare Vaudreuil"],
["06:49","491","Plaza Vaudreuil"],
["07:00","490","Gare Vaudreuil"],
["07:07","490","Bourget / Saint-Charles"],
["07:13","491","Gare Vaudreuil"],
["07:17","491","Plaza Vaudreuil"],
["07:30","490","Gare Vaudreuil"],
["07:37","490","Bourget / Saint-Charles"],
["07:45","491","Gare Vaudreuil"],
["07:49","491","Plaza Vaudreuil"],
["08:00","490","Gare Vaudreuil"],
["08:07","490","Bourget / Saint-Charles"],
["08:10","491","Gare Vaudreuil"],
["08:14","491","Plaza Vaudreuil"],
["08:27","490","Gare Vaudreuil"],
["08:34","490","Bourget / Saint-Charles"],
["08:41","491","Gare Vaudreuil"],
["08:45","491","Plaza Vaudreuil"],
["09:00","490","Gare Vaudreuil"],
["09:07","490","Bourget / Saint-Charles"],
["09:15","491","Gare Vaudreuil"],
["09:19","491","Plaza Vaudreuil"],
["09:35","490","Gare Vaudreuil"],
["09:42","490","Bourget / Saint-Charles"],
["10:06","491","Gare Vaudreuil"],
["10:10","491","Plaza Vaudreuil"],
["10:45","490","Gare Vaudreuil"],
["10:52","490","Bourget / Saint-Charles"],
["11:15","491","Gare Vaudreuil"],
["11:19","491","Plaza Vaudreuil"],
["11:45","490","Gare Vaudreuil"],
["11:52","490","Bourget / Saint-Charles"]
];

const result = document.getElementById("result");

function updateBusDisplay() {

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let upcoming = buses.filter(bus => {
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
        const busMinutes = h * 60 + m;
        const wait = busMinutes - currentMinutes;

        html += `
        <div style="
            background:#dff6dd;
            padding:15px;
            border-radius:10px;
            margin-top:10px;
        ">
            <h2>✅ Recommended Bus</h2>

            <p><strong>Time:</strong> ${next[0]}</p>
            <p><strong>Bus:</strong> ${next[1]}</p>
            <p><strong>Stop:</strong> ${next[2]}</p>
            <p><strong>Leaves In:</strong> ${wait} minute(s)</p>
        </div>

        <h3>Next 5 Buses</h3>
        `;

        upcoming.slice(0, 5).forEach(bus => {
            html += `
            <p>
                ${bus[0]} | Bus ${bus[1]} | ${bus[2]}
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
            <h2>🌙 Tomorrow's First Buses</h2>

            <p><strong>05:27</strong> | Bus 491 | Gare Vaudreuil</p>
            <p><strong>05:31</strong> | Bus 491 | Plaza Vaudreuil</p>
            <p><strong>05:45</strong> | Bus 491 | Gare Vaudreuil</p>
            <p><strong>05:49</strong> | Bus 491 | Plaza Vaudreuil</p>
            <p><strong>06:05</strong> | Bus 490 | Gare Vaudreuil</p>
        </div>
        `;
    }

    result.innerHTML = html;
}

// Initial load
updateBusDisplay();

// Update every 30 seconds automatically
setInterval(() => {
    updateBusDisplay();
}, 30000);
