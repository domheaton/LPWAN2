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

  //dumb html elements and THEIR IDs
  const rawObject = document.getElementById('payload_raw');
  const dataObject = document.getElementById('payload_data');
  const completeDataObject = document.getElementById('complete_data');

  // array to read in the raw payload for decoding into string
  var payloadRaw = [];

  //create reference to firebase
  const firebaseRef = firebase.database().ref().child('-LRR7ehUYNQX2v60MHAq');

  //take snapshot of all the sensor data
  firebaseRef.on('value', snap => {
    completeDataObject.innerText = JSON.stringify(snap.val(), null, 3);
  });

  firebaseRef.child('payload_raw').on('value', snap => {
    rawObject.innerText = JSON.stringify(snap.val(), null, 3);
    payloadRaw = snap.val();
    var i;
    // for loop to convert from ASCII array to string
    for(i = 0; i < payloadRaw.length; i++) {
      dataObject.innerText += String.fromCharCode(payloadRaw[i]);
    }
  });

}());
