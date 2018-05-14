
// Objekti johon viestit haetaan Firebasesta
var viestiObjekti = "";

var lista = haeJson();
// lista = JSON.parse(haeJson());

// Tämä funktio hakee viestit
function haeJson() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maalampo-some-demo.firebaseio.com/uutiset.json";

  // xmlhttp.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     console.log(this.responseText);
  //     viestiObjekti = JSON.parse(this.responseText);
  //   }
  // };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  return xmlhttp.responseText;
}


//TOIMII, koska muuten lämmön lähettäminen ei onnistuisi
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


// TOIMII, testattu konsolilla
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
    viestiObjekti = haeJson();
    };
    // Haetaan JSON:ista parametrin osoittama viesti ja käynnistetään funktio
    haeViesti(int, aikaJarjestus);
}



// var pekka = luoViestiOlio("Hei olen Pekka", "Pekka")
// lahetaViesti(pekka)


function luoViestiOlio(teksti, lahettaja) {
  this.viesti = teksti;
  this.lampo = "0";
  this.nimi = lahettaja;
  this.aika = new Date();
  this.numero = viestiObjekti.length;
  this.kommentit = [{}];
  return {viesti, lampo, nimi, aika, numero, kommentit};
}
// ALLA VANHA YRITYS VIESTIOLION LUOMISELLE.
// var uusOlio = {"viesti": teksti, "lampo": "0", "nimi": lahettaja, "aika": new Date(), "numero": viestiObjekti.length, "kommentit":[{}] };
// return uusOlio;
var database = firebase.database();

function viestiJSONiin(viestiOlio) {
  firebase.database().ref(viestiOlio.numero).set({
    viesti: viestiOlio.viesti,
    lampo: viestiOlio.lampo,
    nimi: viestiOlio.nimi,
    aika: viestiOlio.aika,
    numero: viestiOlio.numero,
    kommentit: viestiOlio.kommentit
  });
  //viestiObjekti = JSON.parse(haeJSON());
  return "moi";
}

function lahetaViesti(viestiOlio) {
  var viesti = document.createElement("div");
  viesti.setAttribute("class", "viesti");
  viesti.setAttribute("id", viestiOlio.numero);

  var viestiTeksti = document.createElement("p");
  viestiTeksti.setAttribute("class", "viestiTeksti");
  var teksti = document.createTextNode(viestiOlio.viesti);
  viestiTeksti.appendChild(teksti);

  var lahettaja = document.createElement("p");
  lahettaja.setAttribute("class", "lahettaja");
  var aa = document.createTextNode(viestiOlio.nimi);
  lahettaja.appendChild(aa);

  var ajankohta = document.createElement("p");
  ajankohta.setAttribute("class", "ajankohta");
  var bb = document.createTextNode(viestiOlio.aika);
  ajankohta.appendChild(bb);

  var lampo = document.createElement("p");
  lampo.setAttribute("class", "lampo");
  var cc = document.createTextNode(viestiOlio.nimi);
  lampo.appendChild(cc);

  var numero = document.createElement("p");
  numero.setAttribute("class", "numero");
  var dd = document.createTextNode(viestiOlio.nimi);
  numero.appendChild(dd);
}

// ALLA VANHA YRITYS VIESTIN LÄHETTÄMISELLE.
// // Tämä funktio lisää uuden viestiolion firebaseen
// function lahetaViesti(viestiOlio) {
//     // Mietitään mihin kohtaan listaa uusi olio lisätään
//     var int = lista.length;          //size???
//     var xmlhttp = new XMLHttpRequest();
//     //Valitaan oikea url listan koon mukaisesti
//     var url = "https://maalampo-some-demo.firebaseio.com/uutiset/3.json";
//     xmlhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         console.log(this.responseText);
//         //viestiObjekti = JSON.parse(this.responseText);
//       }
//     };
//     //Lisätään viesti firebaseen
//     xmlhttp.open("PUT", url, true);     // Send:iä käyttämällä tulee cross-origin virheilmoitus
//     xmlhttp.send(viestiOlio);
//     viestiObjekti = haeJson();
// }



function luoKommenttiOlio(teksti, lahettaja, mihinViestiin) {
  var uusOlio = {viesti: teksti, nimi: lahettaja, aika: new Date() };
  return [uusOlio, mihinViestiin.numero];
}

//Tämä funktio lisää kommentin valittuun viestiolioon
function kommentoi(kommenttiOlio, int) {      //MIETI INT!!!!!!!!
    var xmlhttp = new XMLHttpRequest();
    //Valitaan oikea url listan koon mukaisesti
    var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + "/kommentit.json";
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        //viestiObjekti = JSON.parse(this.responseText);
      }
    };
    //Lisätään viesti firebaseen
    xmlhttp.open("PUT", url, true);
    xmlhttp.send(kommenttiOlio[0]);
}


// Tämä funktio järjestää viestit väärinpäin olevan listan mukaisesti, ts. uusin ensin
function jarjestaAjankohtaiset() {
  return lista.reverse();
}

//Tämä funkio järjestää viestit lämmön määrän mukaisesti, isoin numero ensin
function jarjestaSuosituin() {







  // var jarjestus = viestiObjekti;
  // var x;
  // for (x = 0; x < viestiObjekti.length; x++) {
  //   jarjestus[x] = viestiObjekti[x].lampo;
  // }
  // var c = jarjestus.map(function(e, i) {
  //   return [e, viestiObjekti[i]];
  // });
  // var oikein = c.sort().reverse;
  // return oikein.values;
}

//Tämä funkio järjestää viestit kommenttien määrän mukaisesti, isoin numero ensin
// function jarjestaKeskustelu() {
//
// }
