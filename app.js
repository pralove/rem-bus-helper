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

const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

let upcoming = buses.filter(bus => {
    const [h,m] = bus[0].split(":").map(Number);
    return (h * 60 + m) >= currentMinutes;
});

let html = `
<h3>Current Time</h3>
<p>${now.toLocaleTimeString()}</p>
`;

if (upcoming.length > 0) {

    const next = upcoming[0];

    const [h,m] = next[0].split(":").map(Number);
    const wait = (h * 60 + m) - currentMinutes;

    html += `
    <div style="
        background:#dff6dd;
        padding:15px;
        border-radius:10px;
        margin-top:10px;
    ">
        <h2>✅ Recommended Bus</h2>

        <p><b>Time:</b> ${next[0]}</p>
        <p><b>Bus:</b> ${next[1]}</p>
        <p><b>Stop:</b> ${next[2]}</p>
        <p><b>Leaves In:</b> ${wait} minute(s)</p>
    </div>

    <h3>Next 5 Buses</h3>
    `;

    upcoming.slice(0,5).forEach(bus => {
        html += `<p>${bus[0]} | Bus ${bus[1]} | ${bus[2]}</p>`;
    });

} else {

    html += `
    <div style="
        background:#fff3cd;
        padding:15px;
        border-radius:10px;
    ">
        <h2>🌙 Tomorrow's First Bus</h2>

        <p><b>05:27</b> | Bus 491 | Gare Vaudreuil</p>
        <p><b>05:31</b> | Bus 491 | Plaza Vaudreuil</p>
        <p><b>05:45</b> | Bus 491 | Gare Vaudreuil</p>
        <p><b>05:49</b> | Bus 491 | Plaza Vaudreuil</p>
        <p><b>06:05</b> | Bus 490 | Gare Vaudreuil</p>
    </div>
    `;
}

result.innerHTML = html;
