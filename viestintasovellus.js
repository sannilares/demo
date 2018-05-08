
// Objekti johon viestit haetaan Firebasesta
var viestiObjekti = 0;

var lista = haeJson();

// Tämä funktio hakee viestit
function haeJson() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maalampo-some-demo.firebaseio.com/.json";

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      console.log(this.responseText);
      viestiObjekti = JSON.parse(this.responseText);

      // Voidaan kutsua funktiota tässä

      // Ja päivitetään sivu ehkäpä?

    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}




// Tämä funktio hakee tietyn viesti-olion
function haeViesti(int, callback) {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + ".json";
  console.log(url)

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
      console.log(this.responseText);
      //viestiObjekti = JSON.parse(this.responseText);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

// Tämä funktio lisää viestin firebaseen
function lahetaLampoa(int) {


  function aikaJarjestus(x) {
    var asd = JSON.parse(x);
    var xmlhttp = new XMLHttpRequest({mozSystem: true});
    //Valitaan oikea url parametrin mukaisesti
    var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + "/lampo.json";

    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        //viestiObjekti = JSON.parse(this.responseText);
      }
    };

    //Suoritetaan pluslasku
    var uusLampo = parseInt(asd.lampo) + 1

    //Lisätään lämpö firebaseen
    xmlhttp.open("SEND", url, true);
    xmlhttp.send(uusLampo.toString());
    };
    // Haetaan JSON:ista parametrin osoittama viesti
    haeViesti(int, aikaJarjestus);

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
