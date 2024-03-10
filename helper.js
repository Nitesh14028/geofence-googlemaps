// google-maps api-key
export const apiKey = "// add-your-apiKey";

export const checkForUserLocation = (setUserLocation) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        if (setUserLocation) {
          setUserLocation({ lat, lng });
        }
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      },
      function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.error("An unknown error occurred.");
            break;
        }
      }
    );
  } else {
    console.error("Geolocation is not available in this browser.");
  }
};
