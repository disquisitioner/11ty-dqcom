var pdata = [];

var fieldmap = [
  {name: "field1", active: false},
  {name: "field2", active: false},
  {name: "field3", active: false},
  {name: "field4", active: false},
  {name: "field5", active: false},
  {name: "field6", active: false},
  {name: "field7", active: false},
  {name: "field8", active: false}
];
var nfields = 0;

var layout = {
  title: 'Title of the Graph',
  xaxis: { title: 'Time' },
  yaxis: { title: 'Sensor Value' },
  showlegend: true,
  legend: { orientation: "h", y: -0.2 },
  margin: { l: 45, r: 30 },
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
	// document.querySelector('select[name="duration"]').onchange=changeDurationHandler;

  // Make sure the plot drawn matches the selected duration & thing, even on page reload
	// var d = getduration();
	// var fields = getfields();  // Presumes default field is set in HTML

	// Register a function to handle the "Update" button
	document.getElementById("update").onclick = function doUpdate() {
        updateallthings();
	}

	// The first update is free
	updateallthings();

},false);

function updateallthings()
{
  var things = document.getElementsByClassName("thingvalues");
  // Loop though each thing embedded in the page to fetch & display the desired fields
  for (let i=0; i<things.length; i++) {
  	var thing = {
	  	id     : things[i].dataset.thingid,
	  	channel: things[i].dataset.channel,
	  	key    : things[i].dataset.key
  	}
  	
  	updatethingdata(thing);

  	// Display time this data was retrieved
  	var v = document.getElementById("fetchedat");
  	if(v) {
			v.innerHTML = moment().utc().format();
		}
  }
}

// Called to retrieve the most recent data from a ThingSpeak object ("Thing").   We need 
// to know the desired thing's channel number and API read key to fetch the data, plus 
// provide a unique ID for the thing so the right value fields in the HTML page can be 
// located and updated.
function updatethingdata(thing)
{
  fetch("https://api.thingspeak.com/channels/" + thing.channel + "/feeds.json?api_key=" + thing.key + "&results=1")
		.then(function(response) {
		return response.json();
		})
		.then(function(data) {
      updatedata(data,thing);
    });
}

// Update the data in the page
function updatedata(data,thing)
{
	// console.log(data);

	// Check for the presence of each possible field
	for(let j=0; j<8; j++) {
		let id = thing.id + "-" + (j+1);
		let v = document.getElementById(id);
		// If a field is shown, update its value from fetched data
		if(v) {
			let key = "field" + (j+1);
			value = data.feeds[0][key];  // Only one data point so value is in [0]
			v.innerHTML = value;
		}
	}
	// Update the time of this most recent report
	let id = thing.id + "-time";
	let v = document.getElementById(id);
	if(v) {
		v.innerHTML = data.feeds[0]["created_at"];
	}
}


// ========== OLD CODE BELOW, PRESUME UNUSED AND SAFE TO REMOVE (EVENTUALLY) ==========

// Called to retrieve data from ThingSpeak.  This is the basic version that just retrieves
// the most recent data as specified by the duration control.  We need to know the desired
// thing's channel number and API read key, plus the specified duration tells us how many
// data points to request.
function fetchthingdata(thing,duration,fields,update_fields)
{
  fetch("https://api.thingspeak.com/channels/" + thing.channel + "/feeds.json?api_key=" + thing.key + "&results="+(duration*thing.samperhr))
		.then(function(response) {
		return response.json();
		})
		.then(function(data) {
      renderdata(data,fields,update_fields);
    });
}

// Get plot duration from control in web page.  This is a simple control so all
// we need is the "value" attribute for the chosen duration <option>.
function getduration()
{
    var element = document.getElementById("duration");
	return element.options[element.selectedIndex].value;
}

// Get selected field(s) from control in the web page by seeing which fields'
// checkboxes are checked.  Return all selected fields in an array of those
// fields' 'value' attribute.
function getfields()
{
	// var element = document.getElementById("field");
	// return element.options[element.selectedIndex].value;
	var form = document.getElementById("fieldselection");
	var result = [];
	for(var i=0;i<form.elements.length;i++) {
		if(form.elements[i].type == 'checkbox') {
			if(form.elements[i].checked == true) {
				result.push(parseInt(form.elements[i].value));
			}
		}
	}
	return result;
}

// Get details on the thing selected for display.  Returns an object with a 
// number of useful attributes of the selected thing based on "value" and
// data attributes for the chosen thing selection <option> (defined in HTML)
function getthing()
{
	var element = document.getElementById("thing");
	var thing_channel  = element.options[element.selectedIndex].dataset.channel;
	var thing_key      = element.options[element.selectedIndex].dataset.key;
	var thing_name     = element.options[element.selectedIndex].text;
	var thing_samperhr = element.options[element.selectedIndex].dataset.samperhr;

	return {
		channel: thing_channel,
		key: thing_key,
		name: thing_name,
		samperhr: thing_samperhr
	};
}



// Specialized version of ThingSpeak data retrieval that's capable of handling a custom
// duration range between user-specified start and end times.
function fetchthingrangeddata(thing,start,end,fields,update_fields)
{
  fetch("https://api.thingspeak.com/channels/" + thing.channel + "/feeds.json?api_key=" + thing.key + "&start=" + start + "&end=" + end)
		.then(function(response) {
		return response.json();
		})
		.then(function(data) {
      renderdata(data,fields,update_fields);
    });
}

// Called whenever we need to process data retrieved from ThingSpeak. Loads up the
// fieldmap and plot data arrays so we can properly plot the data as the user
// interacts with the plot controls.
function renderdata(data,fields,update_fields) {
	var f = document.getElementById("chanid");
	f.innerHTML = data.channel.id;
	f = document.getElementById("channame");
	f.innerHTML = data.channel.name;
	layout.title = data.channel.name;

	f = document.getElementById("chandesc");
	f.innerHTML = data.channel.description;
	f = document.getElementById("count");
	f.innerHTML = data.feeds.length;
  
  	/* There's an invisible <div> in the document for dumping (mostly debug) data
    var p = document.getElementById("data");
	p.innerHTML = "";
	*/

    // Update all the field info and settings if we're supposed to do that.  This means
    // figuring out how many data fields we have and activating all that are present.
    if(update_fields) {
	    nfields = 0;
		for(var i=0;i<8;i++) {
			let key = "field" + (i+1);
			if( key in data.channel) {
		    	fieldmap[i].active = true; fieldmap[i].name = data.channel[key];
		    	// Relabel the field's checkbox to use the field's name (as provided
		    	// in channel metadata) and also make sure its checkbox is visible and unchecked.
		    	var fl = document.getElementById("fl"+(i+1));
		    	fl.innerHTML = fieldmap[i].name;
		    	var cb = document.getElementById("field"+(i+1));
		    	cb.checked = false;
				var cbf = document.getElementById("cbf" + (i+1));
				cbf.style.display = "initial";	
		    	nfields++;
			}
			else {
				// This field is not present so disable it and hide its checkbox selector
				fieldmap[i].active = false;
				var cb = document.getElementById("cbf" + (i+1));
				cb.style.display = "none";			
			}
		}
	}

    // Construct our plot data array to hold however many fields exist in this channel
	pdata = [];      	// Discard previous data
	for(var j=0;j<nfields;j++) {
		if(fieldmap[j].active) {
			var series = { x:[], y: [], max: -10000, min: 10000, type: 'scatter', visible: false, name: fieldmap[j].name};
			pdata.push(series);
		}
	}

	// Now make visible the desired fields (and check their checkboxes)
	for(i=0;i<fields.length;i++) { 
		pdata[fields[i]].visible = true;
		var cb = document.getElementById("field"+(fields[i]+1));
		cb.checked = true;
	}

	// Load up the data values so we can feed the right structure to Plotly
	for(var i=0;i<data.feeds.length;i++) {

		// All the fields in this data value have the same timestamp via the created_at attribute
		var t = moment.parseZone(data.feeds[i].created_at).local().format("YYYY-MM-DD HH:mm:ss");

		n = 0;
		for(var j=0;j<8;j++) {
			if(! fieldmap[j].active) continue;  // Skip empty fields
			var key = "field" + (j+1);
			var value = data.feeds[i][key];
			pdata[n].x.push(t);
			pdata[n].y.push(value);
			n++;
		}
	}
	// Plot the data
	Plotly.newPlot("chart",pdata,layout,config);
}
//
// Here's how this should work
// 1. Get the new duration from the in-page control (via the event)
// 2. Get the current thing from the in-page control
// 3. Fetch new data for the current thing so we can cover the new duration
// 4. BONUS: Keep the same fieldmap -- what we have is already fine, but it doesn't
//    hurt to rebuild it from the channel metadata
// 5. Make sure the field checkboxes are UNCHANGED as the user just wants a differnt
//    duration view of the current specified fields
// 6. Draw the plot
//
// Callback invoked when the user selects a new plot duration.  Different duration
// means diferent data so we'll both fetch and draw (and we have to specify the
// duration of data to be fetched, which we can get from the change event).
function changeDurationHandler(event) {
    var thing = getthing();
    var fields = getfields();
	var datepicker = document.getElementById("datepicker");
    if(event.target.value == 0) {
    	// We picked 'Custom' duration, still have work to do
    	datepicker.style.display = "grid";  // Must be 'grid', not 'initial'!
    	setdatefields();
    }
    else {
    	datepicker.style.display = "none";
    	fetchthingdata(thing,event.target.value,fields,false);
    }
}

// Callback invoked when the user selects a new Thing to be displayed. 
//
// Here's how this should work:
// 1. Fetch data for newly specified thing
// 2. Build fieldmap from channel metadata
// 3. Initialize checkboxes so the right number are present and they're properly
//    labeled.  Check the checkbox for field 1, leave the others unchecked
// 4. Draw the plot 
function changeThingHandler(event) { 
  var d = getduration();

  // Need to retrieve chosen monitor's channel ID and read API key from the
  // data attributes stored in the <option> entry for that monitor
  var loc = event.target;  // The "thing" <select> element
  var opt = loc.options[loc.selectedIndex]; // The selected <option> element
  var thing = {
  	channel: opt.dataset.channel,
  	key: opt.dataset.key,
  	samperhr: opt.dataset.samperhr,
  	name: opt.text
  }

  // When we change the target Thing we default to displaying field1.  This means
  // clearing all the checkboxes...
  var fields = [0];
  fetchthingdata(thing,d,fields,true);

}

// Need a function to call when any checkbox changes state.  When a checkbox is selected,
// set the 'visible' property for that field's data to 'true' and draw the plot again with the 
// current pdata and fieldmap.  When a checkbox is deselected, set the 'visible' property 
// for that field's data to 'false' and draw the plot again with the current pdata and fieldmap.
//
// NOTE: In no case are we fetching new data, so we don't need to wait for an async fetch
// operation to do the drawing. We can just (re)plot the data we already have once we've
// adjusted the field visibility attributes in our plot data series
//
// TODO: Check to make sure we've not unchecked the last checked checkbox.  If we have,
// then don't plot (as there's nothing to be plotted), and instead put a message in the
// "chart" <div> asking the user to select a field.
function changeFieldHandler(event) {
	if(event.target.checked) { pdata[event.target.value].visible = true; }
	else                     { pdata[event.target.value].visible = false; }
	Plotly.newPlot("chart",pdata,layout,config);
}

// Called to draw a plot of the data we have previously fetched and processed.  Reads
// the field selection checkboxes to determine which retrieved fields should appear
// in the plot.
function plotFields() {
	var form = document.getElementById("fieldselection");
	for(var i=0;i<form.elements.length;i++) {
		if(!fieldmap[i].active) continue;  // Skip fields not used for this thing
		if(form.elements[i].type == 'checkbox') {
			var v = form.elements[i].value;
			if(form.elements[i].checked == true) {
				pdata[v].visible = true;

			}
			else {
				pdata[v].visible = false;
			}
		}
	}
	Plotly.newPlot("chart",pdata,layout,config);
}

// For the custom duration option we need to let the user enter the starte date/time and
// the end date time then hit a "plot" button so we're sure all the required input info
// has been provided.  This function does that, reading those values out of the
// respective input fields and formatting them to be passed to ThingSpeak.
//
// Also, ThingSpeak's custom data retrieval API works best if you send the data in UTC
// so get predictable results in UTC and can pass them to Plotly.  Moment.js makes that
// easy.
function plotCustomDuration() {
  var start_date = document.getElementById("startdate");
  var start_time = document.getElementById("starttime");
  var startstr = moment(start_date.value+"T"+start_time.value).utc().format("YYYY-MM-DD%20HH:MM:SS");
  
  var end_date = document.getElementById("enddate");
  var end_time = document.getElementById("endtime");
  var endstr = moment(end_date.value+"T"+end_time.value).utc().format("YYYY-MM-DD%20HH:MM:SS");

  var thing = getthing();
  var fields = getfields();
  fetchthingrangeddata(thing,startstr,endstr,fields,true);
}

// Convenience function to initialize the custom plot date fields to current time (and one day
// ago, just to be different).
function setdatefields() {
  var start_date = document.getElementById("startdate");
  var start_time = document.getElementById("starttime");
  var end_date = document.getElementById("enddate");
  var end_time = document.getElementById("endtime");
  start_date.value = moment().subtract(1,'days').format("YYYY-MM-DD");
  end_date.value   = moment().format("YYYY-MM-DD");

  var now = moment();
  var ago = moment().subtract(24,'hours');
  start_date.value = ago.format("YYYY-MM-DD");
  start_time.value = ago.format("HH:mm");
  end_date.value = now.format("YYYY-MM-DD");
  end_time.value = now.format("HH:mm");
}