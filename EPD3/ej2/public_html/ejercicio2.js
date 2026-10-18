function calcular(pesoReal, largo, ancho, alto, destino) {
    var peso = parseFloat(pesoReal);
    var l = Number(largo);
    var an = Number(ancho);
    var al = Number(alto);

    if (isNaN(peso) || peso <= 0 || peso > 30) {
        return "ERROR: DATOS INCORRECTOS";
    }

    if (isNaN(l) || !Number.isInteger(l) || l <= 0 || l > 120 ||
        isNaN(an) || !Number.isInteger(an) || an <= 0 || an > 120 ||
        isNaN(al) || !Number.isInteger(al) || al <= 0 || al > 120) {
        return "ERROR: DATOS INCORRECTOS";
    }

    if (typeof destino !== "string") {
        return "ERROR: DATOS INCORRECTOS";
    }
    var dest = destino.trim().toUpperCase();
    if (dest !== "LOCAL" && dest !== "NACIONAL" && dest !== "INTERNACIONAL") {
        return "ERROR: DATOS INCORRECTOS";
    }

    var pesoVolumetrico = (l * an * al) / 5000;
    var mayor = Math.max(peso, pesoVolumetrico);
    var pesoFacturable = Math.ceil(mayor);
    var tarifa = 0;
    if (dest === "LOCAL") {
        tarifa = 2.50;
    } else if (dest === "NACIONAL") {
        tarifa = 4.00;
    } else if (dest === "INTERNACIONAL") {
        tarifa = 8.50;
    }

    var subtotal = pesoFacturable * tarifa;
    var suplemento = 0.00;
    if (dest === "INTERNACIONAL") {
        suplemento = 12.00;
    }

    var recargo = 0.00;
    if (pesoFacturable > 20) {
        recargo = subtotal * 0.15;
    }

    var precioTotal = subtotal + suplemento + recargo;

    return {
        pesoReal: peso,
        pesoVolumetrico: pesoVolumetrico,
        pesoFacturable: pesoFacturable,
        suplemento: suplemento,
        recargo: recargo,
        precioTotal: precioTotal
    };
}

var inputPeso = prompt("Peso del paquete:");
var inputLargo = prompt("Largo:");
var inputAncho = prompt("Ancho:");
var inputAlto = prompt("Alto:");
var inputDestino = prompt("Destino:");
var resultado = calcular(inputPeso, inputLargo, inputAncho, inputAlto, inputDestino);
var contenedor = document.getElementById("salida");

if (typeof resultado === "string") {
    contenedor.innerHTML = resultado;
} else {
    var texto = "";
    texto += "Peso real: " + resultado.pesoReal + " kg<br>";
    texto += "Peso volum&eacute;trico: " + resultado.pesoVolumetrico.toFixed(2) + " kg<br>";
    texto += "Peso facturable: " + resultado.pesoFacturable + " kg<br>";

    if (resultado.suplemento > 0) {
        texto += "Suplemento internacional: " + resultado.suplemento.toFixed(2) + "&euro;<br>";
    }

    if (resultado.recargo > 0) {
        texto += "Recargo por peso elevado: " + resultado.recargo.toFixed(2) + "&euro;<br>";
    }

    texto += "Precio del env&iacute;o: " + resultado.precioTotal.toFixed(2) + "&euro;";
    contenedor.innerHTML = texto;
}