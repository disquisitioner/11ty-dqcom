var ts_channels = [
    {
      channel_id: "1085121",
      channel_key: "17ELSEET4O568P5B"
    },
    {
      channel_id: "544249",
      channel_key: "7DOZYKVPMRESIV92"
    }
];

var pdata = [ 
  { x:[], y: [], type: 'scatter', name: "trace0"},
  { x:[], y: [], type: 'scatter', name: "trace1"} 
];

var layout = {
  title: 'Title of the Graph',
  xaxis: { title: 'Time' },
  yaxis: { title: 'Sensor Value' },
  showlegend: true,
  legend: { orientation: "h", y: -0.2 },
  margin: { l: 30, r: 30 },
  xaxis: { showline: true },
  yaxis: { showline: true }
};
var config = {
  displayModeBar: false,
  editable: false,
  scrollZoom: false,
  responsive: true
};


// Splice in Javascript functionality once the page DOM is loaded
document.addEventListener('DOMContentLoaded',function() {

	 // Register a handler so we can process changes in the chart 'duration' selection
	document.querySelector('select[name="duration"]').onchange=changeDurationHandler;
	// Register a handler so we can process changes in the chart 'type' selection
	document.querySelector('select[name="location"]').onchange=changeLocationHandler;

    // Make sure the plot drawn matches the selected duration & location, even on page reload
    var l = getlocation();
	var d = getduration();

    // Fetch data and draw the chart
    fetchndraw(l,d);
},false);

// Get plot duration from control in web page
function getduration()
{
	    var element = document.getElementById("duration");
    	return element.options[element.selectedIndex].value;
}
// Get plot type from control in web page
function getlocation()
{
		var element = document.getElementById("location");
    	return element.options[element.selectedIndex].value;
}

function fetchndraw(location,duration)
{
  fetch("https://api.thingspeak.com/channels/" + ts_channels[location].channel_id + "/feeds.json?api_key=" + ts_channels[location].channel_key + "&results="+(duration*12))
		.then(function(response) {
		return response.json();
		})
		.then(function(data) {
      renderdata(data);
    });
}


function renderdata(data) {
	var f = document.getElementById("chanid");
	f.innerHTML = data.channel.id;
	f = document.getElementById("channame");
	f.innerHTML = data.channel.name;
	layout.title = data.channel.name;

	f = document.getElementById("chandesc");
	f.innerHTML = data.channel.description;
	f = document.getElementById("count");
	f.innerHTML = data.feeds.length;

	// Discard previous data
	for(i in pdata)  { pdata[i].x.length = 0;  pdata[i].y.length = 0; }
  
    var p = document.getElementById("data");

	// Label plots based on field names in retrieved data
	pdata[0].name = data.channel.field1;
	pdata[1].name = data.channel.field4;

	// Load up the data values so we can feed the right structure to Plotly
	for(var i=0;i<data.feeds.length;i++) {

		/*
		p.innerHTML += data.feeds[i].created_at  + ": " +
		data.channel.field1 + " = " + data.feeds[i].field1 + ", " +
		data.channel.field4 + " = " + data.feeds[i].field4 + "<br>";
		*/

		var t = moment.parseZone(data.feeds[i].created_at).local().format("YYYY-MM-DD HH:mm:ss");
		pdata[0].x.push(t);  pdata[0].y.push(data.feeds[i].field1);
		pdata[1].x.push(t);  pdata[1].y.push(data.feeds[i].field4);
	}
	// Plot the data
	Plotly.newPlot("chart",pdata,layout,config);
}

// Callback invoked when the user selects a new plot duration.  Different duration
// means diferent data so we'll both fetch and draw (and we have to specify the
// duration of data to be fetched, which we can get from the change event).
function changeDurationHandler(event) {
    var l = getlocation();
    fetchndraw(l,event.target.value);
}

// Callback invoked when the user selects a new monitor location.  
function changeLocationHandler(event) { 
  var d = getduration();
  fetchndraw(event.target.value,d);
}