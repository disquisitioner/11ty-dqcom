// ORIG:   https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.2/mqttws31.min.js
// LATEST: https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.1.0/paho-mqtt.min.js

var mqttHost = "mqtt.thingspeak.com";
var mqttPort = 443; // 80 if not TLS/SSL
var username = "dbryant";
var password = "3WDQKGINHS3CO90O";

var wxTopic  = "channels/544523/subscribe/json/L42E70XGWQORK465";
var aqiTopic = "channels/1133867/subscribe/json/7U3QBCY788QDE5JF";

var latestAqi = "---";

var seriesOut = { x:[], y:[], type: 'scatter', name: 'Outside Temperature', max: -1000, min: 1000};
var seriesIn  = { x:[], y:[], type: 'scatter', name: 'Inside Temperature', max: -1000, min: 1000};
var seriesAqi = { 
    x:[], y:[], type: 'scatter', max: -1000, min: 1000,
    line: {dash: 'dot', color: 'rgb(148,103,189)'}, yaxis: 'y2', 
    name: 'Air Quality Index'
};
var pdata = [seriesOut, seriesIn, seriesAqi];


var plotLayout = {
  title: 'Temperature and AQI at Home',
  showlegend: true,
  legend: { orientation: "h", y: -0.2 },
  xaxis: { 
    title: 'Time',
    showline: true },
  yaxis: { 
    title: 'Temperature &#176;F',
    showline: true
  },
  yaxis2: {
    title: 'AQI',
    titlefont: {color: 'rgb(148,103,189)'},
    tickfont:  {color: 'rgb(148,103,189)'},
    overlaying: 'y',
    showline: true,
    side: 'right'
  }
};
var plotConfig = {
  displayModeBar: false,
  editable: false,
  scrollZoom: false,
  responsive: true
};

// Splice in Javascript functionality once the page DOM is loaded
document.addEventListener('DOMContentLoaded',function() {
    // Initiate connections to the ThingSpeak MQTT broker
    startConnect();
},false);

// Connect to the ThingSpeak MQTT broker for WX & AQI sensor data
function startConnect() {

    // Start with the AQI channel (because we plot when we receive WX data)
    // Generate a random client ID
    clientIdAqi  = "AQIclientID-"  + parseInt(Math.random() * 100);

    // Initialize new Paho client connection
    client_aqi = new Paho.Client(mqttHost, Number(mqttPort), clientIdAqi);

    client_aqi.onConnectionLost = onConnectionLost;
    client_aqi.onFailure        = connectFailed;
    client_aqi.onMessageArrived = onAqiMessageArrived;

    // Connect the client, if successful onConnect function will get called
    try {
        client_aqi.connect({ 
            userName: username,           // Often ignored so can be any string
            password: password,       // For ThingSpeak must be account MQTT key
            reconnect: true,
            useSSL: true,
            onSuccess: onAqiConnect,
            invocationContext: {
                topic: aqiTopic,         // Will need topic in order to subscribe once connected
            },
        });
    } catch(error) {
       console.error(error);
    } 

    // Now do the Weather Station channel
    // Generate a random client ID
    clientIdWx  = "WXclientID-"  + parseInt(Math.random() * 100);

    // Initialize new Paho client connection
    client_wx = new Paho.Client(mqttHost, Number(mqttPort), clientIdWx);

    client_wx.onConnectionLost = onConnectionLost;
    client_wx.onFailure        = connectFailed;
    client_wx.onMessageArrived = onWxMessageArrived;

    // Connect the client, if successful onConnect function will get called
    try {
        client_wx.connect({ 
            userName: username,           // Often ignored so can be any string
            password: password,       // For ThingSpeak must be account MQTT key
            reconnect: true,
            useSSL: true,
            onSuccess: onWxConnect,
            invocationContext: {
                topic: wxTopic,         // Will need topic in order to subscribe once connected
            },
        });
    } 
    catch(error) {
       console.error(error);
    }


}

// Called when the WX client connects and subscribes to get WX data updates
function onWxConnect(responseObject) {

    // Retrieve subscription topic from MQTT connect's invocation context 
    // (passed in when we attempted to connect())
    topic = responseObject.invocationContext.topic;
    // console.log(topic);

    // Subscribe to the requested topic
    client_wx.subscribe(topic,{
        onSuccess: subSuccess,
        onFailure: subFailed,
    });
}

// Called when the AQI client connects and subscribes to get AQI data updates
function onAqiConnect(responseObject) {

    // Retrieve subscription topic from MQTT connect's invocation context 
    // (passed in when we attempted to connect())
    topic = responseObject.invocationContext.topic;
    // console.log(topic);

    // Subscribe to the requested topic
    client_aqi.subscribe(topic,{
        onSuccess: subSuccess,
        onFailure: subFailed,
    });
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('Connection lost, error #: ' + responseObject.errorCode + " : " + responseObject.errorMessage);
    }
    else {
        console.log("ERROR: Connection lost!");
    }
}

// Called if the connect fails or times out
function connectFailed(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('Connect failed, error #: ' + responseObject.errorCode + " : " + responseObject.errorMessage);
    }
    else {
        console.log("ERROR: Connect failed!");
    }
}

// Called if the subscribe request succeeds
function subSuccess() {
    // console.log("Subscribe succeeded");
}

// Called if the subscribe request fails
function subFailed(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log('Subscription failed, error #: ' + responseObject.errorCode + " : " + responseObject.errorMessage);
    }
    else {
        console.log("ERROR: Subscription failed!");
    }
}

// Called when the disconnect button is pressed
function startDisconnect() {
    client_wx.disconnect();
    client_aqi.disconnect();
}

// Called with the "Trim Data" button is presseed.
// Shaves off the oldest 25% of accumulated data
function reduceData() {
    let len = Math.floor(0.25*seriesOut.x.length);
    seriesOut.x.splice(0,len);
    seriesOut.y.splice(0,len);
    seriesIn.x.splice(0,len);
    seriesIn.y.splice(0,len);
    
    len = Math.floor(0.25*seriesAqi.x.length);
    seriesAqi.x.splice(0,len);
    seriesAqi.y.splice(0,len);

    // Recompute max and mins
    seriesOut.max = -1000; seriesOut.min = 1000;
    seriesIn.max  = -1000; seriesIn.min  = 1000;
    seriesAqi.max = -1000; seriesAqi.min = 1000;
    for(let i of seriesOut.y) { 
        seriesOut.max = Math.max(seriesOut.max,i); 
        seriesOut.min = Math.min(seriesOut.min,i)
    }
    for(let i of seriesIn.y) { 
        seriesIn.max = Math.max(seriesIn.max,i); 
        seriesIn.min = Math.min(seriesIn.min,i)
    }
    for(let i of seriesOut.y) { 
        seriesAqi.max = Math.max(seriesAqi.max,i); 
        seriesAqi.min = Math.min(seriesAqi.min,i)
    }

    // Redraw the plot
    Plotly.newPlot('graph',pdata,plotLayout,plotConfig);
}


// Specialized message handler for the Home Weather Station channel
// channel: 544523
// ReadKey: L42E70XGWQORK465

function onWxMessageArrived(message) {
    // console.log("onMessageArrived: " + message.payloadString);

    var obj = JSON.parse(message.payloadString);
    let otemp = obj.field2;
    let itemp = obj.field4;
    let tstamp = obj.field1;
    var latest = document.getElementById("latest");
    latest.innerHTML =
        otemp + ' &#176;F outside, ' + itemp + ' &#176;F inside, ' + latestAqi + ' aqi, at ' + tstamp;

    var t = moment.parseZone(obj.created_at).local().format("YYYY-MM-DD HH:mm:ss");
    seriesOut.x.push(t);
    seriesOut.y.push(otemp);
    seriesIn.x.push(t);
    seriesIn.y.push(itemp);

    seriesOut.max = Math.max(seriesOut.max,otemp);
    seriesOut.min = Math.min(seriesOut.min,otemp);
    seriesIn.max  = Math.max(seriesIn.max,itemp);
    seriesIn.min  = Math.min(seriesIn.min,itemp);

    Plotly.newPlot('graph',pdata,plotLayout,plotConfig);

    // Update widgets
    document.getElementById("curotemp").innerHTML = otemp;
    document.getElementById("maxotemp").innerHTML = seriesOut.max;
    document.getElementById("minotemp").innerHTML = seriesOut.min;
    document.getElementById("curitemp").innerHTML = itemp;
    document.getElementById("maxitemp").innerHTML = seriesIn.max;
    document.getElementById("minitemp").innerHTML = seriesIn.min;
    document.getElementById("curaqi").innerHTML   = latestAqi;
    document.getElementById("maxaqi").innerHTML   = seriesAqi.max;
    document.getElementById("minaqi").innerHTML   = seriesAqi.min;

    console.log(seriesIn.min,seriesIn.max,seriesOut.min,seriesOut.max,seriesAqi.min,seriesAqi.max);
}

// Specialized message handler for the AQI channel
// channel: 1133867
// ReadKey: 7U3QBCY788QDE5JF

function onAqiMessageArrived(message) {
    // console.log("onMessageArrived: " + message.payloadString);

    // obj.created_at -> timestamp
    var obj = JSON.parse(message.payloadString);
    latestAqi = obj.field1;

    var t = moment.parseZone(obj.created_at).local().format("YYYY-MM-DD HH:mm:ss");
    seriesAqi.x.push(t);
    seriesAqi.y.push(latestAqi);

    seriesAqi.max = Math.max(seriesAqi.max,latestAqi);
    seriesAqi.min = Math.min(seriesAqi.min,latestAqi);

}