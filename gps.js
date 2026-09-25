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

let userLatitude = null;
let userLongitude = null;
let nearestStop = null;

function findClosestStop() {

    if (userLatitude === null || userLongitude === null) {
        return;
    }

    let closest = null;
    let closestDistance = Number.MAX_VALUE;

    Object.entries(stopLocations).forEach(([name, stop]) => {

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

    nearestStop = closest;
}

function distanceToNearestStop() {

    if (
        userLatitude === null ||
        userLongitude === null ||
        !nearestStop
    ) {
        return null;
    }

    const stop = stopLocations[nearestStop];

    const latDiff =
        userLatitude - stop.lat;

    const lonDiff =
        userLongitude - stop.lon;

    const distanceDegrees =
        Math.sqrt(
            Math.pow(latDiff, 2) +
            Math.pow(lonDiff, 2)
        );

    return Math.round(distanceDegrees * 111000);
}
