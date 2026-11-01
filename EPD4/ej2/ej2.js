/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
const incidencias = [
    [
        "Seguridad",
        "Se detectan numerosos intentos fallidos de acceso por fuerza bruta desde una direcci&oacute;n IP desconocida.",
        "Alta",
        [
            "Reiniciar el servidor web",
            "Bloquear temporalmente la direcci&oacute;n IP en el firewall",
            "Eliminar todas las cuentas de usuario afectadas",
            "Desactivar la infraestructura de red completa"
        ],
        1,
        "El bloqueo perimetral en el firewall frena el ataque de inmediato sin provocar denegaci&oacute;n de servicio a los usuarios leg&iacute;timos."
    ],
    [
        "Copias de seguridad",
        "El proceso programado de respaldo nocturno de las bases de datos acad&eacute;micas ha finalizado con estado err&oacute;neo.",
        "Media",
        [
            "Ignorar la alerta y esperar a la noche siguiente",
            "Formatear la cabina de almacenamiento de copias",
            "Examinar los logs de error y lanzar un respaldo manual inmediato",
            "Eliminar las copias hist&oacute;ricas para liberar espacio"
        ],
        2,
        "Analizar el registro permite identificar el motivo del fallo y el respaldo manual garantiza contar con un punto de recuperaci&oacute;n reciente."
    ],
    [
        "Redes",
        "Los puestos de trabajo de un departamento no tienen conexi&oacute;n a Internet, aunque s&iacute; se comunican con los servidores locales.",
        "Media",
        [
            "Verificar la puerta de enlace predeterminada y el router de salida",
            "Sustituir los cables de red de todos los ordenadores",
            "Reinstalar el sistema operativo de las m&aacute;quinas cliente",
            "Apagar el conmutador (switch) de planta"
        ],
        0,
        "La comunicaci&oacute;n local operativa confirma que el fallo se localiza en el enrutamiento o en el enlace de salida hacia el proveedor externo."
    ],
    [
        "Hardware",
        "El sensor t&eacute;rmico del servidor de correo alerta de una temperatura cr&iacute;tica sostenida en la CPU superior a 95&deg;C.",
        "Alta",
        [
            "Aumentar la carga de trabajo para forzar la ventilaci&oacute;n",
            "Apagar ordenadamente la m&aacute;quina y verificar disipaci&oacute;n y flujo de aire",
            "Desactivar las alertas de temperatura de la BIOS",
            "Desconectar el cable de alimentaci&oacute;n de forma abrupta"
        ],
        1,
        "El apagado ordenado evita da&ntilde;os f&iacute;sicos en el silicio y permite inspeccionar los ventiladores y la pasta t&eacute;rmica sin corromper datos."
    ],
    [
        "Aplicaciones",
        "El portal de matriculaci&oacute;n arroja un error '500 Internal Server Error' tras desplegar un parche de actualizaci&oacute;n.",
        "Alta",
        [
            "Solicitar a los alumnos que insistan recargando la p&aacute;gina",
            "Revertir el despliegue a la versi&oacute;n estable previa (rollback)",
            "Borrar la base de datos de expedientes",
            "Cambiar el nombre del dominio institucional"
        ],
        1,
        "Efectuar un rollback inmediato restituye el servicio a la comunidad universitaria mientras se depura el parche en entorno de pruebas."
    ],
    [
        "Gesti&oacute;n de usuarios",
        "Un profesor comunica que ha recibido un correo solicitando sus claves universitarias y sospecha haber ca&iacute;do en una trampa de phishing.",
        "Alta",
        [
            "Restablecer su contrase&ntilde;a inmediatamente y revocar sesiones activas",
            "Publicar un aviso en redes sociales advirtiendo del hecho",
            "Ignorar el aviso si el profesor a&uacute;n puede iniciar sesi&oacute;n",
            "Dar de baja la matr&iacute;cula de todos sus alumnos"
        ],
        0,
        "Inhabilitar la contrase&ntilde;a vulnerada e invalidar los tokens de sesi&oacute;n impide el acceso del atacante a los sistemas de la universidad."
    ]
];

var incidenciasTurno = [];   
var indiceActual = 0;
var puntos = 0;              
var aciertos = 0;            
var fallos = 0;              
var omisiones = 0;
var tiemposRespuesta = [];   
var bloqueado = false;       

// Temporizadores
var relojIntervalo = null;
var temporizadoLimite = null;
var segundosRestantes = 25;

function pararReloj() {
    if (relojIntervalo !== null) {
        clearInterval(relojIntervalo);
        relojIntervalo = null;
    }
    if (temporizadoLimite !== null) {
        clearTimeout(temporizadoLimite);
        temporizadoLimite = null;
    }
}

function iniciarTurno() {
    puntos = 0;
    aciertos = 0;
    fallos = 0;
    omisiones = 0;
    indiceActual = 0;
    tiemposRespuesta = [];
    bloqueado = false;

    document.getElementById("puntos").textContent = "0";
    document.getElementById("incidencia_actual").textContent = "0";
    document.getElementById("barra_progreso").style.width = "0%";
    document.getElementById("lista_historial").innerHTML = "";

    incidenciasTurno = seleccionarIncidencias();

    document.getElementById("pantalla_inicio").classList.add("oculto");
    document.getElementById("zona_incidencia").classList.remove("oculto");

    mostrarIncidencia();
}

function seleccionarIncidencias() {
    var incidencias_copia = incidencias.slice();
    var seleccionadas = [];

    while (seleccionadas.length < 5) {
        var indiceAleatorio = Math.floor(Math.random() * incidencias_copia.length);
        var elemento = incidencias_copia.splice(indiceAleatorio, 1)[0];
        seleccionadas.push(elemento);
    }
    return seleccionadas;
}

function mostrarIncidencia() {
    bloqueado = false;
    var panelExp = document.getElementById("panel_explicacion");
    panelExp.classList.add("oculto");
    panelExp.innerHTML = "";

    var actual = incidenciasTurno[indiceActual];
    var categoria = actual[0];
    var descripcion = actual[1];
    var gravedad = actual[2];
    var opciones = actual[3];

    document.getElementById("incidencia_actual").textContent = (indiceActual + 1);
    var zona = document.getElementById("zona_incidencia");
    zona.innerHTML = "";
    var tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta_pregunta";

    var cabecera = document.createElement("div");
    cabecera.innerHTML = '<span class="categoria">' + categoria + '</span>' +
            '<span class="gravedad">Gravedad: ' + gravedad + '</span>';
    tarjeta.appendChild(cabecera);

    var parrafoDesc = document.createElement("p");
    parrafoDesc.innerHTML = descripcion;
    tarjeta.appendChild(parrafoDesc);

    var lista = document.createElement("ul");
    lista.className = "lista_opciones";

    for (let i = 0; i < opciones.length; i++) {
        var item = document.createElement("li");
        var boton = document.createElement("button");

        boton.type = "button";
        boton.className = "btn_opcion";
        boton.id = "opcion_" + i;
        boton.innerHTML = (i + 1) + ". " + opciones[i];

        boton.onmouseover = function () {
            if (!bloqueado) {
                this.classList.add("boton_hover");
            }
        };

        boton.onmouseout = function () {
            this.classList.remove("boton_hover");
        };

        boton.onclick = function () {
            seleccionarActuacion(i, "raton");
        };

        item.appendChild(boton);
        lista.appendChild(item);
    }

    tarjeta.appendChild(lista);
    zona.appendChild(tarjeta);

    iniciarTemporizador();
}

function iniciarTemporizador() {
    pararReloj();

    segundosRestantes = 25;
    var elementoReloj = document.getElementById("reloj");
    var avisoTiempo = document.getElementById("aviso_tiempo");

    elementoReloj.textContent = segundosRestantes;
    elementoReloj.classList.remove("reloj_alerta");
    avisoTiempo.classList.add("oculto");

    relojIntervalo = setInterval(function () {
        segundosRestantes--;
        elementoReloj.textContent = segundosRestantes;

        if (segundosRestantes <= 5 && segundosRestantes > 0) {
            elementoReloj.classList.add("reloj_alerta");
            avisoTiempo.classList.remove("oculto");
        }

        if (segundosRestantes <= 0) {
            if (relojIntervalo !== null) {
                clearInterval(relojIntervalo);
                relojIntervalo = null;
            }
        }
    }, 1000);

    temporizadoLimite = setTimeout(function () {
        gestionarTiempoAgotado();
    }, 25000);
}

function seleccionarActuacion(indiceOpcion, origenEvento) {
    if (bloqueado) {
        return;
    }
    bloqueado = true;
    pararReloj();

    var botones = document.querySelectorAll(".btn_opcion");
    for (var i = 0; i < botones.length; i++) {
        botones[i].disabled = true;
        botones[i].classList.remove("boton_hover");
    }

    var tiempoEmpleado = 25 - segundosRestantes;
    if (tiempoEmpleado < 1) {
        tiempoEmpleado = 1;
    }
    tiemposRespuesta.push(tiempoEmpleado);

    var actual = incidenciasTurno[indiceActual];
    var opcionElegidaTexto = actual[3][indiceOpcion];
    var indiceCorrecto = actual[4];
    var explicacion = actual[5];

    var esAcierto = (indiceOpcion === indiceCorrecto);
    var variacionPuntos = 0;
    var mensajeVeredicto = "";

    if (esAcierto) {
        aciertos++;
        variacionPuntos = 15;
        if (tiempoEmpleado <= 10) {
            variacionPuntos += 5;
            mensajeVeredicto = "&iexcl;Correcto! (+15 pts) con bonificaci&oacute;n de rapidez (+5 pts)";
        } else {
            mensajeVeredicto = "&iexcl;Correcto! (+15 pts)";
        }
    } else {
        fallos++;
        variacionPuntos = -5;
        mensajeVeredicto = "Incorrecto (-5 pts)";
    }

    puntos += variacionPuntos;
    if (puntos < 0) {
        puntos = 0;
    }
    document.getElementById("puntos").textContent = puntos;

    var botonSeleccionado = document.getElementById("opcion_" + indiceOpcion);
    var botonCorrecto = document.getElementById("opcion_" + indiceCorrecto);

    if (esAcierto) {
        if (botonSeleccionado) {
            botonSeleccionado.classList.add("opcion_correcta");
        }
    } else {
        if (botonSeleccionado) {
            botonSeleccionado.classList.add("opcion_incorrecta");
        }
        if (botonCorrecto) {
            botonCorrecto.classList.add("opcion_correcta");
        }
    }

    var panelExp = document.getElementById("panel_explicacion");
    panelExp.innerHTML = "<strong>" + mensajeVeredicto + "</strong> (Tiempo: " + tiempoEmpleado + "s por " + origenEvento + ")<br>" +
            "<em>Justificaci&oacute;n:</em> " + explicacion;
    panelExp.classList.remove("oculto");

    var porcentajeProgreso = (indiceActual + 1) * 20;
    document.getElementById("barra_progreso").style.width = porcentajeProgreso + "%";

    var resultadoTexto = esAcierto ? "Correcta" : "Incorrecta";
    registrarResultado(indiceActual + 1, opcionElegidaTexto, resultadoTexto, tiempoEmpleado, variacionPuntos);

    setTimeout(function () {
        indiceActual++;
        if (indiceActual < 5) {
            mostrarIncidencia();
        } else {
            finalizarTurno();
        }
    }, 2000);
}

function gestionarTiempoAgotado() {
    if (bloqueado) {
        return;
    }
    bloqueado = true;
    pararReloj();

    var botones = document.querySelectorAll(".btn_opcion");
    for (var i = 0; i < botones.length; i++) {
        botones[i].disabled = true;
        botones[i].classList.remove("boton_hover");
    }

    omisiones++;
    tiemposRespuesta.push(25);

    var penalizacion = -3;
    puntos += penalizacion;
    if (puntos < 0) {
        puntos = 0;
    }
    document.getElementById("puntos").textContent = puntos;

    var actual = incidenciasTurno[indiceActual];
    var indiceCorrecto = actual[4];
    var explicacion = actual[5];

    var botonCorrecto = document.getElementById("opcion_" + indiceCorrecto);
    if (botonCorrecto) {
        botonCorrecto.classList.add("opcion_correcta");
    }

    var panelExp = document.getElementById("panel_explicacion");
    panelExp.innerHTML = "<strong>Tiempo agotado (-3 pts)</strong><br>" +
            "<em>Opci&oacute;n correcta:</em> " + actual[3][indiceCorrecto] + "<br>" +
            "<em>Justificaci&oacute;n:</em> " + explicacion;
    panelExp.classList.remove("oculto");

    var porcentajeProgreso = (indiceActual + 1) * 20;
    document.getElementById("barra_progreso").style.width = porcentajeProgreso + "%";

    registrarResultado(indiceActual + 1, "Sin respuesta", "Tiempo agotado", 25, penalizacion);

    setTimeout(function () {
        indiceActual++;
        if (indiceActual < 5) {
            mostrarIncidencia();
        } else {
            finalizarTurno();
        }
    }, 2000);
}

function registrarResultado(indiceIncidencia, decision, resultado, tiempo, variacion) {
    var lista = document.getElementById("lista_historial");

    var item = document.createElement("li");
    item.className = "item_historial";

    var textoVariacion = (variacion > 0 ? "+" : "") + variacion + " pts";
    var actual = incidenciasTurno[indiceActual];
    var categoria = actual[0];
    var gravedad = actual[2];

    item.innerHTML = "<strong>Incidencia " + indiceIncidencia + " &mdash; Categor&iacute;a: " + categoria + " | Gravedad: " + gravedad + "</strong><br>" +
            "Decisi&oacute;n adoptada: " + decision + "<br>" +
            "Resultado: <em>" + resultado + "</em> | Tiempo: " + tiempo + "s | Puntos: <strong>" + textoVariacion + "</strong>";

    lista.appendChild(item);
    lista.scrollTop = lista.scrollHeight;
}

function finalizarTurno() {
    pararReloj();

    document.getElementById("zona_incidencia").classList.add("oculto");
    document.getElementById("panel_explicacion").classList.add("oculto");

    var sumaTiempos = 0;
    for (var i = 0; i < tiemposRespuesta.length; i++) {
        sumaTiempos += tiemposRespuesta[i];
    }
    var tiempoMedio = (sumaTiempos / tiemposRespuesta.length).toFixed(1);

    var nivel = "";
    if (puntos >= 80) {
        nivel = "Especialista";
    } else if (puntos >= 55) {
        nivel = "T&eacute;cnico avanzado";
    } else if (puntos >= 30) {
        nivel = "T&eacute;cnico en formaci&oacute;n";
    } else {
        nivel = "Debe revisar el protocolo de actuaci&oacute;n";
    }

    var zonaInforme = document.getElementById("zona_informe");
    zonaInforme.innerHTML =
            '<div class="tarjeta_pregunta">' +
            '<h2>Informe T&eacute;cnico de Fin de Guardia</h2>' +
            '<p><strong>Puntuaci&oacute;n final:</strong> ' + puntos + ' puntos</p>' +
            '<p><strong>Nivel alcanzado:</strong> ' + nivel + '</p>' +
            '<ul>' +
            '<li>Decisiones correctas: <strong>' + aciertos + '</strong></li>' +
            '<li>Decisiones incorrectas: <strong>' + fallos + '</strong></li>' +
            '<li>Sin respuesta (tiempo agotado): <strong>' + omisiones + '</strong></li>' +
            '<li>Tiempo medio de respuesta: <strong>' + tiempoMedio + ' s</strong></li>' +
            '</ul>' +
            '<p style="text-align: center; margin-top: 20px;">' +
            '<button type="button" onclick="reiniciarTurno()">Iniciar nuevo turno</button>' +
            '</p>' +
            '</div>';

    zonaInforme.classList.remove("oculto");
}

function reiniciarTurno() {
    var zonaInforme = document.getElementById("zona_informe");
    zonaInforme.classList.add("oculto");
    zonaInforme.innerHTML = "";

    iniciarTurno();
}

// Control por teclado (1 al 4)
document.addEventListener("keydown", function (event) {
    if (!bloqueado && incidenciasTurno.length > 0 && indiceActual < 5) {
        if (event.key === "1") {
            seleccionarActuacion(0, "teclado");
        } else if (event.key === "2") {
            seleccionarActuacion(1, "teclado");
        } else if (event.key === "3") {
            seleccionarActuacion(2, "teclado");
        } else if (event.key === "4") {
            seleccionarActuacion(3, "teclado");
        }
    }
});