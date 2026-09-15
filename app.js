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

const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

let upcoming = [];

for (const bus of buses) {
    const [h, m] = bus[0].split(":").map(Number);
    const mins = h * 60 + m;

    if (mins >= currentMinutes) {
        upcoming.push(bus);
    }
}

const result = document.getElementById("result");

if (upcoming.length === 0) {
    result.innerHTML = "<h3>No more morning buses today.</h3>";
} else {
    let html = "<h3>Next Buses</h3>";

    upcoming.slice(0, 5).forEach(bus => {
        html += `
            <p>
                <b>${bus[0]}</b><br>
                Bus ${bus[1]}<br>
                ${bus[2]}
            </p>
            <hr>
        `;
    });

    result.innerHTML = html;
}
