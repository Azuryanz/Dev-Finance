/* Turn the dim on */
function dimOn() {
  document.getElementById('dimmer').style.visibility = 'visible';
  document.getElementById('dimmer').style.opacity = "0.6";
}

/* Turn the dim off */
function dimOff() {
  document.getElementById('dimmer').style.visibility = 'hidden';
  document.getElementById('dimmer').style.opacity = "0";
}
