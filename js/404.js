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