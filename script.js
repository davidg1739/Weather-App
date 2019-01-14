$(function() {

    $.get("https://maps.googleapis.com/maps/api/js?key=AIzaSyDuxPyuZ_uvAL3F9bCDGqBEY1I-COIYGeQ").then(result => {
      console.log(result);
    })
    
    

    function showPosition(position) {
        console.log(position)
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                showPosition,
                function() {
                    console.log('Error')
                }, { enableHighAccuracy: true }
            )
        }
        else {
            console.log('Error');
        }
    }
})
