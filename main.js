document.getElementById('trackbutton').addEventListener('click', function(event) {
    event.preventDefault();
    trackIp();
});



function trackIp(){
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
        console.log(data);
        displayInfo(data);
    })
    .catch(error => {
        console.error('Error:', error);
        displayError(error.message);
    });

}

function displayInfo(data) {
    document.getElementById('ip-result').innerText = data.query;
    document.getElementById('Location').innerText = data.city + " " + data.region + " " + data.zip;
    document.getElementById('timezone').innerText = data.timezone;
    document.getElementById('ISP').innerText = data.isp;
}

//function displayError(message) {
//    const infoDiv = document.getElementById('info');
//    infoDiv.innerHTML = `<p>Error: ${message}</p>`;
//}






