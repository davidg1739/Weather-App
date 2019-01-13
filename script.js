$(function() {

    // $.get("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY", {
    //   key: AIzaSyDuxPyuZ_uvAL3F9bCDGqBEY1I-COIYGeQ

    // }).then(result => {
    //   tokenOfPage = info.nextPageToken;
    // })
    
    function showPosition (position) {
        console.log(position)
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                showPosition,
                function () {
                    console.log('Error')
                },
                {enableHighAccuracy: true}
                )
        }
        else {
            console.log('Error');
        }
    }
    
    getLocation();
})
