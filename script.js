$(function() {

    displayDateAndTime();

    setInterval(displayDateAndTime, 5000);

    function displayDateAndTime() {
        let result = getDateAndTime();

        let dateInfo = result[0] + " " + result[1] + " " + result[2] + ", " + result[3];
        let timeInfo = result[4];

        $('#date').html(dateInfo);
        $('#time').html(timeInfo);
    }

    $('.submitSearch').click(function() {
        getDateAndTime();
    });

    function getDateAndTime() {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let currentDate = new Date();
        let time = clockConversion([currentDate.getHours(), currentDate.getMinutes()]);
        currentDate = new String(currentDate);
        let dateArray = currentDate.split(" ");
        const dateArrayLength = dateArray.length;
        let timeZone = dateArray[dateArrayLength - 3] + " " + dateArray[dateArrayLength - 2] + " " + dateArray[dateArrayLength - 1];

        dateArray.splice((dateArrayLength - 3), 3);
        dateArray.push(timeZone);


        for (let i = 0; i < days.length; i++) {
            let tempDay = days[i];

            if (dateArray[0] == tempDay.substring(0, 3)) {
                dateArray[0] = tempDay;
                break;
            }
        }

        for (let j = 0; j < months.length; j++) {
            let tempMonth = months[j];

            if (dateArray[1] == tempMonth.substring(0, 3)) {
                dateArray[1] = tempMonth;
                break;
            }
        }

        dateArray[4] = time;

        return dateArray;

    }

    function clockConversion(inputtedTime) {
        let t;
        let mins;

        if (inputtedTime[1] < 10) {
            mins = "0" + inputtedTime[1];
        }
        else {
            mins = inputtedTime[1];
        }

        if (inputtedTime[0] < 12) {
            t = `${inputtedTime[0]}` + ':' + `${mins}` + 'am';
        }
        else if (inputtedTime[0] == 12) {
            t = `${inputtedTime[0]}` + ':' + `${mins}` + 'pm';
        }
        else if (inputtedTime[0] > 12) {
            let tempOperation = inputtedTime[0] % 12;
            t = `${tempOperation}` + ':' + `${mins}` + 'pm';
        }
        else {
            let tempOperation = inputtedTime[0] / 2;
        }
        return t

    }

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

    function getWeather(coords, cityName) {
        $('.locationInfo').html(`Lattitude: ${coords.lat} Longitude: ${coords.long}`)

        $('.wordTemperature').css('display', 'block');

        if (!cityName) {
            $('.weather-temperature').openWeather({
                key: "75735e198dd34b697621802ee7001b9e",
                lat: coords.lat,
                lng: coords.long,
                descriptionTarget: ".desc",
                success: weatherOutput
            });
        }
        else {
            $('.weather-temperature').openWeather({
                key: "75735e198dd34b697621802ee7001b9e",
                city: cityName,
                descriptionTarget: ".desc",
                success: weatherOutput
            });
        }

        function weatherOutput(result) {
            console.log(result);

            let currentTemperatureCelsius = result.temperature.current;
            let currentTemperatureFarenheight = currentTemperatureCelsius.replace(/\D/g, "");
            currentTemperatureFarenheight = (((9 / 5) * currentTemperatureFarenheight) + 32);
            let currentTemperatureKelvin = ((((currentTemperatureFarenheight - 32) * (5 / 9)) + 273.15));
            currentTemperatureFarenheight = currentTemperatureFarenheight + '°F';
            currentTemperatureKelvin = currentTemperatureKelvin + '°K';

            $('#otherTemps').html(`${currentTemperatureFarenheight} <br> ${currentTemperatureKelvin}`)
        }

    }


})
