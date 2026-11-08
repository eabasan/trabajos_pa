$(document).ready(function() {
    var intentoEnviado = false;
    var enTransicion = false;

    $("#fecha").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: 0,
        maxDate: "+4D",
        onSelect: function() {
            if (intentoEnviado) {
                validarFecha();
            }
        }
    });

    function mostrarError($elementoError, mensaje) {
        if ($elementoError.text() !== mensaje || !$elementoError.is(":visible")) {
            $elementoError.stop(true, true).text(mensaje).fadeIn(200);
        }
    }

    function ocultarError($elementoError) {
        if ($elementoError.is(":visible")) {
            $elementoError.stop(true, true).fadeOut(200);
        }
    }

    function validarNombre() {
        var valor = $.trim($("#nombre").val());
        var $error = $("#error-nombre");
        if (valor === "") {
            mostrarError($error, "Por favor, introduzca su nombre y apellidos.");
            return false;
        }
        ocultarError($error);
        return true;
    }

    function validarEmail() {
        var valor = $.trim($("#email").val());
        var $error = $("#error-email");
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (valor === "") {
            mostrarError($error, "El correo electr\u00f3nico es obligatorio.");
            return false;
        }
        if (!regexEmail.test(valor)) {
            mostrarError($error, "Introduzca una direcci\u00f3n de correo electr\u00f3nico v\u00e1lida.");
            return false;
        }
        ocultarError($error);
        return true;
    }

    function validarEntradas() {
        var valorStr = $.trim($("#entradas").val());
        var $error = $("#error-entradas");

        if (valorStr === "") {
            mostrarError($error, "Debe indicar el n\u00famero de entradas.");
            return false;
        }

        if (!/^-?\d+$/.test(valorStr)) {
            mostrarError($error, "El n\u00famero de entradas debe ser un n\u00famero entero sin decimales.");
            return false;
        }

        var num = Number(valorStr);
        if (num < 1 || num > 5) {
            mostrarError($error, "El n\u00famero de entradas debe estar comprendido entre 1 y 5.");
            return false;
        }

        ocultarError($error);
        return true;
    }

    function validarFecha() {
        var valor = $.trim($("#fecha").val());
        var $error = $("#error-fecha");

        if (valor === "") {
            mostrarError($error, "Seleccione o escriba una fecha de asistencia.");
            return false;
        }

        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
            mostrarError($error, "La fecha debe respetar el formato dd/mm/aaaa.");
            return false;
        }

        var fechaParsed;
        try {
            fechaParsed = $.datepicker.parseDate("dd/mm/yy", valor);
        } catch (e) {
            mostrarError($error, "La fecha introducida no existe en el calendario.");
            return false;
        }

        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        var maxFecha = new Date(hoy.getTime());
        maxFecha.setDate(hoy.getDate() + 4);

        if (fechaParsed < hoy || fechaParsed > maxFecha) {
            mostrarError($error, "La fecha debe estar dentro de los 5 d\u00edas del festival (desde hoy hasta 4 d\u00edas despu\u00e9s).");
            return false;
        }

        ocultarError($error);
        return true;
    }

    function validarTipo() {
        var valor = $("#tipo-entrada").val();
        var $error = $("#error-tipo");

        if (valor === "") {
            mostrarError($error, "Debe seleccionar un tipo de entrada.");
            return false;
        }
        ocultarError($error);
        return true;
    }

    function validarCondiciones() {
        var aceptado = $("#condiciones").prop("checked") === true;
        var $error = $("#error-condiciones");

        if (!aceptado) {
            mostrarError($error, "Debe aceptar las condiciones del festival para continuar.");
            return false;
        }
        ocultarError($error);
        return true;
    }

    $("#nombre").on("input", function() {
        if (intentoEnviado) validarNombre();
    });

    $("#email").on("input", function() {
        if (intentoEnviado) validarEmail();
    });

    $("#entradas").on("input", function() {
        if (intentoEnviado) validarEntradas();
    });

    $("#fecha").on("input", function() {
        if (intentoEnviado) validarFecha();
    });

    $("#tipo-entrada").on("change", function() {
        if (intentoEnviado) validarTipo();
    });

    $("#condiciones").on("change", function() {
        if (intentoEnviado) validarCondiciones();
    });

    $("#form-entradas").on("submit", function(event) {
        event.preventDefault();
        if (enTransicion) {
            return;
        }

        intentoEnviado = true;
        var esNombreValido = validarNombre();
        var esEmailValido = validarEmail();
        var esEntradasValido = validarEntradas();
        var esFechaValida = validarFecha();
        var esTipoValido = validarTipo();
        var esCondicionesValido = validarCondiciones();

        if (esNombreValido && esEmailValido && esEntradasValido && esFechaValida && esTipoValido && esCondicionesValido) {
            $(".mensaje-error").stop(true, true).hide();
            $("#res-nombre").text($.trim($("#nombre").val()));
            $("#res-email").text($.trim($("#email").val()));
            $("#res-fecha").text($.trim($("#fecha").val()));
            $("#res-tipo").text($("#tipo-entrada option:selected").text());
            $("#res-entradas").text($.trim($("#entradas").val()));
            enTransicion = true;
            $("#btn-confirmar").prop("disabled", true);

            $("#formulario-reserva").slideUp(400, function() {
                $("#panel-resumen").slideDown(400, function() {
                    enTransicion = false;
                    $("#btn-confirmar").prop("disabled", false);
                });
            });
        }
    });

    $("#btn-modificar").on("click", function() {
        if (enTransicion) {
            return;
        }

        enTransicion = true;
        $("#btn-modificar").prop("disabled", true);
        $("#panel-resumen").slideUp(400, function() {
            $("#formulario-reserva").slideDown(400, function() {
                enTransicion = false;
                $("#btn-modificar").prop("disabled", false);
            });
        });
    });
});