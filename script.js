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
        $('.locationInfo').html(`Lattitude: ${coords.lat} Longitude: ${coords.long}`)
        
        $('.wordTemperature').css('display', 'block');
        
        $('.weather-temperature').openWeather({
            key: "75735e198dd34b697621802ee7001b9e",
            lat: coords.lat,
            lng: coords.long,
            descriptionTarget: ".desc",
            success: weatherOutput
        })
        
        function weatherOutput (result) {
            let currentTemperatureCelsius = result.temperature.current;
            let currentTemperatureFarenheight = currentTemperatureCelsius.replace(/\D/g, "");
            currentTemperatureFarenheight = (((9/5) * currentTemperatureFarenheight) + 32);
            let currentTemperatureKelvin = ((((currentTemperatureFarenheight - 32) * (5/9)) + 273.15));
            currentTemperatureFarenheight = currentTemperatureFarenheight + '°F';
            currentTemperatureKelvin = currentTemperatureKelvin + '°K';
            
            $('#otherTemps').html(`${currentTemperatureFarenheight} <br> ${currentTemperatureKelvin}`)
        }
         
    }
    
    
})
