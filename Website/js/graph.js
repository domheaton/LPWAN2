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
  // Code looks at branches 'rssi' and 'sensors' for new data in Firebase
  /*-------------------------------------------------------------------------*/

  // Record of temperature and humidity
  var temperature = ["0"];
  var humidity = ["0"];
  var rssi = [];
  var gateways = [];

  window.onload = function () {
    var temperatureDataPoints = [{y : 0}];
    var humidityDataPoints = [{y: 0}];
    var rssiDataPoints = [];
    var chart = new CanvasJS.Chart("chartContainer", {
      title: {
        text: "Sensor Data"
      },
      data: [{
        type: "spline",
        showInLegend: true,
        name: "Temperature",
        dataPoints: temperatureDataPoints
      }, {
        type: "spline",
        showInLegend: true,
        name: "Humidity",
        dataPoints: humidityDataPoints
      }]
    });
    chart.render();

    var chart2 = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      title:{
        text: "RSSI Measurements"
      },
      axisY: {
        title: "RSSI",
        suffix: "/ dB",
        reversed: false
      },
      axisX2: {
        tickThickness: 0,
        labelAngle: 0
      },
      data: [{
        type: "column", //change type to bar, line, area, pie, etc
        //indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: rssiDataPoints
      }]
    });
    chart2.render();

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

    function updateRSSI() {
      rssiDataPoints[0] = {y: rssi[0], label: "Physics"};
      rssiDataPoints[1] = {y: rssi[1], label: "ECS"};
      rssiDataPoints[2] = {y: rssi[2], label: "Building 7 (1)"};
      rssiDataPoints[3] = {y: rssi[3], label: "Building 7 (2)"}
      chart2.render();
    }

    //create references to firebase
    const firebaseTemperature = firebase.database().ref().child('sensors').child('temperature');
    const firebaseHumidity = firebase.database().ref().child('sensors').child('humidity');
    const firebaseRSSI = firebase.database().ref().child('rssi');

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
      updateHumidityChart(value);
    });

    //take snapshot of the rssi measurements
    //rssi array in the following order: 0=Physics,1=ECS,2=Building7(1),3=Building7(2)
    firebaseRSSI.on('value', snap => {
      console.log(snap.val());
      rssi[0] = snap.child("physics").val();
      rssi[1] = snap.child("ecs").val();
      rssi[2] = snap.child("building7_1").val();
      rssi[3] = snap.child("building7_2").val();
      console.log(rssi);
      updateRSSI();
    });
  }

}());
