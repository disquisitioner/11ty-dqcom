var camIndex = 1;
var camsSelected = [];

// Arrange to call a function to kick things off once the page is loaded
document.addEventListener('DOMContentLoaded',function() {
  timedRefresh(300000);
  showDate();

  var form = document.getElementById("camselection");
  for(var i=0;i<form.elements.length;i++) {
    if(form.elements[i].type == 'checkbox') { 
      form.elements[i].onclick = changeFieldHandler; 
    }
  }

  // Pre-select all webcams, just to get started
  for(var i=0;i<form.elements.length;i++) {
    if(form.elements[i].type == 'checkbox') { 
        camsSelected.push(form.elements[i].value);
    }
  }
},false);


// Open the Modal
function openModal() {
  document.getElementById("modal").style.display = "block";
}

// Close the Modal
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Next/previous controls
function plusCam(n) {
  showCams(camIndex += n);
}

// Thumbnail image controls
function currentCam(n) {
  showCams(camIndex = n);
}

function showCams(n) {
  var i;
  var webcams = document.getElementsByClassName("camimage");
  var thumbs = document.getElementsByClassName("thumb");
  var captionText = document.getElementById("caption");
  if (n > webcams.length-1) {camIndex = 0}
  if (n < 0) {camIndex = webcams.length-1}
  for (i = 0; i < webcams.length; i++) {
    webcams[i].style.display = "none";
  }
  webcams[camIndex].style.display = "block";
  captionText.innerHTML = thumbs[camIndex].alt;
}

/* Enable auto-refresh of page content (wecam views) */ 

function timedRefresh(timeoutPeriod) {
    setTimeout("updateWindow();",timeoutPeriod);
}

function updateWindow(){
    location.reload(true);
    showDate();
}

function showDate()
{
  // Streamline handling Date & Time using Luxon 
  var now = new luxon.DateTime.local(); 

  document.getElementById("dateDiv").innerHTML = now.toFormat("ccc LLL d, y 'at' t '(UTC'Z')'");;
}

function fourdigits(number)
{
  return (number < 1000) ? number + 1900 : number;
}


function changeFieldHandler(event) {
  if(event.target.checked) { 
    console.log(event.target.value + ' checked'); 
    document.getElementById("sel"+event.target.value).style.border = "thick solid green";
  }
  else { 
    console.log(event.target.value + ' unchecked');
    document.getElementById("sel"+event.target.value).style.border = "1px solid #424242";
  }
}

function showSelection() {
  document.getElementById("camselector").style.display = "block";
  document.getElementById("campanel").style.display = "none";

  // Pre-select user's current selections
  var form = document.getElementById("camselection");
  for(var i=0;i<form.elements.length;i++) {
    if(form.elements[i].type == 'checkbox') { 
      for(var j=0;j<camsSelected.length;j++) {
        if(form.elements[i].value == camsSelected[j]) {
          document.getElementById("sel"+form.elements[i].value).style.border = "thick solid green";
          form.elements[i].checked = true;
        } 
      }
    }
  }
}

function saveSelection() {
  camsSelected = [];
  var form = document.getElementById("camselection");
  for(var i=0;i<form.elements.length;i++) {
    if(form.elements[i].type == 'checkbox') { 
      if(form.elements[i].checked == true) {
        camsSelected.push(form.elements[i].value);
        document.getElementById("sel"+form.elements[i].value).style.border = "1px solid #424242";
        form.elements[i].checked = false;
      } 
    }
  }
  console.log(camsSelected);
  var webcams = document.getElementsByClassName("webcam");
  for(var i=0;i<webcams.length;i++) {
    webcams[i].style.display = "none";
  }
  for(var i=0;i<camsSelected.length;i++) {
    document.getElementById("webcam"+camsSelected[i]).style.display = "block";
  }

  document.getElementById("camselector").style.display = "none";
  document.getElementById("campanel").style.display = "block";
}