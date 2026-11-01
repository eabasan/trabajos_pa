/**
 * EPD 4 - Ejercicio 1: Panel de Control de Mision Espacial
 */
var SISTEMAS = [
    { nom: "Energia", desc: "Energia: Suministro electrico general.", esp: "ESPECIFICACIONES DE ENERGIA: Generador fision 250 kW." },
    { nom: "Comunicaciones", desc: "Comunicaciones: Enlace de radio con base.", esp: "ESPECIFICACIONES DE COMUNICACIONES: Banda Ka alta ganancia." },
    { nom: "Navegacion", desc: "Navegacion: Trayectoria y orientacion giroscopica.", esp: "ESPECIFICACIONES DE NAVEGACION: Guiado inercial y estelar." },
    { nom: "Soporte vital", desc: "Soporte vital: Presion, temperatura y oxigeno.", esp: "ESPECIFICACIONES DE SOPORTE VITAL: 1 atm y scrubbers CO2." },
    { nom: "Propulsion", desc: "Propulsion: Motores principales de maniobra.", esp: "ESPECIFICACIONES DE PROPULSION: Motores 450 kN criogenicos." }
];

var tiempo = 90, tReloj = null, tDespegue = null, tPopup = null;
var sigIdx = 0, iniciada = false, finalizada = false, aviso15 = false;

var $ = function(id) { return document.getElementById(id); };

function logConsola(msg) {
    var d = document.createElement("div");
    d.textContent = "[" + new Date().toLocaleTimeString() + "] " + msg;
    $("consola").appendChild(d);
    $("consola").scrollTop = $("consola").scrollHeight;
}

function mostrarAviso(msg) {
    if (tPopup) clearTimeout(tPopup);
    $("popup").textContent = msg;
    $("popup").classList.remove("oculto");
    tPopup = setTimeout(function() {
        $("popup").classList.add("oculto");
        tPopup = null;
    }, 3000);
}

function iniciarMision() {
    iniciada = true; finalizada = false; tiempo = 90; sigIdx = 0; aviso15 = false;
    $("btn-iniciar").classList.add("oculto");
    $("btn-abandonar").disabled = false;
    $("btn-reiniciar").classList.add("oculto");
    document.querySelectorAll(".btn-act").forEach(function(b) { b.disabled = false; });
    $("estado").textContent = "Preparacion en curso";
    logConsola("Protocolo de preparacion iniciado.");

    tReloj = setInterval(function() {
        tiempo--;
        $("reloj").textContent = tiempo + " s";
        if (tiempo <= 15 && !aviso15) {
            aviso15 = true;
            $("reloj").classList.add("alerta-tiempo");
            logConsola("ADVERTENCIA: Tiempo de preparacion proximo a finalizar.");
        }
        if (tiempo <= 0) {
            clearInterval(tReloj);
            cancelarPorTiempo();
        }
    }, 1000);
}

function activarSistema(idx, origen) {
    if (!iniciada || finalizada || idx < sigIdx) return;
    if (idx !== sigIdx) {
        mostrarAviso("Accion bloqueada: debe activar primero el sistema anterior.");
        return;
    }

    var card = $("sis-" + idx);
    card.classList.add("operativa");
    card.querySelector(".estado-sis").textContent = "Operativo";
    card.querySelector(".btn-act").disabled = true;

    sigIdx++;
    $("progreso").textContent = sigIdx + " de 5";
    logConsola(SISTEMAS[idx].nom + " activado mediante " + origen + ".");

    if (sigIdx === 5) {
        $("btn-lanzar").disabled = false;
        $("estado").textContent = "Nave preparada para el lanzamiento.";
        logConsola("Todos los sistemas operativos. Nave lista para lanzamiento.");
    }
}

function lanzarNave() {
    clearInterval(tReloj);
    var congelado = tiempo;
    finalizada = true;
    $("btn-lanzar").disabled = true;
    $("btn-abandonar").disabled = true;

    var cuenta = 5;
    $("estado").textContent = "Secuencia de ignicion iniciada...";
    tDespegue = setInterval(function() {
        if (--cuenta > 0) {
            logConsola("T-" + cuenta + "...");
        } else {
            clearInterval(tDespegue);
            logConsola("¡Despegue!");
            document.title = "¡Mision en Vuelo! Lanzamiento Exitoso";
            $("estado").textContent = "Nave en vuelo";
            $("informe").innerHTML = "<h2>¡LANZAMIENTO COMPLETADO!</h2><p>Mision: Mision Apolo</p><p>Sistemas: 5 de 5</p><p>Tiempo restante: " + congelado + " s</p><p>Estado: Nave en vuelo</p>";
            $("informe").classList.remove("oculto");
            $("btn-reiniciar").classList.remove("oculto");
        }
    }, 1000);
}

function cancelarPorTiempo() {
    finalizada = true;
    $("btn-abandonar").disabled = true;
    document.querySelectorAll(".btn-act").forEach(function(b) { b.disabled = true; });
    $("estado").textContent = "MISION CANCELADA: Protocolo incompleto";
    logConsola("MISION CANCELADA: Tiempo de preparacion agotado.");

    var pend = SISTEMAS.slice(sigIdx).map(function(s) { return s.nom; }).join(", ");
    $("informe").innerHTML = "<h2>MISION CANCELADA</h2><p>Sistemas operativos: " + sigIdx + " de 5</p><p>Sistemas pendientes: " + (pend || "Ninguno") + "</p><p>Resultado: Lanzamiento no autorizado</p>";
    $("informe").classList.remove("oculto");
    $("btn-reiniciar").classList.remove("oculto");
}

function abandonarMision() {
    if (!window.confirm("¿Confirma que desea abortar la mision en curso?")) return;
    clearInterval(tReloj);
    clearInterval(tDespegue);
    clearTimeout(tPopup);
    finalizada = true;
    $("btn-lanzar").disabled = true;
    $("btn-abandonar").disabled = true;
    document.querySelectorAll(".btn-act").forEach(function(b) { b.disabled = true; });
    $("estado").textContent = "Mision abortada por el usuario";
    document.title = "Mision abortada";
    logConsola("Aborto de mision confirmado.");
    $("btn-reiniciar").classList.remove("oculto");
}

function reiniciar() {
    clearInterval(tReloj); clearInterval(tDespegue); clearTimeout(tPopup);
    tiempo = 90; sigIdx = 0; iniciada = false; finalizada = false; aviso15 = false;
    document.title = "Misi\u00f3n Apolo";
    $("estado").textContent = "En espera";
    $("reloj").textContent = "90 s";
    $("reloj").classList.remove("alerta-tiempo");
    $("progreso").textContent = "0 de 5";
    $("info-texto").textContent = "Haz clic en un sistema para ver su descripcion (doble clic para especificaciones).";
    $("btn-iniciar").classList.remove("oculto");
    $("btn-lanzar").disabled = true;
    $("btn-abandonar").disabled = true;
    $("btn-reiniciar").classList.add("oculto");
    $("popup").classList.add("oculto");
    $("informe").classList.add("oculto");
    $("consola").innerHTML = "";

    document.querySelectorAll(".tarjeta").forEach(function(c) {
        c.classList.remove("operativa", "hover");
        c.querySelector(".estado-sis").textContent = "Desactivado";
        c.querySelector(".btn-act").disabled = true;
    });
}

window.addEventListener("load", function() {
    $("btn-iniciar").addEventListener("click", iniciarMision);
    $("btn-lanzar").addEventListener("click", lanzarNave);
    $("btn-abandonar").addEventListener("click", abandonarMision);
    $("btn-reiniciar").addEventListener("click", reiniciar);

    $("panel-sistemas").addEventListener("click", function(e) {
        if (e.target === e.currentTarget) logConsola("Panel de sistemas seleccionado.");
    });

    document.querySelectorAll(".tarjeta").forEach(function(card) {
        var idx = parseInt(card.getAttribute("data-idx"), 10);
        card.addEventListener("mouseover", function() { card.classList.add("hover"); });
        card.addEventListener("mouseout", function() { card.classList.remove("hover"); });
        card.addEventListener("click", function() { $("info-texto").textContent = SISTEMAS[idx].desc; });
        card.addEventListener("dblclick", function() { window.alert(SISTEMAS[idx].esp); });
        card.querySelector(".btn-act").addEventListener("click", function(e) {
            e.stopPropagation();
            activarSistema(idx, "raton");
        });
    });

    window.addEventListener("keydown", function(e) {
        if (e.key >= "1" && e.key <= "5") activarSistema(parseInt(e.key, 10) - 1, "teclado");
    });
});