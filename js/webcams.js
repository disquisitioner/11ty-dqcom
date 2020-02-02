var camIndex = 1;

// Arrange to call a function to kick things off once the page is loaded
document.addEventListener('DOMContentLoaded',function() {
  timedRefresh(300000);
  showDate();

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
  var webcams = document.getElementsByClassName("webcam");
  var thumbs = document.getElementsByClassName("thumb");
  var captionText = document.getElementById("caption");
  if (n > webcams.length) {camIndex = 1}
  if (n < 1) {camIndex = webcams.length}
  for (i = 0; i < webcams.length; i++) {
    webcams[i].style.display = "none";
  }
  webcams[camIndex-1].style.display = "block";
  captionText.innerHTML = thumbs[camIndex-1].alt;
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