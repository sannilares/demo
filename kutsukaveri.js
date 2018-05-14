var sPostit: Array = "";   //Lista, johon sähköpostiosoittet kerätään.

// Funktio lisää sähköpostiosoitteen listalle
function kutsuKaveri(email) {
  var int = sPsotit.length;
  if (email.contains("@")) {
    sPostit += email
  } else {
    window.alert("Kirjoita sähköpostiosoite ennen sen lähettämistä.")
  }
}
