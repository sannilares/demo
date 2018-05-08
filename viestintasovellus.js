
haeJson();

// Tämä funktio hakee viestit ???????ja starttaa karusellin????????
function haeJson() {
  var xmlhttp = new XMLHttpRequest();
  var url = "https://maalampo-some-demo.firebaseio.com/.json";

  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      console.log(this.responseText);
      ????? = JSON.parse(this.responseText);

      // Voidaan kutsua funktiota tässä hehheh

      // Ja päivitetään sivu ehkäpä?

    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}




function lahetaViesti() {

}

function lahetaLampoa() {

}

function kommentoi() {

}
