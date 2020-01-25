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