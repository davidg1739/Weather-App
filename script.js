'use strict'
$(function() {
    var placesArray;
    var searchResults = [];

    $('.search').focus();

    var countryArray = [];
    var cityArray = [];

    $.get("countries.json", countries => {
        for (let countryCode in countries) {
            countryArray.push([countryCode])
        }

        var paises = Object.keys(countries).map(function(key) {
            return [Number(key), countries[key]];
        });

        var countryNames = [];

        paises.forEach(pais => {
            let tempCountry = pais[1];
            countryNames.push(tempCountry.name);
        });

        for (let a = 0; a < countryArray.length; a++) {
            countryArray[a].push(countryNames[a]);
        }
    });

    placesArray = countryArray;


    $.get("cities.json", cities => {
        console.log(cities);
        var citiesArray = [];
        for (let h = 0; h < cities.length; h++) {
            let tempArray = Object.keys(cities[h]).map(function(key) {
                return cities[h][key];
            });
            citiesArray.push(tempArray);
        }


        for (let b = 0; b < placesArray.length; b++) {
            let tempCountryAbbreviation = placesArray[b][0];
            let result = citiesArray.filter(c => c[0] == tempCountryAbbreviation);
            placesArray[b].push(result);
            placesArray[b][2].sort()

        }

        console.log(placesArray);

    });


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
        let searchTerms = $('.search').val();
        searchTerms = capitalizeEachWord(searchTerms);
        searchResults.length = 0;


        if (searchTerms.indexOf(",") == -1) {
            for (let i = 0; i < placesArray.length; i++) {
                for (let o = 0; o < placesArray[i][2].length; o++) {
                    let result = placesArray[i][2][o].filter(c => c == searchTerms);
                    if (result.length != 0) {
                        searchResults.push([placesArray[i][2][o], { country: placesArray[i][1] }]);
                    }
                }

            }
            console.log(searchResults);
        }
        else {
            searchTerms = searchTerms.split(',');
            searchTerms[1] = searchTerms[1].substring(1);
            console.log(searchTerms);
            for (let e = 0; e < placesArray.length; e++) {
                if (placesArray[e][1] == searchTerms[1]) {

                    for (let l = 0; l < placesArray[e][2].length; l++) {
                        let result = placesArray[e][2][l].filter(c => c == searchTerms[0]);
                        if (result.length != 0) {
                            searchResults.push([placesArray[e][2][l], { country: placesArray[e][1] }]);
                        }
                    }
                }
            }


        }

        if (searchResults.length > 0) {
            $('.toggable').css('display', 'none');
            $('.resultsList').css('display', 'block');
            let resultLinksDiv = $('.resultLinks');
            $(resultLinksDiv).empty();

            for (let z = 0; z < searchResults.length; z++) {
                let countryResult = searchResults[z][1].country;
                let cityName = searchResults[z][0][1];
                let placeLat = searchResults[z][0][2];
                let placeLong = searchResults[z][0][3];

                let tempLink = $(`<a class='searchResultLink' style='color:rgb(0,123,255);' data-lat='${placeLat}' data-long='${placeLong}'>${cityName}, ${countryResult}</a><br>`);

                $(tempLink).hover(function() {
                    $(this).css('cursor', 'pointer');
                    $(this).css('text-decoration', 'underline');
                }, function() {
                    $(this).css('cursor', 'default');
                    $(this).css('text-decoration', 'none');
                });
                $(resultLinksDiv).append(tempLink);
                $(resultLinksDiv).append($(`<ul><li>Lattitude: ${placeLat}</li><li>Longitude: ${placeLong}</li></ul>`))
            }
            $(resultLinksDiv).prepend($('<p>A city may show up more than once with its country becuase there are multiple places which this Weather App canuse that have the terms you searched for.</p>'))
            $('.searchResultLink').on('click', function() {
                let location = $(this).data();
                let locationPosition = {
                    lat: location.lat,
                    long: location.long
                };
                getWeather(locationPosition);
            });
        }
        else if (searchResults.length == 0) {
            alert("Location Not Found!");
        }

    });

    function getDateAndTime() {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let currentDate = new Date();
        let time = clockConversion([currentDate.getHours(), currentDate.getMinutes()], "12");
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

    function clockConversion(inputtedTime, format) {
        let t;
        let mins;
        if (format == "12") {
            if (inputtedTime[1] < 10) {
                mins = "0" + inputtedTime[1];
            }
            else {
                mins = inputtedTime[1];
            }

            if (inputtedTime[0] < 12) {
                t = `${inputtedTime[0]}` + ':' + `${mins}` + ' AM';
            }
            else if (inputtedTime[0] == 12) {
                t = `${inputtedTime[0]}` + ':' + `${mins}` + ' PM';
            }
            else if (inputtedTime[0] > 12) {
                let tempOperation = inputtedTime[0] % 12;
                t = `${tempOperation}` + ':' + `${mins}` + ' PM';
            }
            else {
                let tempOperation = inputtedTime[0] / 2;
            }
            return t
        }
        else if (format == '24') {
            let hr = inputtedTime + 12;
            hr = new String(hr);
            return hr;
        }

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
                    console.log('Error');
                }, { enableHighAccuracy: true }
            );
        }
        else {
            console.log('Error');
        }
    }

    getLocation();

    function capitalizeEachWord(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }

        return splitStr.join(' ');
    }


    function getWeather(coords) {
        $('.toggable').css('display', 'block');
        $('.resultsList').css('display', 'none');
        $('.locationInfo').html(`Lattitude: ${coords.lat} Longitude: ${coords.long}`)


        $('.weather-temperature').openWeather({
            key: "75735e198dd34b697621802ee7001b9e",
            lat: coords.lat,
            lng: coords.long,
            descriptionTarget: ".desc",
            windSpeedTarget: ".windSpeed",
            sunriseTarget: ".sunriseTime",
            sunsetTarget: ".sunsetTime",
            success: weatherOutput
        });

        function weatherOutput(result) {
            console.log(result);

            var start = new Date();

            let currentTime = getDateAndTime();
            currentTime = currentTime[4];
            currentTime = currentTime.split(" ");
            currentTime[0].split(":")




            var sunrise = new Date();
            let sunriseTimeForResult = result.sunrise;
            sunriseTimeForResult = sunriseTimeForResult.split(":");

            let tempHr = currentTime[0].split(':')[0];
            tempHr = Number(tempHr);

            if (currentTime[1] == "PM" || tempHr > sunriseTimeForResult[0]) {
                sunrise.setDate(start.getDate() + 1);
            }
            sunriseTimeForResult[1] = sunriseTimeForResult[1].split(" ");
            if (sunriseTimeForResult[1][1] == "AM") {
                sunriseTimeForResult[0] = sunriseTimeForResult[0];
            }
            else if (sunriseTimeForResult[1][1] == "PM") {
                sunriseTimeForResult[0] = clockConversion(Number(sunriseTimeForResult[0]), '24');
            }
            sunrise.setHours(sunriseTimeForResult[0], sunriseTimeForResult[1][0]);

            let timeDiffSr = 0;
            let hours = 1000 * 60 * 60;
            timeDiffSr = ((sunrise - start) / hours);
            timeDiffSr = new String(timeDiffSr).split(".");
            timeDiffSr[0] = timeDiffSr[0] + " hours ";
            timeDiffSr[1] = "." + timeDiffSr[1];

            if (isNaN(Number(timeDiffSr[1]))) {
                timeDiffSr = "";
            }
            else {
                timeDiffSr[1] = new String((Math.floor(Number(timeDiffSr[1]) * 60))) + " minutes";
            }

            var sunset = new Date();
            sunset.setDate(start.getDate() + 1);
            let sunsetTimeForResult = result.sunset;
            sunsetTimeForResult = sunsetTimeForResult.split(":");
            if ((currentTime[1] == "PM" && tempHr > sunsetTimeForResult[0])) {
                sunset.setDate(start.getDate() + 1);
            }
            sunsetTimeForResult[1] = sunsetTimeForResult[1].split(" ");
            if (sunsetTimeForResult[1][1] == "AM") {
                sunsetTimeForResult[0] = sunsetTimeForResult[0];
            }
            else if (sunsetTimeForResult[1][1] == "PM") {
                sunsetTimeForResult[0] = new String((Number(sunsetTimeForResult[0]) + 12));
            }
            sunset.setHours(sunsetTimeForResult[0], sunsetTimeForResult[1][0]);

            let timeDiffSs = 0;
            timeDiffSs = ((sunset - start) / hours);
            timeDiffSs = new String(timeDiffSs).split(".");
            timeDiffSs[0] = timeDiffSs[0] + " hours ";
            timeDiffSs[1] = "." + timeDiffSs[1];

            if (isNaN(Number(timeDiffSs[1]))) {
                timeDiffSs[1] = "";
            }
            else {
                timeDiffSs[1] = new String((Math.floor(Number(timeDiffSs[1]) * 60))) + " minutes";
            }


            let timeDiffs = {
                sunrise: timeDiffSr,
                sunset: timeDiffSs
            };

            $('.srTime').html(timeDiffs.sunrise);
            $('.ssTime').html(timeDiffs.sunset);


            let speed = $('.windSpeed').html();
            speed = speed.split(" ");
            speed = $(`<span class='speedNumber'>${speed[0]}</span> <span data-toggle="tooltip" title="Meters Per Second">${speed[1]}</span>`);
            $('.windSpeed').html(speed);

            let windSpeedMilesPerHour = $('.speedNumber').html();
            console.log(windSpeedMilesPerHour);
            windSpeedMilesPerHour = windSpeedMilesPerHour.split(" ");
            windSpeedMilesPerHour = new String((Number(windSpeedMilesPerHour[0]) * 2.236936)) + " mph";

            $('.otherSpeeds').html(windSpeedMilesPerHour)

            let description = $('.desc').html();
            description = description.charAt(0).toUpperCase() + description.slice(1);
            $('.desc').html(description);
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
