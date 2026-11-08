/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
$(document).ready(function() {
  var velocidad = 400;
  var colorActivo = "rojo";

  var textoRojo = "Det\u00E9n el veh\u00EDculo";
  var textoAmarillo = "Precauci\u00F3n";
  var textoVerde = "Puedes pasar";

  $("#luz-roja").css("opacity", 1);
  $("#luz-amarilla").css("opacity", 0.2);
  $("#luz-verde").css("opacity", 0.2);
  $("#mensaje-estado").text(textoRojo);

  function cambiarSemaforo(nuevoColor, mensaje, luzActiva, lucesRestantes) {
    if (colorActivo === nuevoColor) {
      return;
    }
    colorActivo = nuevoColor;

    $(".luz").stop(true, false);

    luzActiva.fadeTo(velocidad, 1);
    lucesRestantes.fadeTo(velocidad, 0.2);

    $("#mensaje-estado").text(mensaje);
  }

  $("#btn-rojo").on("click", function() {
    cambiarSemaforo(
      "rojo",
      textoRojo,
      $("#luz-roja"),
      $("#luz-amarilla, #luz-verde")
    );
  });

  $("#btn-amarillo").on("click", function() {
    cambiarSemaforo(
      "amarillo",
      textoAmarillo,
      $("#luz-amarilla"),
      $("#luz-roja, #luz-verde")
    );
  });

  $("#btn-verde").on("click", function() {
    cambiarSemaforo(
      "verde",
      textoVerde,
      $("#luz-verde"),
      $("#luz-roja, #luz-amarilla")
    );
  });

  $(".circulo-luz").on("mouseenter", function() {
    $(this).stop(true, false).animate({
      width: "78px",
      height: "78px"
    }, 200);
  });

  $(".circulo-luz").on("mouseleave", function() {
    $(this).stop(true, false).animate({
      width: "70px",
      height: "70px"
    }, 200);
  });
});

