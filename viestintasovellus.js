window.onload = function() {

  //Tallentaa JSON:in firebasesta muuttujaan json
  var json = JSON.parse(getJSON());

  // Viestien ja kommenttien näkyvyys firebasessa
  for (i = 0; i < json.length; i++) {
    lahetaViesti(luoViestiOlio(json[i].viesti, json[i].lampo, json[i].nimi, json[i].aika, json[i].numero, json[i].kommentit));
    if (json[i].kommentit !== undefined) {
      for (j = 0; j < json[i].kommentit.length; j++) {
        lahetaKommentti(luoKommenttiOlio(json[i].viesti, json[i].nimi, json[i].aika));
        }
    }
  }


  // Nappuloihin toiminnallisuus:
  document.getElementById("viestiNappula").addEventListener("keyup", function(event) {     //OISKOHAN?
   // Peruutetaan mahdollinen "defaultAction", jos sen perumiselle tulee tarve
   event.preventDefault();
   // Numero 13 vastaa näppäimistön enter-nappia
   if (event.keyCode === 13) {
     // Klikatessa ID:n osoittama button triggeröityy
     document.getElementById("button").click();
   }
  });
  // document.getElementById("nextbutton").addEventListener("click", function(event) {
  //   // Peruutetaan mahdollinen "defaultAction", jos sen perumiselle tulee tarve
  //   event.preventDefault();
  // });
}


// Objekti johon viestit haetaan Firebasesta
var viestiObjekti = "";

var lista = haeJson();

// Tämä funktio hakee viestit
function haeJson() {

  var database = firebaseAdmin.database();
var ref = database.ref("uutiset");
ref.orderByChild("height").on("child_added", function(snapshot) {
  console.log(snapshot.key + " was " + snapshot.val().height + " meters tall");
});
  // var xmlhttp = new XMLHttpRequest();
  // var url = "https://maalampo-some-demo.firebaseio.com/uutiset.json";
  //
  // xmlhttp.onreadystatechange = function() {
  //   if (this.readyState == 4 && this.status == 200) {
  //     // function funktiokutsu(viestiObjekti) {     //MIETI TÄMÄ!!!!!
  //     // };
  //     console.log(this.responseText);
  //     viestiObjekti = JSON.parse(this.responseText);
  //   }
  // };
  // xmlhttp.open("GET", url, true);
  // xmlhttp.send();
  // return xmlhttp.responseText;
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


// Tämä funktio lähettää lämpö jo olemassa olevalle viestille muuttaen firebasessa viestin lämmön arvoa
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


function luoViestiOlio(teksti) {
  this.viesti = teksti;
  this.lampo = "0";
  this.nimi = localStorage.getItem("etunimi");
  this.aika = new Date();
  this.numero = viestiObjekti.length;
  this.kommentit = [{}];
  return {viesti, lampo, nimi, aika, numero, kommentit};
}

var database = firebase.database();

// Tämä funktio lisää uuden viestiolion firebaseen
function viestiJSONiin(viestiOlio) {
    // Mietitään mihin kohtaan listaa uusi olio lisätään
    var int = viestiObjekti.length;
    var xmlhttp = new XMLHttpRequest();
    //Valitaan oikea url listan koon mukaisesti
    var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + ".json";

    //Lisätään viesti firebaseen
    xmlhttp.open("POST", url, true);     // HUOM. Send:iä käyttämällä tulee cross-origin virheilmoitus
    firebase.database().ref("uutiset/" + viestiOlio.numero).set({
      viesti: viestiOlio.viesti,
      lampo: viestiOlio.lampo,
      nimi: viestiOlio.nimi,
      aika: viestiOlio.aika,
      numero: viestiOlio.numero,
      kommentit: viestiOlio.kommentit
    });
    json = JSON.parse(haeJson());
    // xmlhttp.send(viestiOlio);
    viestiObjekti = haeJson();
};

// Tämä funktio lisää viestin näkyville sivulle, ja luo viestille kommentointi ja lämmön lähetys mahdollisuudet
function lahetaViesti(viestiOlio) {
  console.log("1. Päästiin viestiOlion luomisesta lahetaViestiin saakka")

  // Luodaan tarvittavat tekstit, kentät ja nappulat:
  var viesti = document.createElement("div");
  viesti.setAttribute("class", "viesti");
  // viesti.setAttribute("id", viestiOlio.numero);

  var viestiTeksti = document.createElement("p");
  viestiTeksti.setAttribute("class", "viestiTeksti");
  var teksti = document.createTextNode(viestiOlio.viesti);
  viestiTeksti.appendChild(teksti);

  var lahettaja = document.createElement("p");
  lahettaja.setAttribute("class", "lahettaja");
  var tekst = document.createTextNode(viestiOlio.nimi);
  lahettaja.appendChild(tekst);

  var ajankohta = document.createElement("p");
  ajankohta.setAttribute("class", "ajankohta");
  var teks = document.createTextNode(viestiOlio.aika);
  ajankohta.appendChild(teks);

  var lampo = document.createElement("p");
  lampo.setAttribute("class", "lampo");
  var tek = document.createTextNode(viestiOlio.lampo);
  lampo.appendChild(tek);
    //lampo.setAttribute("id", "lampoId" + viestiOlio.numero);

  var lampoNappula = document.createElement("button");
  lampoNappula.setAttribute("class", "lampoNappula");
  lampoNappula.setAttribute("onClick", "lahetaLampoa(viestiOlio.numero)");
  lampoNappula.innerHTML = "Lähetä lämpöä!";
  //lampoNappula.setAttribute("id", "lamponappulaId" + viestiOlio.numero);

  var kommentit = document.createElement("div");
  kommentit.setAttribute("class", "kommentit");
  // var te = document.createTextNode(viestiOlio.kommentit);
  // kommentit.appendChild(te);
  kommentit.setAttribute("id", "kommenttiId" + viestiOlio.numero);

  var kirjoitaKommentti = document.createElement("textarea");
  kirjoitaKommentti.innerHTML.value = "Haluatko kommentoida?";
  kirjoitaKommentti.setAttribute("id", "kirjoitaKommenttiId" + viestiOlio.numero);
  kirjoitaKommentti.setAttribute("rows", "4");
  kirjoitaKommentti.setAttribute("cols", "60");

  var kommenttiNappula = document.createElement("button");
  kommenttiNappula.innerHTML = "Kommentoi";
  kommenttiNappula.setAttribute("id", "kommenttinappulaId" + viestiOlio.numero);
  var kommenttiOlio = luoKommenttiOlio(document.getElementById("kirjoitaKommenttiId" + viestiOlio.numero), localStorage.getItem("etunimi"))
  kommenttiNappula.setAttribute("onClick", "lahetaKommentti(kommenttiOlio)");
  console.log("2. Kaikki tarvittava on saatu luotua")

  // Kun kaikki tarvittava on luotu (ylempänä), on ne nimettävä 'viestin' lapsiksi
  viesti.appendChild(viestiTeksti);
  viesti.appendChild(lahettaja);
  viesti.appendChild(ajankohta);
  viesti.appendChild(lampo);
  viesti.appendChild(lampoNappula);
  viesti.appendChild(kommentit);
  viesti.appendChild(kirjoitaKommentti);
  viesti.appendChild(kommenttiNappula);
  console.log("3. Kaikki tarvittava on appendattu")

  // Järjestys ja viestien postaaminen sivulle
  var aa = document.getElementById("viestit");
  console.log("4. Aa-muuttuja on nyt luotu")

  if (aa.hasChildNodes()) {
    aa.insertBefore(viesti, haeViesti(viestiObjekti.length, console.log));
  } else {
    aa.appendChild(viesti);
  }
  console.log("5. Random if-lausekin saattoi jopa juuri ja juuri toteutua (aa:ta tarvittiin tässä)")

  // Kun käyttäjä painaa nappia, alla oleva tapahtunee
  document.getElementById("kommenttiId" + viestiOlio.numero).addEventListener("keyup", function(event) {
    // Peruutetaan mahdollinen "defaultAction", jos sen perumiselle tulee tarve
    event.preventDefault();
    // Numero 13 vastaa näppäimistön enter-nappia
    if (event.keyCode === 13) {
      // Klikatessa ID:n osoittama elementti triggeröityy
      document.getElementById("kommenttinappulaId" + viestiOlio.numero).click();
    }
  });
  console.log("6. Päästiin funktion loppuun. Hurraa!!")

  // Kutsutaan vielä funktiota, jotta uusin viesti saataisiin talteen myös firebasen.
  viestiJSONiin(viestiOlio)
}

// Funktio luo kommenttiOlion
function luoKommenttiOlio(teksti) {
  this.viesti = teksti;
  this.nimi = localStorage.getItem("etunimi");
  this.aika = new Date();
  return {viesti, nimi, aika};
}

// Funktio ottaa parametrikseen ylempänä luodun kommenttiOlion, ja lisää sen vamlmiiseen viestiin
function lahetaKommentti(kommenttiOlio, viestiOlio) {
  firebase.database().ref("uutiset/" + viestiOlio.numero).set({
    kommentit: viestiOlio.kommentit[{
      viesti: kommenttiOlio.viesti,
      nimi: kommenttiOlio.nimi,
      aika: kommenttiOlio.aika,
    }]
  });
  json = JSON.parse(haeJson());
}

// ALLA TOISENLAINEN YRITYS VIESTIN JSONIIN LISÄÄMISELLE
// function viestiJSONiin(viestiOlio) {
//   firebase.database().ref(viestiOlio.numero).set({
//     viesti: viestiOlio.viesti,
//     lampo: viestiOlio.lampo,
//     nimi: viestiOlio.nimi,
//     aika: viestiOlio.aika,
//     numero: viestiOlio.numero,
//     kommentit: viestiOlio.kommentit
//   });
//   json = JSON.parse(haeJson());
// }

// Alla vanhoja testauksia erinäisille asioille...
// function luoKommenttiOlio(teksti, lahettaja, mihinViestiin) {
//   var uusOlio = {viesti: teksti, nimi: lahettaja, aika: new Date() };
//   return [uusOlio, mihinViestiin.numero];
// }

// //Tämä funktio lisää kommentin valittuun viestiolioon
// function kommentoi(kommenttiOlio, int) {      //MIETI INT!!!!!!!!
//     var xmlhttp = new XMLHttpRequest();
//     //Valitaan oikea url listan koon mukaisesti
//     var url = "https://maalampo-some-demo.firebaseio.com/uutiset/" + int + "/kommentit.json";
//     xmlhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//         console.log(this.responseText);
//         //viestiObjekti = JSON.parse(this.responseText);
//       }
//     };
//     //Lisätään viesti firebaseen
//     xmlhttp.open("PUT", url, true);
//     xmlhttp.send(kommenttiOlio[0]);
// }


// MIETI MYÖS, MITÄ IHMETTÄ TÄSSÄ TAPAHTUU... PITÄISIKÖ TÄÄ TOTEUTTAA KAHDELLE ERI SIVULLE? RIITTÄÄKÖ LISTAN JÄRJESTÄMINEN JÄRJESTÄMISEKSI?
// Jos tää menee liian monimutkaseks, nii älkää stressatko tästä vaan tehkää muut jutut hyvin :))

// // Tämä funktio järjestää viestit väärinpäin olevan listan mukaisesti, ts. uusin ensin
// function jarjestaAjankohtaiset() {
//   return lista.reverse();
// }
//
// //Tämä funkio järjestää viestit lämmön määrän mukaisesti, isoin numero ensin
// function jarjestaSuosituin() {
//
//
//
//
//   // var jarjestus = viestiObjekti;
//   // var x;
//   // for (x = 0; x < viestiObjekti.length; x++) {
//   //   jarjestus[x] = viestiObjekti[x].lampo;
//   // }
//   // var c = jarjestus.map(function(e, i) {
//   //   return [e, viestiObjekti[i]];
//   // });
//   // var oikein = c.sort().reverse;
//   // return oikein.values;
// }

//Tämä funkio järjestää viestit kommenttien määrän mukaisesti, isoin numero ensin
// function jarjestaKeskustelu() {
//
// }
