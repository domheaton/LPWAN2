(function(){

  //initialise firebase
  var config = {
    apiKey: "AIzaSyBBC9v49--edYcis4ye2vIswNZ0Gu3kE9k",
    authDomain: "esp8266-sensordata.firebaseapp.com",
    databaseURL: "https://esp8266-sensordata.firebaseio.com",
    projectId: "esp8266-sensordata",
    storageBucket: "esp8266-sensordata.appspot.com",
    messagingSenderId: "397649331624"
  };
  firebase.initializeApp(config);

  // Record of temperature and humidity
  var temperature = ["0"];
  var humidity = ["0"];

  //dumb html elements and THEIR IDs
  const preObject = document.getElementById('object');
  const ulList = document.getElementById('list');

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
