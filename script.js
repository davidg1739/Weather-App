$(function() {
    
    function sendPosition(position) {
        var userCoords = {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }
        getWeather(userCoords);
        
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                sendPosition,
                function() {
                    console.log('Error')
                }, { enableHighAccuracy: true }
            )
        }
        else {
            console.log('Error');
        }
    }
    
    getLocation();
    function getWeather(coords) {
        $('.weather-temperature').openWeather({
            key: "75735e198dd34b697621802ee7001b9e",
            lat: coords.lat,
            lng: coords.long,
            descriptionTarget: ".desc"
        });
         
         $('.locationInfo').html(`Lattitude: ${coords.lat} Longitude: ${coords.long}`)
    }
    
    
})
