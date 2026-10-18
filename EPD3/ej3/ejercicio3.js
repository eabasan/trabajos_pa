/**
 * EPD 3 - Ejercicio 3
 * Procesamiento de codigos de actividades deportivas segun posiciones.
 */

function procesarCodigo(codigo) {
    var resultado = "";

    for (var i = 0; i < codigo.length; i++) {
        var caracter = codigo.charAt(i);

        // Regla 1: Posiciones multiplos de 5 (prioridad maxima sobre par)
        // La posicion 0 se excluye de multiplos para no anular el caracter inicial
        if (i > 0 && i % 5 === 0) {
            resultado += "*";
        }
        // Regla 2: Posiciones multiplos de 3 (prioridad sobre posicion par)
        else if (i > 0 && i % 3 === 0) {
            resultado += caracter.toLowerCase();
        }
        // Regla 3: Posiciones pares (incluye posicion 0)
        else if (i % 2 === 0) {
            resultado += caracter.toUpperCase();
        }
        // Resto de posiciones: sin cambios
        else {
            resultado += caracter;
        }
    }

    return resultado;
}

// Entrada de datos del usuario
var entrada = prompt("Introduzca el codigo de la actividad deportiva:", "natacion2025");

if (entrada !== null && entrada.trim() !== "") {
    var salida = procesarCodigo(entrada);
    alert("Codigo original: " + entrada + "\nCodigo procesado: " + salida);
} else {
    alert("No se ha introducido ningun codigo valido.");
}