const incidencias = [
    [
        "Seguridad",
        "Se detectan numerosos intentos fallidos de acceso por fuerza bruta desde una direcci\u00f3n IP desconocida.",
        "Alta",
        [
            "Reiniciar el servidor web",
            "Bloquear temporalmente la direcci\u00f3n IP en el firewall",
            "Eliminar todas las cuentas de usuario afectadas",
            "Desactivar la infraestructura de red completa"
        ],
        1,
        "El bloqueo perimetral en el firewall frena el ataque de inmediato sin provocar denegaci\u00f3n de servicio a los usuarios leg\u00edtimos."
    ],
    [
        "Copias de seguridad",
        "El proceso programado de respaldo nocturno de las bases de datos acad\u00e9micas ha finalizado con estado err\u00f3neo.",
        "Media",
        [
            "Ignorar la alerta y esperar a la noche siguiente",
            "Formatear la cabina de almacenamiento de copias",
            "Examinar los logs de error y lanzar un respaldo manual inmediato",
            "Eliminar las copias hist\u00f3ricas para liberar espacio"
        ],
        2,
        "Analizar el registro permite identificar el motivo del fallo y el respaldo manual garantiza contar con un punto de recuperaci\u00f3n reciente."
    ],
    [
        "Redes",
        "Los puestos de trabajo de un departamento no tienen conexi\u00f3n a Internet, aunque s\u00ed se comunican con los servidores locales.",
        "Media",
        [
            "Verificar la puerta de enlace predeterminada y el router de salida",
            "Sustituir los cables de red de todos los ordenadores",
            "Reinstalar el sistema operativo de las m\u00e1quinas cliente",
            "Apagar el conmutador (switch) de planta"
        ],
        0,
        "La comunicaci\u00f3n local operativa confirma que el fallo se localiza en el enrutamiento o en el enlace de salida hacia el proveedor externo."
    ],
    [
        "Hardware",
        "El sensor t\u00e9rmico del servidor de correo alerta de una temperatura cr\u00edtica sostenida en la CPU superior a 95\u00b0C.",
        "Alta",
        [
            "Aumentar la carga de trabajo para forzar la ventilaci\u00f3n",
            "Apagar ordenadamente la m\u00e1quina y verificar disipaci\u00f3n y flujo de aire",
            "Desactivar las alertas de temperatura de la BIOS",
            "Desconectar el cable de alimentaci\u00f3n de forma abrupta"
        ],
        1,
        "El apagado ordenado evita da\u00f1os f\u00edsicos en el silicio y permite inspeccionar los ventiladores y la pasta t\u00e9rmica sin corromper datos."
    ],
    [
        "Aplicaciones",
        "El portal de matriculaci\u00f3n arroja un error '500 Internal Server Error' tras desplegar un parche de actualizaci\u00f3n.",
        "Alta",
        [
            "Solicitar a los alumnos que insistan recargando la p\u00e1gina",
            "Revertir el despliegue a la versi\u00f3n estable previa (rollback)",
            "Borrar la base de datos de expedientes",
            "Cambiar el nombre del dominio institucional"
        ],
        1,
        "Efectuar un rollback inmediato restituye el servicio a la comunidad universitaria mientras se depura el parche en entorno de pruebas."
    ],
    [
        "Gesti\u00f3n de usuarios",
        "Un profesor comunica que ha recibido un correo solicitando sus claves universitarias y sospecha haber ca\u00eddo en una trampa de phishing.",
        "Alta",
        [
            "Restablecer su contrase\u00f1a inmediatamente y revocar sesiones activas",
            "Publicar un aviso en redes sociales advirtiendo del hecho",
            "Ignorar el aviso si el profesor a\u00fan puede iniciar sesi\u00f3n",
            "Dar de baja la matr\u00edcula de todos sus alumnos"
        ],
        0,
        "Inhabilitar la contrase\u00f1a vulnerada e invalidar los tokens de sesi\u00f3n impide el acceso del atacante a los sistemas de la universidad."
    ]
];
var incidenciasTurno = [];
var indiceActual = 0;
var puntuacionTotal = 0;
var correctas = 0;
var incorrectas = 0;
var noRespondidas = 0;
var tiemposRespuesta = [];

var temporizadorSegundos = null;
var temporizadorTimeout = null;
var segundosRestantes = 25;
var bloqueado = false;

function iniciarTurno() {
    puntuacionTotal = 0;
    correctas = 0;
    incorrectas = 0;
    noRespondidas = 0;
    tiemposRespuesta = [];
    indiceActual = 0;
    actualizarMarcadores();
    document.getElementById("historial-actividad").innerHTML = "";
    document.getElementById("pantalla-inicio").style.display = "none";
    document.getElementById("contenedor-informe").style.display = "none";
    document.getElementById("contenedor-incidencia").style.display = "block";
    document.getElementById("contenedor-reloj").style.display = "block";
    incidenciasTurno = seleccionarIncidencias();
    cargarIncidenciaActual();
}

function seleccionarIncidencias() {
    var copia = incidencias.slice();
    for (var i = copia.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = copia[i];
        copia[i] = copia[j];
        copia[j] = temp;
    }
    return copia.slice(0, 5);
}

function mostrarIncidencia() {
    var inc = incidenciasTurno[indiceActual];
    var contenedor = document.getElementById("contenedor-incidencia");
    var html = "<div class='tarjeta-incidencia'>";
    html += "<h2>Incidencia " + (indiceActual + 1) + " de 5</h2>";
    html += "<p><strong>Categor&iacute;a:</strong> " + inc[0] + " | <strong>Gravedad:</strong> " + inc[2] + "</p>";
    html += "<p style='font-size: 1.05rem;'><strong>Descripci&oacute;n:</strong> " + inc[1] + "</p>";
    html += "<h3>Actuaciones posibles (Teclas 1, 2, 3 o 4):</h3>";
    html += "<div id='grupo-opciones'>";

    for (var i = 0; i < inc[3].length; i++) {
        html += "<button type='button' class='btn-accion' id='btn-opcion-" + i + "' " +
                "onmouseover='manejarHover(this, true)' onmouseout='manejarHover(this, false)' " +
                "onclick='seleccionarActuacion(" + i + ", \"raton\")'>" +
                (i + 1) + ". " + inc[3][i] + "</button>";
    }

    html += "</div>";
    html += "<div id='panel-veredicto-contenedor'></div>";
    html += "</div>";
    contenedor.innerHTML = html;
}

function manejarHover(elemento, entra) {
    if (bloqueado) return;
    if (entra) {
        elemento.classList.add("btn-hover");
    } else {
        elemento.classList.remove("btn-hover");
    }
}

function iniciarTemporizador() {
    segundosRestantes = 25;
    bloqueado = false;
    actualizarVistaReloj();
    temporizadorSegundos = setInterval(function() {
        segundosRestantes--;
        actualizarVistaReloj();
    }, 1000);
    temporizadorTimeout = setTimeout(function() {
        gestionarTiempoAgotado();
    }, 25000);
}

function actualizarVistaReloj() {
    var relojTxt = document.getElementById("texto-temporizador");
    var aviso = document.getElementById("aviso-tiempo");
    relojTxt.textContent = "Tiempo: " + segundosRestantes + "s";
    if (segundosRestantes <= 5) {
        relojTxt.classList.add("alerta-tiempo");
        aviso.style.display = "block";
    } else {
        relojTxt.classList.remove("alerta-tiempo");
        aviso.style.display = "none";
    }
}

function detenerTemporizadores() {
    if (temporizadorSegundos) clearInterval(temporizadorSegundos);
    if (temporizadorTimeout) clearTimeout(temporizadorTimeout);
}

function bloquearInteracciones() {
    bloqueado = true;
    for (var i = 0; i < 4; i++) {
        var btn = document.getElementById("btn-opcion-" + i);
        if (btn) {
            btn.disabled = true;
            btn.classList.remove("btn-hover");
            btn.style.cursor = "default";
        }
    }
}

function seleccionarActuacion(indiceOpcion, origenEvento){
    if (bloqueado) return;
    detenerTemporizadores();
    bloquearInteracciones();
    var inc = incidenciasTurno[indiceActual];
    var tiempoEmpleado = 25 - segundosRestantes;
    if (tiempoEmpleado < 0) tiempoEmpleado = 0;
    tiemposRespuesta.push(tiempoEmpleado);
    var indiceCorrecto = inc[4];
    var esCorrecto = (indiceOpcion === indiceCorrecto);
    var variacion = 0;
    var textoVeredicto = "";
    var btnPulsado = document.getElementById("btn-opcion-" + indiceOpcion);
    var btnCorrecto = document.getElementById("btn-opcion-" + indiceCorrecto);
    if (esCorrecto){
        correctas++;
        btnPulsado.classList.add("btn-correcto");
        if(tiempoEmpleado <= 10){
            variacion = 20;
            textoVeredicto = "DECISI\u00d3N CORRECTA (+20 pts)\n" +
                             inc[5] + "\n" +
                             "Tiempo de respuesta: " + tiempoEmpleado + " segundos (\u00a1Bonificaci\u00f3n aplicada!)";
        }else{
            variacion = 15;
            textoVeredicto = "DECISI\u00d3N CORRECTA (+15 pts)\n" +
                             inc[5] + "\n" +
                             "Tiempo de respuesta: " + tiempoEmpleado + " segundos";
        }
    }else{
        incorrectas++;
        btnPulsado.classList.add("btn-incorrecto");
        btnCorrecto.classList.add("btn-correcto");
        variacion = -5;
        textoVeredicto = "DECISI\u00d3N INCORRECTA (-5 pts)\n" +
                         "Actuaci\u00f3n recomendada: " + inc[3][indiceCorrecto] + "\n" +
                         inc[5] + "\n" +
                         "Tiempo de respuesta: " + tiempoEmpleado + " segundos";
    }

    aplicarVariacionPuntos(variacion);
    mostrarPanelVeredicto(textoVeredicto);
    var resultadoTexto = esCorrecto ? "Correcta" : "Incorrecta";
    var variacionTexto = (variacion > 0) ? "+" + variacion : "" + variacion;
    registrarResultado(indiceActual + 1, inc[3][indiceOpcion], resultadoTexto, tiempoEmpleado, variacionTexto);

    pasarSiguienteIncidencia();
}

function gestionarTiempoAgotado(){
    detenerTemporizadores();
    bloquearInteracciones();
    noRespondidas++;
    var tiempoEmpleado = 25;
    tiemposRespuesta.push(tiempoEmpleado);
    var inc = incidenciasTurno[indiceActual];
    var indiceCorrecto = inc[4];
    var btnCorrecto = document.getElementById("btn-opcion-" + indiceCorrecto);
    if (btnCorrecto) btnCorrecto.classList.add("btn-correcto");
    aplicarVariacionPuntos(-3);
    var textoVeredicto = "TIEMPO DE RESPUESTA AGOTADO (-3 pts)\n" +
                         "No se ha aplicado ninguna actuaci\u00f3n a tiempo.\n" +
                         "Actuaci\u00f3n recomendada: " + inc[3][indiceCorrecto] + "\n" +
                         inc[5];

    mostrarPanelVeredicto(textoVeredicto);
    registrarResultado(indiceActual + 1, "Sin respuesta", "Tiempo agotado", tiempoEmpleado, "-3");
    pasarSiguienteIncidencia();
}

function aplicarVariacionPuntos(variacion) {
    puntuacionTotal += variacion;
    if (puntuacionTotal < 0) {
        puntuacionTotal = 0;
    }
    actualizarMarcadores();
}

function mostrarPanelVeredicto(mensaje) {
    var cont = document.getElementById("panel-veredicto-contenedor");
    if (cont) {
        cont.innerHTML = "<div class='panel-veredicto'>" + mensaje + "</div>";
    }
}

function registrarResultado(numIncidencia, decision, resultado, tiempo, variacion) {
    var inc = incidenciasTurno[indiceActual];
    var historial = document.getElementById("historial-actividad");
    var entrada = document.createElement("div");
    entrada.className = "tarjeta-historial";
    var texto = "Incidencia " + numIncidencia + " | Categor\u00eda: " + inc[0] + " | Gravedad: " + inc[2] + "\n" +
                "Decisi\u00f3n adoptada: " + decision + "\n" +
                "Resultado: " + resultado + "\n" +
                "Tiempo empleado: " + tiempo + " segundos\n" +
                "Variaci\u00f3n de puntuaci\u00f3n: " + variacion;

    entrada.textContent = texto;
    historial.appendChild(entrada);
}

function actualizarMarcadores() {
    document.getElementById("marcador-puntos").textContent = puntuacionTotal;
    document.getElementById("marcador-resueltas").textContent = indiceActual + "/5";
    var porcentaje = (indiceActual / 5) * 100;
    document.getElementById("barra-progreso").style.width = porcentaje + "%";
    document.getElementById("porcentaje-progreso").textContent = Math.round(porcentaje) + "%";
}

function pasarSiguienteIncidencia() {
    indiceActual++;
    setTimeout(function() {
        if (indiceActual < 5) {
            cargarIncidenciaActual();
        } else {
            actualizarMarcadores();
            finalizarTurno();
        }
    }, 2000);
}

function cargarIncidenciaActual() {
    actualizarMarcadores();
    mostrarIncidencia();
    iniciarTemporizador();
}

function finalizarTurno() {
    detenerTemporizadores();
    document.getElementById("contenedor-reloj").style.display = "none";
    document.getElementById("contenedor-incidencia").style.display = "none";
    var sumaTiempos = 0;
    for (var i = 0; i < tiemposRespuesta.length; i++) {
        sumaTiempos += tiemposRespuesta[i];
    }
    var tiempoMedio = (tiemposRespuesta.length > 0) ? (sumaTiempos / tiemposRespuesta.length).toFixed(1) : 0;
    var clasificacion = "";
    if (puntuacionTotal >= 80) {
        clasificacion = "Especialista";
    } else if (puntuacionTotal >= 55) {
        clasificacion = "T\u00e9cnico avanzado";
    } else if (puntuacionTotal >= 30) {
        clasificacion = "T\u00e9cnico en formaci\u00f3n";
    } else {
        clasificacion = "Debe revisar el protocolo de actuaci\u00f3n";
    }

    document.title = "SOC [" + clasificacion + "] - " + puntuacionTotal + " pts";
    var informe = "==================================================\n";
    informe += "INFORME T\u00c9CNICO DE FIN DE GUARDIA (SOC)\n";
    informe += "==================================================\n";
    informe += "Incidencias analizadas: 5\n";
    informe += "Decisiones correctas: " + correctas + "\n";
    informe += "Decisiones incorrectas: " + incorrectas + "\n";
    informe += "Incidencias sin respuesta: " + noRespondidas + "\n";
    informe += "Puntuaci\u00f3n final obtenida: " + puntuacionTotal + "\n";
    informe += "Tiempo medio de respuesta: " + tiempoMedio + " segundos\n";
    informe += "Nivel de desempe\u00f1o asignado: " + clasificacion + "\n";
    informe += "==================================================";
    var contInforme = document.getElementById("contenedor-informe");
    contInforme.innerHTML = "<pre>" + informe + "</pre>" +
                           "<div style='text-align: center; margin-top: 20px;'>" +
                           "<button type='button' class='btn-principal' onclick='reiniciarTurno()'>Iniciar nuevo turno</button>" +
                           "</div>";
    contInforme.style.display = "block";
}

function reiniciarTurno() {
    detenerTemporizadores();
    document.title = "SOC - Centro de Operaciones de Ciberseguridad";
    iniciarTurno();
}

window.addEventListener("keydown", function(event) {
    if (bloqueado) return;
    if (event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4") {
        var indiceOpcion = parseInt(event.key, 10) - 1;
        seleccionarActuacion(indiceOpcion, "teclado");
    }
});