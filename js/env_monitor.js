var pdata = [ 
  { x:[], y: [], max: -10000, min: 10000, type: 'scatter', name: "trace0"},
  { x:[], y: [], max: -10000, min: 10000, type: 'scatter', name: "trace1"} 
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
    var monitor = getlocation();
	var d = getduration();

    // Fetch data and draw the chart
    fetchndraw(monitor.channel,monitor.key,d);
},false);

// Get plot duration from control in web page.  This is a simple control so all
// we need is the "value" attribute for the chosen duration <option>.
function getduration()
{
	    var element = document.getElementById("duration");
    	return element.options[element.selectedIndex].value;
}
// Get details on the monitor selected for display.  Returns an object with a 
// number of useful attributes of the selected monitor based on "value" and
// data attributes for the chosen location <option>
function getlocation()
{
		var element = document.getElementById("location");
		var mon_channel = element.options[element.selectedIndex].dataset.channel;
		var mon_key     = element.options[element.selectedIndex].dataset.key;
		var mon_name    = element.options[element.selectedIndex].text;

		return {
			channel: mon_channel,
			key: mon_key,
			name: mon_name
		};

    	// return element.options[element.selectedIndex].value;
}

function fetchndraw(monitor_channel,monitor_key,duration)
{
  fetch("https://api.thingspeak.com/channels/" + monitor_channel + "/feeds.json?api_key=" + monitor_key + "&results="+(duration*12))
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
	for(i in pdata)  { 
		pdata[i].x.length = 0;  pdata[i].y.length = 0; 
		pdata[i].max = -10000;  pdata[i].min = 10000;
	}
  
    var p = document.getElementById("data");
    p.innerHTML = "";

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
		tempf = data.feeds[i].field1;
		humid = data.feeds[i].field4;
		pdata[0].max = Math.max(pdata[0].max,tempf);
		pdata[0].min = Math.min(pdata[0].min,tempf);

		pdata[1].max = Math.max(pdata[1].max,humid);
		pdata[1].min = Math.min(pdata[1].min,humid);

		var t = moment.parseZone(data.feeds[i].created_at).local().format("YYYY-MM-DD HH:mm:ss");
		pdata[0].x.push(t);  pdata[0].y.push(tempf);
		pdata[1].x.push(t);  pdata[1].y.push(humid);
	}
	// Plot the data
	Plotly.newPlot("chart",pdata,layout,config);
	p.innerHTML += "Min/max: " + pdata[0].min + "\xB0F," + pdata[0].max + "\xB0F;" + 
		pdata[1].min + "% RH," + pdata[1].max + "% RH <br>";
	ldp = data.feeds[data.feeds.length-1];
	p.innerHTML += "Overall min/max: " + ldp.field3 + "\xB0F, " + ldp.field2 + "\xB0F; " +
		ldp.field6 + "% RH, " + ldp.field5 + "% RH<br>";
	p.innerHTML += "Current: " + ldp.field1 + "\xB0F; " + ldp.field4 + "% RH<br>";
}

// Callback invoked when the user selects a new plot duration.  Different duration
// means diferent data so we'll both fetch and draw (and we have to specify the
// duration of data to be fetched, which we can get from the change event).
function changeDurationHandler(event) {
    var monitor = getlocation();
    fetchndraw(monitor.channel,monitor.key,event.target.value);
}

// Callback invoked when the user selects a new monitor location.  
function changeLocationHandler(event) { 
  var d = getduration();

  // Need to retrieve chosen monitor's channel ID and read API key from the
  // data attributes stored in the <option> entry for that monitor
  var loc = event.target;  // The "location" <select> element
  var opt = loc.options[loc.selectedIndex]; // The selected <option> element
  var mon_channel = opt.dataset.channel;
  var mon_key = opt.dataset.key;

  fetchndraw(mon_channel,mon_key,d);
}