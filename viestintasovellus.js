
var lista = haeJson();

// Tämä funktio hakee viestit
function haeJson() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maalampo-some-demo.firebaseio.com/.json";

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      console.log(this.responseText);
      ????? = JSON.parse(this.responseText);

      // Voidaan kutsua funktiota tässä

      // Ja päivitetään sivu ehkäpä?

    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}


// Tämä funktio lisää viestin firebaseen
function lahetaLampoa() {
  // Haetaan JSON:ista parametrin osoittama viesti
  var x = haeJson();
  var xmlhttp = new XMLHttpRequest();
  //Valitaan oikea url parametrin mukaisesti
  var url = "https://maalampo-some-demo.firebaseio.com/" + "x" + ".json";

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      ????? = JSON.parse(this.responseText); //KYSYMYSMERKIT?????????
    }
  };

  //Suoritetaan pluslasku
  var uusLampo = x.lampo.toInt + 1

  //Lisätään lämpö firebaseen
  xmlhttp.open("SEND", url, true);
  xmlhttp.send(uusLampo.toString);
}




// function lahetaViesti() {
//   lista = haeJson;
// }

// function lahetaLampoa() {
//   lista = haeJson;
// }

function kommentoi() {
  lista = haeJson;
}
