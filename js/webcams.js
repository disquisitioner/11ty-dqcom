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

var camIndex = 1;
showCams(camIndex);

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
    showdate();
}

function showDate()
{
  var now = new Date();
  var days = new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
  var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
  var date = ((now.getDate()<10) ? "0" : "")+ now.getDate();
  
  tnow=new Date();
  thour=now.getHours();
  tmin=now.getMinutes();
  tsec=now.getSeconds();
  
  if (tmin<=9) { tmin="0"+tmin; }
  if (tsec<=9) { tsec="0"+tsec; }
  if (thour<10) { thour="0"+thour; }
  
  today = days[now.getDay()] + ", " + date + " " + months[now.getMonth()] + ", " + (fourdigits(now.getYear())) + " - " + thour + ":" + tmin +":"+ tsec;
  document.getElementById("dateDiv").innerHTML = today;
}

function fourdigits(number)
{
  return (number < 1000) ? number + 1900 : number;
}