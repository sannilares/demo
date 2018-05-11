
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
      //Odotetaan että saadaan tiedot firebasesta
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
    // Haetaan tämänhetkisen lämmön määrä
    var lammonMaara = JSON.parse(x);
    var xmlhttp = new XMLHttpRequest();
    //Valitaan oikea url parametrin mukaisesti
    var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + "/lampo.json";
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        //viestiObjekti = JSON.parse(this.responseText);
      }
    };

    //Suoritetaan pluslasku
    var uusLampo = parseInt(lammonMaara.lampo) + 1

    //Lisätään lämpö firebaseen
    xmlhttp.open("PUT", url, true);         //POST toiminee myös
    xmlhttp.send(uusLampo.toString());
    };

    // Haetaan JSON:ista parametrin osoittama viesti ja käynnistetään funktio
    haeViesti(int, aikaJarjestus);

}

var pekka = luoViestiOlio("Hei olen Pekka", "Pekka")
lahetaViesti(pekka)


function luoViestiOlio(teksti, lahettaja) {
  var uusOlio = {viesti: teksti, lampo: "0", nimi: lahettaja, aika: new Date(), kommentit:[{}] };
  return uusOlio;
}


function lahetaViesti(viestiOlio) {

    // Mietitään mihin kohtaan listaa uusi olio lisätään
    var int = haeJson().size          //size???
    var xmlhttp = new XMLHttpRequest();
    //Valitaan oikea url listan koon mukaisesti
    var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + ".json";
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        //viestiObjekti = JSON.parse(this.responseText);
      }
    };

    //Lisätään viesti firebaseen
    xmlhttp.open("SEND", url, true);
    xmlhttp.send(viestiOlio);

}


function kommentoi() {
  lista = haeJson;
}
