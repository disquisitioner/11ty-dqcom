// Arrange to call a function to kick things off once the page is loaded
document.addEventListener('DOMContentLoaded',function() {

	document.getElementById("update").onclick = function doUpdate() {
        updateDweet(getthing());
	}

    // Register a handler so we can process changes in the thing selection
    document.querySelector('select[name="thingmenu"]').onchange=changeThingHandler;

	// The first one is free. :-)
	updateDweet(getthing());

},false);


// Additional code goes here

function updateDweet(thingname) {
    var d_out = document.getElementById("dweet");
    d_out.innerHTML = "...retrieving dweet...";

	dweetio.get_latest_dweet_for(thingname, function(err, dweet){
	    var dweet = dweet[0]; // Dweet is always an array of 1
	    var d_out = document.getElementById("dweet");
	    var d_name = document.getElementById("thing");
	    var d_created = document.getElementById("created");
	  
	    var str = JSON.stringify(dweet.content, null, 4);
	    d_out.innerHTML = syntaxHighlight(str);
	    d_name.innerHTML = dweet.thing;
	    d_created.innerHTML = dweet.created;
		});
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
                match = match.replace(/^"/g, '').replace(/":/g,':');
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Get desired thing type from control in web page
function getthing()
{
        var element = document.getElementById("thingmenu");
        return element.options[element.selectedIndex].value;
}

// Callback invoked when the user selects a new Thing.  
function changeThingHandler(event) { 
    updateDweet(event.target.value);
}