let map;
let marker;

function iniciarMap(coord) {
    coord = {lat: undefined, lng: undefined};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: coord,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false, 
        streetViewControl: false,
        fullscreenControl: false, 
    });
    marker = new google.maps.Marker({
        position: coord,
        map: map
    });
}

document.getElementById('trackbutton').addEventListener('click', function(event) {
    event.preventDefault();
    trackIp();
});

function trackIp() {
    let ip = document.getElementById('search').value;
    const apiURL = `http://ip-api.com/json/${ip}`;

    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            if (data.city === undefined && data.region === undefined && data.zip === undefined) {
                alert('Coloca un IP o dominio válido');
                document.getElementById('ip-result').innerText = "--";
                document.getElementById('Location').innerText = "--";
                document.getElementById('timezone').innerText = "--";
                document.getElementById('ISP').innerText = "--";
            } else {
                const newCoord = {lat: data.lat, lng: data.lon};
                moveMarker(newCoord);
                const utcOffset = getUtcOffset(data.timezone);
                document.getElementById('timezone').innerText = utcOffset;
                displayInfo(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayError(error.message);
        });
}

function moveMarker(newCoord) {
    marker.setPosition(newCoord);
    map.setCenter(newCoord);
}

function displayInfo(data) {
    document.getElementById('ip-result').innerText = data.query;
    document.getElementById('Location').innerText = `${data.city} ${data.region} ${data.zip}`;
    document.getElementById('ISP').innerText = data.isp;
}

function displayError(message) {
    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `<p>Error: ${message}</p>`;
}

function getUtcOffset(timezone) {
    try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const parts = formatter.formatToParts(now);
        const hourPart = parts.find(part => part.type === 'hour');
        const minutePart = parts.find(part => part.type === 'minute');
        const secondPart = parts.find(part => part.type === 'second');
        
        const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
        const utcTime = new Date(now.toUTCString().slice(0, -4));
        
        const offsetInMinutes = (localTime - utcTime) / 60000;
        const offsetHours = Math.floor(Math.abs(offsetInMinutes) / 60);
        const offsetMinutes = Math.abs(offsetInMinutes % 60);
        const sign = offsetInMinutes >= 0 ? '+' : '-';
        
        const formattedOffset = `UTC ${sign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
        return formattedOffset;
    } catch (error) {
        console.error('Error calculating UTC offset:', error);
        return "Invalid timezone";
    }
}