// Muuttujia:
var json = "";
var database = firebase.database();

// funktio päivittää viestit näkyviin sivulle.
function listaaViestit() {
  var viestit = document.getElementById('viestit');
  database.ref().orderByChild('numero').on('value', snapshot => {
    while (viestit.firstChild) { viestit.removeChild(viestit.firstChild); };
    snapshot.forEach(child => {
        lahetaViesti(new viestiOlio(child.val().viesti, child.val().lampo, child.val().nimi, child.val().aika, child.val().numero));
    });
  });
}


window.onload = function() {

document.getElementById("testi").innerHTML = "Hello, " + localStorage.getItem("etunimi");
console.log("hello world");
listaaViestit();
//Tallentaa JSON:in firebasesta muuttujaan json, Objekti
json = JSON.parse(haeJson());

// Nappuloihin toiminnallisuus:
document.getElementById("viestiNappula").addEventListener("keyup", function(event) {
 // Peruutetaan mahdollinen "defaultAction", jos sen perumiselle tulee tarve
 event.preventDefault();
 // Numero 13 vastaa näppäimistön enter-nappia
 if (event.keyCode === 13) {
   // Klikatessa ID:n osoittama button triggeröityy
   document.getElementById("viestiNappula").click();
 }
});
};


// Tämä funktio hakee viestit
function haeJson() {
var xmlhttp = new XMLHttpRequest();
var url = "https://maalampo-some-demo.firebaseio.com/.json";

xmlhttp.open("GET", url, false);
xmlhttp.send(null);
return xmlhttp.responseText;
}

// Tämä funktio hakee tietyn viesti-olion
function haeViesti(int, callback) {
var xmlhttp = new XMLHttpRequest();
var url = "https://maalampo-some-demo.firebaseio.com/" + int + ".json";
console.log(url);

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    //Odotetaan että saadaan tiedot firebasesta
    callback(this.responseText);
    console.log(this.responseText);
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
  var url = "https://maalampo-some-demo.firebaseio.com/" + int + "/lampo.json";
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  //Suoritetaan pluslasku
  var uusLampo = parseInt(lammonMaara.lampo) + 1

  //Lisätään lämpö firebaseen
  xmlhttp.open("PUT", url, true);         //POST toiminee myös
  xmlhttp.send(uusLampo.toString());
  }
  // Haetaan JSON:ista parametrin osoittama viesti ja käynnistetään funktio
  haeViesti(int, aikaJarjestus);
}


// Mööritellään viestiOlio
class viestiOlio {
  constructor(viesti, lampo, nimi, aika, numero) {
    this.viesti = viesti;
    this.lampo = lampo;
    this.nimi = nimi;
    this.aika = aika;
    this.numero = numero;
  }
}

// Luodaan viestiOlio
function luoViestiOlio(teksti) {
this.viesti = teksti;
this.lampo = "0";
this.nimi = localStorage.getItem("etunimi");
var d = new Date();
this.aika = d.toLocaleString();
this.numero = (new Date()).getTime();
return new viestiOlio(this.viesti, this.lampo, this.nimi, this.aika, this.numero);
}


// Tämä funktio lisää uuden viestiolion firebaseen käyttäen firebasen omia metodeita
function viestiJSONiin(viestiOlio) {

  firebase.database().ref(viestiOlio.numero).set({
    viesti: viestiOlio.viesti,
    lampo: viestiOlio.lampo,
    nimi: viestiOlio.nimi,
    aika: viestiOlio.aika,
    numero: viestiOlio.numero
  });
  json = JSON.parse(haeJson());
}


// Tämä funktio lisää viestin näkyville sivulle, ja luo viestille kommentointi ja lämmön lähetys mahdollisuudet
function lahetaViesti(viestiOlio) {

// Luodaan tarvittavat tekstit, kentät ja nappulat:
var viesti = document.createElement("div");
viesti.setAttribute("class", "viesti");

var lahettaja = document.createElement("p");
lahettaja.setAttribute("class", "lahettaja");
var teksti = document.createTextNode(viestiOlio.nimi);
lahettaja.appendChild(teksti);

var ajankohta = document.createElement("p");
ajankohta.setAttribute("class", "ajankohta");
var tekst = document.createTextNode(viestiOlio.aika);
ajankohta.appendChild(tekst);

var vali = document.createElement("br");
ajankohta.appendChild(vali);

var viestiTeksti = document.createElement("p");
viestiTeksti.setAttribute("class", "viestiTeksti");
var teks = document.createTextNode(viestiOlio.viesti);
viestiTeksti.appendChild(teks);

var lampo = document.createElement("p");
lampo.setAttribute("class", "lampo");
var tek = document.createTextNode(viestiOlio.lampo);
lampo.appendChild(tek);

// Lähetä lämpöä - nappula toiminnalisuuksineen
var lampoNappula = document.createElement("button");
lampoNappula.setAttribute("class", "lampoNappula");
lampoNappula.setAttribute("type", "button");
lampoNappula.setAttribute("onclick", "lahetaLampoa(" + viestiOlio.numero + ")");
lampoNappula.innerHTML = "Lähetä lämpöä!";
lampoNappula.setAttribute("id", "lamponappulaId" + viestiOlio.numero);

// Kommentit näkyville
var kommentit = document.createElement("div");
kommentit.setAttribute("class", "kommentit");

database.ref(viestiOlio.numero).child('kommentit').once('value', snapshot => {
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      var p = document.createElement("p");
      var te = document.createTextNode(child.val().viesti);
      var tee = document.createTextNode(" ~");
      var teee = document.createTextNode(child.val().nimi);
      p.appendChild(te);
      p.appendChild(tee);
      p.appendChild(teee);
      kommentit.appendChild(p);
    })
  }
});
kommentit.setAttribute("id", "kommenttiId" + viestiOlio.numero);

// Tekstikenttä kommenttien kirjoittamiselle
var kirjoitaKommentti = document.createElement("textarea");
kirjoitaKommentti.innerHTML.value = "Haluatko kommentoida?";
kirjoitaKommentti.setAttribute("class", "kirKommentti");
kirjoitaKommentti.setAttribute("id", "kirjoitaKommenttiId" + viestiOlio.numero);
kirjoitaKommentti.setAttribute("rows", "4");
kirjoitaKommentti.setAttribute("cols", "60");

// Nappula kommenttien lähettämiselle toiminnallisuuksineen
var kommenttiNappula = document.createElement("button");
kommenttiNappula.innerHTML = "Kommentoi";
kommenttiNappula.setAttribute("id", "kommenttinappulaId" + viestiOlio.numero);
kommenttiNappula.setAttribute("class", "kommenttiNappula");
kommenttiNappula.setAttribute("type", "button");
kommenttiNappula.onclick = function() { lahetaKommentti("kirjoitaKommenttiId" + viestiOlio.numero, viestiOlio) };

// Kun kaikki tarvittava on luotu (ylempänä), on ne nimettävä 'viestin' lapsiksi
viesti.appendChild(lahettaja);
viesti.appendChild(ajankohta);
viesti.appendChild(viestiTeksti);
viesti.appendChild(lampo);
viesti.appendChild(lampoNappula);
viesti.appendChild(kommentit);
viesti.appendChild(kirjoitaKommentti);
viesti.appendChild(kommenttiNappula);

// Järjestys ja viestien postaaminen sivulle
var aa = document.getElementById("viestit");

// Uusin viesti näkyköön ensimmäisenä
viestit.prepend(viesti);

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
  document.getElementById('viesti').value = "";
}

// Luokka kommenttioliolle
class kommenttiOlio {
  constructor(viesti, nimi, aika) {
    this.viesti = viesti;
    this.nimi = nimi;
    this.aika = aika;
  }
}

// Funktio luo kommenttiOlion
function luoKommenttiOlio(teksti) {
this.viesti = teksti;
this.nimi = localStorage.getItem("etunimi");
var d = new Date();
this.aika = d.toLocaleString();
return new kommenttiOlio(this.viesti, this.nimi, this.aika);
}

// Funktio ottaa parametrikseen kommentin tekstiin viittaavan id:n, luo sillä kommenttiolion ja lisää sen tekstin vamlmiiseen viestiin (parametrinä)
function lahetaKommentti(kommentinSisalto, viestiOlio) {

 var kommentinSisalto = document.getElementById(kommentinSisalto);
 var kommenttiOlio = luoKommenttiOlio(kommentinSisalto.value);

 firebase.database().ref(viestiOlio.numero).child('kommentit').push(kommenttiOlio);
json = JSON.parse(haeJson());
}
