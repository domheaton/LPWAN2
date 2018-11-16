(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAu-3f0gwQxpv7_xyisyGoBUtHymejxmcQ",
    authDomain: "wireless-networks-lpwan2.firebaseapp.com",
    databaseURL: "https://wireless-networks-lpwan2.firebaseio.com",
    projectId: "wireless-networks-lpwan2",
    storageBucket: "wireless-networks-lpwan2.appspot.com",
    messagingSenderId: "868186919348"
  };
  firebase.initializeApp(config);

  /*-------------------------------------------------------------------------*/
  // ALL OF THE FOLLOWING NEEDS UPDATING TO FIND THE CORRECT DATA FROM FIREBASE
  // CURRENTLY THE CODE BELOW WAS FOR GRAPHS IN THE ARDUINO EXAMPLE CODE
  /*-------------------------------------------------------------------------*/

  // Record of temperature and humidity
  var temperature = ["0"];
  var humidity = ["0"];

  window.onload = function () {
    var temperatureDataPoints = [{y : 0}];
    var humidityDataPoints = [{y: 0}];
    var chart = new CanvasJS.Chart("chartContainer", {
      title : {
        text : "Sensor Data"
      },
      data : [{
        type : "spline",
        showInLegend: true,
        name: "Temperature",
        dataPoints : temperatureDataPoints
      }, {
        type : "spline",
        showInLegend: true,
        name: "Humidity",
        dataPoints : humidityDataPoints
      }]
    });
    chart.render();

    function updateTemperatureChart(value) {
      temperatureDataPoints.push({y : value});
      humidityDataPoints.push({y: humidity[humidity.length - 1]});
      chart.render();
    }

    function updateHumidityChart(value) {
      humidityDataPoints.push({y : value});
      temperatureDataPoints.push({y: temperature[temperature.length - 1]});
      chart.render();
    }

    //create references to firebase
    const firebaseTemperature = firebase.database().ref().child('temperature');
    const firebaseHumidity = firebase.database().ref().child('humidity');

    //take snapshot of all the sensor data
    firebaseTemperature.on('value', snap => {
      temperature.push(parseInt(JSON.stringify(snap.val(), null, 3)));
      value = temperature[temperature.length - 1];
      console.log("Temperature: " + temperature);
      updateTemperatureChart(value);
    });

    //take snapshot of all the sensor data
    firebaseHumidity.on('value', snap => {
      humidity.push(parseInt(JSON.stringify(snap.val(), null, 3)));
      value = humidity[humidity.length - 1];
      console.log("Humidity: " + humidity);
      updateHumidityChart(value)
    });

  }

}());
