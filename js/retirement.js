var current_day = 0;

// Arrange to call a function to kick things off once the page is loaded
document.addEventListener('DOMContentLoaded',function() {

	// Auto-reload every 5 minutes.  Overkill, but so what...
  	timedRefresh(300000);

	display_dtw();

},false);

function display_dtw()
{
	var dtw = document.getElementById("days");

	var now = luxon.DateTime.local();
	// var now = luxon.DateTime.local(2020,12,30,8,18);

	// The last working alarm clock morning is Dec 31, 2020
	var retire = luxon.DateTime.local(2020,12,31,17,0);

	// How many actual days to my last day worked, after today?
	var deltat_days = retire.ordinal - now.ordinal;

	// Easy weekend calculation formula depends on starting
	// the week on Sunday, so Sunday has a weekday value of 1.
	// Luxon.js assignes 1 to Monday, so need to map values.
	var now_wd = now.weekday + 1;
	if(now_wd == 8) now_wd = 1;
	var retire_wd = retire.weekday;

	var weeks = Math.floor((now_wd + deltat_days)/7);
	var wkend = Math.floor(weeks) * 2;
	if(now_wd == 7) wkend--;
	if(retire_wd == 6) wkend--;   // Isn't true, but for completeness

	// Need to not count weekday holidays, but no easy way to do
	// that with Luxon.  Just check manually...
	var holidays = [];  // Build look-up table of potential holidays
	holidays.push(luxon.DateTime.local(2020,9,7,8,0));    // Labor Day
	holidays.push(luxon.DateTime.local(2020,11,26,8,0));  // Thanksgiving
	holidays.push(luxon.DateTime.local(2020,11,27,8,0));  // Thanksgiving Fri
	holidays.push(luxon.DateTime.local(2020,12,24,8,0));  // Christmas Eve
	holidays.push(luxon.DateTime.local(2020,12,25,8,0));  // Christmas Day
	var numhols = 0;
	for(var i=0;i<holidays.length;i++) {
	  if(now < holidays[i]) numhols++;  // Luxon DateTime compare
	}

	// OK. Working days = total days minus weekends and minus holidays
	var daystowork = deltat_days - wkend - numhols;
	dtw.innerHTML = daystowork; 

	// Keep track of our current day number so we can detect a day change
	current_day = now.ordinal;
}

 function toggle_neon(el) {
   // If it's off, turn it on
   if(el.classList.contains("neoff")) {
     el.classList.remove("neoff");
     el.classList.add("neon");
     // If it's supposed to flicker, retrigger the animation
     if(el.classList.contains("flicker")) {
        var newel = el.cloneNode(true);
        el.parentNode.replaceChild(newel,el);
     }
   }
   else {
     // Otherwise, if it's on turn it off 
     if(el.classList.contains("neon")) {
       el.classList.remove("neon");
       el.classList.add("neoff");
     }
   }
}

/* Enable auto-refresh of page content to keep the countdown accurate */ 

function timedRefresh(timeoutPeriod) {
    setInterval("updateWindow();",timeoutPeriod);
}

function updateWindow(){
    var tick = new luxon.DateTime.local();
    if( tick.ordinal > current_day) {
	    display_dtw();
	    current_day = tick.ordinal;
	    console.log("Updating!...");
    }
}