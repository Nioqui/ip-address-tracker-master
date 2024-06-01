let coord = {lat: undefined, lng: undefined};

function iniciarMap(coord) {
    coord = {lat: -34.4097558385695, lng: -64.59585097748153};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: coord,
    });
}

 document.getElementById('trackbutton').addEventListener('click', function(event) {
     event.preventDefault();
     trackIp();
 });

 function trackIp(coord){
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
         if(data.city == undefined && data.region == undefined && data.zip == undefined){
            alert('Coloca un ip o dominio valido')
            document.getElementById('ip-result').innerText = "--";
            document.getElementById('Location').innerText = "--";
            document.getElementById('timezone').innerText = "--";
            document.getElementById('ISP').innerText = "--";
         } else{
         coord = {lat: data.lat, lng: data.lon};
         let map = new google.maps.Map(document.getElementById('map'), {
             zoom: 13,
             center: coord,
         });}
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

 function displayError(message) {
     const infoDiv = document.getElementById('info');
     infoDiv.innerHTML = `<p>Error: ${message}</p>`;
}





