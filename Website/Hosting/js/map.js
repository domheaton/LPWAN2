Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2014_us_cities.csv', function(err, rows){

  function unpack(rows, key) {
      return rows.map(function(row) { return row[key]; });
  }

  // var cityName = unpack(rows, 'name'),
  //     cityPop = unpack(rows, 'pop'),
  //     cityLat = unpack(rows, 'lat'),
  //     cityLon = unpack(rows, 'lon')

  // var gatewayName = unpack(rows, 'id')
  // var gatewayLatitude = unpack(rows, 'lat');
  // var gatewayLongitude = unpack(rows, 'lon');

  //location: longitude, latitude, gtw_id
  //physics: 50.935033, -1.399582, eui-7276fffffe01028c
  //ecs: 50.937274, -1.397667, eui-b827ebfffeac4b12
  //building 7(1): 50.935330, -1.393598, eui-7276fffffe0103f0
  //building 7(2): 50.935567, -1.394270, eui-b827ebfffe2d3798

  var gatewayID = ["eui-7276fffffe01028c", "eui-b827ebfffeac4b12", "eui-7276fffffe0103f0", "eui-b827ebfffe2d3798"];
  var gatewayName = ["physics","ecs","building7(1)", "building7(2)"];
  var gatewayLatitude = ["50.935033","50.937274","50.935330","50.935567"];
  var gatewayLongitude = ["-1.399582","-1.397667","-1.393598","-1.394270"];
  var rssi = [-108,-111,-108,-117];
  var color = ["rgb(255,65,54)","rgb(133,20,75)","rgb(255,133,27)","lightgrey"];
  var citySize = [];
  var hoverText = [];
  var scale = 10;

  for ( var i = 0 ; i < rssi.length; i++) {
      var currentSize = Math.abs(rssi[i]) / scale;
      var currentText = "Gateway: " + gatewayName[i] + ". ID: " + gatewayID[i] + ". RSSI: " + rssi[i];
      citySize.push(currentSize);
      hoverText.push(currentText);
  }

  var data = [{
      type: 'scattergeo',
      locationmode: 'ENG',
      lat: gatewayLatitude,
      lon: gatewayLongitude,
      hoverinfo: 'text',
      text: hoverText,
      marker: {
          size: citySize,
          line: {
              color: 'black',
              width: 2
          },
      }
  }];

  var layout = {
      title: 'LoRa Gateways and measured RSSI',
      showlegend: false,
      geo: {
          scope: 'europe',
          // lonaxis: {
          //       'range': [48, 52]
          //   },
          // lataxis: {
          //       'range': [-1.3, -1.40]
          //   },
          automargin: true,
          showland: true,
          landcolor: 'rgb(217, 217, 217)',
          subunitwidth: 1,
          countrywidth: 1,
          subunitcolor: 'rgb(255,255,255)',
          countrycolor: 'rgb(255,255,255)',
          showrivers: true,
          rivercolor: '#fff',
          showlakes: true,
          lakecolor: '#fff',
          showland: true,
          landcolor: '#EAEAAE',
          countrycolor: '#d3d3d3',
          countrywidth: 1.5,
          subunitcolor: '#d3d3d3'
      },
  };

  Plotly.plot('tester', data, layout, {showLink: false});

});
