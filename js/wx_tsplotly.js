 // Splice in Javascript functionality once the page DOM is loaded
 document.addEventListener('DOMContentLoaded',function() {

 	// Register a handler so we can process changes in the chart 'type' selection
    document.querySelector('select[name="plottype"]').onchange=changePlotTypeHandler;

 	// Register a handler so we can process changes in the chart 'duration' selection
    document.querySelector('select[name="duration"]').onchange=changeDurationHandler;

    // Register a handler to redraw the chart if the browser window resizes
    window.addEventListener('resize', drawchart);

    // Make sure the plot drawn matches the selected duration, even on page reload
    var d = getduration();

    // Fetch data and draw the chart
    fetchndraw(d);
},false);

// Get plot duration from control in web page
function getduration()
{
	    var element = document.getElementById("duration");
    	return element.options[element.selectedIndex].value;
}

// Get plot type from control in web page
function getplottype()
{
		var element = document.getElementById("plottype");
    	return element.options[element.selectedIndex].value;
}


// Retrieve data from ThingSpeak and convert it into a usable internal form. This gets all
// done together so we can do it via the promise returned from fetch()
function fetchndraw(duration)
{
	fetch('https://api.thingspeak.com/channels/544523/feeds.json?api_key=L42E70XGWQORK465&results='+(duration*12))
		.then(function(response) {
		return response.json();
		})
		.then(function(data) {
			processndraw(data);
	});
}

// Sets attributes of each supported plot type including a map of booleans indicating which
// data streams are to be displayed on that plot and the title of the plot.  (It's a "Look Up
// Table", hence the 'lut' in the name.)
var plotlut = [
	{ vismap:[true,true,false,false,false,false,false],  title: "Temperature at Home" },
	{ vismap:[false,false,true,false,false,false,false], title: "Barometric Pressure" },
	{ vismap:[false,false,false,true,true,false,false],  title: "Wind Speeds" },
	{ vismap:[false,false,false,false,false,true,true],  title: "Rainfall" }
];

// Global object in which we'll store the data we retrieve.  Because ThingSpeak returns all the
// fields we'll store them all away as if we were going to plot them all, but only show as visible
// the ones intended for each supported plot type.  Max/min values discovered in processing the
// retrieved data are stored here too to save work later on.
var pdata = [
		{ x:[], y:[], type:'scatter', name: 'Outdoor \xB0F',  visible: true,  max: -1000, min: 1000 },
		{ x:[], y:[], type:'scatter', name: 'Indoor \xB0F',   visible: true,  max: -1000, min: 1000 },
		{ x:[], y:[], type:'scatter', name: 'Barometer "Hg',  visible: false, max: -1, min: 100 },
		{ x:[], y:[], type:'scatter', name: 'Wind Speed MPH', visible: false, max: -1, min: 1000 },
		{ x:[], y:[], type:'scatter', name: 'Wind Gust MPH',  visible: false, max: -1, min: 1000 },
		{ x:[], y:[], type:'scatter', name: 'Rainfall (inch)',  visible: false, max: -1, min: 1000 },
		{ x:[], y:[], type:'scatter', name: 'Rain Today (inch)',   visible: false, max: -1, min: 1000 },
];

/// Proceess the json data from ThingSpeak so it's easier to use later on, then draw it
function processndraw(data) {
	// console.log('Raw data:',data.feeds);
	// var element = document.getElementById("rawdata");
	// element.innerHTML = JSON.stringify(data.channel,null,4);

	// Discard previous data
	for(i in pdata)  { 
		pdata[i].x.length = 0;  pdata[i].y.length = 0; 
		pdata[i].max = -10000;  pdata[i].min = 10000;
	}

	var otemp, itemp, bp, wind, gust, rain, raintoday;

	for(i in data.feeds) {
		// Use the timestamp reported in the dataset for all the plots
		var timestamp = data.feeds[i].field1;

		// Pull out the data values as variables so it's easier to work with them
		otemp = data.feeds[i].field2;
		itemp = data.feeds[i].field4;
		bp    = data.feeds[i].field3;
		wind  = data.feeds[i].field5;
		gust  = data.feeds[i].field6;
		rain  = data.feeds[i].field7;
		rtoday = data.feeds[i].field8;

		// Calculate maximum and minimum values for each data field
		pdata[0].max = Math.max(pdata[0].max,otemp);
		pdata[0].min = Math.min(pdata[0].min,otemp);

		pdata[1].max = Math.max(pdata[1].max,itemp);
		pdata[1].min = Math.min(pdata[1].min,itemp);

		pdata[2].max = Math.max(pdata[2].max,bp);
		pdata[2].min = Math.min(pdata[2].min,bp);

		pdata[3].max = Math.max(pdata[3].max,wind);
		pdata[3].min = Math.min(pdata[3].min,wind);

		pdata[4].max = Math.max(pdata[4].max,gust);
		pdata[4].min = Math.min(pdata[4].min,gust);

		pdata[5].max = Math.max(pdata[5].max,rain);
		pdata[5].min = Math.min(pdata[5].min,rain);

		pdata[6].max = Math.max(pdata[6].max,rtoday);
		pdata[6].min = Math.min(pdata[6].min,rtoday);

		// Stuff our field values into the appropriate (x,y) part of the storage object
		pdata[0].x.push(timestamp);  pdata[0].y.push(otemp);
		pdata[1].x.push(timestamp);  pdata[1].y.push(itemp);
		pdata[2].x.push(timestamp);  pdata[2].y.push(bp);
		pdata[3].x.push(timestamp);  pdata[3].y.push(wind);
		pdata[4].x.push(timestamp);  pdata[4].y.push(gust);
		pdata[5].x.push(timestamp);  pdata[5].y.push(rain);
		pdata[6].x.push(timestamp);  pdata[6].y.push(rtoday);

	}

	// Draw the chart.
	drawchart();
}

function drawchart()
{
	// Which plot are we drawing?
	var p = getplottype();

	// Adjust data visibility based on plot type
	for(i in pdata) { pdata[i].visible = plotlut[p].vismap[i]; }

	// Set some important plot layout attributes
	var layout = {
		title: plotlut[p].title,
		showlegend: true,
		legend: {
			orientation: "h",
			y: -0.2
		},
		margin: {
			l: 30,
			r: 30
		},
		xaxis: {
			showline: true
		},
		yaxis: {
			showline: true
		}

	}
	var config = {
		responsive: true,
		displayModeBar: false,
		editable: false,
		scrollZoom: false
	}

	// Update the data display "widgets" to show current values, max/min, etc.
	current = pdata[0].x.length-1;

	element = document.getElementById("curotemp");
	element.innerHTML = pdata[0].y[current];
	element = document.getElementById("maxotemp");
	element.innerHTML = pdata[0].max;
	element = document.getElementById("minotemp");
	element.innerHTML = pdata[0].min;
	
	element = document.getElementById("curitemp");
	element.innerHTML = pdata[1].y[current];
	element = document.getElementById("maxitemp");
	element.innerHTML = pdata[1].max;
	element = document.getElementById("minitemp");
	element.innerHTML = pdata[1].min;

	element = document.getElementById("curbp");
	element.innerHTML = pdata[2].y[current];
	element = document.getElementById("maxbp");
	element.innerHTML = pdata[2].max;
	element = document.getElementById("minbp");
	element.innerHTML = pdata[2].min;

	// Wind widget just displays current, max instantaneous, and max gust
	element = document.getElementById("curwind");
	element.innerHTML = pdata[3].y[current];
	element = document.getElementById("maxwind");
	element.innerHTML = pdata[3].max;
	element = document.getElementById("maxgust");
	element.innerHTML = pdata[4].max;

	// Rainfall widget just displays total rain today max in 5 minutes
	element = document.getElementById("raintoday");
	element.innerHTML = pdata[6].y[current];
	element = document.getElementById("maxrain");
	element.innerHTML = pdata[5].max;

	// Draw the chart
	Plotly.newPlot('chart', pdata, layout, config);
 	
 }

// Callback invoked when the user selects a new plot type.  Because we saved all
// the field values when we fetched data based on duration we don't have to fetch
// now, just redraw based on the newly specified plot type.
function changePlotTypeHandler(event) { 
    drawchart();
}

// Callback invoked when the user selects a new plot duration.  Different duration
// means diferent data so we'll both fetch and draw (and we have to specify the
// duration of data to be fetched, which we can get from the change event).
function changeDurationHandler(event) {
    fetchndraw(event.target.value);
}